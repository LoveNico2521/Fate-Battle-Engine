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
  outputFormatInput.value = 'plain';
  countInput.value = 'abc'; boostInput.value = '5.5'; targetValueInput.value = '500';
  debugSeqInput.value = '4';
  executeRoll('d6');
  S['s32_clamp'] = { inputs: [countInput.value, boostInput.value, targetValueInput.value].join('|'), flow: $('chain-flow-display').innerText.slice(0, 120) };

  // ⚔️ 戰鬥情境(B 案對拼模型 v3,88:633~642F 精確版):debug 序列驅動;每回合消費序=守方 rollB → 攻方 rollA(免擲則缺)→ 受傷表 → 第10行 1d2 → 大失敗再擲 → 破解
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
  S['b01_freehit'] = B('40,8', () => { battle.player.skills = [SUPERSKILL(), BATTLE_DEFAULT.player.skills[0]]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 16; renderBattleCards(); }); // 斬殺線選超人;免擲自動命中(我方下限 927>265)➔ 特大4×4=16 擊殺
  S['b02_freefail'] = B('35,10,2,2,1,100,3,90,1,10,2', () => { onlyNormal('player'); battle.enemy.skills = [{ id: 'ek', name: '攻消力', ct: 0, atkMod: 60, mult: 1, dice: '', cost: 0, counter: 0 }]; battle.enemy.hp = 99; battle.player.hp = 3; renderBattleCards(); }); // 635F 復現:對手 320 我方上限 316 追不上➔免擲自動失敗+大失敗鏈;R2 勝、R3 再敗➔敵勝
  S['b03_counter'] = B('40,60,5,60,30,80,6,70', () => { onlyNormal('player'); battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0], { id: 'ex', name: '紅海皇', ct: 0, atkMod: 0, mult: 1, dice: '', cost: 0, counter: 50 }]; battle.enemy.hp = 2; renderBattleCards(); }); // 破解 60/70≥50 ➔ 減半後擊殺
  S['b04_direct'] = B('4', () => { battle.player.skills = [FLOWER()]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 6; renderBattleCards(); }); // 直接傷害技:跳過對拼,2+4=6 一擊
  S['b05_bigfail'] = B('40,60,10,2,3', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 4; renderBattleCards(); }); // 受傷表 10 ➔ 1d2=2 大失敗 ➔ 再擲 3 中傷×2=4 擊殺
  S['b06_draw'] = B(Array.from({ length: 150 }, (_, i) => [40, 60, 1][i % 3]).join(','), () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 999; renderBattleCards(); }); // 50 回合全迴避 ➔ 平局
  S['b07_nocscf'] = B('10,96,8,20,70,8', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 6; renderBattleCards(); }); // 骰 96 不再是 CS(傷害 4 而非 ×2=8):B 案保真驗證
  S['b08_injury10_counter'] = B('40,60,10,1,10,70,5', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 2; renderBattleCards(); }); // 受傷表 10 ➔ 1d2=1 受擊方大成功(防禦+反擊2:烈海王 HP 17→15)➔ R2 擊殺
  S['b09_rhythm'] = B('40,60,1,10,70,1,40,8,10,70,8', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], SUPERSKILL()]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 20; renderBattleCards(); }); // 策略節奏:R1-2 普攻試探(迴避)、R3 劣勢翻盤超人(免擲)、R4 超人 CD 改普攻斬殺
  S['b10_once'] = B('40,60,5,40,60,5,40,8,40,60,5', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], { ...SUPERSKILL(), oncePerBattle: 1 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 一場一次(A-3):R3 翻盤用掉大招後 R4 不再選(once 用過)➔ 普攻
  S['b11_duration'] = B('40,60,1,40,60,1,40,5,40,10,5,40,60,5,90,5,3', () => { battle.player.skills = [BATTLE_DEFAULT.player.skills[0], { id: 'wzh', name: '武之怀', ct: 5, atkMod: 60, duration: 3, mult: 1, dice: '', cost: 0, counter: 0 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; renderBattleCards(); }); // 持續效果(A-8):R3 發動 buff 60(免擲)、R4 普攻仍吃 buff(286)、R5 336、R6 buff 到期回落 276
  S['b12_heal'] = B('40,70,5,2,3', () => { battle.player.skills = [{ id: 'zr', name: '戰刃', ct: 0, atkMod: 0, mult: 1, dice: '2d3', cost: 0, counter: 0, heal: 1 }]; battle.enemy.skills = [BATTLE_DEFAULT.enemy.skills[0]]; battle.enemy.hp = 99; battle.player.hp = 8; battle.player.regen = 1; renderBattleCards(); }); // 回復(命中後 +1)與 regen(每回合 +1):HP 8→heal 9→regen 10
  S['b13_shift'] = B('40,60,1', () => { onlyNormal('player'); onlyNormal('enemy'); battle.enemy.hp = 99; battle.enemy.injuryShift = 3; renderBattleCards(); }); // 受傷表位移:骰 1+3→4=中傷(2)——迴避被位移成中傷
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
