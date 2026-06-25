// SmartChef AI - Google Sign-In Authentication

let currentUser = null;

/**
 * Initialize Google Sign-In on page load
 */
function initializeGoogleSignIn() {
    // Check if CLIENT_ID is configured
    if (CONFIG.GOOGLE_AUTH.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        console.warn('⚠️ Google Client ID 未配置。請在 config.js 中設定 GOOGLE_AUTH.CLIENT_ID');
        showAuthError('❌ 登入系統未配置。請聯繫管理員。');
        return;
    }

    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_AUTH.CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
    });

    // Check if user is already logged in
    checkUserLoginStatus();
}

/**
 * Handle the credential response from Google Sign-In
 */
function handleCredentialResponse(response) {
    // response.credential is a JWT token
    const token = response.credential;
    
    // Decode JWT to get user info (without verification for client-side)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    
    const userData = JSON.parse(jsonPayload);
    
    // Store user info
    currentUser = {
        id: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        token: token
    };
    
    // Save to localStorage
    localStorage.setItem('smartchef_user', JSON.stringify(currentUser));
    localStorage.setItem('smartchef_token', token);
    
    console.log('✅ 登入成功:', currentUser.name);
    
    // Update UI
    updateAuthUI(true);
    hideAuthError();
    
    // Enable app features
    enableAppFeatures();
}

/**
 * Check if user is already logged in
 */
function checkUserLoginStatus() {
    const savedUser = localStorage.getItem('smartchef_user');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('✅ 已登入用戶:', currentUser.name);
            updateAuthUI(true);
            enableAppFeatures();
        } catch (error) {
            console.error('錯誤的用戶數據:', error);
            logout();
        }
    } else {
        updateAuthUI(false);
        disableAppFeatures();
    }
}

/**
 * Sign out the user
 */
function logout() {
    // Clear user data
    currentUser = null;
    localStorage.removeItem('smartchef_user');
    localStorage.removeItem('smartchef_token');
    
    // Sign out from Google
    google.accounts.id.revoke('', () => {
        console.log('登出成功');
    });
    
    // Update UI
    updateAuthUI(false);
    disableAppFeatures();
    
    // Show message
    showAuthError('您已登出。請重新登入以繼續使用。', 'info');
}

/**
 * Update UI based on login status
 */
function updateAuthUI(isLoggedIn) {
    const authContainer = document.getElementById('authContainer');
    const loginSection = document.getElementById('loginSection');
    const userInfo = document.getElementById('userInfo');
    const mainContent = document.getElementById('mainContent');
    
    if (isLoggedIn && currentUser) {
        // Hide login section, show user info
        if (loginSection) loginSection.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('auth-locked');
        
        if (userInfo) {
            userInfo.innerHTML = `
                <div class="user-profile">
                    <img src="${currentUser.picture}" alt="頭像" class="user-avatar">
                    <div class="user-details">
                        <span class="user-name">${currentUser.name}</span>
                        <span class="user-email">${currentUser.email}</span>
                    </div>
                    <button class="btn btn-logout" onclick="logout()">登出</button>
                </div>
            `;
            userInfo.classList.remove('hidden');
        }
    } else {
        // Show login section, hide user info
        if (loginSection) loginSection.classList.remove('hidden');
        if (mainContent) mainContent.classList.add('auth-locked');
        if (userInfo) userInfo.classList.add('hidden');
    }
}

/**
 * Enable app features (show input section)
 */
function enableAppFeatures() {
    const inputSection = document.querySelector('.input-section');
    const infoSection = document.querySelector('.info-section');
    
    if (inputSection) inputSection.classList.remove('hidden');
    if (infoSection) infoSection.classList.remove('hidden');
}

/**
 * Disable app features (hide input section)
 */
function disableAppFeatures() {
    const inputSection = document.querySelector('.input-section');
    const infoSection = document.querySelector('.info-section');
    const resultsSection = document.getElementById('resultsSection');
    
    if (inputSection) inputSection.classList.add('hidden');
    if (infoSection) infoSection.classList.add('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');
}

/**
 * Check login status before generating recipe
 */
function checkLoginBeforeAction() {
    if (!currentUser) {
        showAuthError('❌ 請先登入才能使用此功能', 'error');
        // Scroll to login section
        const loginSection = document.getElementById('loginSection');
        if (loginSection) {
            loginSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return false;
    }
    return true;
}

/**
 * Show authentication error message
 */
function showAuthError(message, type = 'error') {
    const authMessage = document.getElementById('authMessage');
    if (!authMessage) return;
    
    authMessage.textContent = message;
    authMessage.className = `auth-message auth-message-${type} ${type === 'error' || type === 'info' ? '' : 'hidden'}`;
    
    // Auto hide success messages
    if (type === 'success') {
        setTimeout(() => {
            authMessage.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Hide authentication error message
 */
function hideAuthError() {
    const authMessage = document.getElementById('authMessage');
    if (authMessage) {
        authMessage.classList.add('hidden');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGoogleSignIn);
