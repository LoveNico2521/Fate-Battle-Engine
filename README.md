# 🎲 Fate-Dreamweaver-Engine (織夢者菲特引擎) — Classic Edition

「把命運,交給我吧。」 — 菲特

**F.A.T.E.** = **F**ated **A**nko **T**ale **E**ngine(命定安科物語引擎)

![RNG](https://img.shields.io/badge/RNG-Crypto_API-rose) ![平台](https://img.shields.io/badge/平台-瀏覽器_·_Windows-4C9F70) ![離線](https://img.shields.io/badge/離線-完全可用-E8B93E)

專為安科(Anko)/安價與 TRPG 劇本推演設計的輕量骰子引擎。整個系統就是**一個 HTML 檔**——不用安裝、不用連網,瀏覽器打開就能擲。支援密碼學安全隨機數、`ra`/`ro` 雙檢定、基準向量連鎖追擲與單次最高 50 顆的大批量投下。

## ⚡ 快速開始

### 網頁版(即點即用)
1. 下載 `index_classic.html`
2. 直接雙擊開啟(Chrome / Edge / Firefox / Safari 皆可)
3. 選模式(`ra` / `ro`)、配骰數與 Boost,投下去

### 桌面視窗版(pywebview)
```bash
pip install pywebview
python main.py
```

### 打包成單一 EXE(PyInstaller,Windows)
```bash
pyinstaller --noconfirm --onefile --windowed --add-data "index_classic.html;." --name "Fate_Dreamweaver_Engine" main.py
```

## 🎯 核心規則(絕對不能改錯)

### 1. 雙檢定模式
- `ra`:最終值 **≤ 目標值** 判定成功
- `ro`:最終值 **≥ 目標值** 判定成功

### 2. 起手與追擲連鎖
- 起手 1d100:**1~5 觸發大失敗(CF)**、**96~100 觸發大成功(CS)**,進入 s1 追擲 1d10
- 1d10 擲出 10 時進行 1d2 判定(**1 = 大成功,2 = 大失敗**)
- **基準向量連鎖**:首個 CS/CF 為基準;與基準**同向 ➔ 層級 +1 深入**、**反向 ➔ 層級 −1 退回**並抵銷淨 Stacks
- 起手大成功/大失敗**計入淨 Stack(與追擲同向 +1 對稱)**

### 3. 1d100 Boost 三模式(設定中切換)
| 模式 | 算式 | 判定 |
|---|---|---|
| `v1` | 降面 `1d(100−Boost) + Boost` | CF 看原始值,CS 看最終值 |
| `v2` | 原始 `1d100 + Boost` | CF 看原始值,CS 看最終值 |
| `v3` | 降面 `1d(100−\|Boost\|) + 正Boost` | CF/CS 皆看最終值(負 Boost 不扣減數值) |

### 4. 總和採計
- 只採計**最後停留在 s0 的那顆骰子**(沒觸發連鎖就是起手那顆)
- 觸發連鎖且未退回 s0 的骰組**不計入總和**(畫面上以刪除線標示)

### 5. 自動複製格式
- 公式:`xdy=(r1+b)+(r2+b)=(sum)`
- Boost 為 0 時不加括號;總和永遠不加括號

## ✨ 功能亮點

- 🔐 **密碼學安全隨機數** — `window.crypto.getRandomValues()`,告別 `Math.random()`
- ⚡ **安科連鎖追擲引擎** — 觸發即連鎖,逐層展開、動態抵銷
- 🎲 **自訂骰子語法**(完全獨立於基礎 Boost):`1d100`、`8d50`、`3d6+5`、`1d100 - 10`、`ra50 1d100`、`ro25 1d75`
- 🎲 **通用骰子 d4~d20** — 純擲骰顯示,不套用 ra/ro 判定
- 🔢 **單次最高 50 顆** — 骰數上限解放,大批量史詩判定
- 🛡️ **嚴格防呆** — 浮點數輸入、0 面數、彈窗開啟時快捷鍵誤觸,全面攔截
- 🎨 **三主題** — 深色 / 淺色 / 金黃(Fate),原生 input/select 全彩覆蓋
- 📜 **推演紀錄** — localStorage 持久保存(200 筆),點擊即複製,支援 CSV 匯出(pywebview 原生存檔視窗)
- 🧪 **全域 Debug 測試序列** — 指定骰值序列 100% 重現結果(自訂骰也接入了)
- ⌨️ **快捷鍵** — `空白鍵`/`Enter` = 投下 1d100、`1` = 1d10 安科連鎖、`2` = 1d100

## 📁 檔案結構

```
Fate-Dreamweaver-Engine/
├── index_classic.html   # 全部。核心推演引擎前端(UI + 動畫 + 運算法則)
├── main.py              # pywebview 桌面視窗封裝與 CSV 存檔 API
├── README.md
├── CHANGELOG.md         # v1 ~ v47 完整開發史
└── legacy/              # 開發考古層:83 件歷史產物(含 manifest.json 索引)
```

## 🗺️ Roadmap(規劃中)

- [ ] 發文格式複製(MD / BBCode)
- [ ] 骰組模板設定頁
- [ ] 戰績統計與推演驗證碼
- [ ] 歷史紀錄匯入
- [ ] 3D 骰子落桌動畫與音效
- [ ] 擴充自訂 TRPG 規則模組(CoC、D&D、WoD)

## 📌 注意事項

- 推演紀錄與偏好僅存於瀏覽器 **localStorage**——清除瀏覽器資料會連紀錄一起清掉,請定期匯出 CSV
- 判定行為以你的團規為準;菲特只負責骰子,不負責吵架

---

## 📝 版本說明(2026-11-09 統整版)

本版合併 DeepSeek 與 Gemini 兩條開發線的成果,裁決如下:

| 項目 | 裁決 |
|---|---|
| 用語 | 全面採用「大成功 / 大失敗」(不再出現「大暴走」) |
| 起手 CS/CF 淨 Stack | 計 +1(與追擲同向對稱) |
| 通用骰子 d4~d20 | 純擲骰顯示,不套用 ra/ro(自訂輸入框的 `ra50 1d100` 語法不受影響) |
| 隨機數 | `crypto.getRandomValues()` |
| 骰數上限 | 50 |
| HP/SAN 狀態追蹤 | 已移除(純擲骰版) |
| Repo 名稱 | Fate-Dreamweaver-Engine |

---

菲特誕生於主人與 AI 夥伴們的深夜對話 🐾
