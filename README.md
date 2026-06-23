# SmartChef AI - 智慧食譜推薦系統

## 🎯 專案概述

SmartChef AI 是一個智能食譜推薦系統，結合 AI 技術為使用者根據現有食材和飲食偏好生成個性化食譜建議。系統支持將食譜保存到 Google Sheets，方便使用者管理和查看歷史記錄。

### 主要功能

✨ **核心功能：**
- 🔍 輸入現有食材和飲食偏好
- 🤖 AI 生成個性化食譜推薦
- 💾 保存食譜到 Google Sheets
- 📱 響應式設計，支持多設備訪問
- 🌐 部署在 GitHub Pages 上

---

## 📋 技術棧

| 層級 | 技術 |
|------|------|
| **前端** | HTML5 + CSS3 + Vanilla JavaScript |
| **後端** | Google Apps Script |
| **AI 引擎** | Google Gemini API (免費) |
| **數據存儲** | Google Sheets |
| **部署** | GitHub Pages |

---

## 🚀 快速開始

### 1️⃣ 前置要求

- GitHub 帳號（用於部署）
- Google 帳號（用於 API 和 Sheets）
- Google Gemini API 金鑰（免費取得）

### 2️⃣ 獲取 AI API 金鑰

#### 方式 A: Google Gemini（推薦 - 完全免費）

1. 訪問 [Google AI Studio](https://ai.google.dev)
2. 點擊 "Get API Key"
3. 建立新專案並生成 API 金鑰
4. 將金鑰複製到 `docs/assets/js/config.js` 中的 `CONFIG.AI.API_KEY`

#### 方式 B: OpenAI（可選）

1. 訪問 [OpenAI 平台](https://platform.openai.com)
2. 建立 API 金鑰
3. 配置到 config.js 中

### 3️⃣ 設置 Google Sheets 集成

#### Step 1: 建立 Google Sheet

1. 訪問 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表，命名為 "SmartChef Recipes"
3. 記下試算表 ID（URL 中的 ID）

#### Step 2: 建立 Google Apps Script

1. 在 Google Sheet 中，點擊 "Extensions" → "Apps Script"
2. 刪除預設程式碼
3. 複製 `/scripts/apps-script.gs` 的內容到編輯器
4. 將腳本中的 `SHEET_ID` 替換為你的試算表 ID
5. 保存腳本

#### Step 3: 部署 Apps Script

1. 點擊 "Deploy" → "New deployment"
2. 選擇 "Type: Web app"
3. 配置如下：
   - Execute as: 你的 Google 帳號
   - Who has access: Anyone
4. 點擊 "Deploy"
5. 複製顯示的部署 URL
6. 將 URL 粘貼到 `docs/assets/js/config.js` 中的 `CONFIG.GOOGLE_SHEETS.SCRIPT_URL`

### 4️⃣ 配置前端

編輯 `/docs/assets/js/config.js`：

```javascript
const CONFIG = {
    GOOGLE_SHEETS: {
        SCRIPT_URL: 'https://script.google.com/macros/d/YOUR_ID/userweb',
        SHEET_ID: 'YOUR_SHEET_ID'
    },
    AI: {
        API_KEY: 'YOUR_GEMINI_API_KEY'
    }
};
```

### 5️⃣ 部署到 GitHub Pages

#### 方式 1: 使用 GitHub Web 界面

1. 推送程式碼到 GitHub 倉庫
   ```bash
   git add .
   git commit -m "Initial SmartChef AI setup"
   git push origin main
   ```

2. 進入 GitHub 倉庫設置
3. 找到 "Pages" 部分
4. 設置：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
5. 保存並等待部署完成

#### 方式 2: 使用 GitHub CLI

```bash
gh repo edit --enable-issues
# 設置 Pages 配置
```

### 6️⃣ 訪問應用

部署完成後，訪問：
```
https://YOUR_USERNAME.github.io/schoolwork/
```

---

## 📁 專案結構

```
schoolwork/
├── docs/                          # GitHub Pages 根目錄
│   ├── index.html                # 主頁面
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css         # 樣式表
│   │   └── js/
│   │       ├── config.js         # ⚙️ 配置檔案（需要編輯）
│   │       ├── api.js            # API 通信模組
│   │       └── main.js           # 主應用邏輯
├── scripts/
│   └── apps-script.gs            # Google Apps Script 後端
└── README.md                      # 本檔案
```

---

## 🔧 使用說明

### 生成食譜

1. **輸入食材**
   - 在文字框中輸入現有的食材
   - 多個食材用逗號分隔
   - 例如：`雞肉, 番茄, 洋蔥, 大蒜, 米`

2. **選擇偏好**
   - 輸入飲食限制（素食、無麩質等）
   - 選擇烹飪難度
   - 設定人份數

3. **生成食譜**
   - 點擊 "🤖 生成食譜" 按鈕
   - 等待 AI 生成建議（通常需要 5-15 秒）

4. **保存食譜**
   - 滿意後點擊 "💾 保存到 Google Sheets"
   - 食譜將自動保存到你的試算表

---

## 🛠️ 常見問題

### Q: API 金鑰是否安全？

**A:** 當前配置中，API 金鑰存儲在前端程式碼中。對於生產環境，建議：
- 使用後端代理隱藏 API 金鑰
- 使用環境變數
- 限制 API 金鑰的使用範圍和速率

### Q: 可以離線使用嗎？

**A:** 不能。系統需要網路連接來：
- 調用 Google Gemini API
- 訪問 Google Sheets
- 在 GitHub Pages 上託管

### Q: 如何修改生成食譜的提示詞？

**A:** 編輯 `/docs/assets/js/api.js` 中的 `buildRecipePrompt()` 函數。

### Q: 支持多語言嗎？

**A:** 目前支持繁體中文。修改 `config.js` 中的 `RECIPE_LANGUAGE` 可以調整提示詞語言。

### Q: 食譜生成失敗？

**A:** 檢查以下項目：
- ✅ API 金鑰是否正確配置
- ✅ 網路連接是否正常
- ✅ 是否超出 API 配額
- ✅ 瀏覽器控制台是否有錯誤訊息

---

## 🔐 安全建議

1. **不要提交真實的 API 金鑰到公開倉庫**
   - 使用 `.gitignore` 排除配置檔案
   - 或在部署時設置環境變數

2. **限制 API 金鑰**
   - 在 Google Cloud Console 中設置使用限額
   - 限制允許的來源 (referrers)

3. **Google Sheets 權限**
   - 只在 Apps Script 中授予必要的權限
   - 定期檢查共享設置

---

## 📈 後續改進

- [ ] 添加使用者驗證
- [ ] 實現食譜搜尋功能
- [ ] 營養信息計算
- [ ] 食材價格估算
- [ ] 購物清單生成
- [ ] 多語言支持
- [ ] 離線緩存
- [ ] 食譜分享功能

---

## 🤝 貢獻指南

歡迎提交 Issues 和 Pull Requests！

---

## 📄 授權

本專案使用 MIT 授權。

---

## 📧 聯絡方式

如有問題或建議，請提交 Issue。

---

**祝你使用愉快！🍳✨**
