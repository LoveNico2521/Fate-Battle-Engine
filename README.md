<div align="center">

# 🎲 Fate-Dreamweaver-Engine

**單檔 HTML 安科/安價骰子引擎 — 打開就擲,離線可用**

[![最新版](https://img.shields.io/github/v/release/LoveNico2521/Fate-Dreamweaver-Engine?style=flat-square)](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/latest)
[![授權](https://img.shields.io/badge/授權-MIT-green?style=flat-square)](LICENSE)

**[下載最新版](../../releases/latest)** · [v1~v47 全部版本](../../releases)

</div>

---

為安科/安價連載設計的連鎖骰子:1d100 骰出 1~5 或 96~100 就自動追擲 1d10,層級逐層展開、淨 Stack 同向加深、反向抵銷,全程紀錄、一鍵複製、CSV 匯出。整個系統就是一個 HTML 檔。

## 下載

| 要用哪種 | 做法 |
|---|---|
| **網頁版(推薦)** | 下載 [`index_classic.html`](index_classic.html),雙擊用瀏覽器開啟(Chrome / Edge / Firefox / Safari 皆可) |
| 桌面視窗版(可選) | `pip install pywebview` 後執行 `python main.py` |
| 手機 / Android APK / iOS App | 見 [跨平台指南](docs/CROSS_PLATFORM.md)(手機版面已自動適配) |

> **先看這個**:紀錄存在瀏覽器 localStorage(上限 200 筆)——清瀏覽器資料會連紀錄一起消失。要留的內容,用右下角「匯出 CSV」帶走。

## 操作

| 按鈕 / 按鍵 | 功能 |
|---|---|
| 🎯 投下 1d100(空白鍵 / Enter / `2`) | 劇情判定:1~5 大失敗、96~100 大成功,觸發後自動連鎖 |
| 🎲 投下 1d10(`1`) | 安科連鎖:骰出 10 加擲 1d2(1=大成功、2=大失敗) |
| d4 ~ d20 | 純擲骰,不套檢定 |
| 自訂輸入框 | 見下方語法 |
| ⚙️ 設定 | 主題(深/淺/金)、複製格式、1d100 Boost 演算法、debug 序列 |

**參數**:投下次數 1~50(每組獨立連鎖)、Boost 加值、檢定模式 ra(≤ 目標值成功)/ ro(≥ 目標值成功)。

**自訂骰語法**(不受 Boost 影響):

```text
1d100       8d50        3d6+5
1d100 - 10  ra50 1d100  ro25 1d75
```

## 連鎖規則

1. 1d100 的 1~5 → 大失敗(CF);96~100 → 大成功(CS);觸發後進入 s1 追擲 1d10
2. 1d10 骰出 10 → 加擲 1d2:1 = 大成功、2 = 大失敗
3. 首個 CS/CF 為基準向量:同向層級 +1 深入、反向 −1 退回並抵銷淨 Stacks
4. 總和只計最後停留在 s0 的骰子;觸發連鎖未退回者不計(畫面以刪除線標示)
5. 自動複製格式 `xdy=(r1+b)+(r2+b)=(sum)`(Boost=0 不加括號,總和永不加括號)

**1d100 Boost 三模式**(⚙️ 切換):v1 降面 `1d(100−Boost)`,CF 看原始值;v2 原始 `1d100+Boost`,CF 看原始值;v3 降面 `1d(100−|Boost|)`,CF/CS 看最終值(負 Boost 不扣減數值)。

## v47 變更摘要

- d4~d20 改為純擲骰(不套檢定);自訂輸入框的 ra/ro 語法不受影響
- 起手大成功/大失敗計入淨 Stack(與追擲同向對稱)
- 桌面版支援 PyInstaller 打包
- 單次投下上限 50 顆、密碼學安全隨機數(`crypto.getRandomValues`)

## 歷史版本

47 個版本全部保留:[Releases](../../releases) 每版附當版檔案與更新日誌;原始產物在 [`legacy/`](legacy/)(索引 `manifest.json`);逐版細節見 [`CHANGELOG.md`](CHANGELOG.md)。

打包 EXE:

```text
pyinstaller --noconfirm --onefile --windowed --add-data "index_classic.html;." --name "Fate_Dreamweaver_Engine" main.py
```

## 授權

[MIT](LICENSE)
