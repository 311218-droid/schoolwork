# SmartChef AI - 登入功能測試指南

## 實現功能概述

✅ **已實現的功能：**

1. **Google Sign-In 整合**
   - 使用 Google Identity Services (GSI) 庫
   - 安全的 OAuth 2.0 認證流程
   - 支持繁體中文 UI

2. **用戶認證管理**
   - JWT token 解析與本地存儲
   - 自動登入狀態恢復
   - 登出功能
   - 登入狀態持久化

3. **訪問控制**
   - 未登入用戶無法訪問食譜生成功能
   - 未登入用戶無法保存食譜
   - 清晰的登入提示消息
   - 登入後自動解鎖功能

4. **UI/UX 改進**
   - 專業的登入卡片界面
   - 用戶信息顯示（頭像、姓名、郵箱）
   - 登出按鈕
   - 響應式設計
   - 認證相關消息提示

## 快速測試步驟

### 步驟 1：配置 Google Client ID

1. 打開 [Google Cloud Console](https://console.cloud.google.com/)
2. 按照 `GOOGLE_SIGNIN_SETUP.md` 中的指示設置 OAuth 2.0
3. 獲取您的 Client ID
4. 編輯 `assets/js/config.js`:
   ```javascript
   CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
   ```

### 步驟 2：啟動本地伺服器

```bash
# 方法 1: Python 3
python -m http.server 8000

# 方法 2: Node.js http-server
npx http-server
```

### 步驟 3：在瀏覽器中測試

1. 打開 `http://localhost:8000`
2. 您應該看到登入卡片
3. 點擊 **Sign in with Google** 按鈕
4. 選擇您的 Google 帳號
5. 授權應用訪問
6. 登入成功！您現在可以看到：
   - 用戶頭像和姓名
   - 食材輸入表單
   - 🤖 生成食譜按鈕已啟用

### 步驟 4：測試功能

✅ **測試登入成功後的功能：**
- 輸入食材
- 選擇飲食偏好
- 點擊 **生成食譜**
- 查看 AI 推薦的食譜

✅ **測試登出：**
- 點擊用戶信息框中的 **登出**
- 頁面應回到登入界面
- 食譜生成按鈕應被禁用

### 步驟 5：測試持久化

1. 登入您的帳號
2. 刷新頁面 (`Ctrl+R` 或 `Cmd+R`)
3. 您應該保持登入狀態（無需重新登入）

## 開發者注意事項

### 文件結構

```
/workspaces/schoolwork/
├── index.html                          # 主頁面（包含登入 UI）
├── assets/
│   ├── js/
│   │   ├── config.js                   # 配置（包含 Google Client ID）
│   │   ├── auth.js                     # 認證邏輯 ⭐ NEW
│   │   ├── main.js                     # 主要邏輯（已修改）
│   │   └── api.js                      # API 調用
│   └── css/
│       └── style.css                   # 樣式（已添加登入相關樣式）
├── GOOGLE_SIGNIN_SETUP.md              # Google Sign-In 設置指南 ⭐ NEW
└── TESTING.md                          # 本測試文檔 ⭐ NEW
```

### 核心修改點

#### 1. **auth.js** - 新文件
- `initializeGoogleSignIn()` - 初始化 Google Sign-In
- `handleCredentialResponse()` - 處理登入回調
- `checkUserLoginStatus()` - 檢查登入狀態
- `logout()` - 登出功能
- `checkLoginBeforeAction()` - 在操作前檢查登入

#### 2. **main.js** - 修改
- 添加 `generateRecipeWithAuth()` - 帶認證檢查的食譜生成
- 修改 `saveToSheets()` - 添加登入檢查
- 修改 `saveIndividualRecipe()` - 添加登入檢查

#### 3. **index.html** - 修改
- 添加登入卡片 UI
- 添加用戶信息顯示區
- 加載 Google GSI 庫
- 修改按鈕 onclick 為 `generateRecipeWithAuth()`

#### 4. **config.js** - 修改
- 添加 `GOOGLE_AUTH` 配置
- 添加 `REQUIRE_LOGIN` 標誌

#### 5. **style.css** - 修改
- 添加登入相關樣式
- 改進 header 布局（flex）
- 添加登出按鈕樣式
- 添加認證消息樣式

## localStorage 結構

應用在瀏覽器中存儲以下數據：

```javascript
// 用戶信息 (JSON)
localStorage.getItem('smartchef_user')
{
  "id": "google_sub_id",
  "email": "user@gmail.com",
  "name": "User Name",
  "picture": "https://...",
  "token": "JWT_token"
}

// JWT Token
localStorage.getItem('smartchef_token')
// JWT format: header.payload.signature
```

## 故障排除

### 問題：Google 登入按鈕不顯示
**解決方案：**
- 確認 Google GSI 庫已加載（檢查瀏覽器控制台）
- 檢查 Client ID 是否正確配置
- 檢查是否添加了授權的 JavaScript 源

### 問題：登入後按鈕仍被禁用
**解決方案：**
- 清除瀏覽器 localStorage: `localStorage.clear()`
- 刷新頁面
- 檢查瀏覽器控制台是否有錯誤

### 問題：跨域錯誤
**解決方案：**
- 確認在 Google Cloud Console 中添加了正確的授權源
- 使用精確的域名（包括端口號）
- 等待配置生效（最多幾分鐘）

## 安全建議

🔒 **生產環境建議：**

1. **不要在 localStorage 中存儲敏感信息**
   - 使用 HttpOnly cookies 存儲 tokens
   - 後端驗證所有 tokens

2. **實現後端驗證**
   - 驗證 JWT 簽名
   - 檢查 token 過期時間
   - 為敏感操作添加額外認證

3. **啟用 HTTPS**
   - 生產環境必須使用 HTTPS
   - Google Sign-In 在 HTTP 下有限制

4. **定期更新依賴**
   - 保持 Google GSI 庫最新
   - 定期檢查安全漏洞

## 下一步

考慮添加以下功能：

- [ ] 後端 token 驗證
- [ ] 用戶數據庫保存
- [ ] 用戶偏好設定保存
- [ ] 多語言支持
- [ ] 第三方登入（Facebook、GitHub）
- [ ] 社交分享功能
- [ ] 用戶反饋系統

## 支持

遇到問題？請參考：
- 本文檔中的故障排除部分
- `GOOGLE_SIGNIN_SETUP.md`
- [Google Sign-In 官方文檔](https://developers.google.com/identity/sign-in/web/sign-in?hl=zh-tw)
