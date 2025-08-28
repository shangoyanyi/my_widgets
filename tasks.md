# 開發功能清單

這份文件用來追蹤與管理 `my_widgets` 專案的開發任務。

## 任務列表

- **#1 [done] JSON 格式化與驗證器 (JSON Formatter & Validator)**
  - **功能描述**: 提供一個文字區，讓使用者貼上 JSON 字串。點擊「格式化」按鈕後，會將雜亂的 JSON 整理成美觀、易讀的縮排格式。同時，它會自動驗證 JSON 語法是否正確，並在有錯誤時提示使用者。

- **#2 [todo] Base64 編碼/解碼器 (Base64 Encoder/Decoder)**
  - **功能描述**: 提供兩個文字區，讓使用者在「原始文字」和「Base64 字串」之間進行雙向轉換。

- **#3 [todo] QR Code 產生器 (QR Code Generator)**
  - **功能描述**: 一個輸入框讓使用者輸入任何網址或文字，旁邊會即時生成對應的 QR Code 圖片，並提供下載按鈕。

- **#4 [done] 建立 my-json-server mock API**
  - **功能描述**: 建立一個 `my-json-server` 線上服務可讀取的資料來源，在專案內建立 `db.json`檔案後，`my-json-server.typicode.com` 會自動產生 mock API。使用者可以利用 `https://my-json-server.typicode.com/my_widgets/` 這個URL Endpoint透過http方法(GET, POST 等)進行REST API操作(無法修改 `db.json`)。
  - **技術細節**:
    - 產生 `db.json`，寫入模擬的部落格貼文的json內容。
    - 將 `db.json` 存放於專案根目錄。
    - `my-json-server.typicode.com` 的線上服務會自動產生 API Endpoint，無需自行啟動後端伺服器。

- **#5 [done] 優化 JSON Formatter - 快速載入 Mock API 資料**
  - **功能描述**: 在「JSON 格式化與驗證器」小工具頁面中，新增一個下拉式選單。選單內應包含四個選項，分別對應 `my-json-server` 提供的 API 端點 (`/posts`, `/comments`, `/profile` 等)。當使用者選擇其中一個選項時，程式會自動發送請求到對應的 URL，並將回傳的 JSON 資料載入到文字區中，方便使用者直接進行格式化與驗證。

