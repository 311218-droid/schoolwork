# SmartChef AI - 故障排除指南

## 🔍 問題診斷

### 工具和訊息

#### 1. 開發者工具（F12）

所有前端錯誤都會在 Console 標籤中顯示。

**使用方法：**
1. 按 F12 打開開發者工具
2. 點擊 "Console" 標籤
3. 查看紅色錯誤訊息
4. 記下完整的錯誤堆疊信息

#### 2. Google Apps Script 日誌

查看後端執行日誌。

**使用方法：**
1. 打開 Google Apps Script 編輯器
2. 點擊 "Execution log"
3. 查看最近的執行記錄

---

## 🐛 常見問題和解決方案

### 問題 1: "API 金鑰未配置"

```
❌ AI API 金鑰未配置。請按照設置說明進行配置。
```

**原因：**
- API 金鑰為空
- API 金鑰包含 `YOUR_` 字樣

**解決方案：**

1. 打開 `docs/assets/js/config.js`
2. 確認 API_KEY 不為空：
   ```javascript
   API_KEY: 'AIza...'  // ✅ 應該是這樣
   // 不是
   API_KEY: 'YOUR_GEMINI_API_KEY_HERE'  // ❌ 這樣
   ```
3. 刷新頁面重試

**驗證方法：**
```javascript
// F12 Console 中運行
console.log(CONFIG.AI.API_KEY);
// 應該顯示完整的金鑰，不是 YOUR_...
```

---

### 問題 2: "無法生成食譜"

```
❌ 無法生成食譜: API Error
```

**可能的原因：**

| 原因 | 檢查方式 | 解決方案 |
|------|---------|--------|
| API 金鑰無效 | 在 ai.google.dev 測試 | 重新生成 API 金鑰 |
| 超出配額 | Console 檢查 429 錯誤 | 等待或升級計畫 |
| 沒有輸入食材 | 檢查食材文字框 | 輸入至少一個食材 |
| 食材超過限制 | 計算逗號個數 | 食材不超過 20 個 |
| 網路問題 | 測試其他網站 | 檢查網路連接 |

**具體診斷：**

1. **檢查 API 金鑰**
   ```javascript
   // F12 Console
   console.log(CONFIG.AI.API_KEY);
   // 應顯示: AIza... (長字符串)
   ```

2. **檢查網路請求**
   - F12 → Network 標籤
   - 點擊生成食譜
   - 查看名為 `gemini...` 的請求
   - 檢查 Status（應為 200）
   - 查看 Response 中的錯誤訊息

3. **查看 Console 中的詳細錯誤**
   ```
   GET https://generativelanguage.googleapis.com/...
   → 429 Too Many Requests
   (表示超出配額)
   ```

---

### 問題 3: "無法保存到 Google Sheets"

```
❌ 無法保存到 Google Sheets: ...
```

**可能的原因：**

| 原因 | 檢查方式 | 解決方案 |
|------|---------|--------|
| Apps Script URL 錯誤 | 驗證 config.js | 複製正確的部署 URL |
| SHEET_ID 錯誤 | 檢查 Sheet URL | 複製正確的 ID |
| Apps Script 錯誤 | 查看 Apps Script 日誌 | 檢查腳本中的 SHEET_ID |
| Google Sheet 不可訪問 | 直接打開 Sheet | 檢查權限設置 |
| Apps Script 未部署 | 查看 Deployments | 重新部署 |

**詳細步驟：**

1. **驗證 Apps Script URL**
   ```javascript
   // F12 Console
   console.log(CONFIG.GOOGLE_SHEETS.SCRIPT_URL);
   // 應該是: https://script.google.com/macros/d/xxxxx/userweb
   ```

2. **驗證 SHEET_ID**
   ```javascript
   // F12 Console
   console.log(CONFIG.GOOGLE_SHEETS.SHEET_ID);
   // 應該是一長串字符
   ```

3. **檢查 Apps Script 日誌**
   - 打開 Google Apps Script 編輯器
   - 點擊 "Execution log"
   - 查看最近的執行記錄
   - 尋找錯誤訊息

4. **測試 Google Sheet 訪問**
   - 直接在瀏覽器中打開 Sheet URL
   - 確認可以訪問和編輯

---

### 問題 4: 食譜內容格式不正確

```
生成的食譜缺少某些部分（材料、步驟等）
```

**原因：**
- AI 返回格式與預期不符
- 解析邏輯問題

**解決方案：**

1. **查看原始響應**
   - F12 → Network
   - 查看 `gemini...` 請求的 Response
   - 檢查返回的完整文本

2. **調整提示詞**
   - 編輯 `docs/assets/js/api.js` 中的 `buildRecipePrompt()`
   - 修改提示詞讓 AI 返回更清晰的格式

3. **使用備用解析方法**
   - 在 `parseRecipeResponse()` 中添加更多匹配規則

---

### 問題 5: GitHub Pages 無法訪問

```
404 Not Found
```

**原因：**

| 原因 | 檢查方式 | 解決方案 |
|------|---------|--------|
| Pages 未启用 | Settings → Pages | 启用 Pages |
| Folder 配置错误 | 检查 Pages 设置 | 设置为 `/docs` |
| 未推送代码 | 检查 Git | 推送到 main 分支 |
| 部署未完成 | 进入 Actions | 等待构建完成 |
| 缓存问题 | 硬刷新 | Ctrl+Shift+R |

**具体步骤：**

1. **检查 Pages 配置**
   - 进入 GitHub 倉庫
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/docs"

2. **检查部署状态**
   - 进入 Actions 标签
   - 查看最近的工作流运行
   - 确认状态为 ✅

3. **检查文件**
   - 确认 `docs/index.html` 存在
   - 推送所有文件到 main 分支

4. **硬刷新和等待**
   - 等待 5-10 分钟
   - Ctrl+Shift+R 硬刷新
   - 或在隐私窗口访问

---

### 问题 6: 页面加载但功能不工作

```
✅ 页面加载成功
❌ 点击生成按钮无反应
```

**原因：**
- JavaScript 文件未加载
- 配置文件有语法错误
- 浏览器兼容性问题

**解决方案：**

1. **检查 JS 文件加载**
   - F12 → Network
   - 刷新页面
   - 确认所有 `.js` 文件状态为 200
   - 如果是 404，检查文件路径

2. **检查语法错误**
   - F12 → Console
   - 查看红色错误信息
   - 特别注意 `config.js` 的错误

3. **测试基本功能**
   ```javascript
   // F12 Console 中运行
   console.log(CONFIG);
   // 应该显示完整的配置对象
   ```

---

## 🔧 高级诊断

### 启用详细日志

编辑 `docs/assets/js/main.js`，添加：

```javascript
// 在文件开头添加
const DEBUG = true;

function log(...args) {
    if (DEBUG) {
        console.log('[SmartChef]', ...args);
    }
}
```

### 查看网络请求

1. F12 → Network 标签
2. 刷新页面
3. 点击生成食谱
4. 查看所有请求
5. 检查有问题的请求：
   - 红色 = 失败
   - 黄色 = 警告
   - 绿色 = 成功

### 监控 API 限额

访问 https://ai.google.dev 并查看：
- Requests
- Quote usage
- Rate limits

---

## 📞 获取帮助

如果上述方案无法解决问题：

1. **检查所有文档**
   - [README.md](README.md) - 完整说明
   - [CONFIG.md](CONFIG.md) - 配置参考
   - [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南

2. **查看日志**
   - 浏览器 Console 日志
   - Google Apps Script 执行日志
   - GitHub Actions 日志

3. **测试环境**
   - 在隐私窗口中测试
   - 尝试不同的浏览器
   - 检查网络连接

4. **重置和重试**
   - 清除浏览器缓存
   - 重新部署 Apps Script
   - 重新生成 API 密钥

---

## 📝 错误代码参考

| 代码 | 含义 | 解决方案 |
|------|------|--------|
| 400 | 请求错误 | 检查参数格式 |
| 401 | 未授权 | 检查 API 密钥 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 未找到 | 检查 URL |
| 429 | 超出限额 | 等待或升级 |
| 500 | 服务器错误 | 重试或联系支持 |

---

**记住：大多数问题都可以通过 F12 Console 中的错误信息解决！** 🎯
