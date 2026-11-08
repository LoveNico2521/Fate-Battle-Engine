<div align="center">

# 🎲 Fate-Dreamweaver-Engine

**單檔 HTML 安科/安價骰子引擎 — 打開就擲,離線可用**

[![最新版](https://img.shields.io/github/v/release/LoveNico2521/Fate-Dreamweaver-Engine?style=flat-square)](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/latest)
[![授權](https://img.shields.io/badge/授權-MIT-green?style=flat-square)](LICENSE)

**[下載最新版](../../releases/latest)** · [v1~v47 全部版本](../../releases)

</div>

---

為安科/安價連載設計的連鎖骰子:1d100 骰出 ≤5 或 ≥96 就自動追擲 1d10,層級逐層展開、淨 Stack 同向加深、反向抵銷,全程紀錄、一鍵複製、CSV 匯出。整個系統就是一個 HTML 檔。

## 下載

| 要用哪種 | 做法 |
|---|---|
| **網頁版(推薦)** | 下載 [`index_classic.html`](index_classic.html),雙擊用瀏覽器開啟(Chrome / Edge / Firefox / Safari 皆可)——**單檔無任何網路依賴,完全離線可用** |
| **手機離線安裝(PWA)** | 開 [線上版](https://lovenico2521.github.io/Fate-Dreamweaver-Engine/index_classic.html) → 加入主畫面 → 之後離線當 App 用 |
| 桌面視窗版(可選) | `pip install pywebview` 後執行 `python main.py` |
| Android APK / iOS App | 見 [跨平台指南](docs/CROSS_PLATFORM.md)(Capacitor / Xcode 打包路徑) |

> **先看這個**:紀錄存在瀏覽器 localStorage(上限 200 筆)——清瀏覽器資料會連紀錄一起消失。要留的內容,用右下角「匯出 CSV」帶走。

## 操作

| 按鈕 / 按鍵 | 功能 |
|---|---|
| 🎯 投下 1d100(空白鍵 / Enter / `2`) | 劇情判定:≤5 大失敗、≥96 大成功,觸發後自動連鎖 |
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

1. 1d100 的 ≤5 → 大失敗(CF);≥96 → 大成功(CS);觸發後進入 s1 追擲 1d10
2. 1d10 骰出 10 → 加擲 1d2:1 = 大成功、2 = 大失敗
3. 首個 CS/CF 為基準向量:同向層級 +1 深入、反向 −1 退回並抵銷淨 Stacks
4. 總和計算模式(⚙️ 設定可切換):**預設採計全部 s0 骰(含觸發骰)**;可切換「嚴格:僅最終停留 s0(觸發骰不計)」或「全部骰子計入(含追擲)」——不採計的骰在畫面以刪除線標示
5. 自動複製格式 `xdy=(r1+b)+(r2+b)=(sum)`(Boost=0 不加括號,總和永不加括號)

**1d100 Boost 三模式**(⚙️ 切換):v1 降面 `1d(100−Boost)`,CF 看原始值;v2 原始 `1d100+Boost`,CF 看原始值;v3 降面 `1d(100−|Boost|)`,CF/CS 看最終值(負 Boost 不扣減數值)。

## 最新版變更(v52)

- 總和計算三模式可切換(⚙️ 設定;預設:採計全部 s0 骰,含觸發骰)
- 平板直向(768–1023px)單欄 + 底部標籤欄 + 半屏(擲骰/圖譜合併);橫向(≥1024px)雙欄
- 手機:底部標籤欄(擲骰/圖譜/紀錄/半屏/設定)、半屏迷你骰盤、離線 PWA 安裝
- 修復短視窗 UI 裁切;單檔無任何網路依賴,完全離線

## 歷史版本

47 個版本全部保留:[Releases](../../releases) 每版附當版檔案與更新日誌;原始產物在 [`legacy/`](legacy/)(索引 `manifest.json`);逐版細節見 [`CHANGELOG.md`](CHANGELOG.md)。

打包 EXE:

```text
pyinstaller --noconfirm --onefile --windowed --add-data "index_classic.html;." --name "Fate_Dreamweaver_Engine" main.py
```

## 授權

[MIT](LICENSE)
