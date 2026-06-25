# SmartChef AI Google Sign-In - 快速參考卡

## 🚀 快速開始（5分鐘）

### 1. 獲取 Google Client ID
- 訪問 https://console.cloud.google.com/
- 創建新項目
- 設置 OAuth 2.0 認證（詳見 GOOGLE_SIGNIN_SETUP.md）
- 複製 Client ID

### 2. 配置 Client ID
```bash
# 編輯 assets/js/config.js
找到這行：
CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',

替換為您的實際 ID：
CLIENT_ID: 'xxxxxxxxx.apps.googleusercontent.com',
```

### 3. 啟動服務器並測試
```bash
python -m http.server 8000
# 訪問 http://localhost:8000
```

---

## 📁 核心文件一覽

| 文件 | 用途 | 修改 |
|------|------|------|
| `assets/js/auth.js` | 完整認證系統 | ✨ 新建 |
| `index.html` | 登入 UI + GSI 庫 | ✏️ 修改 |
| `assets/js/config.js` | Google 配置 | ✏️ 修改 |
| `assets/js/main.js` | 認證檢查集成 | ✏️ 修改 |
| `assets/css/style.css` | 登入樣式 | ✏️ 修改 |

---

## 🔑 關鍵 API

### 認證檢查
```javascript
// 在任何操作前檢查登入
if (checkLoginBeforeAction()) {
    // 用戶已登入，可以進行操作
}
```

### 獲取當前用戶
```javascript
// 全局變量 currentUser 包含：
// - id: Google 用戶 ID
// - email: 郵箱
// - name: 用戶名
// - picture: 頭像 URL
// - token: JWT token

console.log(currentUser.name);
```

### 手動登出
```javascript
logout();
```

---

## 🎯 功能清單

- ✅ Google Sign-In 集成
- ✅ OAuth 2.0 認證流程
- ✅ JWT Token 管理
- ✅ 登入狀態持久化
- ✅ 自動登入檢查
- ✅ 訪問控制
- ✅ 用戶信息顯示
- ✅ 登出功能
- ✅ 錯誤消息提示

---

## 📊 認證流程圖

```
用戶訪問 index.html
    ↓
DOMContentLoaded 事件觸發
    ↓
initializeGoogleSignIn() 初始化
    ↓
checkUserLoginStatus() 檢查舊登入
    ↓
[是否已登入？]
  ↙          ↘
否          是
 ↓           ↓
顯示        解鎖
登入卡       功能
 ↓
用戶點擊
Sign in
 ↓
Google
彈窗
 ↓
用戶授權
 ↓
handleCredential
Response()
 ↓
解析 JWT
 ↓
保存到
localStorage
 ↓
updateAuthUI()
 ↓
顯示用戶信息
解鎖功能
```

---

## 🔐 localStorage 結構

應用存儲以下數據：

```javascript
// 完整用戶信息
localStorage.getItem('smartchef_user')
// {id, email, name, picture, token}

// JWT Token
localStorage.getItem('smartchef_token')
// JWT 格式字符串
```

---

## ⚙️ 配置項目

在 `assets/js/config.js` 中修改：

```javascript
CONFIG = {
    GOOGLE_AUTH: {
        CLIENT_ID: 'xxxxx.apps.googleusercontent.com',  // ⬅️ 必須設置
        SCOPES: 'profile email'  // OAuth 作用域
    },
    APP: {
        REQUIRE_LOGIN: true  // 需要登入才能使用
    }
}
```

---

## 🧪 測試檢查表

- [ ] Google Client ID 已配置
- [ ] 本地服務器正在運行
- [ ] 可以看到登入卡片
- [ ] 點擊登入按鈕無錯誤
- [ ] 登入後可以看到用戶信息
- [ ] 食譜生成按鈕已啟用
- [ ] 可以生成食譜
- [ ] 點擊登出返回登入界面
- [ ] 刷新頁面後仍保持登入
- [ ] localStorage 中有正確的數據

---

## 🐛 常見問題解決

### 登入按鈕不顯示
- ❌ Client ID 未設置或無效
- ✅ 解決: 設置正確的 Client ID

### 登入失敗，出現 CORS 錯誤
- ❌ 域名未添加到授權列表
- ✅ 解決: 在 Google Cloud Console 中添加 localhost:8000

### 登入後仍被要求登入
- ❌ 登入檢查邏輯失敗
- ✅ 解決: 打開瀏覽器控制台檢查錯誤

### 刷新後自動登出
- ❌ localStorage 被清除
- ✅ 解決: 檢查瀏覽器隱私設置

---

## 📚 詳細文檔

| 文檔 | 內容 |
|------|------|
| GOOGLE_SIGNIN_SETUP.md | 完整設置指南 |
| TESTING.md | 測試和故障排除 |
| IMPLEMENTATION_SUMMARY.md | 實現詳細總結 |

---

## 🌐 重要資源

- Google Sign-In: https://developers.google.com/identity/sign-in/web/sign-in?hl=zh-tw
- Google Cloud Console: https://console.cloud.google.com/
- OAuth 2.0: https://developers.google.com/identity/protocols/oauth2

---

## ✨ 實現亮點

✓ **完全本地化** - 繁體中文 UI  
✓ **現代認證** - 使用最新 Google Identity Services  
✓ **無密碼登入** - 安全且易用  
✓ **智能恢復** - 自動檢查登入狀態  
✓ **響應式設計** - 在所有設備上工作  

---

## 📞 支援

遇到問題？按以下順序查閱：

1. 檢查本文檔的常見問題
2. 查看 TESTING.md 中的故障排除
3. 參考 GOOGLE_SIGNIN_SETUP.md 的設置步驟
4. 查看瀏覽器開發者工具的控制台錯誤

---

**版本**: 1.0  
**最後更新**: 2026-06-25  
**狀態**: ✅ 就緒
