// SmartChef AI - API Communication Module

/**
 * Call Google Gemini API to generate recipe recommendations
 */
async function callGeminiAPI(ingredients, dietary, difficulty, servings) {
    try {
        if (!CONFIG.GOOGLE_SHEETS.SCRIPT_URL || CONFIG.GOOGLE_SHEETS.SCRIPT_URL.includes('YOUR_')) {
            throw new Error('Google Apps Script 部署 URL 未配置，請在 config.js 設定 GOOGLE_SHEETS.SCRIPT_URL');
        }

        const payload = {
            action: 'generateRecipe',
            inputs: { ingredients, dietary, difficulty, servings }
        };

        const response = await fetch(CONFIG.GOOGLE_SHEETS.SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'AI 生成失敗');
        }

        const text = (result.data && result.data.text) ? result.data.text : '';
        return parseRecipeResponse(text || '');

    } catch (error) {
        console.error('Backend AI Error:', error);
        throw new Error(`無法生成食譜: ${error.message}`);
    }
}

/**
 * Build the prompt for recipe generation
 */
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
    
    // Split by recipe title pattern
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
        
        if (recipe.name) {
            recipes.push(recipe);
        }
    }
    
    return recipes.length > 0 ? recipes : parseGenericRecipe(text);
}

/**
 * Extract a section from text using regex
 */
function extractSection(text, regex) {
    const match = text.match(regex);
    return match ? match[1].trim() : '';
}

/**
 * Extract list items from a section
 */
function extractListSection(text, sectionRegex) {
    const sectionStart = text.search(sectionRegex);
    if (sectionStart === -1) return [];
    
    const afterSection = text.substring(sectionStart);
    
    // Extract lines until next section marker
    const nextSection = afterSection.search(/(?=📋|👨‍🍳|⏱️|📊|💡|🍽️)/);
    const section = nextSection === -1 ? afterSection : afterSection.substring(0, nextSection);
    
    const lines = section.split('\n')
        .slice(1) // Skip the section header
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
    
    return lines;
}

/**
 * Fallback parser for generic recipe format
 */
function parseGenericRecipe(text) {
    // If the above parsing fails, create a generic recipe object
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
                ingredients: recipe.ingredients.join(', '),
                instructions: recipe.instructions.join('\n'),
                tips: recipe.tips,
                inputIngredients: ingredients,
                dietary: dietary,
                timestamp: new Date().toISOString()
            }
        };

        const response = await fetch(CONFIG.GOOGLE_SHEETS.SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失敗');
        }

        return result;

    } catch (error) {
        console.error('Save to Sheets Error:', error);
        throw new Error(`無法保存到 Google Sheets: ${error.message}`);
    }
}
