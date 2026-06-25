// SmartChef AI - Main Application Logic

let currentRecipes = [];

/**
 * Generate recipe with authentication check
 */
async function generateRecipeWithAuth() {
    // Check if user is logged in
    if (!checkLoginBeforeAction()) {
        return;
    }
    
    // Proceed with recipe generation
    await generateRecipe();
}

/**
 * Generate recipe based on user input
 */
async function generateRecipe() {
    const ingredients = document.getElementById('ingredients').value.trim();
    const dietary = document.getElementById('dietary').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    const servings = document.getElementById('servings').value;

    // Validation
    if (!ingredients) {
        showError('請輸入至少一個食材');
        return;
    }

    if (ingredients.split(',').length > CONFIG.APP.MAX_INGREDIENTS) {
        showError(`食材數量不能超過 ${CONFIG.APP.MAX_INGREDIENTS} 個`);
        return;
    }

    // Check Apps Script backend configuration
    if (!CONFIG.GOOGLE_SHEETS.SCRIPT_URL || CONFIG.GOOGLE_SHEETS.SCRIPT_URL.includes('YOUR_')) {
        showError('❌ Google Apps Script 部署 URL 未配置。請部署後在 config.js 設定 GOOGLE_SHEETS.SCRIPT_URL。');
        return;
    }

    try {
        // Show loading
        showLoading(true);
        hideError();
        document.getElementById('resultsSection').classList.add('hidden');

        // Call API
        const recipes = await callGeminiAPI(ingredients, dietary, difficulty, servings);
        currentRecipes = recipes;

        // Display results
        displayRecipes(recipes, ingredients, dietary);
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('saveBtn').disabled = false;

        // Scroll to results
        setTimeout(() => {
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
        document.getElementById('saveBtn').disabled = true;
    } finally {
        showLoading(false);
    }
}

/**
 * Display recipes on the page
 */
function displayRecipes(recipes, ingredients, dietary) {
    const resultsDiv = document.getElementById('recipeResults');
    resultsDiv.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <div class="recipe-title">${recipe.name || `食譜 ${index + 1}`}</div>
            
            <div class="recipe-meta">
                ${recipe.time ? `<span>⏱️ ${recipe.time}</span>` : ''}
                ${recipe.difficulty ? `<span>📊 ${recipe.difficulty}</span>` : ''}
            </div>

            ${recipe.ingredients && recipe.ingredients.length > 0 ? `
                <div class="recipe-ingredients">
                    <h4>📋 所需材料:</h4>
                    <ul>
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${(() => {
                if (recipe.instructions && recipe.instructions.length > 0) {
                    return `
                        <div class="recipe-instructions">
                            <h4>👨‍🍳 製作流程:</h4>
                            <ol>
                                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                    `;
                }

                if (recipe.raw && recipe.raw.trim()) {
                    // Fallback: show raw text as the production process
                    const safeRaw = recipe.raw.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return `
                        <div class="recipe-instructions">
                            <h4>👨‍🍳 製作流程 (原始):</h4>
                            <pre style="white-space:pre-wrap; background:#fff; padding:10px; border-radius:4px;">${safeRaw}</pre>
                        </div>
                    `;
                }

                return '';
            })()}

            ${recipe.tips ? `
                <div class="recipe-tips" style="margin-top: 15px; padding: 10px; background: #fff3cd; border-left: 3px solid #ffc107; border-radius: 4px;">
                    <strong>💡 小貼士:</strong> ${recipe.tips}
                </div>
            ` : ''}

            <div style="margin-top: 15px;">
                <button class="btn btn-secondary" onclick="saveIndividualRecipe(${index})">
                    💾 保存此食譜
                </button>
            </div>
        `;
        resultsDiv.appendChild(recipeCard);
    });
}

/**
 * Save individual recipe to Google Sheets
 */
async function saveIndividualRecipe(index) {
    // Check if user is logged in
    if (!checkLoginBeforeAction()) {
        return;
    }

    if (index >= currentRecipes.length) {
        showError('食譜索引錯誤');
        return;
    }

    const recipe = currentRecipes[index];
    const ingredients = document.getElementById('ingredients').value.trim();
    const dietary = document.getElementById('dietary').value.trim();

    try {
        showLoading(true);
        await saveRecipeToSheets(recipe, ingredients, dietary);
        showError('✅ 食譜已成功保存到 Google Sheets！', 'success');
        showLoading(false);
    } catch (error) {
        showError(`保存失敗: ${error.message}`);
        showLoading(false);
    }
}

/**
 * Save all recipes to Google Sheets
 */
async function saveToSheets() {
    // Check if user is logged in
    if (!checkLoginBeforeAction()) {
        return;
    }

    if (currentRecipes.length === 0) {
        showError('沒有食譜可保存');
        return;
    }

    const ingredients = document.getElementById('ingredients').value.trim();
    const dietary = document.getElementById('dietary').value.trim();

    try {
        showLoading(true);

        for (const recipe of currentRecipes) {
            await saveRecipeToSheets(recipe, ingredients, dietary);
        }

        showError('✅ 所有食譜已成功保存到 Google Sheets！', 'success');
        showLoading(false);

    } catch (error) {
        showError(`保存失敗: ${error.message}`);
        showLoading(false);
    }
}

/**
 * Clear the form
 */
function clearForm() {
    document.getElementById('ingredients').value = '';
    document.getElementById('dietary').value = '';
    document.getElementById('difficulty').value = '';
    document.getElementById('servings').value = '2';
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('saveBtn').disabled = true;
    hideError();
    currentRecipes = [];
}

/**
 * Show loading spinner
 */
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

/**
 * Show error message
 */
function showError(message, type = 'error') {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.className = `error-message ${type === 'success' ? 'success' : ''}`;
    errorDiv.classList.remove('hidden');

    if (type === 'success') {
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
}

/**
 * Update success message styling
 */
const style = document.createElement('style');
style.textContent = `
    .error-message.success {
        background: var(--success-color);
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('SmartChef AI 應用已初始化');
    console.log('API Provider:', CONFIG.AI.PROVIDER);
});
