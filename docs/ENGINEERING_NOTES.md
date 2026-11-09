# 工程交接文檔(ENGINEERING_NOTES)

給任何要接手修改這份代碼的人(包括未來的自己與 AI)。**動手前先讀完。**

產品:`index_classic.html` 單檔安科骰子引擎。使用者規則見 README;逐版演進見 CHANGELOG;歷史產物見 `legacy/`。

---

## 1. 硬性不變式(改代碼前先背下來)

1. `ra`:最終值 ≤ 目標成功;`ro`:≥ 目標成功
2. 1d100:**≤5 → 大失敗(CF)、≥96 → 大成功(CS)**;程式中 `isCS` 判定在 `isCF` **之前**(s08 迴歸情境依賴此順序)
3. Boost:v1 降面 `1d(100−Boost)`、CF 看原始值、CS 看最終值;v2 原始+Boost、CF 原始、CS 最終;v3 降面 `1d(100−|Boost|)`、CF/CS 皆看最終值、**負 Boost 不扣減數值**
4. 首個 CS/CF 為基準向量:同向 `stack+1 level+1`;反向 `stack−1 level−1`(皆有 ≥0 保護,不變負)
5. 1d10=10 → 加擲 1d2:1=大成功、2=大失敗
6. 總和模式三選一(settings.sumMode):`all-s0`(預設,採計全部 s0 骰含觸發骰)/ `strict`(僅無連鎖或最終停留 s0 的骰;觸發骰不計)/ `all`(全部計入)——判定核心是 `isCountedStep(run, s)`,renderTotalSum 與自動複製共用;`lastAllRuns` 支援切換模式後即時重算
7. 自動複製格式 `xdy=(r1+b)+(r2+b)=(sum)`;Boost=0 無括號、總和永不加括號——**改任何輸出字串 = 改變安科作者拿去發文的格式,先問**
8. 通用骰 d4~d20 純擲骰(不套檢定);自訂骰與基礎 Boost 完全隔離
9. debug 序列必須優先於隨機消耗(順序不可動);用盡後回歸隨機
10. `getRnd` 隨機路徑的分布不可變——`% max` 的微小取模偏差(~1e-8)是**刻意保留**,修它會改變分布 = 改變輸出

## 2. 程式結構地圖(單檔內)

| 區塊 | 內容 |
|---|---|
| UI refs(script 頂部) | 全部 `getElementById`,含快取的 `settingsModalEl` / `confirmModalEl` |
| `getRnd(max, debugSeq, state)` | debug 優先 → crypto(`_rndBuf` 重用)→ 無 crypto 時 fallback |
| `rollCustomDice()` | regex `^(?:(ra\|ro)\s*(\d+)\s*)?(\d*)d(\d+)(?:\s*([+-]\s*\d+))?$`;邊界防呆在 match 之後 |
| `rollChainEngine(...)` | `while + loopSafety < 50` 兜底;回傳 `{steps, finalStack, baseOutcome}` |
| `executeRoll(type)` | 讀 UI → `saveSettings` → 跑 count 次 → render 三件套 → history → 自動複製 |
| `renderBadges / renderFlow / renderTotalSum` | 純輸出層,只吃 `allRuns` 資料結構 |
| storage | `safeGet/safeSet`(try-catch);theme 另有獨立 try-catch |
| 事件 | contextmenu 禁用、keydown(空白/1/2;彈窗開啟時擋掉)、DOMContentLoaded → loadSettings |

## 3. 2026-11-09 改動清單(行為零變更,32 情境迴歸通過)

| # | 位置 | 修改 | 為何不影響輸出 |
|---|---|---|---|
| 1 | `getRnd` | `_rndBuf` 模組級重用,取代每次擲骰 `new Uint32Array(1)` | 同長度緩衝、同 API、同取模,分布不變 |
| 2 | `getRnd` | 無 `window.crypto` 時退回 `Math.random` | 原行為是直接拋例外崩潰(未定義行為),屬防崩潰 |
| 3 | `setTheme` / `loadSettings` | theme 的 localStorage 存取包 try-catch | storage 禁用環境原本會丟例外中斷點擊 |
| 4 | 四處 `clipboard.writeText` | 加 `.catch(() => {})` | 失敗原本就靜默(只有 .then 有 toast),僅消除 unhandled rejection |
| 5 | pywebview `save_csv` | 加 `.catch(() => {})` | 同上 |
| 6 | `exportHistoryToCSV` | `map + join` 取代逐列 `+=` | 輸出位元組相同 |
| 7 | `renderFlow` | `parts.push + join` 取代 `flowHtml +=` | 輸出位元組相同 |
| 8 | keydown | 彈窗元素參照快取至頂部 const | 元素靜態存在,查詢結果相同,省每次按鍵的 DOM 查詢 |

## 4. 刻意不修改(與原因)

- **crypto RNG 取模偏差**:修復(棄樣法)會改變隨機分布 = 改變輸出,違反本輪「輸出不變」約束。若未來要修,必須當成新版本公告
- **renderFlow 全量 innerHTML 重繪**:真正的提速要改成差量渲染,與單檔原則和風險不成比例;50 顆 × 最深連鎖的實測延遲可接受
- **單檔架構**:拆檔對可維護性更好,但「一個 HTML 檔、雙擊即用」是產品承諾
- 虛擬滾動(content-visibility)已存在,未再動

## 5. 邊界情況清單(攻防面,已逐一驗證)

- 輸入鉗制:count `"abc"`/`-5`/`5.9` → `1`/`1`/`5`;target `0`/`500` → `1`/`100`;boost `5.5` → `5`
- 自訂骰:`0d100`、`1d0`、`ra0`、>50 顆、>10000 面、格式錯誤 → 全部 error toast,不擲
- v1 boost ≥ 95:sides 鉗到 1~5 → final 恆 ≥96 → 恆 CS,`loopSafety=50` 兜底(s08 情境即此形狀)
- v1 負 boost:sides >100、final 可為負 → ra 必成功、ro 必失敗(規則字面行為)
- debug 序列含 0 或小數:clamp(0→1);用盡後回歸隨機
- 50 顆 × 深連鎖:loopSafety 兜底,無死循環
- localStorage 禁用:全站不崩(含主題切換)
- clipboard 禁用(部分 file:// 環境):靜默失敗,不中斷擲骰
- pywebview API 異常:不拋未處理拒絕
- 極端 modifier(±1e9):純顯示,JS number 無溢出
- 使用者輸入永不進入 innerHTML 的插值(全部經 regex 取數字),無 XSS 注入面

## 6. 迴歸測試(改代碼必跑)

`tools/battery.js`:**battle 分支 36 個情境(引擎 31 + 戰鬥機 5),全部用 debug 序列強制確定性**,涵蓋 CS/CF 連鎖、三種 Boost(含負值與鉗制)、反向退回、0 Stacks、通用骰、自訂骰語法與錯誤、自動複製格式、Markdown 複製、輸入鉗制、戰鬥機(即決/免擲命中受傷表/破解減半/直接傷害/大失敗鏈/平局/無CS保真/第10行反擊/選技策略+排程表/一場一次/持續buff/回復regen/表位移/injuryFlat/stun眩暈/處決/自動勝利/CT操作/真實傷害/支援位/每段獨立HP/特殊判定框架+束縛即死版+蓄力+勝點制+勝利條件覆寫+戰意+減傷三件套)+BBCode匯出(CSV 情境已移除——會觸發真實下載)。

**基線(電池 hash)**:main 分支 31 情境 = `463080c0`;battle 分支 76 情境 = `7a7cb348`(兩輪一致已驗證;B 案 v3+選技策略+原語全套+支援位+每段獨立HP+排程表+BBCode+特殊判定框架 B-11+束縛即死版+蓄力 A-5+勝點制 B-12+勝利條件覆寫 A-10+戰意 A-6+減傷三件套 B-1,LCG 基線)。**驗證引擎零變更的方法**:跑 main 版電池(31 情境)於當前代碼,hash 應仍為 `463080c0`,且 s01~s32 逐項 per 與新電池完全一致。

跑法:

1. 專案目錄起 `python -m http.server <port>`(**注意:8765 可能被其他 session 的伺服器佔用**——兩個進程同聽一埠時請求會落到錯誤根目錄(index 200 但 tools/ 404),換埠並 `curl` 確認 battery.js 是 200 再開跑)
2. 瀏覽器開 `index_classic.html`,在頁面 context 執行:`fetch('/tools/battery.js', {cache:'no-store'})` → `eval` 內容
3. 取回 `{hash, per}`:hash 是全結果 JSON 的 FNV-1a;**不改行為的修改 hash 必須完全相同**;新增功能(如戰鬥情境)hash 必變,此時以「原情境 per 逐項一致 + 舊電池完整 hash 不變」為零變更證據

已知陷阱:

- 電池開頭會正規化 localStorage / history / stale DOM(首輪 = 次輪);**戰鬥情境另有 resetBattle() 重置 fate_battle_v1**
- toast/clipboard/blob 攔截只在測試 evaluate 內生效,結束時還原
- **fetch 一律加 `{cache: 'no-store'}`**——否則瀏覽器啟發式快取可能送舊版測試腳本
- 同網址 goto 可能觸發 bfcache 軟導航,保留上一輪 DOM 狀態——每輪用唯一 query 參數
- `content-visibility: auto` 的元素在視口外時 innerText 會跳過其內容——檢查紀錄用 textContent
- s08 是哨兵情境:依賴 isCS 先於 isCF 的判定順序 + loopSafety 兜底,動了引擎順序它第一個爆
- **隨機尾巴已 LCG 確定化**:battery.js 開頭把 getRnd 包裝——debug 序列用盡後改用固定種子 LCG(取代 crypto),**兩輪必然一致,序列只需覆蓋情境設計路徑**(不再需要手算補齊尾巴;序列值對小骰會被 clamp,如 1d2 收到 5 出 2,屬正常);s01~s32 序列覆蓋完整不受 LCG 影響(per 與 main 基線逐項不變)。LCG 版 getRnd 在電池結束後不還原——正式使用不載入 battery.js 即無影響
- **分頁僵死陷阱**:長 session 的瀏覽器分頁可能 chrome-error 黏死(tabs[0] 也可能消失)——**開新分頁即恢復**;evaluate 失敗先檢查 tabs.list 再重試
- **BBCode 匯出**(outputFormat 第三格式,參考 AnkeCreator 的 NGA 匯出):formatOutputText 的 bbcode 分支=整段 [b] 包裹,僅作用於 copyHistory 路徑(經典版自動複製公式**不經此**,格式紅線不動);摘要內含的方括號(如 [RA:50])非 NGA 合法標籤,原樣顯示

## 7. ⚔️ 自動戰鬥機(battle 分支專屬)

**規格來源**:gululu《烈海王幻想入》的戰鬥系統(主人提供角色卡截圖 + 平台「戰鬥重演」實作考察),簡化為引擎可跑的核心迴圈。

- **資料**:`battle = {player, enemy}`,每方 `{name, atk, hp, skills[]}`;技能 `{id, name, ct(冷卻), atkMod(Atk±), mult(傷害×倍率), dice(骰式如 '2+1d5'), cost(HP消耗), counter(破解門檻), special(特殊判定 B-11)}`。存於 localStorage `fate_battle_v1`(獨立 key,與經典版零衝突);無資料時載入烈幻入預設角色(烈海王 Atk216/Hp17 vs 紅美鈴 Atk225/Hp18)
- **戰鬥流程(B 案 v3 對拼模型,88:633~642F 精確版)**:每回合一次對拼——AI 選技(**確定策略無機率**:斬殺線→劣勢翻盤(round>2)→常態普攻;貪心與隨機抽籤都被主人否決)→ **守方先擲對拼骰** → 攻方**免擲判定**(我方上限<對手值:自動失敗 635F;我方下限>對手值:自動命中)→ 中間區間擲攻骰比大小 → **平手**(同值)→ 雙方各擲武藝 1d100 比高低(634F/639F 實演),勝者攻擊成立 → 勝者結算傷害:敗方擲**受傷表 1d10**(INJURY_TABLE 與原作表逐行一致)→ **第 10 行→1d2**:1=受擊方大成功(完全防禦+反擊 2【設計值】)/2=大失敗→再擲受傷表**全行×2**(635F 實演:小傷X2+2)→ 傷害 = 表檔位×mult + 骰式 → 受擊方破解判定(counter 減半照舊)→ CT 遞減。**攻擊骰無 CS/CF**(88:797F;CS/CF 屬日常檢定,經典連鎖引擎保留)。**必中技(alwaysHit)=直接傷害技**:跳過對拼,直接骰式傷害(640F:破解成功與否皆結算)。HP≤0 定勝負;50 回合兜底判平局
- **確定性**:全骰走 `getRnd(debugSeq, state)` 同一 state——debug 序列可重現整場戰鬥(電池基礎)
- **減傷三件套(B-1,三件一體)**:受擊方角色欄位 `reduceHalf`(消力減半)/`reduceFlat`(固定減 N,可歸零無傷,88:1149F);繞過=攻方技能 `elem` 屬性勾選(253F「沒法用消力消掉」)或攻方 `pierceAt` 穿透門檻(Atk≥ 門檻則減傷無效,325F Atk>240)。結算序:破解減半 ➔ 消力 ➔ 護盾池 ➔ HP 扣減 ➔ special/戰意(dmg>0 閘門用最終值)。**隨本項修正既有 bug**:原實現 `loser.hp -= dmg` 在盾結算前——盾池吸收只改顯示值、HP 全額扣減;b20 per 隨修正更新
- **戰意(A-6)**:雙形態。①資源條型——角色欄位 `moraleFlee`(門檻):戰意 100 起始,每次有效受擊(dmg>0)擲 -1d50(24688:642F),低於門檻 ➔ 逃跑(該方判負/擊退,350F);②檢定型——角色欄位 `moraleCheck`(「回合:門檻」DSL,例 `3:30`):該回合末擲 1d100 < 門檻 ➔ 投降(該方判負,88:234F/403F);停戰(無結果)語義用 A-10 離場線表達。runBattle 終局鏈:束縛 ➔ 戰意逃跑 ➔ 離場/鎖定 ➔ 死亡
- **勝點制快速模式(B-12)+勝利條件覆寫(A-10)**:`battle.cfg = {mode('hp'/'points'), maxRounds, hpLock, retreatAt, pointRounds}`(可缺省=HP 戰預設;工房頂部「戰鬥配置」欄編輯)。勝點制(21033:5040F):固定 N 輪(預設 7)雙方各擲 1d100+Atk+buff+非持續 atkMod 拼點,勝者+1 勝點,終局比點——**無 HP/狀態機**(傷害/受傷表/眩暈/蓄力/special 全不參與,CT/once/schedule 仍驅動選技)。HP 戰覆寫:回合上限(期滿比血量,1671F)、HP 鎖定線(觸線判負即終,先於死亡/血條推進,4146F/1626F)、離場線(觸線中止無結果,3801F)
- **蓄力(A-5)**:技能欄位 `charge`(N 回合,卡面數值=釋放版,88:4045F 星脈地轉彈「蓄力 1T,Atk+700,傷害×4」/639-642F 實演)。宣告回合起 chargeTurns 回合不行動(對手攻擊自動成立,與眩暈同構);蓄滿後次回合**強制釋放**(免再選技,cost/CT/一場一次於宣告回合結算,效果於釋放回合生效)。無法行動分支統一重構:雙方皆無法行動➔對峙一回合;自暈分支 `settleInjury` 少傳參的既有 bug 一併修正(電池無覆蓋,per 不變);工房技能卡新增「蓄力T」欄
- **特殊攻擊判定框架(B-11)**:卡面 `special` 原語——命中後(dmg>0 且受擊方未眩)按卡面分段表判定。DSL「骰式|lo-hi:效果」例 `1d100|31-65:眩1|66-100:眩2`(效果:眩N=stunN 眩 N 回合/束縛=bind,636F 被縛方戰鬥自動失敗【runBattle 以 bindLost 旗標先於 HP/血條收束】/不眩=none 明示帶;骰式限單骰 NdX 或定值),物件形式 `{dice, bands:[{min,max,fx,n}]}` 直接通行。**special 存在時蓋過舊 stun 旗標**;未設 special 時舊三段表(炎火村)路徑與記錄逐位元組不變。效果分派留擴充;工房技能卡有「⚔️ 特殊判定」欄(`forgeSpecial` 解析失敗保留原值+toast)
- **UI**:`#panel-battle` 桌面在右欄頂部常駐;行動版第 6 格 mtab(`body.mtab-battle` 靠上對齊,矮內容不置中漂浮);技能編輯器在設定彈窗(雙 tab 玩家/敵人)
- **重演**:開戰後按鈕變「🔄 戰鬥重演」= 同配置重擲(新隨機);參考 gululu 戰鬥重演(結構化戰鬥資料+讀者重算)而來
- **明確不做**:自動傷害外的勝敗敘事、貼吧式樓層、主檢定 Boost 三模式不套用於命中骰(命中骰為裸 1d100+CS/CF)

## 8. 給下一雙手的提醒

- localStorage key:`fate_theme` / `fate_dreamweaver_settings` / `fate_dreamweaver_history`——動結構要寫遷移(舊資料在玩家瀏覽器裡)
- 新增 UI 元素時,檢查 keydown 的擋除清單(INPUT/TEXTAREA/SELECT/BUTTON/contentEditable)
- `main.py` 的 `resource_path()` 依賴 `_MEIPASS`,PyInstaller 打包指令的 `--add-data "index_classic.html;."` 不可拿掉
- Android APK 打包專案在 `C:\Users\user\.zcode\workspace\draft-2beac78f-4219-4cd9-b92e-486264f76810\fate-dreamweaver\_apkbuild`**(不在 repo 內;node_modules 與 build 產物太大故未納入 git)。重打包:`cd _apkbuild/android` 後設 `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`、`ANDROID_HOME=C:\Android\Sdk`,再 `gradlew assembleDebug`;SDK 已裝在 C:\Android\Sdk
- **APK 單檔原則(主人 2026-11-09 裁決,兩分支皆然)**:`www/` 只放**當版單一檔案**——`index.html` = 當版 `index_classic.html` 全文(Capacitor 直接載入,App 打開就是引擎)。**不放版本選擇頁、不放歷史版本**(使用者不需要選 v44/v45/v46;歷史正本在 repo `legacy/` 與 GitHub Releases)。更新步驟:`cp index_classic.html _apkbuild/www/index.html` → `npx cap copy android` → `gradlew assembleDebug`
- 桌面版 CSV 存檔走 `window.pywebview.api.save_csv`,網頁版走 blob 下載——兩條路都要測
- **倉庫分流(主人 2026-11-10 裁決)**:本倉 `Fate-Battle-Engine` = 戰鬥主線(battle 分支整段歷史遷出為 main);主線經典版在 `Fate-Dreamweaver-Engine`(其 battle 分支保留作遷出時刻的存檔快照)。**戰鬥工作從此全部在本倉 main 進行**;規則挖掘報告在本地 `C:\Users\user\Documents\anko_archive\analysis\`(不入倉,僅私人參考)
