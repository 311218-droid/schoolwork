// SmartChef AI - API Communication Module

/**
 * Call Google Gemini (via Apps Script backend or direct) to generate recipe recommendations
 */
async function callGeminiAPI(ingredients, dietary, difficulty, servings) {
    try {
        // If debug direct AI is enabled, call Gemini API directly (bypass Apps Script)
        if (CONFIG.DEBUG && CONFIG.DEBUG.DIRECT_AI) {
            const prompt = buildRecipePrompt(ingredients, dietary, difficulty, servings);
            try {
                return await callGeminiDirectAPI(prompt);
            } catch (error) {
                console.warn('Direct AI 失敗，改用 Apps Script 後端:', error);
                // 如果開啟了 direct AI 但失敗，嘗試使用 Apps Script 後端作為備援
            }
        }

        if (!CONFIG.GOOGLE_SHEETS.SCRIPT_URL || CONFIG.GOOGLE_SHEETS.SCRIPT_URL.includes('YOUR_')) {
            throw new Error('Google Apps Script 部署 URL 未配置，請在 config.js 設定 GOOGLE_SHEETS.SCRIPT_URL');
        }

        await validateAppsScriptEndpoint();

        const payload = {
            action: 'generateRecipe',
            inputs: { ingredients, dietary, difficulty, servings }
        };

        const response = await fetch(CONFIG.GOOGLE_SHEETS.SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(payload)
        });

        const rawText = await response.text();
        let result;
        try {
            result = rawText ? JSON.parse(rawText) : {};
        } catch (e) {
            console.error('非 JSON 回應:', rawText);
            throw new Error(`後端回傳非 JSON 回應: ${rawText}`);
        }

        if (!response.ok) {
            throw new Error(result.message || `後端 HTTP 錯誤 (${response.status})`);
        }

        if (!result.success) {
            throw new Error(result.message || 'AI 生成失敗');
        }

        const text = (result.data && result.data.text) ? result.data.text : '';
        return parseRecipeResponse(text || '');

    } catch (error) {
        console.error('Backend AI Error:', error);
        const message = error.message || ''; 
        if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
            throw new Error('無法連線到後端，請檢查 Google Apps Script URL、網路連線與 CORS 設定。');
        }
        throw new Error(`無法生成食譜: ${error.message}`);
    }
}

/**
 * Build the prompt for recipe generation
 */
async function validateAppsScriptEndpoint() {
    try {
        const pingUrl = `${CONFIG.GOOGLE_SHEETS.SCRIPT_URL}?action=ping`;
        const response = await fetch(pingUrl, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`Apps Script ping 返回 HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Apps Script ping 返回失敗');
        }

        return data;
    } catch (error) {
        console.error('Apps Script endpoint validation failed:', error);
        throw new Error('無法連線到 Apps Script，請確認 SCRIPT_URL 為正確的 Web App exec URL，並且已設定為「Anyone, even anonymous」訪問。詳細錯誤：' + error.message);
    }
}

function buildRecipePrompt(ingredients, dietary, difficulty, servings) {
    return `你是一位專業的食譜顧問。根據以下信息生成食譜建議：

食材: ${ingredients}
飲食偏好/限制: ${dietary || '無特別限制'}
烹飪難度: ${difficulty || '任何難度'}
人份數: ${servings || 2}人

請生成2個食譜建議，每個食譜包含以下內容，使用台灣繁體中文：
1. 食譜名稱
2. 預計烹飪時間
3. 難度等級
4. 所需材料（列出份量）
5. 烹飪步驟（逐步說明）
6. 小貼士

格式要求：
- 食譜名稱用 "🍽️ [名稱]" 開頭
- 材料用 "📋 材料:" 開頭
- 步驟用 "👨‍🍳 步驟:" 開頭
- 時間用 "⏱️ 時間: [分鐘]" 格式
- 難度用 "📊 難度: [簡單/中等/困難]" 格式
- 小貼士用 "💡 小貼士:" 開頭

請確保食譜實用、易於跟隨，並使用所有提供的食材。`;
}

/**
 * Parse the API response into structured recipe objects
 */
function parseRecipeResponse(text) {
    const recipes = [];
    const recipeBlocks = text.split(/(?=🍽️)/);

    for (const block of recipeBlocks) {
        if (!block.trim()) continue;

        const recipe = {
            name: extractSection(block, /🍽️\s*(.+?)(?:\n|$)/),
            time: extractSection(block, /⏱️\s*時間:\s*(.+?)(?:\n|$)/),
            difficulty: extractSection(block, /📊\s*難度:\s*(.+?)(?:\n|$)/),
            ingredients: extractListSection(block, /📋\s*材料:/),
            instructions: extractListSection(block, /👨‍🍳\s*步驟:/),
            tips: extractSection(block, /💡\s*小貼士:\s*(.+?)(?:\n|$)/),
            raw: block
        };

        if (recipe.name) recipes.push(recipe);
    }

    return recipes.length > 0 ? recipes : parseGenericRecipe(text);
}

function extractSection(text, regex) {
    const match = text.match(regex);
    return match ? match[1].trim() : '';
}

function extractListSection(text, sectionRegex) {
    const sectionStart = text.search(sectionRegex);
    if (sectionStart === -1) return [];

    const afterSection = text.substring(sectionStart);
    const nextSection = afterSection.search(/(?=📋|👨‍🍳|⏱️|📊|💡|🍽️)/);
    const section = nextSection === -1 ? afterSection : afterSection.substring(0, nextSection);

    const lines = section.split('\n').slice(1)
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);

    return lines;
}

function parseGenericRecipe(text) {
    return [{
        name: '推薦食譜',
        time: '待定',
        difficulty: '中等',
        ingredients: ['根據提供的食材進行烹飪'],
        instructions: text.split('\n').filter(line => line.trim()).slice(0, 5),
        tips: '請按照 AI 提供的詳細指示進行烹飪',
        raw: text
    }];
}

/**
 * Call Gemini API directly from frontend (for debug/testing only).
 * Returns parsed recipes array.
 */
async function callGeminiDirectAPI(promptText) {
    try {
        if (!CONFIG.AI || !CONFIG.AI.API_URL || !CONFIG.AI.API_KEY) {
            throw new Error('AI API 配置缺失 (API_URL 或 API_KEY)');
        }

        const body = { contents: [{ parts: [{ text: promptText }] }] };
        const url = CONFIG.AI.API_URL.includes('?') ? `${CONFIG.AI.API_URL}&key=${CONFIG.AI.API_KEY}` : `${CONFIG.AI.API_URL}?key=${CONFIG.AI.API_KEY}`;

        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const raw = await resp.text();
        let data;
        try { data = raw ? JSON.parse(raw) : {}; } catch (e) { throw new Error(`AI 回應非 JSON: ${raw}`); }

        if (!resp.ok) {
            throw new Error(data.error ? data.error.message : `AI HTTP 錯誤 (${resp.status})`);
        }

        const text = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || '';
        return parseRecipeResponse(text || '');

    } catch (error) {
        console.error('Direct AI Error:', error);
        throw new Error(`直接呼叫 AI 失敗: ${error.message}. 若未配置有效 AI.API_KEY，請將 CONFIG.DEBUG.DIRECT_AI 設為 false 並使用 Apps Script 後端。`);
    }
}

/**
 * Save recipe to Google Sheets via Google Apps Script
 */
async function saveRecipeToSheets(recipe, ingredients, dietary) {
    try {
        if (!CONFIG.GOOGLE_SHEETS.SCRIPT_URL || CONFIG.GOOGLE_SHEETS.SCRIPT_URL.includes('YOUR_')) {
            throw new Error('Google Apps Script 部署 URL 未配置');
        }

        const data = {
            action: 'saveRecipe',
            recipe: {
                name: recipe.name,
                time: recipe.time,
                difficulty: recipe.difficulty,
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients,
                instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions,
                tips: recipe.tips,
                inputIngredients: ingredients,
                dietary: dietary,
                timestamp: new Date().toISOString()
            }
        };

        const response = await fetch(CONFIG.GOOGLE_SHEETS.SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data)
        });

        const rawText = await response.text();
        let result;
        try { result = rawText ? JSON.parse(rawText) : {}; } catch (e) { throw new Error(`後端回傳非 JSON 回應: ${rawText}`); }

        if (!response.ok) throw new Error(result.message || `後端 HTTP 錯誤 (${response.status})`);
        if (!result.success) throw new Error(result.message || '保存失敗');

        return result;

    } catch (error) {
        console.error('Save to Sheets Error:', error);
        const message = error.message || '';
        if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
            throw new Error('無法連線到 Google Apps Script，請檢查部署 URL、網路連線與 CORS 設定。');
        }
        throw new Error(`無法保存到 Google Sheets: ${error.message}`);
    }
}
