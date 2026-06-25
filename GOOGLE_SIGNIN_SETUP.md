# Google Sign-In 設置指南

本應用已實現 Google Sign-In 認證。用戶必須登入才能使用 AI 食譜推薦功能。

## 設置步驟

### 1. 創建 Google Cloud 項目

1. 訪問 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊項目選擇器，創建新項目
3. 項目名稱：`SmartChef AI` （或任何名稱）
4. 等待項目創建完成

### 2. 設置 OAuth 2.0 認證

1. 在 Google Cloud Console 中，轉到 **API 和服務** > **認證**
2. 點擊 **建立認證** > **OAuth 客戶端 ID**
3. 如果提示設置 OAuth 同意屏幕，先點擊 **設置同意屏幕**
   - 選擇 **External** 用戶類型
   - 填入應用名稱、用戶支持電郵等必填項
   - 返回認證頁面

### 3. 設置 OAuth 2.0 客戶端 ID

1. 應用類型選擇：**Web 應用程序**
2. 名稱：`SmartChef AI Web Client`
3. **授權的 JavaScript 源**：
   - `http://localhost:3000`
   - `http://localhost:5500`
   - `http://localhost:8000`
   - 您的生產網域（例如 `https://yoursite.com`）

4. **授權的重定向 URI**：
   - `http://localhost:3000/`
   - `http://localhost:5500/`
   - `http://localhost:8000/`
   - 您的生產網域（例如 `https://yoursite.com/`）

5. 點擊 **建立**

### 4. 複製您的 Client ID

1. 在認證頁面找到剛創建的 OAuth 2.0 客戶端
2. 點擊下載按鈕或直接複製 **客戶端 ID**（形如 `xxxxxxxxx.apps.googleusercontent.com`）
3. 複製 Client ID

### 5. 配置應用

1. 打開 `assets/js/config.js`
2. 找到以下行：
   ```javascript
   CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
   ```
3. 將 `YOUR_GOOGLE_CLIENT_ID` 替換為您的實際 Client ID：
   ```javascript
   CLIENT_ID: 'xxxxxxxxx.apps.googleusercontent.com',
   ```

## 功能說明

### 登入流程
- 用戶打開應用時會看到登入卡片
- 用戶點擊 **Sign in with Google** 按鈕
- Google Sign-In 彈窗出現
- 用戶選擇 Google 帳號並授權

### 登入後
- 用戶信息顯示在頁面頂部（頭像、姓名、郵箱）
- AI 食譜推薦功能解鎖
- 用戶可點擊 **登出** 按鈕退出

### 安全特性
- 用戶認證狀態存儲在瀏覽器 localStorage
- 未登入用戶無法訪問食譜生成和保存功能
- JWT token 存儲在 localStorage 中

## 本地開發

### 使用 Python 內置伺服器
```bash
# Python 3.x
python -m http.server 8000

# 訪問 http://localhost:8000
```

### 使用 Node.js http-server
```bash
npm install -g http-server
http-server
```

### 使用 VS Code Live Server 擴展
1. 安裝 Live Server 擴展
2. 右鍵點擊 `index.html`
3. 選擇 **Open with Live Server**

## 常見問題

### Q: 登入後刷新頁面，我需要重新登入嗎？
A: 不需要，登入狀態保存在 localStorage 中。除非您清除瀏覽器數據或登出，否則會保持登入狀態。

### Q: 如何在多個域名上使用？
A: 在 Google Cloud Console 的認證設置中添加所有授權的 JavaScript 源和重定向 URI。

### Q: 我如何驗證用戶身份？
A: JWT token 存儲在 `localStorage.getItem('smartchef_token')` 中，可發送到後端進行驗證。

### Q: 是否支持第三方登入（Facebook、GitHub）？
A: 目前僅實現 Google Sign-In。未來可添加其他提供者。

## 代碼結構

- **auth.js**: 認證邏輯和 Google Sign-In 初始化
- **config.js**: Google Client ID 配置
- **main.js**: 添加了 `checkLoginBeforeAction()` 檢查
- **index.html**: 登入 UI 和 Google GSI 庫

## 參考資源

- [Google Sign-In 官方文檔](https://developers.google.com/identity/sign-in/web/sign-in?hl=zh-tw)
- [Google Identity 服務文檔](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 指南](https://developers.google.com/identity/protocols/oauth2)
