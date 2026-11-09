// 確定性迴歸電池:全部情境使用 debug 序列,輸出可重現。
// 回傳 { hash, per, len }:hash 為全結果 JSON 的 FNV-1a,per 為逐情境 CRC。
(() => {
  const $ = id => document.getElementById(id);
  // 隨機尾巴確定化:debug 序列用盡後改用固定種子 LCG(取代 crypto 真隨機)——保證兩輪完全一致;
  // 序列只需覆蓋情境設計路徑,尾巴由種子確定。電池結束不還原(eval 測試頁專用;正式使用不載入 battery.js)
  let lcgState = 0x2F6E2B1;
  const origGetRnd = getRnd;
  getRnd = function(max, debugSeq, state) {
    if (debugSeq && debugSeq.length > 0 && state.index < debugSeq.length) return origGetRnd(max, debugSeq, state);
    lcgState = (lcgState * 1664525 + 1013904223) >>> 0;
    return ((lcgState >>> 16) % max) + 1;
  };
  // 起始狀態正規化(清 localStorage 殘留,兩輪測試起點一致)
  try { localStorage.clear(); } catch (e) {}
  history = [];
  renderHistory();
  totalSummary.innerHTML = ''; // 防止隱藏元素的 stale innerText 汙染擷取
  checkMode = 'ra';
  outputFormatInput.value = 'plain';
  autoCopyToggle.checked = false;
  countInput.value = 1; boostInput.value = 0; targetValueInput.value = 50;
  boostMode100Input.value = 'v2'; debugSeqInput.value = ''; customDiceInput.value = '';

  // 測試掛鉤:攔截 toast / 剪貼簿 / blob
  const toasts = [];
  const origToast = window.showToast;
  window.showToast = (m, t) => { toasts.push(`[${t}] ${m}`); origToast(m, t); };
  const clip = [];
  const origWrite = navigator.clipboard.writeText.bind(navigator.clipboard);
  navigator.clipboard.writeText = t => { clip.push(t); return Promise.resolve(); };

  const grab = () => ({
    badges: $('strike-badges').innerText,
    flow: $('chain-flow-display').innerText,
    total: $('total-summary').innerText,
    hist0: (($('history-log').firstElementChild || { innerText: '' }).innerText),
    histN: $('history-log').children.length,
    toasts: toasts.splice(0),
    clip: clip.splice(0),
    inputs: [countInput.value, boostInput.value, targetValueInput.value].join('|')
  });
  const R = (type, count, boost, mode, target, bm, debug) => {
    countInput.value = count; boostInput.value = boost;
    targetValueInput.value = target; boostMode100Input.value = bm;
    checkMode = mode; debugSeqInput.value = debug || '';
    executeRoll(type);
    return grab();
  };
  const C = (expr, debug) => {
    debugSeqInput.value = debug || '';
    customDiceInput.value = expr;
    rollCustomDice();
    return grab();
  };
  const S = {};
  S['s01_100_normal'] = R('1d100', 1, 0, 'ra', 50, 'v2', '50');
  S['s02_cs_chain'] = R('1d100', 1, 0, 'ra', 50, 'v2', '96,10,1,7');
  S['s03_reverse'] = R('1d100', 1, 0, 'ra', 50, 'v2', '96,10,2,55');
  S['s04_cf_chain'] = R('1d100', 1, 0, 'ra', 50, 'v2', '3,10,1,7');
  S['s05_v1_boost'] = R('1d100', 1, 10, 'ra', 50, 'v1', '90,10,2,50');
  S['s06_v3_neg'] = R('1d100', 1, -10, 'ra', 50, 'v3', '85,7');
  S['s07_v3_neg_cf_chain'] = R('1d100', 1, -10, 'ro', 90, 'v3', '1,10,1,5,10,2,3');
  S['s08_v1_cs_clamp'] = R('1d100', 1, 96, 'ra', 50, 'v1', '4,10,2,50,9');
  S['s09_d10_chain'] = R('1d10', 1, 0, 'ra', 50, 'v2', '10,1,10,1,5');
  S['s10_d10_reverse0'] = R('1d10', 1, 0, 'ra', 50, 'v2', '10,1,10,2,9');
  S['s11_d4_boost'] = R('d4', 1, 3, 'ra', 50, 'v2', '2');
  S['s12_d20_negboost'] = R('d20', 1, -3, 'ro', 15, 'v2', '18');
  S['s13_count3'] = R('1d100', 3, 0, 'ra', 50, 'v2', '50,96,10,2,55,42');
  S['s14_v1_boost5'] = R('1d100', 1, 5, 'ro', 100, 'v1', '96,10,1,6');
  S['s15_fifty'] = R('1d100', 50, 0, 'ra', 50, 'v2', Array(50).fill('50').join(','));
  S['s16_c_1d100'] = C('1d100', '55');
  S['s17_c_8d50'] = C('8d50', '1,2,3,4,5,6,7,8');
  S['s18_c_3d6p5'] = C('3d6+5', '1,2,3');
  S['s19_c_ra50'] = C('ra50 1d100', '49');
  S['s20_c_ro25'] = C('ro25 1d75', '30');
  S['s21_c_minus10'] = C('1d100 - 10', '55');
  S['s22_c_spaced'] = C('1d100 + 5', '55');
  S['s23_c_spacedra'] = C('ra 50 1d100', '50');
  S['s24_c_err0d'] = C('0d100');
  S['s25_c_err1d0'] = C('1d0');
  S['s26_c_err_ra0'] = C('ra0 1d100');
  S['s27_c_50d'] = C('50d100', Array(50).fill('7').join(','));
  autoCopyToggle.checked = true;
  S['s28_autocopy'] = R('1d100', 1, 0, 'ra', 50, 'v2', '96,10,2,55');
  autoCopyToggle.checked = false;
  copyHistory(0);
  S['s29_copyhist'] = { clip: clip.splice(0) };
  outputFormatInput.value = 'markdown';
  copyHistory(0);
  S['s31_md_copy'] = { clip: clip.splice(0) };
  outputFormatInput.value = 'bbcode';
  copyHistory(0);
  S['s33_bbcode'] = { clip: clip.splice(0) };
  outputFormatInput.value = 'plain';
  countInput.value = 'abc'; boostInput.value = '5.5'; targetValueInput.value = '500';
  debugSeqInput.value = '4';
  executeRoll('d6');
  S['s32_clamp'] = { inputs: [countInput.value, boostInput.value, targetValueInput.value].join('|'), flow: $('chain-flow-display').innerText.slice(0, 120) };

  // ⚔️ 戰鬥情境(B 案對拼模型 v3,88:633~642F 精確版):debug 序列驅動;每回合消費序=守方 rollB → 攻方 rollA(免擲則缺)→ 受傷表 → 第10行 1d2 → 大失敗再擲 → 破解 → 特殊判定(B-11,僅帶 special/stun 技且 dmg>0 時)→ 戰意條(A-6,僅 moraleFlee>0 且 dmg>0 時)
  const resetBattle = () => { battle = JSON.parse(JSON.stringify(BATTLE_DEFAULT)); renderBattleCards(); };
  resetBattle();
  const B = (debug, mutate) => {
    resetBattle();
    if (mutate) mutate();
    debugSeqInput.value = debug || '';
    startBattle(); // 序列用盡處由 LCG 補確定值,兩輪必然一致
    return { battle: $('battle-log').innerText, hist0: (($('history-log').firstElementChild || { innerText: '' }).innerText), toasts: toasts.splice(0) };
  };
  const onlyNormal = side => { battle[side].skills = [{ id: side + 'n', name: '普通攻擊', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0 }]; };
  const SUPERSKILL = () => BATTLE_DEFAULT.player.skills[1];
  const FLOWER = () => ({ id: 'y1', name: 'Flower star', ct: 0, atkMod: 0, mult: 1, dice: '2+1d5', cost: 0, counter: 0, alwaysHit: 1 });
  S['b01_freehit'] = B('40,8', () => { battle.player.skills = [SUPERSKILL(), BATTLE_DEFAULT.player.skills[0]]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 16; renderBattleCards(); }); // 斬殺線選超人;免擲自動命中(我方下限 867>265)➔ 特大4×4=16 擊殺
  S['b02_freefail'] = B('35,10,2,2,1,100,3,90,1,10,2', () => { onlyNormal('player'); battle.enemy.skills = [{ id: 'ek', name: '攻消力', ct: 0, atkMod: 60, mult: 1, dice: '', cost: 0, counter: 0 }]; battle.enemy.hp = 99; battle.player.hp = 3; renderBattleCards(); }); // 635F 復現:對手 320 我方上限 316 追不上➔免擲自動失敗+大失敗鏈;R2 勝、R3 迴避、R4 敵勝(卡面 hp 3 生效)
  S['b03_counter'] = B('40,60,5,60,30,80,6,70', () => { onlyNormal('player'); battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0], { id: 'ex', name: '紅海皇', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 50 }]; battle.enemy.hp = 2; renderBattleCards(); }); // 破解 60/70≥50 ➔ 減半後擊殺
  S['b04_direct'] = B('4', () => { battle.player.skills = [FLOWER()]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 6; renderBattleCards(); }); // 直接傷害技:跳過對拼,2+4=6 一擊
  S['b05_bigfail'] = B('40,60,10,2,3', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 4; renderBattleCards(); }); // 受傷表 10 ➔ 1d2=2 大失敗 ➔ 再擲 3 中傷×2=4 擊殺
  S['b06_draw'] = B(Array.from({ length: 150 }, (_, i) => [40, 60, 1][i % 3]).join(','), () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 999; renderBattleCards(); }); // 50 回合全迴避 ➔ 平局
  S['b07_nocscf'] = B('10,96,8,20,70,8', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 6; renderBattleCards(); }); // 骰 96 不再是 CS(傷害 4 而非 ×2=8):B 案保真驗證
  S['b08_injury10_counter'] = B('40,60,10,1,10,70,5', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 2; renderBattleCards(); }); // 受傷表 10 ➔ 1d2=1 大成功(F1418:完全防禦+對攻方骰受傷——反擊擲 10 又接大失敗鏈 4 傷,烈海王 HP 17→13)
  S['b09_rhythm'] = B('40,60,1,10,70,1,40,8,10,70,8', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], SUPERSKILL()]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 20; renderBattleCards(); }); // 策略節奏:R1-2 普攻試探(迴避)、R3 劣勢翻盤超人(免擲)、R4 超人 CD 改普攻斬殺
  S['b10_once'] = B('40,60,5,40,60,5,40,8,40,60,5', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], { ...SUPERSKILL(), oncePerBattle: 1 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 一場一次(A-3):R3 翻盤用掉大招後 R4 不再選(once 用過)➔ 普攻
  S['b11_duration'] = B('40,60,1,40,60,1,40,5,40,10,5,40,60,5,90,5,3', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], { id: 'wzh', name: '武之怀', ct: 5, atkMod: 60, duration: 3, mult: 1, dice: '', cost: 0, counter: 0 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 持續效果(A-8):R3 發動 buff 60(免擲)、R4 普攻仍吃 buff(286)、R5 336、R6 buff 到期回落 276
  S['b12_heal'] = B('40,70,5,2,3', () => { battle.player.skills = [{ id: 'zr', name: '戰刃', ct: 0, atkMod: 0, mult: 1, dice: '2d3', cost: 0, counter: 0, heal: 1 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; battle.player.hp = 8; battle.player.regen = 1; renderBattleCards(); }); // 回復(命中後 +1)與 regen(每回合 +1):HP 8→heal 9→regen 10
  S['b13_shift'] = B('40,60,1', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 99; battle.enemy.injuryShift = 3; renderBattleCards(); }); // 受傷表位移:骰 1+3→4=中傷(2)——迴避被位移成中傷
  S['b25_schedule'] = B('40,8,10,70,5', () => { battle.player.skills = [SUPERSKILL(), BATTLE_DEFAULT.player.skills[0]]; battle.player.schedule = ['超人烈海王']; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 排程表(A-9):T1 按表出超人(對照 b10 同 mutate 的 R1 普攻=策略路線)➔ 表外 R2 用普攻
  S['b24_barhps'] = B('40,60,8,40,60,8,40,60,8,40,60,8', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.bars = '5,3,1'; renderBattleCards(); }); // 每段獨立 HP(主人例 20/10/5/5/1 的縮小版 5/3/1):R1 4 傷剩 1、R2 擊破➔滿血 3、R3 擊破➔滿血 1、R4 擊破➔敗
  S['b23_support'] = B('40,60,5,40,8', () => { battle.player.skills = [SUPERSKILL(), BATTLE_DEFAULT.player.skills[0]]; battle.player.supportDmg = 3; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 21; renderBattleCards(); }); // 支援位(炎火村 4865F 援護手):R1 普攻 2+支援 3(敵 21→16)、R2 斬殺線超人免擲 16 擊殺(卡面 hp 21 生效)
  S['b20_shield'] = B('40,60,8', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 99; battle.enemy.shield = 3; renderBattleCards(); }); // 護盾池(炎火村 886F):命中 4 ➔ 盾吸收 3、餘傷 1
  S['b21_bars'] = B('40,60,5,40,60,5', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.bars = '2,2'; renderBattleCards(); }); // 多段血條均勻:2 段每段 2 ➔ R1 擊破(滿血 2)➔ R2 終殺
  S['b22_cond'] = B('40,60,5,40,60,5,40,8', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], { id: 'cd', name: '條件必殺', ct: 0, atkMod: 650, mult: 4, dice: '', cost: 0, counter: 0, condRoundMin: 3 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 條件符卡(88:77F):回合 ≥3 才解鎖 ➔ R1-2 普攻、R3 必殺免擲
  S['b14_injuryflat'] = B('40,60,5', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 99; battle.enemy.injuryFlat = 2; renderBattleCards(); }); // 表常駐修正(635F 攻消力):命中中傷 2+2=4
  S['b15_stun'] = B('40,60,5,70,3,3', () => { battle.player.skills = [{ id: 'st', name: '虹色太極拳', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, stun: 1 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 命中後特殊攻擊判定 70(66+)➔ 眩暈 2 回合:R2-R3 敵無法行動,攻擊自動成立
  S['b16_exec'] = B('', () => { battle.player.skills = [{ id: 'ex', name: '榮耀處決', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, execHp: 0.2 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 3; renderBattleCards(); }); // 處決(74:8130F):敵 HP 3 ≤ 上限 17 的 20%(3.4)➔ 直接擊殺
  S['b17_autowin'] = B('', () => { battle.player.skills = [{ id: 'tw', name: '假腿 The World', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, autoWin: 1, autoWinAtk: 160 }]; battle.enemy.atk = 100; battle.enemy.hp = 99; renderBattleCards(); }); // 自動勝利(88:6117F):對手 Atk 100 < 160 ➔ 直接判定戰鬥結束
  S['b18_ctreset'] = B('90,10,2,2,40,8', () => { battle.player.skills = [{ id: 'wzy', name: '武之真意', ct: 3, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, ctReset: 1 }]; battle.enemy.skills = [SUPERSKILL()]; battle.enemy.hp = 20; battle.player.hp = 20; renderBattleCards(); }); // CT 操作(88:128F 武之真意):R1 發動清雙方 CT ➔ R2 敵超人(CT 清後可再用)免擲即決擊殺
  S['b19_truedmg'] = B('40,60,5', () => { battle.player.skills = [{ id: 'td', name: '真實傷害', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, trueDmg: 1 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0], { id: 'ex', name: '紅海皇', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 50 }]; battle.enemy.hp = 99; renderBattleCards(); }); // 真實傷害(F1851):破解無效,傷害 2 全額(非減半 1)
  const SPECSKILL = (name, dsl, extra) => ({ id: 'sp', name, ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, special: dsl, ...(extra || {}) });
  const specSetup = (name, dsl, extra) => { battle.player.skills = [SPECSKILL(name, dsl, extra)]; battle.player.atk = 300; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.atk = 5; renderBattleCards(); }; // 我方 300 vs 敵 5:雙向免擲(攻必中/守必敗),序列僅耗 rollB+受傷表+判定骰
  S['b26_special_hit'] = B('50,4,9', () => specSetup('試作特殊彈', '1d10|9-10:眩1')); // 特殊判定(B-11):自訂骰 1d10+自訂帶 9-10 ➔ 判定 9 命中帶 ➔ 眩暈 1 回合,R1 敵回合跳過(無法行動)
  S['b27_special_miss'] = B('50,2,15', () => specSetup('試作特殊彈', '1d100|66-100:眩2')); // 判定 15 落帶外(1-65 無帶)➔ 無效果,敵 R1 正常行動(對照 b15 同骰值 70 會眩)
  S['b28_special_over_stun'] = B('50,3,40', () => specSetup('試作特殊彈', '1d100|95-100:眩1', { stun: 1 })); // 優先級:special 存在時蓋過舊 stun 旗標——判定 40 落舊表 31-65(本會眩 1)但帶外 ➔ 無效果,敵 R1 正常行動
  S['b29_bind'] = B('50,2,40', () => specSetup('縛魂彈', '1d100|31-45:束縛')); // 束縛即死(88:636F):判定 40 命中帶 ➔ ⛓️束縛——戰鬥自動失敗,R1 即終局勝者烈海王
  S['b30_bind_bars'] = B('50,2,35', () => { specSetup('縛魂彈', '1d100|31-45:束縛'); battle.enemy.bars = '2,2'; }); // 束縛壓血條:敵剩 1 段血條仍被束縛即死——bindLost 先於 HP/血條判定
  const CHARGESKILL = (name, charge, extra) => ({ id: 'cg', name, ct: 0, atkMod: 0, mult: 4, dice: '', cost: 0, counter: 0, charge, ...(extra || {}) });
  const chargeSetup = (name, charge) => { battle.player.skills = [CHARGESKILL(name, charge)]; battle.player.atk = 300; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.atk = 5; battle.enemy.hp = 99; renderBattleCards(); };
  S['b31_charge1'] = B('5,50,4', () => chargeSetup('星脈地轉彈', 1)); // 蓄力 A-5(4045F/639-642F):R1 宣告➔🌀蓄力中敵攻自動成立;R2 蓄滿釋放——免擲命中,受傷表 4 中傷×4=8
  S['b32_charge2'] = B('5,3,50,4', () => chargeSetup('星脈地轉彈', 2)); // 蓄力 2T:R1 宣告、R2 仍蓄力(敵再自動命中)、R3 釋放免擲 中傷×4=8——639-642F 蓄力 1T→2T→宣言釋放
  const CFG = (o) => { battle.cfg = { ...(battle.cfg || {}), ...o }; };
  S['b33_points'] = B('60,40,70,30,50,55', () => { onlyNormal('player'); onlyNormal('enemy'); CFG({ mode: 'points', pointRounds: 3 }); renderBattleCards(); }); // 勝點制(B-12,5040F):3 輪拼點 2:1 ➔ 勝者烈海王(勝點 2:1)
  S['b34_points_draw'] = B('60,51,70,61,80,71', () => { onlyNormal('player'); onlyNormal('enemy'); CFG({ mode: 'points', pointRounds: 3 }); renderBattleCards(); }); // 拼點全平手(276/286/296 vs 276/286/296)➔ 0:0 平局
  S['b35_hplock'] = B('50,2', () => { onlyNormal('player'); onlyNormal('enemy'); CFG({ hpLock: 3 }); renderBattleCards(); }); // HP 鎖定線(A-10,4146F):敵我互有傷損,R6 烈海王 HP 17-15=2 ≤ 3 ➔ 觸線判負,戰鬥即終(勝者紅美鈴)
  S['b36_retreat'] = B('50,2', () => { onlyNormal('player'); onlyNormal('enemy'); CFG({ retreatAt: 8 }); renderBattleCards(); }); // 離場條件(A-10,3801F):R5 烈海王 HP 17-10=7 ≤ 8 ➔ 戰鬥中止(無結果)
  S['b37_maxrounds'] = B('50,60,4,50,40,1', () => { onlyNormal('player'); onlyNormal('enemy'); CFG({ maxRounds: 2 }); renderBattleCards(); }); // 回合上限(A-10,1671F):2 回合期滿比血量——B 傷 2/A 傷 0 ➔ 勝者烈海王(比血量)
  S['b38_lock_bars'] = B('50,2', () => { onlyNormal('player'); battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.atk = 5; battle.enemy.bars = '3,3'; CFG({ hpLock: 3 }); renderBattleCards(); }); // 敵側鎖定+壓血條:R1 敵段 3-1=2 ≤ 3 ➔ 鎖定即終(勝者烈海王;鎖定先於血條段推進)
  const moraleSetup = (side, fields) => { onlyNormal('player'); onlyNormal('enemy'); battle.player.atk = 300; battle.enemy.atk = 5; Object.assign(battle[side], fields); renderBattleCards(); };
  S['b39_morale_flee'] = B('50,2,20', () => moraleSetup('enemy', { moraleFlee: 90 })); // 戰意條(A-6 資源條型,642F/350F):R1 有效受擊 -1d50=20 ➔ 戰意 80 < 門檻 90 ➔ 逃跑,勝者烈海王(R1)
  S['b40_morale_check'] = B('50,2,50,2,40', () => moraleSetup('player', { moraleCheck: '2:50' })); // 戰意檢定(A-6 檢定型,234F):R2 末擲 40 < 50 ➔ 烈海王投降,勝者紅美鈴
  S['b41_morale_check_pass'] = B('50,2,50,2,60', () => moraleSetup('player', { moraleCheck: '2:50' })); // 檢定通過:R2 末擲 60 ≥ 50 ➔ 戰意不動,戰鬥續行(尾巴 LCG)
  S['b42_reduce_flat_zero'] = B('50,2', () => moraleSetup('enemy', { reduceFlat: 2 })); // 消力固定減(B-1①):中傷 2-1=1 ➔ 消力-2 ➔ 0 無傷(1149F「必中 1-消力 2=無傷」),敵 HP 不動
  S['b43_pierce'] = B('50,4', () => { moraleSetup('enemy', { reduceHalf: 1 }); battle.player.pierceAt = 240; }); // 穿透門檻(B-1③,325F):Atk 300 ≥ 240 ➔ 穿透消力,特大 4 不減半
  S['b44_elem_bypass'] = B('50,2', () => { moraleSetup('enemy', { reduceFlat: 5 }); battle.player.skills = [{ id: 'el', name: '屬性彈', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, elem: 1 }]; renderBattleCards(); }); // 屬性繞過(B-1②,253F):火焰系攻擊無視消力-5,小傷 1 全額入 HP
  const catSkill = (cat) => ({ id: 'cs', name: '分檔彈', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, cat });
  const counterSetup = (cat, counterSkill) => { onlyNormal('player'); battle.player.skills = [catSkill(cat)]; battle.player.atk = 300; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0], counterSkill]; battle.enemy.atk = 5; renderBattleCards(); };
  S['b45_counter_cat'] = B('50,4,60', () => counterSetup('必殺', { id: 'ex', name: '紅海皇', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, counterCat: 1 })); // 破解分檔(B-8,77F):counterCat 按攻方類別取檔——必殺技 75+;擲 60<75 ➔ 失敗,傷害全額(對照 b03 explicit 50 擲 60 成功)
  S['b46_counter_cat_melee'] = B('50,4,40', () => counterSetup('近戰', { id: 'ex', name: '紅海皇', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, counterCat: 1 })); // 類別門檻:近戰 30+;擲 40≥30 ➔ 傷害減半
  S['b47_counter_rip'] = B('50,4,60,4', () => counterSetup('', { id: 'ex', name: '紅海皇', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 50, counterRip: 1 })); // 破解連動(684F):explicit 50 擲 60 成功減半 ➔ counterRip 反擊自動成立,烈海王再吃中傷 2(HP 17→15)
  const INJ_DBL_DODGE = '1-2:迴避:0,3-4:小傷:1,5-6:中傷:2,7-8:大傷:3,9:特大傷:4,10:極端';
  S['b48_custom_table'] = B('50,2', () => moraleSetup('enemy', { injTable: INJ_DBL_DODGE })); // 個人受傷表(B-2 表驅動):雙迴避行 1-2 ➔ 擲 2 = 迴避 0 傷(預設表同骰為小傷 1),敵 HP 不動
  S['b49_custom_table_reroll'] = B('50,10,2,5', () => moraleSetup('enemy', { injTable: '1:迴避:0,2-8:小傷:1,9:特大傷:4,10:極端' })); // 自訂表+第10行鏈:極端 ➔ 1d2=2 大失敗 ➔ 再擲 5 查自訂表=小傷 1 ×2=2(HP 18→16)
  S['b50_row10_counter'] = B('50,10,1,4', () => moraleSetup('enemy', {})); // 大成功反擊原作化(F1418):第10行 1d2=1 ➔ 完全防禦+對攻方骰受傷——反擊擲 4 中傷 2,烈海王 HP 17→15(取代舊設計值「反擊 2」)
  S['b51_stun_stack'] = B('50,2,20,50,2,20,50,2,20', () => { moraleSetup('enemy', {}); battle.player.skills = [{ id: 'st', name: '虹色太極拳', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, stun: 1 }]; renderBattleCards(); }); // 眩暈累計難度(21033:886F):R1 擲 20 不眩(stack10)、R2 20+10=30 不眩(stack20)、R3 20+20=40 ➔ 眩 1(成功重置)
  S['b52_exec_multi'] = B('2,2,2,2,2,2,2,2,2,2', () => { moraleSetup('enemy', {}); battle.enemy.bars = '5,5,1'; battle.player.skills = [{ id: 'ex', name: '榮耀處決', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, execHp: 0.2 }]; renderBattleCards(); }); // 處決多段保真(8130F):序列耗盡後 LCG 推段,R8 敵進最後段 HP 1 ≤ 總和 11×20%+10=13 ➔ 直接擊殺(前兩段不觸發=最後段限定)
  S['b53_autowin_round'] = B('4', () => { onlyNormal('player'); battle.player.skills = [{ id: 'tw', name: '假腿 The World', ct: 0, atkMod: 0, mult: 1, dice: '2+1d5', cost: 0, counter: 0, autoWin: 1, autoWinAtk: 400 }]; battle.player.atk = 5; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.atk = 500; renderBattleCards(); }); // The World 前半補全(6117F):敵 Atk 500 ≥ 400 不終局 ➔ 本回合自動勝利+傷害必中(骰 2+4=6)
  S['b54_hp_field'] = B('50,2', () => { onlyNormal('player'); onlyNormal('enemy'); battle.player.hp = 10; battle.player.atk = 5; battle.enemy.atk = 300; renderBattleCards(); }); // 卡面 Hp 修復:player.hp=10 生效(舊行為被血條初始化覆蓋為 17)——R1 受擊 HP 10→9
  const FOEDUR = () => { onlyNormal('player'); battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0], { id: 'wzh', name: '武之怀', ct: 3, atkMod: 60, duration: 2, mult: 1, dice: '', cost: 0, counter: 0 }]; battle.enemy.schedule = ['武之怀']; battle.enemy.atk = 300; battle.enemy.hp = 99; battle.player.hp = 99; renderBattleCards(); };
  S['b55_foe_duration'] = B('50,2,50,2', () => FOEDUR()); // 敵方 duration 對稱生效:A-9 排程 R1 出武之怀 ➔ 敵 buff+60(R2 普攻 defVal 300+60+50=410 仍帶 buff),R2 表外落回普攻
  S['b56_foe_shield'] = B('50,2,50,2', () => { onlyNormal('player'); battle.player.atk = 300; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0], { id: 'shd', name: '護盾術', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 0, shieldGain: 3 }]; battle.enemy.schedule = ['護盾術']; renderBattleCards(); }); // 敵方 shieldGain 對稱生效:R1 排程出護盾術 ➔ 敵盾+3 吸收我方命中(HP 不動),R2 盾池 2 續吸
  const REVIVE_SETUP = (revive) => { battle.player.skills = [SUPERSKILL()]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 2; battle.enemy.revive = revive; renderBattleCards(); };
  S['b57_revive'] = B('40,8', () => REVIVE_SETUP(5)); // 復活攔截(B-5①,1157F 急救拳式):超人免擲 16 擊殺 ➔ 🎗️HP 歸零攔截復活 5,戰鬥續行
  S['b58_revive_dice'] = B('40,8,4', () => REVIVE_SETUP('1d5')); // Death Cancel 式(2205F 0→1d5):復活量骰 1d5=4 ➔ HP→4(骰式每次重擲)
  S['b59_auto_hp'] = B('40,20,4,40,20,4,40,60', () => { onlyNormal('player'); battle.player.skills = [BATTLE_DEFAULT.player.skills[0], { id: 'xk', name: '俠客行', ct: 0, atkMod: 60, mult: 1, dice: '', cost: 0, counter: 0, autoHpPct: 0.5 }]; battle.player.hp = 8; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; renderBattleCards(); }); // HP 閾值自動技(B-5②,2044F 俠客行):卡面 hp=8 為上限(修復後語義),受擊 8→6→4 ≤ 8×50% ➔ R3 跳過策略強制出俠客行
  S['b60_gear_fail'] = B('10,2,80,40,60', () => { onlyNormal('player'); onlyNormal('enemy'); battle.player.gear = '20:20:假腿'; renderBattleCards(); }); // 裝備判定(B-6,77F 假腿):R1 擲 10<20 ➔ ⚙️該回合自動失敗+永久 Atk-20(216→196);R2 擲 80 通過,攻擊值 196 落空
  S['b61_gear_pass'] = B('80,40,60', () => { onlyNormal('player'); onlyNormal('enemy'); battle.player.gear = '20:20:假腿'; renderBattleCards(); }); // 裝備判定通過:R1 擲 80≥20 ➔ 無 gear 行,正常對拼命中
  S['b62_support_boost'] = B('40,8,60,8', () => { onlyNormal('player'); battle.player.skills = [SUPERSKILL(), BATTLE_DEFAULT.player.skills[0]]; battle.player.supportBoostRound = 2; battle.player.supportBoostAtk = 700; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 支援插手(B-7①,1000F 幽香魔炮):R2 支援+700 入對拼值(216+700+60=976 起跳)免擲命中
  S['b63_support_chance'] = B('40,2,40,2,50', () => { onlyNormal('player'); battle.player.atk = 300; battle.player.supportDmg = 3; battle.player.supportFromRound = 2; battle.player.supportChance = 50; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.atk = 5; renderBattleCards(); }); // 機率型支援(B-7②,92F 迟来的支援):R1 未到支援自回合不發;R2 擲 50≤50 ➔ 🤝到場!支援位 3 起效
  S['b64_foe_support'] = B('40,8', () => { onlyNormal('player'); battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.supportDmg = 2; renderBattleCards(); }); // 敵方支援位對稱生效:R1 我方命中後 🤝敵方支援位追加 2(烈海王 HP 17→15)
  // 還原掛鉤
  window.showToast = origToast;
  navigator.clipboard.writeText = origWrite;

  const json = JSON.stringify(S);
  window.__lastBatteryJson = json; // 測試用:暫存 JSON 供字元級比對
  const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 0x01000193) >>> 0; } return h.toString(16); };
  const per = {};
  Object.keys(S).forEach(k => { per[k] = fnv(JSON.stringify(S[k])); });
  return { hash: fnv(json), per, len: json.length };
})()
