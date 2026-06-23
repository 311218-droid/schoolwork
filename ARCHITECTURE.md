# SmartChef AI - 專案架構

## 📐 系統架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                    用戶瀏覽器（GitHub Pages）                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              前端應用 (JavaScript)                        │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ index.html - 用戶界面                              │ │   │
│  │  │  • 食材輸入框                                      │ │   │
│  │  │  • 飲食偏好選項                                    │ │   │
│  │  │  • 生成按鈕                                        │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          ↕                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ JavaScript 邏輯模組                                │ │   │
│  │  │  • config.js      - 配置管理                       │ │   │
│  │  │  • api.js         - API 通信                       │ │   │
│  │  │  • main.js        - 應用邏輯                       │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          ↕                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ CSS 樣式表                                         │ │   │
│  │  │  • style.css      - 響應式設計                     │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                     │
│                           ↓ ↑                                      │
│                    API 調用 / 回應                                 │
└─────────────────────────────────────────────────────────────────┘
          ↓                                          ↓
    ┌──────────────┐                          ┌──────────────┐
    │ Gemini API   │                          │ Google Cloud │
    │ (AI 模型)    │                          │ Apps Script  │
    │              │                          │  (後端邏輯)   │
    └──────────────┘                          └──────────────┘
                                                      ↓
                                              ┌──────────────┐
                                              │Google Sheets │
                                              │ (數據存儲)    │
                                              └──────────────┘
```

---

## 🎯 數據流程

### 1️⃣ 食譜生成流程

```
用戶輸入 (食材、偏好)
    ↓
main.js: generateRecipe()
    ↓
api.js: callGeminiAPI()
    ↓
Google Gemini API 處理
    ↓
api.js: parseRecipeResponse()
    ↓
前端顯示食譜結果
    ↓
用戶點擊「保存」
```

### 2️⃣ 保存流程

```
用戶選擇食譜
    ↓
main.js: saveRecipeToSheets()
    ↓
api.js: saveRecipeToSheets()
    ↓
Google Apps Script API 調用
    ↓
Google Apps Script 後端
    ↓
Google Sheets 記錄數據
    ↓
用戶看到確認訊息
```

---

## 📁 文件結構

```
schoolwork/
│
├── 📄 README.md                    # 完整項目說明
├── 📄 QUICK_START.md              # 5分鐘快速開始
├── 📄 CONFIG.md                   # 配置參考
├── 📄 DEPLOYMENT.md               # 部署指南
├── 📄 TROUBLESHOOTING.md          # 故障排除
├── 📄 ARCHITECTURE.md             # 本文件
├── 📄 .gitignore                  # Git 忽略配置
│
├── 📁 docs/                       # GitHub Pages 根目錄
│   ├── 📄 index.html              # 主頁面（入口點）
│   │
│   └── 📁 assets/
│       ├── 📁 css/
│       │   └── 📄 style.css       # 全局樣式表
│       │                           # • 響應式設計
│       │                           # • 深色主題
│       │                           # • 動畫效果
│       │
│       └── 📁 js/
│           ├── 📄 config.js       # 配置文件 ⚙️
│           │                       # • API 密鑰
│           │                       # • Google Sheets URL
│           │                       # • 應用設置
│           │
│           ├── 📄 api.js          # API 通信模組
│           │                       # • callGeminiAPI()
│           │                       # • saveRecipeToSheets()
│           │                       # • parseRecipeResponse()
│           │
│           └── 📄 main.js         # 應用主邏輯
│                                   # • 事件處理
│                                   # • UI 更新
│                                   # • 表單驗證
│
└── 📁 scripts/
    └── 📄 apps-script.gs          # Google Apps Script 後端
                                   # • 接收前端請求
                                   # • 訪問 Google Sheets
                                   # • 保存數據
```

---

## 🔌 API 集成

### Gemini API

**端點：** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**方法：** POST

**請求：**
```json
{
  "contents": [{
    "parts": [{
      "text": "提示詞..."
    }]
  }]
}
```

**響應：**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "生成的食譜..."
      }]
    }
  }]
}
```

### Google Apps Script Web App

**URL：** 部署後生成的 URL

**方法：** POST

**請求：**
```json
{
  "action": "saveRecipe",
  "recipe": {
    "name": "食譜名稱",
    "time": "30分鐘",
    "difficulty": "中等",
    "ingredients": ["材料1", "材料2"],
    "instructions": ["步驟1", "步驟2"],
    "tips": "小貼士...",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

---

## 🔐 安全考慮

### 當前實現

- 前端直接包含 API 密鑰（**不適合生產環境**）
- GitHub Pages 提供 HTTPS 加密傳輸
- Google Apps Script 進行服務端驗證

### 生產環境建議

1. **使用後端代理**
   ```
   前端 → 後端服務器 → Google APIs
   ```

2. **環境變量管理**
   ```
   API_KEY 存儲在服務器環境變量中
   前端調用後端端點
   ```

3. **速率限制**
   ```
   在後端實現速率限制
   防止濫用 API
   ```

4. **日志和監控**
   ```
   記錄所有 API 調用
   監控異常使用
   ```

---

## ⚡ 性能優化

### 當前實現

- Vanilla JavaScript（無框架開銷）
- 本地 CSS（無 CDN 依賴）
- 異步 API 調用

### 優化建議

| 方面 | 當前 | 優化 |
|------|------|------|
| 資源加載 | 順序加載 | 並行加載 |
| CSS | 全局 | 組件化 |
| JS | 單文件 | 模塊化 |
| 快取 | 無 | 服務工作者 |
| 壓縮 | 無 | Gzip 壓縮 |

---

## 🧪 測試策略

### 單元測試

對以下函數進行測試：

- `parseRecipeResponse()` - 食譜解析
- `buildRecipePrompt()` - 提示詞生成
- `validateInput()` - 輸入驗證

### 集成測試

- 完整的食譜生成流程
- Google Sheets 保存功能
- 錯誤處理流程

### 用戶測試

- 跨瀏覽器兼容性
- 手機和平板設備
- 不同網速環境

---

## 🚀 部署流程

```
本地開發
    ↓
測試和調試
    ↓
提交到 Git
    ↓
推送到 GitHub main 分支
    ↓
GitHub Actions 構建（自動）
    ↓
GitHub Pages 部署（自動）
    ↓
訪問 https://user.github.io/schoolwork/
```

---

## 📊 配置管理

### 環境配置

| 環境 | 檔案 | 方式 |
|------|------|------|
| 開發 | config.js | 硬編碼（用於測試） |
| 生產 | .env | 環境變量 |

### 配置優先級

```
環境變量 > .env 文件 > config.js 默認值
```

---

## 🔄 版本管理

### Git 工作流

```
main
  ├─ v1.0 - 初始版本
  ├─ v1.1 - 功能增強
  └─ v2.0 - 重大更新

feature/* - 功能分支
bugfix/*  - 修復分支
hotfix/*  - 緊急修復
```

---

## 📈 擴展可能性

### 後續功能

1. **用戶帳戶**
   - 登錄系統
   - 個人食譜收藏

2. **高級搜尋**
   - 按營養篩選
   - 按成本篩選

3. **社區功能**
   - 食譜分享
   - 評分和評論

4. **應用集成**
   - 移動應用
   - 語音助手

---

**了解系統架構有助於更好地維護和擴展項目！** 🏗️
