# 📜 CHANGELOG — Fate-Battle-Engine

> **倉庫分流**(2026-11-10):本倉為**戰鬥主線**——自主倉 [`Fate-Dreamweaver-Engine`](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine) 的 battle 分支整段歷史遷出為 main;經典版開發(v1–v52)續留主倉,其完整紀錄見主倉 CHANGELOG 與 [Releases](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases)。版本號自主線 v52 續接。

---

## v53 — 2026-11-10(battle 主線首版)

- **倉庫分流**:battle 分支(13 提交)整段歷史遷出為 main;原倉 battle 分支保留作遷出時刻快照;戰鬥工作此後全在本倉
- **自動戰鬥機(烈幻入式規格)**:B 案對拼核——Atk+1d100 守方先擲/免擲判定(635F)/平手雙擲武藝(634F/639F)/受傷表 1d10+第 10 行 1d2;攻擊骰無 CS/CF(88:797F);50 回合兜底平局(A-10 可覆寫)
- **卡面層原語全套**(主人裁決「標準層統一、卡面層自由」):CT/Atk±/傷害×倍率/骰式/破解門檻+破解分檔(B-8,cat 類別 30+/50+/75+)+破解連動 counterRip(684F)/必中/回復/持續 T/一場一次/眩暈/護盾+/蓄力(A-5,4045F/639-642F)/技能排程表(A-9,21033:5147F)/特殊判定框架(B-11,炎火村三段+自訂分段表+束縛即死 636F)/屬性(繞過消力)/自動HP% 閾值自動技(俠客行 2044F)/姿態切換(B-9,閃避 ×1.8 不結算傷 269F)/處決(74:8130F 多段血條總和+最後段+區間+10)/自動勝利(88:6117F 兩段)/CT 清 0/真實傷害
- **角色層**:血條段(20/10/5/5/1 式+卡面 hp 復活)/支援位(炎火村 4865F)/戰意(A-6,條型+檢定)/消力減傷三件套(B-1,1149F/253F/325F)/裝備判定(B-6,假腿 77F)/支援骰(B-7,插手 1000F+機率到場 92F)/復活攔截(B-5,1157F/2205F)/個人受傷表(B-2,表驅動)/拼點累計池(炎火村 32013F/912F)
- **戰鬥配置(A-10/B-12)**:勝點制快速模式(21033:5040F)/回合上限期滿比血量(1671F)/HP 鎖定線(4146F)/離場線(3801F)
- **🃏 角色卡工房**:全屏雙欄卡編輯+卡組多槽 localStorage+JSON 匯出匯入+戰鬥配置欄
- **標準層保真修正**(主人逐條審查落地):第 10 行大成功反擊原作化(F1418,廢設計值「反擊 2」)/眩暈未中累計 -10 難度(886F)/樓號 635F 更正 233F/456F
- **修復**:injFlat/injuryFlat 鍵名錯位/卡面 hp 被血條初始化覆蓋/敵方側 duration·shieldGain·支援位對稱生效/盾池吸收實效(原僅改顯示)/自暈分支少傳參
- **UI**:輸出格式第三式 BBCode(NGA,參考 AnkeCreator);喵語尾掃除——菲特本人語氣(對齊 d5d607e)
- **迴歸電池**:100 情境(經典 32+戰鬥 68)基線 `febf5ff`,LCG 確定化兩輪一致;經典層 s01-s32 逐項與 main 零污染;全部規則條目附原作樓號,挖掘報告 B 級全清

---

## 戰鬥線歷史版本(battle-01–30)

> 2026-11-09/10 的逐版演進,**每版一個 Release 並附當時完整單檔 `index_classic.html`**:battle-01–14(分流前的 battle 分支時期)發布於主倉 [Releases](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases);battle-15–30(分流後)發布於本倉 [Releases](https://github.com/LoveNico2521/Fate-Battle-Engine/releases)。**battle-30 與 v53 同提交**(`b683ac0`)——v53 為主線里程碑標籤。

| 標籤 | 日期 | 內容 | 電池基線 |
|---|---|---|---|
| [battle-01](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-01) | 11-09 | docs: APK 打包改單檔原則 | — |
| [battle-02](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-02) | 11-09 | 自動戰鬥機(烈幻入式規格) | 36 情境 `1ff293c0` |
| [battle-03](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-03) | 11-09 | A 案必中 flag alwaysHit | 37 情境 `3b2ec5d0` |
| [battle-04](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-04) | 11-09 | B 案對拼模型(88:797F/A-1/B-2) | 38 情境 `8f31461a` |
| [battle-05](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-05) | 11-09 | AI 選技改原作式選技骰(88:446F) | 39 情境 `ef6b7ca0` |
| [battle-06](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-06) | 11-09 | 對拼核升級 633-642F 精確版+LCG 確定化 | 39 情境 `f19696c8` |
| [battle-07](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-07) | 11-09 | 卡面層四原語(once/duration/heal+regen/injuryShift) | 43 情境 `44764948` |
| [battle-08](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-08) | 11-09 | 對拼核 v4+六新原語+🃏角色卡工房 | 43 情境 `cbdada0c` |
| [battle-09](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-09) | 11-09 | docs: battle 分支獨立 README | — |
| [battle-10](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-10) | 11-09 | 支援位原語 supportDmg(炎火村 4865F) | 44 情境 `8507b8f0` |
| [battle-11](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-11) | 11-09 | 多段血條每段獨立 HP(20/10/5/5/1 式) | 55 情境 `82bcdf40` |
| [battle-12](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-12) | 11-10 | A-9 技能排程表(21033:5147F) | 56 情境 `737f2968` |
| [battle-13](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-13) | 11-10 | BBCode 匯出第三格式(NGA) | 57 情境 `773d3a6f` |
| [battle-14](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases/tag/battle-14) | 11-10 | B-11 特殊攻擊判定框架 | 60 情境 `4998170` |
| [battle-15](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-15) | 11-10 | docs: 倉庫分流說明(戰鬥主線獨立成倉) | 60 情境 `4998170` |
| [battle-16](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-16) | 11-10 | 束縛即死版(88:636F) | 62 情境 `52901650` |
| [battle-17](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-17) | 11-10 | 蓄力 A-5(88:4045F/639-642F) | 64 情境 `d41ca4dc` |
| [battle-18](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-18) | 11-10 | 勝點制 B-12+勝利條件覆寫 A-10 | 70 情境 `dfa1c677` |
| [battle-19](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-19) | 11-10 | 戰意 A-6(條型+檢定型) | 73 情境 `81953588` |
| [battle-20](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-20) | 11-10 | 減傷三件套 B-1(+盾池 HP 修正) | 76 情境 `7a7cb348` |
| [battle-21](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-21) | 11-10 | 破解分檔 B-8(類別標籤+counterRip) | 79 情境 `e39592c6` |
| [battle-22](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-22) | 11-10 | 個人受傷表 B-2(表驅動傷害器) | 81 情境 `659ae23` |
| [battle-23](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-23) | 11-10 | 標準層五規則保真修正 | 85 情境 `8bed7e04` |
| [battle-24](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-24) | 11-10 | UI 喵語尾掃除(菲特本人語氣) | 85 情境 `117964b4` |
| [battle-25](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-25) | 11-10 | 三既有 bug 修正(hp 復活/鍵名/對稱) | 88 情境 `12b1b43e` |
| [battle-26](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-26) | 11-10 | 復活/命運觸發器 B-5 | 91 情境 `f6f4d488` |
| [battle-27](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-27) | 11-10 | 裝備判定 B-6(假腿式) | 93 情境 `8ba47e28` |
| [battle-28](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-28) | 11-10 | 支援骰 B-7(插手+機率到場) | 96 情境 `322dc26` |
| [battle-29](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-29) | 11-10 | 姿態系統 B-9(閃避 ×1.8) | 98 情境 `528f8937` |
| [battle-30](https://github.com/LoveNico2521/Fate-Battle-Engine/releases/tag/battle-30) | 11-10 | 拼點累計池(炎火村 32013F)——**與 v53 同提交** | 100 情境 `febf5ff` |

---

## 經典版歷史(v1–v52,主倉)

2026-10-02 至今的完整開發紀錄,共 52 個標籤版本。

> **時間標記**:2026-11-05 起為精確時間戳;早期版本為同日近似。
> **歷史歸檔**:全部 83 件原始產物在 [`legacy/`](legacy/)(索引 `manifest.json`);每版可下載檔案附於各 [Release](https://github.com/LoveNico2521/Fate-Dreamweaver-Engine/releases)。

---

## v52 — 2026-11-09

- **總和計算模式(設定頁新增)**:`全部 s0 骰計入(預設)` / `嚴格:僅最終停留 s0(觸發骰不計)` / `全部骰子計入(含追擲)`——切換即時重算,自動複製格式同步套用
- **修復 UI 裁切**:移除主容器 `min-h-[800px]`——iPad 橫向(1024×768)與短筆電視窗不再被切掉上下內容
- 未退回 s0 的連鎖改為逐顆標示(不採計的骰畫刪除線)
- 迴歸電池新基線 `463080c0`(總和預設模式變更所致);APK 版本選擇器補齊 v47–v51(50 個版本全含)

---

## v51 — 2026-11-09

- **平板版面**:768–1023px(直向)沿用單欄 + 底部標籤欄 + 半屏,擲骰與圖譜合併為同一分頁;≥1024px(橫向平板/桌面)走雙欄版
- 內容改為靠上對齊(配底部標籤欄)
- 重新打包 Android APK(內含平板版引擎與全部歷史版本)

---

## v50 — 2026-11-09

- 手機版面重構:底部標籤欄(擲骰/圖譜/紀錄/半屏/設定),非當前分頁收合
- **半屏迷你骰盤**:寫作時骰子只佔下半屏(≤50dvh 自適應),可縮成右下角浮動泡泡;結果一鍵複製、自動複製開關
- 手機隱藏標題列,空間還給內容
- **Android APK**:Capacitor 打包,內含版本選擇器與全部 45 個可執行歷史版本(見 Release 附件)
- 迴歸電池移除 CSV 下載情境(31 情境,基線 `4c55605c`)

---

## v49 — 2026-11-09

- **離線自足**:移除 Tailwind CDN 依賴,樣式以 CLI 靜態編譯內嵌(v3.4.17),單檔 75KB 零外部請求
- **PWA 離線安裝**:manifest + Service Worker + 自製圖示——手機開線上版加入主畫面,之後完全離線當 App 用
- GitHub Pages 上線;Service Worker 僅在 https 環境註冊,file:// 與區網 http 自動略過

---

## v48 — 2026-11-09

- 手機版面自動適配:≤767px 整頁自然捲動、`100dvh` 網址列修正、紀錄面板自動高度
- iOS 相容:粗指標裝置輸入框 16px(防聚焦自動放大)、`touch-action: manipulation` 取消雙擊延遲
- 剪貼簿跨平台:`execCommand('copy')` 後備——區網 http / 受限環境的複製功能修復
- 加入主畫面(standalone)支援 meta;新增跨平台指南(docs/CROSS_PLATFORM.md)

---

## v47 — 2026-11-09

- d4~d20 改純擲骰顯示,不套 ra/ro(自訂輸入框 `ra50 1d100` 語法保留)
- 起手 CS/CF 計入淨 Stack(與追擲同向對稱)
- main.py 加入 PyInstaller `_MEIPASS` 資源路徑支援
- 新增 MIT 授權、README 重構、legacy 歸檔 83 件歷史產物

---

## v46 — 2026-11-08 23:50

- 骰數上限 20 → 50(前端、加減按鈕、核心防呆同步)
- Repo 定名 Fate-Dreamweaver-Engine
- 交付 `main.py`(pywebview 封裝 + CSV 原生存檔)與 README

---

## v45 — 2026-11-08 23:45

- 隨機數升級 `window.crypto.getRandomValues()`(密碼學安全)
- 浮點數輸入防呆(Math.floor 全域套用)
- 自訂骰子接入 debug 序列(全域 100% 覆蓋)
- 自訂骰 0 面數/負面數邊界防呆(骰數 ≥1、面數 ≥2)

---

## v44 — 2026-11-08 23:40

- 修正 1d100 按鈕說明文案(96~100 誤標為大失敗)
- 自訂骰 regex 支援運算符兩側空格(`1d100 + 5`)
- 修復彈窗開啟時快捷鍵仍會觸發擲骰
- 修復自動複製在無可採計骰組時輸出 `1d100==0`
- 清理 renderFlow 中 DF-Trigger 死代碼

---

## v43 — 2026-11-08 23:35

- 「暴走/大暴走」全面改名「失敗/大失敗」
- 自訂骰子大改:與基礎 Boost 完全隔離
- 自訂骰支援 `ra50 1d100`、`ro25 1d75`、`3d6+5`、`1d100 - 10` 語法

---

## v42 — 2026-11-08 23:30

- Gemini 線接手經典版,首個完整輸出
- 自動複製採計修正:僅計未觸發連鎖或已退回 s0 的骰組(杜絕 `1d100==0` 異常格式)

---

## v41 — 2026-11-08 22:34

- 跨平台相容版:以 Windows HTML 為基底,涵蓋 macOS 本地、Android/APK、iOS/App、Linux 方案

---

## v40 — 2026-11-08 22:29

- 以當時代碼為基礎再次優化(規則完全不變)

---

## v39 — 2026-11-08 21:16

- 代碼優化

---

## v38 — 2026-11-08 21:08

- 代碼審查(review)與修復

---

## v37 — 2026-11-08 19:14

- 移除 HP/SAN 狀態追蹤——經典版轉為純擲骰專用
- 同步清理對應 UI 與存檔欄位

---

## v36 — 2026-11-08 19:11

- A/B/C 裁決實作:首個 1d2 計 +1 Stack;DF-Trigger(1d100 的 1~5)只推層級不動淨 Stack;通用骰 d4~d20 改純擲骰
- 戰鬥版殘留碼審計:確認無 faction/skill/CD/turn 殘留

---

## v35 — 2026-11-08 19:04

- **經典版分岔**:自戰鬥版分支,移除技能/符卡/戰鬥系統
- 保留純擲骰、狀態追蹤與設定頁

---

## v34 — 2026-11-08 19:02

- **戰鬥版成形**:技能/符卡數據庫、回合制戰鬥
- 雙陣營(玩家/敵人)與獨立 HP/SAN、技能消耗與 CD 冷卻、回合切換

---

## v33 — 2026-11-08 18:34

- 修正深色主題下 Boost 模式與自訂骰框架的白底灰字不可讀問題

---

## v32 — 2026-11-08 17:41

- 新增獨立設定選項頁(設定頁誕生)
- 六項功能提議中四項採用實作

---

## v31 — 2026-11-05 19:21

- 負 Boost 在 v3 只降面、不扣減數值(1d90 骰出 90 即 90)
- 總和規則定案:只計最後停留在 s0 的骰子;cf > cs 互相抵銷

---

## v30 — 2026-11-05 19:02

- **Boost 三模式定案並實作**
- v1:降面 `1d(100−Boost)`,CF 看原始值、CS 看最終值
- v2:原始 `1d100+Boost`,CF 看原始值、CS 看最終值
- v3:降面 `1d(100−|Boost|)`,CF/CS 皆看最終值

---

## v29 — 2026-11-05 18:28

- 總和永不加括號(無論 Boost 為何)

---

## v28 — 2026-11-05 18:22

- 新增自動複製公式開關
- 複製格式定案:`xdy=(r1+b)+(r2+b)……=(sum)`

---

## v27 — 2026-11-05 17:57

- 歷史紀錄點擊即複製
- 虛擬滾動(content-visibility)優化長紀錄效能
- 三項並行優化與 UI 細節調整

---

## v26 — 2026-11-05 17:32

- CSV 匯出行為修正、視窗尺寸調整
- 確立 pywebview + PyInstaller 的 EXE 打包方向

---

## v25 — 2026-11-05 17:13

- 新增 debug 序列輸入:逗號分隔數字,依序取代隨機結果(用完回歸隨機)

---

## v24 — 2026-11-05 17:01

- 連續擲骰加總顯示:`(原始+Boost)+(原始+Boost)=總和`
- 2d100 觸發時逐顆追擲 1d10
- 總和顯示於 log 上方

---

## v23 — 2026-11-05 16:52

- 空狀態文案:「命運的經緯在此交織,織夢者菲特將為你落下第一顆骰子」

---

## v22 — 2026-11-05 16:45

- 紀錄與 log 逐顆列出所有骰子數值(方便對帳)

---

## v21 — 2026-11-05 16:40

- 標題定案「織夢機 Fate/菲特」
- 頂部徽章與標題列更新

---

## v20 — 2026-11-05 16:36

- **專案定名「Fate / 菲特」**
- 取代語音輸入誤植的《我們的問題》(Gemini 一直沿用的舊名)

---

## v19 — 2026-11-05 16:25

- 新增 CSV 紀錄匯出(UTF-8 BOM,Excel 開啟不亂碼)

---

## v18 — 2026-11-05 16:16

- DeepSeek 接手(Gemini 上下文用盡)
- 修正 CSS 捲軸錯字 `6px(M)` → `6px`(原宣告被瀏覽器整條忽略)
- 措辭修正:「退回頂層 s0」→「退回起始層 s0」

---

## v17 — 2026-10-02 21:20

- 修正特定連鎖應顯示「0 Stacks」的結算錯誤

---

## v16 — 2026-10-02 21:15

- 淨 Stacks 顯示於每組連鎖最後一次擲骰(Last Roll)右側

---

## v15 — 2026-10-02 21:10

- CS/CF 全面改名「大成功/大失敗」
- 連擊標籤改為「x重大成功/x重大失敗」(x = Stacks 數)

---

## v14 — 2026-10-02 21:05

- 層級堆疊方向修正:與基準同向深入(+1)、反向退回(−1)

---

## v13 — 2026-10-02 21:00

- 修正 s0/s1 層級對應關係(s0=起始層、s1=第一層追擲)

---

## v12 — 2026-10-02 20:55

- 層級(s0、s1、s2……)流向實作,連鎖逐層展開

---

## v11 — 2026-10-02 20:50

- ra 與 ro 兩種檢定模式並行可用

---

## v10 — 2026-10-02 20:45

- 1d100 極值定案:低 5 = 1~5、高 5 = 96~100

---

## v9 — 2026-10-02 20:40

- 新增大於/小於檢定概念(ra / ro 前身)

---

## v8 — 2026-10-02 20:35

- 新增 CS/CF 交替時的抵銷提醒閃爍提示
- 新增連擊統計(Strike Counter)

---

## v7 — 2026-10-02 20:30

- UI 改為 16:9 全螢幕運用
- 連鎖與 Strike 系統支援 1d10 起手

---

## v6 — 2026-10-02 20:25

- 修正 1d100 投下次數無效的問題

---

## v5 — 2026-10-02 20:20

- **安科連鎖機制誕生**:1d10=10 → 1d2 判定後繼續追擲 1d10
- 支援同向反覆深入的連鎖流程

---

## v4 — 2026-10-02 20:15

- 依「使用第一版的介面」要求重製
- 規則定案:1d2=1 大成功、1d2=2 大失敗;1d100=5 大失敗、95 大成功

---

## v3 — 2026-10-02 20:10

- 回歸舊版介面設計
- 支援多顆骰同擲
- 新增自訂基礎 Boost 加值

---

## v2 — 2026-10-02 20:05

- 第一個 HTML GUI 版(單檔、Tailwind CDN、zh-Hant 介面)
- 實作 1d10=10 → 1d2 追擲與 1d100 極值觸發顯示

---

## v1 — 2026-10-02 20:00

- `roll_d10()`:擲 1d10,骰出 10 自動追擲 1d2
- `roll_d100()`:極值觸發(當時門檻 ≤5 / ≥95),極值可調
- 純主控台輸出——專案的第一行程式碼

---
