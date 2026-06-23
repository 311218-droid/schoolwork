// SmartChef AI Configuration

// IMPORTANT: Replace with your actual values
const CONFIG = {
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
        API_KEY: 'AQ.Ab8RN6Kvs2PR1hFknX19kYn31SyeBZYOC-gJB-JJ45XVEADxTQ',
        API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    },

    // App Settings
    APP: {
        MAX_INGREDIENTS: 20,
        RECIPE_LANGUAGE: 'zh-TW',
        TEMPERATURE: 0.7
    }
};

// Note: 
// 1. For security, never commit real API keys to public repositories.
// 2. Prefer storing sensitive keys in Apps Script Script Properties and calling AI from the server-side.
// 3. Deploy your Apps Script web app and set CONFIG.GOOGLE_SHEETS.SCRIPT_URL to the deployment URL.
