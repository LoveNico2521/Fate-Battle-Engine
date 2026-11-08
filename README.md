# 🎲 Fate-Dreamweaver-Engine (織夢者菲特引擎) - Classic Edition

![Fate-Dreamweaver-Engine](https://img.shields.io/badge/Fate--Dreamweaver--Engine-Classic-indigo?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)
![Security](https://img.shields.io/badge/RNG-Crypto API-rose?style=for-the-badge)
![Python](https://img.shields.io/badge/pywebview-4.x-amber?style=for-the-badge)

專為安科 (Anko) 與 TRPG 跑團劇本創作量身打造的極致輕量、無依賴單頁面推演引擎。不僅具備獨創的 **基準向量連鎖演算法**，更搭載了 **密碼學安全隨機引擎 (Crypto RNG)**，確保絕對的命運公平性。

---

## 🌟 系統亮點 (Elite Features)

- 🔐 **密碼學安全隨機數 (Crypto RNG)**：捨棄傳統 `Math.random()`，採用 `window.crypto.getRandomValues()`，徹底解決 PRNG 分佈不均勻的問題，提供 TRPG 玩家物理級的真實亂數玄學。
- 🎯 **雙檢定模式**：完整支援 `ra` ($\le$ 目標值成功) 與 `ro` ($\ge$ 目標值成功) 雙向邏輯。
- ⚡ **安科連鎖追擲引擎**：1d100 觸發 CS/CF 進入 $s_1$ 層級，透過 1d10/1d2 判定連鎖深入與抵銷。
- 🧮 **數學向量採計**：嚴格落實「僅採計停留在 $s_0$ 之最終骰子」演算法，觸發連鎖骰精準排斥。
- 🛡️ **極限防呆與上限解放**：全面防禦浮點數注入、0 骰面除錯，支援單次最高 **50 顆骰子** 的史詩級判定運算。
- 🎨 **三色極致主題**：提供深色 (Default)、淺色 (Light) 與金黃 (Fate) 三種主題，原生 Input/Select 全彩覆蓋。
- 📜 **一鍵複製與 CSV 匯出**：整合 `pywebview` 原生存檔視窗與 Web 備用下載機制，支援 Markdown 格式化輸出。
- 🧪 **全域 Debug 測試序列**：提供測試序列輸入，包含自訂骰子皆實現 100% 確定性複現。

---

## 🎲 核心規則與演算法規約

### 1. 雙檢定判定
- **`ra` 模式**：最終值 $\le$ 目標值判定為「✅ 成功」。
- **`ro` 模式**：最終值 $\ge$ 目標值判定為「✅ 成功」。

### 2. 起手與追擲連鎖演算法
1. **起手 1d100**：
   - 原始/最終值 1~5 觸發 **CF (大失敗)**。
   - 最終值 96~100 觸發 **CS (大成功)**。
   - 觸發後將第一個 CS/CF 設定為「**基準向量**」，並進入層級 $s_1$ 追擲 `1d10`。
2. **追擲 1d10 / 1d2**：
   - 擲出 10 時進行 `1d2` 判定（`1` = 大成功，`2` = 大失敗）。
   - **與基準同向** ➔ 層級 $+1$ 深入（Stacks $+1$）。
   - **與基準反向** ➔ 層級 $-1$ 退回（Stacks $-1$ 並抵銷）。

### 3. 1d100 Boost 加值三模式
- **`v1` 模式**：降面 $1\text{d}(100 - \text{Boost}) + \text{Boost}$（CF 看原始值 $\le 5$）。
- **`v2` 模式**：原始 $1\text{d}100 + \text{Boost}$（CF 看原始值 $\le 5$）。
- **`v3` 模式**：降面 $1\text{d}(100 - |\text{Boost}|) + \text{正Boost}$（CF/CS 皆看最終值）。

### 4. 總和與公式採計規則
- **公式**：`xdy=(r1+b)+(r2+b)=(sum)`。
- **排斥律**：觸發連鎖的骰子不計入總和；若連鎖最終退回 $s_0$，則採計退回 $s_0$ 之最終骰值。

### 5. 高級自訂骰子語法
自訂輸入框完全獨立於 `base-boost` 加值，支援以下高階語法：
- `1d100` / `8d50` / `3d6+5` / `1d100 - 10`
- `ra50 1d100` / `ro25 1d75`（直接附帶獨立標示與檢定）

---

## 🛠️ 開發與部署指南 (pywebview / PyInstaller)

### 專案目錄結構
```text
Fate-Dreamweaver-Engine/
├── index_classic.html   # 經典版前端 UI 完整程式碼
├── main.py              # pywebview 視窗封裝與 GUI API
└── build.py             # PyInstaller 打包配置