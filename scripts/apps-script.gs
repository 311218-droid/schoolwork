/**
 * SmartChef AI - Google Apps Script Backend
 * 
 * Deploy this script as a web app:
 * 1. Save this file in Google Apps Script
 * 2. Deploy → New deployment → Type: Web app
 * 3. Execute as: Your email
 * 4. Who has access: Anyone
 * 5. Copy the deployment URL to config.js in the frontend
 */

// Read configuration from Script Properties when possible
const SHEET_ID = (function() {
    try {
        const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
        return id || 'YOUR_SPREADSHEET_ID_HERE';
    } catch (e) {
        return 'YOUR_SPREADSHEET_ID_HERE';
    }
})();

const SHEET_NAME = 'recipes';

// AI settings (store API key in Script Properties: key name = AI_API_KEY)
const AI_PROVIDER = 'GEMINI';
const AI_API_URL = (function() {
    try {
        return PropertiesService.getScriptProperties().getProperty('AI_API_URL') || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    } catch (e) {
        return 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    }
})();

/**
 * Simple GET handler for health checks and quick debugging.
 * Use: GET ?action=ping returns a JSON pong.
 */
function doGet(e) {
    try {
        const params = e && e.parameter ? e.parameter : {};
        if (params.action === 'ping') {
            return sendResponse(true, 'pong', { sheetId: SHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE' });
        }

        return sendResponse(true, 'Apps Script Web App is running');
    } catch (error) {
        return sendResponse(false, `doGet Error: ${error.message}`);
    }
}

/**
 * Handle incoming requests from the frontend
 */
function doPost(e) {
    try {
        const payload = JSON.parse(e.postData.contents);
        
        if (payload.action === 'saveRecipe') {
            return saveRecipe(payload.recipe);
        }

        if (payload.action === 'generateRecipe') {
            return generateRecipeFromAI(payload.inputs || {});
        }

        return sendResponse(false, '未知的操作');
        
    } catch (error) {
        console.error('Error:', error);
        return sendResponse(false, `錯誤: ${error.message}`);
    }
}


/**
 * Generate recipe using AI provider (Gemini)
 * payload.inputs = { ingredients, dietary, difficulty, servings }
 */
function generateRecipeFromAI(inputs) {
    try {
        const apiKey = PropertiesService.getScriptProperties().getProperty('AI_API_KEY') || '';
        if (!apiKey) {
            return sendResponse(false, 'AI API 金鑰未設定 (請在 Script Properties 設定 AI_API_KEY)');
        }

        const ingredients = inputs.ingredients || '';
        const dietary = inputs.dietary || '';
        const difficulty = inputs.difficulty || '';
        const servings = inputs.servings || 2;

        const prompt = `你是一位專業的食譜顧問。根據以下信息生成食譜建議：\n\n食材: ${ingredients}\n飲食偏好/限制: ${dietary || '無特別限制'}\n烹飪難度: ${difficulty || '任何難度'}\n人份數: ${servings || 2}人\n\n請生成2個食譜建議，每個食譜包含以下內容，使用台灣繁體中文：\n1. 食譜名稱\n2. 預計烹飪時間\n3. 難度等級\n4. 所需材料（列出份量）\n5. 烹飪步驟（逐步說明）\n6. 小貼士\n\n格式要求：\n- 食譜名稱用 "🍽️ [名稱]" 開頭\n- 材料用 "📋 材料:" 開頭\n- 步驟用 "👨‍🍳 步驟:" 開頭\n- 時間用 "⏱️ 時間: [分鐘]" 格式\n- 難度用 "📊 難度: [簡單/中等/困難]" 格式\n- 小貼士用 "💡 小貼士:" 開頭\n\n請確保食譜實用、易於跟隨，並使用所有提供的食材。`;

        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const url = `${AI_API_URL}?key=${apiKey}`;

        const options = {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(requestBody),
            muteHttpExceptions: true
        };

        const resp = UrlFetchApp.fetch(url, options);
        const code = resp.getResponseCode();
        const respText = resp.getContentText();

        if (code < 200 || code >= 300) {
            console.error('AI API Error:', code, respText);
            return sendResponse(false, `AI 服務錯誤 (${code})`, { raw: respText });
        }

        const data = JSON.parse(respText || '{}');
        const recipeText = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || '';

        return sendResponse(true, '生成成功', { text: recipeText, raw: data });

    } catch (error) {
        console.error('generateRecipeFromAI Error:', error);
        return sendResponse(false, `AI 生成失敗: ${error.message}`);
    }
}

/**
 * Save recipe to Google Sheets
 */
function saveRecipe(recipe) {
    try {
        const sheet = getOrCreateSheet();
        
        // Prepare data row
        const row = [
            recipe.timestamp,
            recipe.name,
            recipe.time,
            recipe.difficulty,
            recipe.inputIngredients,
            recipe.dietary,
            recipe.ingredients,
            recipe.instructions.replace(/\n/g, ' | '),
            recipe.tips
        ];
        
        // Add row to sheet
        sheet.appendRow(row);
        
        return sendResponse(true, '食譜已成功保存');
        
    } catch (error) {
        console.error('Save recipe error:', error);
        return sendResponse(false, `保存失敗: ${error.message}`);
    }
}

/**
 * Get or create the recipes sheet
 */
function getOrCreateSheet() {
    try {
        const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        let sheet = spreadsheet.getSheetByName(SHEET_NAME);
        
        if (!sheet) {
            // Create new sheet
            sheet = spreadsheet.insertSheet(SHEET_NAME);
            
            // Add headers
            const headers = [
                '時間戳',
                '食譜名稱',
                '烹飪時間',
                '難度',
                '輸入食材',
                '飲食偏好',
                '所需材料',
                '烹飪步驟',
                '小貼士'
            ];
            sheet.appendRow(headers);
            
            // Format header row
            const headerRange = sheet.getRange(1, 1, 1, headers.length);
            headerRange.setBackground('#004e89');
            headerRange.setFontColor('#ffffff');
            headerRange.setFontWeight('bold');
        }
        
        return sheet;
        
    } catch (error) {
        throw new Error(`無法訪問 Google Sheets: ${error.message}`);
    }
}

/**
 * Send JSON response
 */
function sendResponse(success, message, data) {
    const response = {
        success: success,
        message: message
    };

    if (typeof data !== 'undefined') {
        response.data = data;
    }

    return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify the setup
 */
function testSetup() {
    if (!SHEET_ID || SHEET_ID.includes('YOUR_')) {
        Logger.log('❌ 請設置 SHEET_ID');
        return;
    }
    
    try {
        const sheet = getOrCreateSheet();
        Logger.log('✅ Google Sheets 連接成功');
        Logger.log('Sheet name:', sheet.getName());
        Logger.log('Row count:', sheet.getLastRow());
    } catch (error) {
        Logger.log('❌ Error:', error);
    }
}
