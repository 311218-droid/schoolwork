// SmartChef AI Configuration

// IMPORTANT: Replace with your actual values
const CONFIG = {
    // Google Sign-In Configuration (OAuth 2.0)
    GOOGLE_AUTH: {
        // 將此替換為您的 Google OAuth 2.0 Client ID
        // 從 Google Cloud Console 獲取: https://console.cloud.google.com/
        CLIENT_ID: '592081736425-fs9tb30jtri7ifp9t4ak9nhsdnm2rc41.apps.googleusercontent.com',
        // 登入作用域
        SCOPES: 'profile email'
    },

    // Google Sheets Configuration
    GOOGLE_SHEETS: {
        // Your Google Apps Script deployment URL
        // Get this after deploying the apps script
        SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby0Ur5Lik5bFMBcHjdyzLWcCD-GTmtLO4r9J0fOia5yTJeK9s7dq6yBFLW_M2iSQX4XLQ/exec',
        
        // Your Google Sheets ID
        SHEET_ID: '1UzxHuEzNbXwNNyneiClI-0mTblpRgmKWEituax-U7lY',
        
        // Sheet name to save recipes
        SHEET_NAME: 'recipes'
    },

    // AI API Configuration
    AI: {
        // Using Google Gemini Free API
        // When using the Apps Script backend, store the AI API key in Script Properties (key = AI_API_KEY)
        PROVIDER: 'GEMINI',
        API_KEY: 'AQ.Ab8RN6LwPP8OQvzpXbHRaOHaqe1cB6ntXqRvFn098ehulTWyyQ',
        // 使用可用的模型端點（若無法使用請改為你帳號可用的 model name）
        API_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent'
    },

    // App Settings
    APP: {
        MAX_INGREDIENTS: 20,
        RECIPE_LANGUAGE: 'zh-TW',
        TEMPERATURE: 0.7,
        REQUIRE_LOGIN: true  // 需要登入才能使用
    }
};

// Debug settings (開發時可啟用直接呼叫 AI，生產環境請關閉)
CONFIG.DEBUG = {
    DIRECT_AI: true
};

// Note: 
// 1. For security, never commit real API keys to public repositories.
// 2. Prefer storing sensitive keys in Apps Script Script Properties and calling AI from the server-side.
// 3. Deploy your Apps Script web app and set CONFIG.GOOGLE_SHEETS.SCRIPT_URL to the deployment URL.
