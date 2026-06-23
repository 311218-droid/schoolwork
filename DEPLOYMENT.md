# SmartChef AI 部署指南

## 🎯 GitHub Pages 部署步驟

### 前置準備

1. ✅ 已配置 Google Gemini API 金鑰
2. ✅ 已建立 Google Sheets 和 Apps Script
3. ✅ 已配置 `config.js` 中的所有參數

### 部署流程

#### 步驟 1: 確認 GitHub Pages 設置

在倉庫設置中：

```
Settings → Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /docs
```

#### 步驟 2: 推送程式碼

```bash
# 初始化 Git（如果尚未初始化）
git init
git add .
git commit -m "SmartChef AI 初始版本"
git branch -M main
git remote add origin https://github.com/你的用戶名/schoolwork.git
git push -u origin main
```

#### 步驟 3: 驗證部署

1. 進入倉庫主頁
2. 找到 "Deployments" 部分
3. 確認最新部署狀態為 "Active"
4. 訪問 GitHub Pages URL: `https://你的用戶名.github.io/schoolwork/`

#### 步驟 4: 檢測功能

在部署的網站上：

1. 輸入測試食材
2. 點擊 "生成食譜"
3. 確認食譜生成成功
4. 點擊 "保存到 Google Sheets"
5. 檢查 Google Sheet 中是否有新記錄

---

## 🔄 更新和維護

### 更新程式碼

```bash
# 修改本地檔案後
git add .
git commit -m "描述你的改動"
git push origin main
```

GitHub Pages 會自動重新部署。

### 更新配置

如需更新 API 金鑰或 Sheets URL：

1. 編輯 `docs/assets/js/config.js`
2. 提交變更
3. 推送到 GitHub

### 更新 Apps Script

如需更新後端邏輯：

1. 編輯 `/scripts/apps-script.gs`
2. 複製更新的程式碼到 Google Apps Script 編輯器
3. 如需更改部署 URL，重新部署為新版本

---

## 🧪 本地開發

### 本地運行

使用簡單的 HTTP 伺服器運行本地版本：

```bash
# Python 3
python -m http.server 8000 --directory docs

# 或使用 Node.js http-server
npx http-server docs -p 8000
```

訪問 `http://localhost:8000`

---

## ⚠️ 常見部署問題

### 問題 1: 食譜生成返回 CORS 錯誤

**解決方案：**
- 確認 API 金鑰正確
- 檢查 API 配額是否已用完
- 確認 Gemini API 已在 Google Cloud 中啟用

### 問題 2: 無法保存到 Google Sheets

**解決方案：**
- 驗證 Apps Script 部署 URL 正確
- 確認 Apps Script 中的 SHEET_ID 正確
- 檢查 Google Sheet 是否可訪問
- 查看瀏覽器控制台的錯誤訊息

### 問題 3: GitHub Pages 404 錯誤

**解決方案：**
- 確認倉庫名稱和 URL 路徑一致
- 檢查 Pages 配置中的 Folder 設置為 `/docs`
- 等待幾分鐘讓 GitHub Pages 完成部署

### 問題 4: 部署後頁面為空白

**解決方案：**
- 清除瀏覽器快取（Ctrl+Shift+Delete）
- 查看瀏覽器控制台（F12）的錯誤訊息
- 確認 `index.html` 在 `/docs` 目錄中

---

## 📊 效能優化

為提高效能，可以：

1. **最小化 CSS/JS**（可選）
   - 使用在線工具最小化 CSS 和 JavaScript

2. **啟用 CDN**
   - 考慮使用 CDN 加速靜態資源

3. **優化圖片**
   - 如有圖片資源，使用適當格式和尺寸

---

## 🔒 安全檢查清單

在部署前確保：

- [ ] API 金鑰不在公開倉庫中
- [ ] 使用 HTTPS（GitHub Pages 自動支持）
- [ ] Google Sheets 共享設置正確
- [ ] Apps Script 執行權限合理
- [ ] 定期監控 API 使用量

---

## 📞 故障排除

如遇見問題：

1. 檢查瀏覽器控制台（F12 → Console）
2. 查看 Google Apps Script 執行日誌
3. 驗證所有配置參數
4. 清除快取重試

---

**部署完成！享受 SmartChef AI 🎉**
