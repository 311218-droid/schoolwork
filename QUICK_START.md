# SmartChef AI - 快速設置指南

## 🚀 5 分鐘快速開始

### 1. 獲取 Gemini API 金鑰（2 分鐘）

```
https://ai.google.dev → Get API Key → Copy
```

### 2. 創建 Google Sheet 和 Apps Script（2 分鐘）

```
https://sheets.google.com → New Sheet → Extensions → Apps Script
```

複製並粘貼 `/scripts/apps-script.gs` 的內容

### 3. 部署 Apps Script（1 分鐘）

```
Deploy → New Deployment → Web app → Anyone → Deploy → Copy URL
```

### 4. 配置檔案

編輯 `docs/assets/js/config.js`：

```javascript
const CONFIG = {
    GOOGLE_SHEETS: {
        SCRIPT_URL: '你複製的部署 URL',
        SHEET_ID: '試算表 ID（URL 中間的字符串）'
    },
    AI: {
        API_KEY: '你的 Gemini API 金鑰'
    }
};
```

### 5. 部署到 GitHub Pages

```bash
git add .
git commit -m "SmartChef AI setup"
git push origin main
```

**完成！** 訪問 `https://你的用戶名.github.io/schoolwork/`

---

## 📖 詳細步驟

### A. Gemini API 設置

1. 打開 https://ai.google.dev
2. 點擊紅色 "Get API Key" 按鈕
3. 點擊 "Create API Key"
4. 選擇 "Create API key in new Google Cloud project"
5. 複製顯示的 API 金鑰
6. 粘貼到 `config.js` 的 `API_KEY` 欄位

### B. Google Sheets 和 Apps Script

1. **建立試算表**
   - 訪問 https://sheets.google.com
   - 點擊 "+ 新增" → "試算表"
   - 命名為 "SmartChef Recipes"
   - 記下 URL 中的 ID

2. **建立 Apps Script**
   - 在 Google Sheet 中，點擊 "擴充功能" → "Apps Script"
   - 刪除預設程式碼
   - 複製 `/scripts/apps-script.gs` 中的全部內容
   - 粘貼到編輯器
   - 修改第 3 行的 `SHEET_ID`：
     ```javascript
     const SHEET_ID = '你的試算表ID';
     ```
   - Ctrl+S 保存

3. **部署 Apps Script**
   - 點擊 "部署" 按鈕
   - 選擇 "新增部署"
   - 類型選擇 "Web 應用"
   - 配置：
     - 執行身份：你的 Google 帳號
     - 誰可以存取：任何人
   - 點擊 "部署"
   - 複製顯示的部署 URL
   - 粘貼到 `config.js` 的 `SCRIPT_URL` 欄位

### C. 配置前端

編輯 `/docs/assets/js/config.js`，替換所有 `YOUR_*` 的值：

```javascript
const CONFIG = {
    GOOGLE_SHEETS: {
        SCRIPT_URL: 'https://script.google.com/macros/d/..../userweb',  // ← 粘貼 Apps Script URL
        SHEET_ID: '1mABxxxxxxxxxxxxxx...'  // ← 粘貼試算表 ID
    },
    AI: {
        API_KEY: 'AIza...'  // ← 粘貼 Gemini API 金鑰
    }
};
```

### D. 推送到 GitHub

```bash
cd /workspaces/schoolwork
git add .
git commit -m "Complete SmartChef AI configuration"
git push origin main
```

### E. 啟用 GitHub Pages

1. 進入倉庫設置（Settings）
2. 找到 "Pages" 部分
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/docs"
6. 點擊 Save

---

## ✨ 驗證安裝

### 本地測試

訪問應用並測試：

1. 輸入食材：`雞肉, 番茄, 洋蔥`
2. 點擊 "生成食譜"
3. 等待結果（5-15 秒）
4. 點擊 "保存到 Google Sheets"
5. 檢查 Google Sheet 中是否有新記錄

### 遠端測試

部署完成後（5-10 分鐘）：

訪問 `https://你的用戶名.github.io/schoolwork/` 並重複上述測試

---

## 🆘 快速排除故障

### 食譜生成失敗

```
❌ 無法生成食譜
```

**檢查項目：**
- [ ] Gemini API 金鑰是否正確
- [ ] 是否超出 API 免費配額（500 req/min）
- [ ] 網路連接是否正常

**解決方案：**
1. F12 打開開發者工具 → Console
2. 檢查錯誤訊息
3. 查看 https://ai.google.dev 的使用統計

### 無法保存到 Sheets

```
❌ 無法保存到 Google Sheets
```

**檢查項目：**
- [ ] Apps Script URL 是否正確
- [ ] SHEET_ID 是否正確且一致
- [ ] Google Sheet 是否可訪問

**解決方案：**
1. 驗證 `config.js` 中的兩個 URL
2. 在 Google Sheet 中手動測試訪問
3. 重新部署 Apps Script（新部署）

### GitHub Pages 無法訪問

```
404 Not Found
```

**檢查項目：**
- [ ] Pages 配置中 Folder 是否設為 `/docs`
- [ ] 是否已推送到 main 分支
- [ ] 是否等待了足夠時間（5-10 分鐘）

**解決方案：**
1. 重新檢查 Pages 配置
2. 進入 Actions 標籤檢查部署狀態
3. 清除瀏覽器快取（Ctrl+Shift+Delete）

---

## 📚 更多資源

- [完整 README](README.md)
- [部署指南](DEPLOYMENT.md)
- [配置參考](CONFIG.md)
- [Gemini API 文檔](https://ai.google.dev/docs)
- [Google Apps Script 文檔](https://developers.google.com/apps-script)

---

**需要幫助？查看上述文檔或檢查瀏覽器控制台的錯誤訊息！** 💡
