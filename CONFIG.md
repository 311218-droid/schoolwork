# SmartChef AI 配置指南

## ⚙️ 必須配置的參數

### 1. Google Gemini API 金鑰

**檔案位置：** `docs/assets/js/config.js`

```javascript
AI: {
    API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
    // ... 其他配置
}
```

**獲取方式：**

1. 訪問 https://ai.google.dev
2. 點擊 "Get API Key" → "Create API Key"
3. 選擇或建立專案
4. 複製生成的 API 金鑰
5. 粘貼到上述位置

---

### 2. Google Apps Script 部署 URL

**檔案位置：** `docs/assets/js/config.js`

```javascript
GOOGLE_SHEETS: {
    SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE',
    SHEET_ID: 'YOUR_GOOGLE_SHEETS_ID_HERE'
}
```

**部署步驟：**

1. 打開 `/scripts/apps-script.gs` 中的程式碼
2. 進入 Google Drive，新建 Google Sheet
3. 複製 Sheet ID（URL 中間的長字串）
4. 點擊 Extensions → Apps Script
5. 在 Apps Script 編輯器中粘貼 `apps-script.gs` 的內容
6. 修改 `const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'` 中的 ID
7. 點擊 Deploy → New Deployment
8. 選擇 Type: Web app
9. 配置執行者和訪問權限
10. 複製部署 URL

---

### 3. Google Sheets ID

該 ID 可從 Google Sheet URL 中獲取：

```
https://docs.google.com/spreadsheets/d/1mABxxxxxxxxxxxxxx/edit
                                     ↑ 這個就是 SHEET_ID
```

---

## 🔧 可選配置

### 語言設置

```javascript
APP: {
    RECIPE_LANGUAGE: 'zh-TW'  // 支持: zh-TW, en, zh-CN
}
```

### API 溫度參數

控制 AI 輸出的創意程度（0-1）：
- 0.0: 更保守、一致
- 0.7: 平衡（推薦）
- 1.0: 更創意、多樣

```javascript
TEMPERATURE: 0.7
```

---

## ✅ 驗證配置

### 方法 1: 在瀏覽器中測試

1. 訪問應用
2. 打開開發者工具（F12）
3. 在 Console 中運行：
   ```javascript
   console.log('API Key:', CONFIG.AI.API_KEY);
   console.log('Script URL:', CONFIG.GOOGLE_SHEETS.SCRIPT_URL);
   ```
4. 確認值已正確設置

### 方法 2: 功能測試

1. 輸入測試食材
2. 點擊生成食譜
3. 檢查是否成功生成
4. 嘗試保存到 Google Sheets

---

## 🚨 配置錯誤排查

| 錯誤訊息 | 原因 | 解決方案 |
|---------|------|--------|
| "API 金鑰未配置" | `API_KEY` 為空或包含 `YOUR_` | 填入實際 API 金鑰 |
| "無法連接到 Google Sheets" | Apps Script URL 錯誤 | 驗證部署 URL |
| "無法訪問試算表" | SHEET_ID 錯誤 | 確認 Sheets ID 和 Apps Script 中的 ID 一致 |
| "API 錯誤" | Gemini API 配額已用完 | 等待或升級計畫 |

---

## 🔐 安全最佳實踐

### ❌ 不要做

- 不要將真實 API 金鑰提交到公開倉庫
- 不要在前端代碼中硬編碼機密信息
- 不要共享 .env 檔案

### ✅ 應該做

- 使用環境變數或後端代理
- 為 API 金鑰設置限額
- 定期輪換 API 金鑰
- 在生產環境中使用 HTTPS

---

## 📝 配置檢查清單

在部署前確保：

- [ ] Gemini API 金鑰已配置
- [ ] Google Apps Script URL 已配置
- [ ] Google Sheets ID 已配置
- [ ] Apps Script 中的 SHEET_ID 已更新
- [ ] 所有參數都不包含 `YOUR_` 字樣
- [ ] 測試功能正常運作

---

## 🆘 需要幫助？

1. 查看 [README.md](README.md) 獲取完整說明
2. 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 獲取部署指南
3. 查看瀏覽器控制台的錯誤訊息
4. 檢查 Google Apps Script 的執行日誌

---

**配置完成後，應用即可正常使用！** ✨
