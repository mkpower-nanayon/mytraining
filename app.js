'use strict';
/* ===================== utils ===================== */
const KEY = 'mytraining.data.v1', UIKEY = 'mytraining.ui.v1', SYNCKEY = 'mytraining.sync.v1';
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dstr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => dstr(new Date());
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const WD = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_EN = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const fmtDateJP = s => { const d = parseD(s); return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WD[d.getDay()]}）`; };
const fmtMD = s => { const d = parseD(s); return `${d.getMonth() + 1}/${d.getDate()}`; };
const fmtDur = sec => { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`; };
const fmtMin = sec => { const m = Math.round((sec || 0) / 60); return m >= 60 ? `${Math.floor(m / 60)}時間${m % 60}分` : `${m}分`; };
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(n) ? n : 0; };
const r1 = n => Math.round(n * 10) / 10;
const fmtN = n => r1(n).toLocaleString('ja-JP');
const clone = o => JSON.parse(JSON.stringify(o));
const e1rm = (w, r) => (w > 0 && r > 0) ? (r === 1 ? w : w * (1 + r / 30)) : 0;

/* ===================== icons ===================== */
const ic = p => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I = {
  folder: ic('<path d="M3.5 6.5a1.5 1.5 0 0 1 1.5-1.5h4.2l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v9.3A1.5 1.5 0 0 1 19 19.5H5a1.5 1.5 0 0 1-1.5-1.5z"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>'),
  folderPlus: ic('<path d="M3.5 6.5a1.5 1.5 0 0 1 1.5-1.5h4.2l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v9.3A1.5 1.5 0 0 1 19 19.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M12 10.5v5.5M9.25 13.25h5.5"/>'),
  play: '<svg class="ico" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  more: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg>',
  close: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  left: ic('<path d="M15 5l-7 7 7 7"/>'),
  right: ic('<path d="M9 5l7 7-7 7"/>'),
  down: ic('<path d="M5 9l7 7 7-7"/>'),
  chev: ic('<path d="M9 6l6 6-6 6"/>'),
  timer: ic('<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V10M9.5 3h5M12 3v3.5M18.5 7l1.5-1.5"/>'),
  check: ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  grip: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',
  search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
  trophy: ic('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1.5A3 3 0 0 0 8 10.5M16 6h3v1.5a3 3 0 0 1-3 3M12 13v4M8.5 20.5h7M9.5 17h5"/>'),
  sort: ic('<path d="M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5"/>'),
  sync: ic('<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/>'),
};

/* ===================== constants ===================== */
const PARTS = [
  { id: 'chest', name: '胸', color: '#b5534a' },
  { id: 'back', name: '背中', color: '#5a7a96' },
  { id: 'shoulder', name: '肩', color: '#c9a24a' },
  { id: 'legs', name: '脚', color: '#7a8f5c' },
  { id: 'arms', name: '腕', color: '#8b6a9a' },
  { id: 'abs', name: '腹', color: '#5b8f87' },
  { id: 'cardio', name: '有酸素', color: '#a9677a' },
  { id: 'other', name: 'その他', color: '#7d776c' },
];
const PART = Object.fromEntries(PARTS.map(p => [p.id, p]));
const TYPES = { wr: '重量×回数', r: '回数のみ', sec: '時間（秒）', cardio: '有酸素（分・km）' };
const SET_FIELDS = ['w', 'r', 's', 'm', 'km'];
function fieldsOf(type) {
  const u = S.data.settings.unit;
  return ({ wr: [['w', u], ['r', '回']], r: [['r', '回']], sec: [['s', '秒']], cardio: [['m', '分'], ['km', 'km']] })[type] || [['w', u], ['r', '回']];
}
const DEFAULT_EX = [
  ['chest', 'ベンチプレス'], ['chest', 'インクラインベンチプレス'], ['chest', 'デクラインベンチプレス'], ['chest', 'ダンベルプレス'], ['chest', 'インクラインダンベルプレス'], ['chest', 'ダンベルフライ'], ['chest', 'ケーブルクロスオーバー'], ['chest', 'チェストプレス（マシン）'], ['chest', 'ペックフライ（マシン）'], ['chest', 'ディップス'], ['chest', '腕立て伏せ', 'r'],
  ['back', 'デッドリフト'], ['back', '懸垂', 'r'], ['back', 'ラットプルダウン'], ['back', 'ベントオーバーロウ'], ['back', 'ワンハンドダンベルロウ'], ['back', 'シーテッドロウ'], ['back', 'Tバーロウ'], ['back', 'ケーブルロウ'], ['back', 'バックエクステンション'], ['back', 'プルオーバー'],
  ['shoulder', 'オーバーヘッドプレス'], ['shoulder', 'ダンベルショルダープレス'], ['shoulder', 'ショルダープレス（マシン）'], ['shoulder', 'サイドレイズ'], ['shoulder', 'ケーブルサイドレイズ'], ['shoulder', 'フロントレイズ'], ['shoulder', 'リアレイズ'], ['shoulder', 'リアデルト（マシン）'], ['shoulder', 'アップライトロウ'], ['shoulder', 'フェイスプル'], ['shoulder', 'シュラッグ'],
  ['legs', 'スクワット'], ['legs', 'フロントスクワット'], ['legs', 'ハックスクワット'], ['legs', 'レッグプレス'], ['legs', 'レッグエクステンション'], ['legs', 'レッグカール'], ['legs', 'ルーマニアンデッドリフト'], ['legs', 'ブルガリアンスクワット'], ['legs', 'ランジ'], ['legs', 'ヒップスラスト'], ['legs', 'アダクション'], ['legs', 'アブダクション'], ['legs', 'カーフレイズ'],
  ['arms', 'バーベルカール'], ['arms', 'ダンベルカール'], ['arms', 'ハンマーカール'], ['arms', 'インクラインダンベルカール'], ['arms', 'プリーチャーカール'], ['arms', 'ケーブルカール'], ['arms', 'トライセプスプッシュダウン'], ['arms', 'ライイングトライセプスエクステンション'], ['arms', 'オーバーヘッドトライセプスエクステンション'], ['arms', 'ナローベンチプレス'], ['arms', 'キックバック'], ['arms', 'リストカール'],
  ['abs', 'クランチ', 'r'], ['abs', 'レッグレイズ', 'r'], ['abs', 'ハンギングレッグレイズ', 'r'], ['abs', 'アブローラー', 'r'], ['abs', 'ケーブルクランチ'], ['abs', 'ロシアンツイスト', 'r'], ['abs', 'プランク', 'sec'], ['abs', 'サイドプランク', 'sec'],
  ['cardio', 'ランニング', 'cardio'], ['cardio', 'ウォーキング', 'cardio'], ['cardio', 'エアロバイク', 'cardio'], ['cardio', 'ローイングマシン', 'cardio'], ['cardio', 'ステアクライマー', 'cardio'], ['cardio', '縄跳び', 'sec'],
];
const REST_OPTS = [30, 45, 60, 75, 90, 105, 120, 150, 180, 240, 300];
const COLS = ['exercises', 'folders', 'routines', 'workouts', 'body', 'plans'];

/* ===================== state ===================== */
function fresh() {
  return {
    v: 2,
    exercises: DEFAULT_EX.map(([part, name, type], i) => ({ id: 'd' + i, name, part, type: type || 'wr' })),
    folders: [{ id: 'f_default', name: 'マイルーティン' }],
    routines: [], workouts: [], body: [], plans: [], deleted: {},
    settings: { unit: 'kg', rest: 90, autoRest: true, sound: true, vibrate: true },
    active: null,
  };
}
function normalize(d) {
  const f = fresh();
  const o = { ...f, ...d };
  o.settings = { ...f.settings, ...(d.settings || {}) };
  COLS.forEach(k => { if (!Array.isArray(o[k])) o[k] = f[k]; });
  if (!o.deleted || typeof o.deleted !== 'object') o.deleted = {};
  return o;
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return normalize(s); } catch (e) { console.error(e); }
  return fresh();
}
const loadJSON = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };

const S = {
  data: load(),
  ui: { tab: 'home', month: [new Date().getFullYear(), new Date().getMonth()], sel: today(), q: '', closed: loadJSON(UIKEY).closed || {}, sortRt: false },
  editor: null,  // {mode:'live'|'edit'|'routine'|'plan', draft, isNew, dirty, sort}
  rest: null,
};

/* change tracking (used to merge when syncing) */
let snap = {};
const itemJSON = it => { const { u, ...rest } = it; return JSON.stringify(rest); };
const orderSig = d => d.folders.map(f => f.id).join(',') + '|' + d.routines.map(r => r.id).join(',');
function rebuildSnap() {
  snap = {};
  COLS.forEach(c => S.data[c].forEach(it => { snap[c + ':' + it.id] = itemJSON(it); }));
  snap.$settings = JSON.stringify(S.data.settings); snap.$active = JSON.stringify(S.data.active); snap.$order = orderSig(S.data);
}
function stamp() {
  const now = Date.now(), d = S.data, seen = new Set();
  COLS.forEach(c => d[c].forEach(it => {
    const k = c + ':' + it.id, j = itemJSON(it); seen.add(k);
    if (snap[k] !== j) { it.u = now; snap[k] = j; }
  }));
  Object.keys(snap).forEach(k => { if (!k.startsWith('$') && !seen.has(k)) { d.deleted[k] = now; delete snap[k]; } });
  const st = JSON.stringify(d.settings); if (snap.$settings !== st) { d.settingsU = now; snap.$settings = st; }
  const ac = JSON.stringify(d.active); if (snap.$active !== ac) { d.activeU = now; snap.$active = ac; }
  const od = orderSig(d); if (snap.$order !== od) { d.orderU = now; snap.$order = od; }
}
rebuildSnap();

let exCache = null;
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(S.data)); }
  catch (e) { toast('保存に失敗しました（容量不足の可能性）'); console.error(e); }
}
function save() { exCache = null; stamp(); persist(); scheduleSync(); }
let saveT = null;
function saveSoon() { clearTimeout(saveT); saveT = setTimeout(() => { saveT = null; save(); }, 400); }
function flushSave() { if (saveT) { clearTimeout(saveT); saveT = null; save(); } }
function saveUI() { try { localStorage.setItem(UIKEY, JSON.stringify({ closed: S.ui.closed })); } catch (e) { } }
window.addEventListener('pagehide', flushSave);
document.addEventListener('visibilitychange', () => { if (document.hidden) flushSave(); else syncNow(); });
window.addEventListener('online', () => syncNow());

function getEx(id) {
  if (!exCache) exCache = new Map(S.data.exercises.map(e => [e.id, e]));
  return exCache.get(id) || { id, name: '(削除された種目)', part: 'other', type: 'wr' };
}
const visibleEx = () => S.data.exercises.filter(e => !e.hidden);
const sortedWorkouts = () => [...S.data.workouts].sort((a, b) => b.date.localeCompare(a.date) || (b.start || 0) - (a.start || 0));
const findW = id => S.data.workouts.find(w => w.id === id);
const findR = id => S.data.routines.find(r => r.id === id);
const findF = id => S.data.folders.find(f => f.id === id);
const findP = id => S.data.plans.find(p => p.id === id);
function partsOf(items) { const s = []; items.forEach(it => { const p = getEx(it.exerciseId).part; if (!s.includes(p)) s.push(p); }); return s; }
const tag = p => `<span class="tag"><i style="background:${PART[p]?.color}"></i>${PART[p]?.name || p}</span>`;
const dot = p => `<span class="dot" style="background:${PART[p]?.color || '#888'}"></span>`;
function setText(type, s) {
  const u = S.data.settings.unit;
  if (!s) return '-';
  switch (type) {
    case 'r': return `${s.r || 0}回`;
    case 'sec': return `${s.s || 0}秒`;
    case 'cardio': return `${s.m || 0}分${num(s.km) ? ' ' + s.km + 'km' : ''}`;
    default: return `${s.w || 0}${u} × ${s.r || 0}`;
  }
}
function setsOnly(s) { const o = {}; SET_FIELDS.forEach(f => { if (s[f] !== undefined && s[f] !== '') o[f] = s[f]; }); return o; }
const tplItems = items => items.map(it => ({ exerciseId: it.exerciseId, sets: it.sets.map(setsOnly) }));
function wStats(w) {
  let sets = 0, vol = 0, reps = 0;
  w.items.forEach(it => {
    const t = getEx(it.exerciseId).type;
    it.sets.forEach(s => { if (s.done === false) return; sets++; if (t === 'wr') { vol += num(s.w) * num(s.r); reps += num(s.r); } else if (t === 'r') reps += num(s.r); });
  });
  return { sets, vol, reps, exs: w.items.length };
}
function prevSets(exId, excludeId, beforeDate) {
  for (const w of sortedWorkouts()) {
    if (w.id === excludeId) continue;
    if (beforeDate && w.date > beforeDate) continue;
    const it = w.items.find(i => i.exerciseId === exId);
    if (it && it.sets.length) return it.sets;
  }
  return null;
}
function usage() {
  const m = {};
  S.data.workouts.forEach(w => w.items.forEach(it => { m[it.exerciseId] = (m[it.exerciseId] || 0) + 1; }));
  return m;
}

/* ===================== UI primitives ===================== */
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, 2200);
}
function dlg(inner, cls = '') {
  const el = document.createElement('div'); el.className = 'dlg-bg ' + cls;
  el.innerHTML = `<div class="dlg ${cls}">${inner}</div>`;
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
  return el;
}
function closeDlg(el) { el.classList.remove('show'); setTimeout(() => el.remove(), 160); }
function uiConfirm(msg, ok = 'OK', danger = false) {
  return new Promise(res => {
    const el = dlg(`<p class="dlg-msg">${esc(msg)}</p><div class="dlg-btns"><button class="btn" data-r="0">キャンセル</button><button class="btn ${danger ? 'danger' : 'primary'}" data-r="1">${esc(ok)}</button></div>`);
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-r]'); if (b || ev.target === el) { ev.stopPropagation(); closeDlg(el); res(b?.dataset.r === '1'); } });
  });
}
function uiAlert(msg) {
  return new Promise(res => {
    const el = dlg(`<p class="dlg-msg">${esc(msg)}</p><div class="dlg-btns"><button class="btn primary" data-r="1">OK</button></div>`);
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-r]'); if (b || ev.target === el) { ev.stopPropagation(); closeDlg(el); res(); } });
  });
}
function uiPrompt(title, value = '', ph = '') {
  return new Promise(res => {
    const el = dlg(`<h3>${esc(title)}</h3><input id="dp-in" value="${esc(value)}" placeholder="${esc(ph)}" autocomplete="off"><div class="dlg-btns"><button class="btn" data-r="0">キャンセル</button><button class="btn primary" data-r="1">OK</button></div>`);
    const inp = $('#dp-in', el); setTimeout(() => { inp.focus(); inp.select(); }, 60);
    const done = ok => { closeDlg(el); res(ok ? inp.value.trim() : null); };
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); done(true); } });
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-r]'); if (b || ev.target === el) { ev.stopPropagation(); done(b?.dataset.r === '1'); } });
  });
}
function uiMenu(title, items) {
  return new Promise(res => {
    const el = dlg(`${title ? `<div class="mt">${esc(title)}</div>` : ''}<div class="mg">${items.map((it, i) => `<button class="mi ${it.danger ? 'danger' : ''}" data-r="${i}">${esc(it.label)}</button>`).join('')}</div><button class="mi cancel" data-r="-1">キャンセル</button>`, 'menu');
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-r]'); if (b || ev.target === el) { ev.stopPropagation(); closeDlg(el); const i = b ? +b.dataset.r : -1; res(i >= 0 ? items[i].value : null); } });
  });
}
function datePrompt(value, title = '日付を選択') {
  return new Promise(res => {
    const el = dlg(`<h3>${esc(title)}</h3><input type="date" id="dt-in" value="${value}"><div class="dlg-btns"><button class="btn" data-r="0">キャンセル</button><button class="btn primary" data-r="1">OK</button></div>`);
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-r]'); if (b || ev.target === el) { ev.stopPropagation(); const v = $('#dt-in', el).value; closeDlg(el); res(b?.dataset.r === '1' && v ? v : null); } });
  });
}

const sheets = [];
function openSheet(render, { full = false, state = {} } = {}) {
  const el = document.createElement('div'); el.className = 'sheet-bg';
  el.innerHTML = `<div class="sheet ${full ? 'full' : ''}"><div class="sheet-grip"></div><div class="sheet-c"></div></div>`;
  document.body.appendChild(el);
  const h = { el, render, state };
  sheets.push(h);
  el.addEventListener('click', ev => { if (ev.target === el) closeSheet(h); });
  drawSheet(h);
  requestAnimationFrame(() => el.classList.add('show'));
  return h;
}
function drawSheet(h) {
  const html = h.render(h);
  if (html == null) { closeSheet(h); return; }
  const c = $('.sheet-c', h.el); const st = c.scrollTop; c.innerHTML = html; c.scrollTop = st;
}
function closeSheet(h) {
  h = h || sheets[sheets.length - 1]; if (!h) return;
  const i = sheets.indexOf(h); if (i < 0) return; sheets.splice(i, 1);
  h.el.classList.remove('show'); setTimeout(() => h.el.remove(), 220);
}
const refreshSheets = () => [...sheets].forEach(drawSheet);
const closeAllSheets = () => [...sheets].forEach(closeSheet);
const sheetOf = el => sheets.find(s => s.el === el.closest('.sheet-bg'));

/* drag & drop sorting: drag a .handle; items are direct children carrying data-sid */
function sortable(list, onEnd) {
  if (!list) return;
  list.addEventListener('pointerdown', ev => {
    const h = ev.target.closest('.handle'); if (!h) return;
    const item = h.closest('[data-sid]'); if (!item || item.parentElement !== list) return;
    ev.preventDefault(); ev.stopPropagation();
    const scroller = list.closest('.ed-body,.sheet-c') || document.scrollingElement;
    const scrRect = () => scroller === document.scrollingElement ? { top: 0, bottom: innerHeight } : scroller.getBoundingClientRect();
    const outer = el => el.getBoundingClientRect().height + parseFloat(getComputedStyle(el).marginBottom || 0);
    const isItem = el => el && el.dataset.sid !== undefined;
    const startY = ev.clientY, s0 = scroller.scrollTop; let lastY = ev.clientY, shift = 0;
    item.classList.add('dragging'); list.classList.add('sorting');
    if (navigator.vibrate) navigator.vibrate(10);
    const pos = () => {
      item.style.transform = `translateY(${lastY - startY - shift + (scroller.scrollTop - s0)}px)`;
      const r = item.getBoundingClientRect(), cy = r.top + r.height / 2;
      const nx = item.nextElementSibling, pv = item.previousElementSibling;
      if (isItem(nx)) { const nr = nx.getBoundingClientRect(); if (cy > nr.top + nr.height / 2) { const hgt = outer(nx); list.insertBefore(nx, item); shift += hgt; return pos(); } }
      if (isItem(pv)) { const pr = pv.getBoundingClientRect(); if (cy < pr.top + pr.height / 2) { const hgt = outer(pv); list.insertBefore(item, pv); shift -= hgt; return pos(); } }
    };
    const iv = setInterval(() => {
      const b = scrRect();
      if (lastY < b.top + 70) { scroller.scrollTop -= 9; pos(); } else if (lastY > b.bottom - 70) { scroller.scrollTop += 9; pos(); }
    }, 16);
    const move = e => { lastY = e.clientY; pos(); };
    const up = () => {
      clearInterval(iv);
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up);
      item.style.transform = ''; item.classList.remove('dragging'); list.classList.remove('sorting');
      onEnd([...list.children].filter(isItem).map(c => c.dataset.sid));
    };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  });
}

/* ===================== charts ===================== */
const GOLD = '#c9a24a';
function lineChart(pts, { color = GOLD, unit = '' } = {}) {
  if (!pts.length) return '<div class="empty">データがありません</div>';
  const W = 340, H = 170, pl = 38, pr = 12, pt = 16, pb = 24;
  const vals = pts.map(p => p.v); let mn = Math.min(...vals), mx = Math.max(...vals);
  if (mn === mx) { mn -= 1; mx += 1; } const pv = (mx - mn) * 0.12; mn -= pv; mx += pv;
  const x = i => pl + (pts.length === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (pts.length - 1));
  const y = v => pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn));
  let g = '';
  for (let k = 0; k <= 3; k++) { const v = mn + (mx - mn) * k / 3; const yy = y(v); g += `<line x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}" stroke="#262320" stroke-width="1"/><text x="${pl - 6}" y="${yy + 3}" text-anchor="end">${fmtN(v)}</text>`; }
  const idx = [...new Set([0, Math.floor((pts.length - 1) / 2), pts.length - 1])];
  idx.forEach(i => { g += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${esc(pts[i].l)}</text>`; });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const area = `${d}L${x(pts.length - 1)},${H - pb}L${x(0)},${H - pb}Z`;
  const last = pts[pts.length - 1]; const gid = 'g' + Math.random().toString(36).slice(2, 7);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>${g}<path d="${area}" fill="url(#${gid})"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>${pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.v)}" r="${pts.length > 30 ? 1.6 : 2.6}" fill="#0b0b0b" stroke="${color}" stroke-width="1.5"/>`).join('')}<text class="cv" x="${x(pts.length - 1)}" y="${y(last.v) - 9}" text-anchor="end">${fmtN(last.v)}${unit}</text></svg>`;
}
function barChart(pts, { color = GOLD } = {}) {
  const W = 340, H = 170, pl = 38, pr = 8, pt = 12, pb = 24;
  const mx = Math.max(1, ...pts.map(p => p.v));
  const bw = (W - pl - pr) / pts.length;
  let g = '';
  for (let k = 0; k <= 3; k++) { const v = mx * k / 3; const yy = pt + (H - pt - pb) * (1 - k / 3); g += `<line x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}" stroke="#262320"/><text x="${pl - 6}" y="${yy + 3}" text-anchor="end">${v >= 1000 ? fmtN(v / 1000) + 'k' : fmtN(v)}</text>`; }
  pts.forEach((p, i) => {
    const h = (H - pt - pb) * p.v / mx; const xx = pl + i * bw + bw * 0.2;
    g += `<rect x="${xx}" y="${H - pb - h}" width="${bw * 0.6}" height="${Math.max(h, 0)}" fill="${color}" opacity="${i === pts.length - 1 ? 1 : .45}"/>`;
    if (i % 2 === (pts.length - 1) % 2) g += `<text x="${xx + bw * 0.3}" y="${H - 6}" text-anchor="middle">${esc(p.l)}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}

/* ===================== views: shared ===================== */
const pageHead = (en, ja, right = '') => `<div class="page-head"><div><div class="eyebrow">${en}</div><h1>${ja}</h1></div>${right ? `<div class="head-r">${right}</div>` : ''}</div>`;

/* ===================== views: home ===================== */
function byDate(arr) { const m = {}; arr.forEach(w => { (m[w.date] = m[w.date] || []).push(w); }); return m; }
function wCard(w) {
  const st = wStats(w);
  return `<div class="card wcard" data-a="openWorkout" data-id="${w.id}">
    <div class="row"><b class="ct">${esc(w.title)}</b><span class="muted small num">${fmtMin(w.dur)}</span></div>
    <div class="tags">${partsOf(w.items).map(tag).join('')}</div>
    <div class="ex-list">${w.items.map(it => `${esc(getEx(it.exerciseId).name)} ${it.sets.length}セット`).join('　/　')}</div>
    <div class="meta"><span><em>VOLUME</em><b>${fmtN(st.vol)}</b>${S.data.settings.unit}</span><span><em>SETS</em><b>${st.sets}</b></span><span><em>EXERCISES</em><b>${st.exs}</b></span></div>
  </div>`;
}
function pCard(p) {
  const sets = p.items.reduce((a, it) => a + it.sets.length, 0);
  return `<div class="card pcard">
    <div class="row" data-a="planEdit" data-id="${p.id}"><div class="ct-wrap"><span class="badge">PLAN</span><b class="ct">${esc(p.title)}</b></div><span class="muted small">${p.items.length}種目・${sets}セット</span></div>
    <div class="tags">${partsOf(p.items).map(tag).join('')}</div>
    ${p.items.length ? `<div class="ex-list">${p.items.map(it => esc(getEx(it.exerciseId).name)).join('　/　')}</div>` : ''}
    <div class="pbtns"><button class="icon bordered" data-a="planMenu" data-id="${p.id}">${I.more}</button><button class="btn sm" data-a="planEdit" data-id="${p.id}">編集</button><button class="btn sm primary" data-a="planStart" data-id="${p.id}">${I.play}開始</button></div>
  </div>`;
}
function vHome() {
  const [y, mo] = S.ui.month;
  const first = new Date(y, mo, 1), days = new Date(y, mo + 1, 0).getDate();
  const bd = byDate(S.data.workouts), bp = byDate(S.data.plans); const td = today();
  let cells = WD.map((w, i) => `<div class="cal-wd ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${w}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) cells += '<div class="cal-cell empty"></div>';
  let mCount = 0, mVol = 0, mDur = 0;
  for (let d = 1; d <= days; d++) {
    const ds = dstr(new Date(y, mo, d)); const ws = bd[ds] || [], ps = bp[ds] || [];
    ws.forEach(w => { mCount++; mVol += wStats(w).vol; mDur += w.dur || 0; });
    const parts = [...new Set(ws.flatMap(w => partsOf(w.items)))];
    cells += `<button class="cal-cell ${ds === td ? 'today' : ''} ${ds === S.ui.sel ? 'sel' : ''} ${ws.length ? 'has' : ''} ${ps.length ? 'plan' : ''}" data-a="selDay" data-d="${ds}"><span>${d}</span><i class="dots">${parts.slice(0, 4).map(p => `<b style="background:${PART[p].color}"></b>`).join('')}</i></button>`;
  }
  const selWs = (bd[S.ui.sel] || []).sort((a, b) => (a.start || 0) - (b.start || 0));
  const selPs = bp[S.ui.sel] || [];
  const isFuture = S.ui.sel > td, isPast = S.ui.sel < td;
  const big = mVol >= 10000;
  return `
  <div class="brand"><span></span><b>MYTRAINING</b><span></span></div>
  <div class="cal-head">
    <button class="icon" data-a="month" data-v="-1">${I.left}</button>
    <div class="mh" data-a="monthToday"><b>${y}.${pad(mo + 1)}</b><small>${MONTH_EN[mo]}</small></div>
    <button class="icon" data-a="month" data-v="1">${I.right}</button>
  </div>
  <div class="cal">${cells}</div>
  <div class="cal-legend"><span><i class="lg-dot"></i>記録</span><span><i class="lg-plan"></i>予定</span></div>
  <div class="msum"><div><small>SESSIONS</small><b>${mCount}</b><em>回</em></div><div><small>VOLUME</small><b>${big ? fmtN(mVol / 1000) : fmtN(mVol)}</b><em>${big ? 't' : S.data.settings.unit}</em></div><div><small>TIME</small><b>${Math.round(mDur / 60)}</b><em>分</em></div></div>
  <div class="start-box">
    <button class="btn primary big" data-a="startEmpty">${I.play}ワークアウト開始</button>
    <button class="btn big" data-a="startFromRoutine">${I.folder}ルーティンから</button>
  </div>
  <div class="day-head"><div><div class="eyebrow">${isFuture ? 'SCHEDULE' : isPast ? 'HISTORY' : 'TODAY'}</div><b>${fmtDateJP(S.ui.sel)}</b></div>
    <div class="btns-r"><button class="btn sm" data-a="addPlan">${I.plus}予定</button>${isPast ? `<button class="btn sm" data-a="logPast">${I.plus}記録</button>` : ''}</div></div>
  ${selPs.map(pCard).join('')}
  ${selWs.map(wCard).join('')}
  ${!selPs.length && !selWs.length ? `<div class="card empty">${isFuture ? '予定はまだありません。<br>「＋予定」からトレーニング予定を登録できます' : 'この日の記録はありません'}</div>` : ''}`;
}

/* ===================== views: routines ===================== */
function rtRow(r, showFolder) {
  const sets = r.items.reduce((a, it) => a + it.sets.length, 0);
  return `<div class="rt-row" data-a="openRoutine" data-id="${r.id}">
    <div class="rt-main"><b>${esc(r.name)}</b>
    <div class="muted small">${showFolder ? esc(findF(r.folderId)?.name || '') + '　・　' : ''}${r.items.length}種目・${sets}セット</div>
    <div class="tags">${partsOf(r.items).map(tag).join('')}</div></div>
    <button class="play" data-a="startRoutine" data-id="${r.id}">${I.play}</button>
  </div>`;
}
function vRoutineList() {
  const q = S.ui.q.trim().toLowerCase();
  if (q) {
    const rs = S.data.routines.filter(r => r.name.toLowerCase().includes(q) || r.items.some(it => getEx(it.exerciseId).name.toLowerCase().includes(q)));
    return rs.length ? `<div class="folder">${rs.map(r => rtRow(r, true)).join('')}</div>` : '<div class="empty">見つかりません</div>';
  }
  if (!S.data.folders.length) return '<div class="card empty">フォルダがありません。「＋フォルダ」で作成しましょう</div>';
  return S.data.folders.map(f => {
    const rs = S.data.routines.filter(r => r.folderId === f.id);
    const open = !S.ui.closed[f.id];
    return `<div class="folder">
      <div class="folder-head" data-a="toggleFolder" data-id="${f.id}">
        <span class="chev ${open ? 'open' : ''}">${I.chev}</span><span class="fname">${esc(f.name)}</span><span class="count">${rs.length}</span>
        <button class="icon" data-a="folderMenu" data-id="${f.id}">${I.more}</button>
      </div>
      ${open ? (rs.length ? rs.map(r => rtRow(r)).join('') : `<div class="folder-empty"><span>ルーティンがありません</span><button class="btn sm" data-a="newRoutine" data-f="${f.id}">${I.plus}追加</button></div>`) : ''}
    </div>`;
  }).join('');
}
function vRoutineSort() {
  return `<div class="sort-note">${I.grip}<span>つまみを長押ししたまま上下にドラッグして、フォルダとルーティンの順番を入れ替えます</span></div>
  <div id="sort-folders">${S.data.folders.map(f => `<div class="s-folder" data-sid="${f.id}">
    <div class="s-head"><span class="handle">${I.grip}</span><b>${esc(f.name)}</b></div>
    <div class="s-list" data-folder="${f.id}">${S.data.routines.filter(r => r.folderId === f.id).map(r => `<div class="s-row" data-sid="${r.id}"><span class="handle">${I.grip}</span><span class="grow">${esc(r.name)}</span></div>`).join('') || '<div class="s-empty">ルーティンなし</div>'}</div>
  </div>`).join('')}</div>`;
}
function vRoutines() {
  if (S.ui.sortRt) return pageHead('ROUTINES', '並び替え', `<button class="btn sm primary" data-a="rtSortDone">完了</button>`) + vRoutineSort();
  return pageHead('ROUTINES', 'ルーティン', `<button class="icon bordered" data-a="rtSort" title="並び替え">${I.sort}</button><button class="icon bordered" data-a="newFolder" title="フォルダを追加">${I.folderPlus}</button><button class="btn sm primary" data-a="newRoutine">${I.plus}新規</button>`) +
    `<div class="search-wrap">${I.search}<input class="search" id="rt-q" type="search" placeholder="ルーティン名・種目名で検索" value="${esc(S.ui.q)}"></div>
    <div class="muted small count-line">${S.data.folders.length} フォルダ　・　${S.data.routines.length} ルーティン（保存数無制限）</div>
    <div id="rt-list">${vRoutineList()}</div>`;
}

/* ===================== views: stats ===================== */
function weekStart(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); return x; }
function vStats() {
  const ws = S.data.workouts; const u = S.data.settings.unit;
  const now = new Date(); const wk0 = dstr(weekStart(now)); const m0 = dstr(new Date(now.getFullYear(), now.getMonth(), 1));
  const cntW = ws.filter(w => w.date >= wk0).length, cntM = ws.filter(w => w.date >= m0).length;
  const weeks = [];
  for (let i = 11; i >= 0; i--) { const s = weekStart(now); s.setDate(s.getDate() - i * 7); const e = new Date(s); e.setDate(e.getDate() + 7); weeks.push({ s: dstr(s), e: dstr(e), l: `${s.getMonth() + 1}/${s.getDate()}`, v: 0 }); }
  ws.forEach(w => { const wk = weeks.find(k => w.date >= k.s && w.date < k.e); if (wk) wk.v += wStats(w).vol; });
  const d30 = new Date(); d30.setDate(d30.getDate() - 30); const s30 = dstr(d30);
  const pc = {}; let pmax = 1;
  ws.filter(w => w.date >= s30).forEach(w => w.items.forEach(it => { const p = getEx(it.exerciseId).part; pc[p] = (pc[p] || 0) + it.sets.length; }));
  Object.values(pc).forEach(v => pmax = Math.max(pmax, v));
  const us = usage(); const top = Object.entries(us).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const body = [...S.data.body].sort((a, b) => a.date.localeCompare(b.date));
  return pageHead('STATISTICS', '統計') + `
  <div class="msum"><div><small>THIS WEEK</small><b>${cntW}</b><em>回</em></div><div><small>THIS MONTH</small><b>${cntM}</b><em>回</em></div><div><small>TOTAL</small><b>${ws.length}</b><em>回</em></div></div>
  <div class="sec-title"><span>WEEKLY VOLUME</span><small>週別ボリューム（${u}）</small></div>
  <div class="card">${barChart(weeks)}</div>
  <div class="sec-title"><span>MUSCLE GROUPS</span><small>部位別セット数・過去30日</small></div>
  <div class="card">${PARTS.map(p => `<div class="bar-h"><span class="lbl">${p.name}</span><span class="trk"><i style="width:${(pc[p.id] || 0) / pmax * 100}%;background:${p.color}"></i></span><span class="v num">${pc[p.id] || 0}</span></div>`).join('')}</div>
  <div class="sec-title"><span>EXERCISES</span><small>種目別の記録</small><button class="btn sm" data-a="statPickEx">${I.search}検索</button></div>
  <div class="card list">${top.length ? top.map(([id, n]) => { const ex = getEx(id); return `<div class="list-row" data-a="openExStats" data-id="${id}">${dot(ex.part)}<div class="grow">${esc(ex.name)}</div><span class="muted small">${n}回</span><span class="muted">${I.chev}</span></div>`; }).join('') : '<div class="empty">まだ記録がありません</div>'}</div>
  <div class="sec-title"><span>BODY WEIGHT</span><small>体重</small><button class="btn sm primary" data-a="addBody">${I.plus}記録</button></div>
  <div class="card">${body.length ? lineChart(body.slice(-60).map(b => ({ l: fmtMD(b.date), v: num(b.w) })), { unit: 'kg' }) : '<div class="empty">体重を記録するとグラフが表示されます</div>'}
  ${body.slice(-5).reverse().map(b => `<div class="list-row" data-a="editBody" data-id="${b.id}"><div class="grow">${fmtDateJP(b.date)}</div><b class="num">${b.w}kg</b>${b.fat ? `<span class="muted small num">${b.fat}%</span>` : ''}</div>`).join('')}</div>`;
}

/* ===================== views: settings ===================== */
function syncStatusText() {
  if (!SY.token) return '未設定';
  if (syncing) return '同期中…';
  if (SY.err) return 'エラー：' + SY.err;
  if (SY.last) { const d = new Date(SY.last); return `同期済み ${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  return '未同期';
}
function vSettings() {
  const st = S.data.settings;
  const tgl = (k, l) => `<button class="set-item" data-a="toggleSet" data-k="${k}"><span>${l}</span><span class="tgl ${st[k] ? 'on' : ''}"></span></button>`;
  return pageHead('SETTINGS', '設定') + `
  <div class="sec-title"><span>CLOUD SYNC</span><small>クラウド同期</small></div>
  <div class="group">
    ${SY.token ? `
      <div class="set-item"><span>状態</span><span class="muted small" id="sync-st">${esc(syncStatusText())}</span></div>
      <button class="set-item" data-a="syncNowBtn"><span>今すぐ同期</span><span class="muted">${I.sync}</span></button>
      <button class="set-item" data-a="syncSetup"><span>接続設定を変更</span><span class="muted">${I.chev}</span></button>
      <button class="set-item danger" data-a="syncOff"><span>この端末の同期を解除</span></button>` : `
      <div class="set-note">Safari・ホーム画面のアプリ・別の端末のあいだで記録を共有します。アプリを削除しても、クラウドからデータを戻せます。</div>
      <button class="set-item" data-a="syncSetup"><span class="gold">同期を設定する</span><span class="muted">${I.chev}</span></button>`}
  </div>
  <div class="sec-title"><span>WORKOUT</span><small>トレーニング</small></div>
  <div class="group">
    <div class="set-item"><span>重量の単位</span><span class="seg"><button class="${st.unit === 'kg' ? 'on' : ''}" data-a="setUnit" data-v="kg">kg</button><button class="${st.unit === 'lb' ? 'on' : ''}" data-a="setUnit" data-v="lb">lb</button></span></div>
    <div class="set-item"><span>休憩タイマー（初期値）</span><select data-set="rest">${REST_OPTS.map(v => `<option value="${v}" ${v === +st.rest ? 'selected' : ''}>${fmtDur(v)}</option>`).join('')}</select></div>
    ${tgl('autoRest', 'セット完了で休憩タイマー開始')}
    ${tgl('sound', 'タイマー終了時のサウンド')}
    ${tgl('vibrate', 'タイマー終了時のバイブ')}
    <button class="set-item" data-a="openLib"><span>種目の管理</span><span class="muted small">${visibleEx().length}種目 ${I.chev}</span></button>
  </div>
  <div class="sec-title"><span>DATA</span><small>データ</small></div>
  <div class="group">
    <button class="set-item" data-a="exportData"><span>バックアップを書き出す（JSON）</span><span class="muted">${I.chev}</span></button>
    <button class="set-item" data-a="importData"><span>バックアップから復元</span><span class="muted">${I.chev}</span></button>
    <button class="set-item danger" data-a="resetAll"><span>すべてのデータを削除</span></button>
  </div>
  <p class="muted small foot-note">ルーティン ${S.data.routines.length}件　・　ワークアウト記録 ${S.data.workouts.length}件　・　予定 ${S.data.plans.length}件</p>`;
}

/* ===================== render ===================== */
function render() {
  const t = S.ui.tab;
  $('#main').innerHTML = t === 'home' ? vHome() : t === 'routines' ? vRoutines() : t === 'stats' ? vStats() : vSettings();
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  if (t === 'routines' && S.ui.sortRt) bindRoutineSort();
  renderActiveBar();
  const ae = document.activeElement;
  if (!(ae && ae.matches?.('input,textarea,select') && ae.closest('#editor'))) renderEditor();
  refreshSheets();
}
function bindRoutineSort() {
  sortable($('#sort-folders'), ids => { S.data.folders = ids.map(findF).filter(Boolean); save(); });
  document.querySelectorAll('#sort-folders .s-list').forEach(list => sortable(list, ids => {
    const fid = list.dataset.folder; const inF = ids.map(findR); let k = 0;
    S.data.routines = S.data.routines.map(r => r.folderId === fid ? inF[k++] : r); save();
  }));
}
function renderActiveBar() {
  const b = $('#activebar'); const a = S.data.active;
  document.body.classList.toggle('has-ab', !!(a && !S.editor));
  if (!a || S.editor) { b.hidden = true; b.innerHTML = ''; return; }
  b.hidden = false;
  b.innerHTML = `<button class="ab" data-a="resume"><span class="pulse"></span><div><small>IN PROGRESS</small><b>${esc(a.title)}</b></div><span class="ab-t num" id="ab-timer">${fmtDur((Date.now() - a.start) / 1000)}</span><span class="ab-go">${I.chev}</span></button>`;
}

/* ===================== editor ===================== */
const isTpl = mode => mode === 'routine' || mode === 'plan';
function edData() { const e = S.editor; if (!e) return null; return e.mode === 'live' ? S.data.active : e.draft; }
function edVol(D) { return wStats({ items: D.items.map(it => ({ ...it, sets: it.sets.filter(s => isTpl(S.editor.mode) || s.done) })) }).vol; }
function renderEditor() {
  const box = $('#editor'); const e = S.editor; const D = edData();
  if (!e || !D) { box.hidden = true; box.innerHTML = ''; document.body.classList.remove('noscroll', 'ed-open'); return; }
  const old = $('#ed-body'); const st = old ? old.scrollTop : 0;
  box.hidden = false; document.body.classList.add('noscroll', 'ed-open');
  box.innerHTML = edHead(e, D) + `<div id="ed-body" class="ed-body">${e.sort ? edSortBody(D) : edBody(e, D)}</div>`;
  const nb = $('#ed-body');
  if (e.scrollBottom) { nb.scrollTop = nb.scrollHeight; e.scrollBottom = false; } else nb.scrollTop = st;
  if (e.sort) sortable($('#ed-sort'), ids => { const prev = D.items; D.items = ids.map(i => prev[+i]); edChanged(); renderEditor(); });
}
function edHead(e, D) {
  const u = S.data.settings.unit;
  if (e.mode === 'live') return `<div class="ed-head">
    <button class="icon" data-a="edMin" title="最小化">${I.down}</button>
    <div class="ed-title"><input data-ed="title" value="${esc(D.title)}"><div class="ed-sub"><span class="lbl">TIME</span><b id="ed-timer" class="num">${fmtDur((Date.now() - D.start) / 1000)}</b><span class="lbl">VOLUME</span><b id="ed-vol" class="num">${fmtN(edVol(D))}${u}</b></div></div>
    <button class="icon" data-a="restManual" title="休憩タイマー">${I.timer}</button>
    <button class="btn primary sm" data-a="edFinish">完了</button></div>`;
  if (e.mode === 'edit') return `<div class="ed-head">
    <button class="icon" data-a="edClose">${I.close}</button>
    <div class="ed-title"><input data-ed="title" value="${esc(D.title)}"><div class="ed-sub"><input type="date" data-ed="date" value="${D.date}"><span class="lbl">TIME</span><input type="number" inputmode="numeric" data-ed="durMin" value="${D.durMin}" style="width:58px"><span>分</span></div></div>
    <button class="btn primary sm" data-a="edFinish">保存</button></div>`;
  if (e.mode === 'plan') return `<div class="ed-head">
    <button class="icon" data-a="edClose">${I.close}</button>
    <div class="ed-title"><input data-ed="title" value="${esc(D.title)}" placeholder="予定名"><div class="ed-sub"><span class="badge">PLAN</span><input type="date" data-ed="date" value="${D.date}"></div></div>
    <button class="btn primary sm" data-a="edSavePlan">保存</button></div>`;
  return `<div class="ed-head">
    <button class="icon" data-a="edClose">${I.close}</button>
    <div class="ed-title"><input data-ed="name" value="${esc(D.name)}" placeholder="ルーティン名"><div class="ed-sub"><span class="lbl">FOLDER</span><select data-ed="folderId">${S.data.folders.map(f => `<option value="${f.id}" ${f.id === D.folderId ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select></div></div>
    <button class="btn primary sm" data-a="edSaveRoutine">保存</button></div>`;
}
function edSortBody(D) {
  return `<div class="sort-note">${I.grip}<span>つまみを長押ししたまま上下にドラッグして、種目の順番を入れ替えます</span><button class="btn sm primary" data-a="edSortDone">完了</button></div>
  <div id="ed-sort" class="sort-list">${D.items.map((it, i) => { const ex = getEx(it.exerciseId); return `<div class="s-row big" data-sid="${i}"><span class="handle">${I.grip}</span>${dot(ex.part)}<span class="grow">${esc(ex.name)}</span><span class="muted small">${it.sets.length}セット</span></div>`; }).join('')}</div>`;
}
function edBody(e, D) {
  return (D.items.length > 1 ? `<div class="ed-tools"><span class="eyebrow">${D.items.length} EXERCISES</span><button class="btn sm" data-a="edSort">${I.sort}並び替え</button></div>` : '') +
    D.items.map((it, i) => exCard(e, D, it, i)).join('') +
    `<button class="btn block dashed big" data-a="edAddEx">${I.plus}種目を追加</button>
    <div class="gap"></div>
    <textarea class="ed-note" data-ed="note" placeholder="メモ">${esc(D.note || '')}</textarea>
    ${e.mode === 'live' ? `<button class="btn block ghost-danger" data-a="edDiscard">ワークアウトを破棄</button>` : ''}
    ${e.mode === 'edit' && !e.isNew ? `<button class="btn block ghost-danger" data-a="edDeleteW">この記録を削除</button>` : ''}
    ${e.mode === 'plan' && !e.isNew ? `<button class="btn block ghost-danger" data-a="edDeletePlan">この予定を削除</button>` : ''}`;
}
function exCard(e, D, it, i) {
  const ex = getEx(it.exerciseId); const F = fieldsOf(ex.type);
  const tpl = isTpl(e.mode);
  const prev = tpl ? null : prevSets(it.exerciseId, D.id, D.date);
  const cols = `38px ${tpl ? '' : '1.25fr '}${F.map(() => '1fr').join(' ')}${tpl ? '' : ' 44px'}`;
  const hdr = `<div class="set-row hdr" style="grid-template-columns:${cols}"><span>SET</span>${tpl ? '' : '<span>前回</span>'}${F.map(f => `<span>${f[1]}</span>`).join('')}${tpl ? '' : '<span></span>'}</div>`;
  const rows = it.sets.map((s, j) => {
    const p = prev?.[j];
    return `<div class="set-row ${!tpl && s.done ? 'done' : ''}" style="grid-template-columns:${cols}">
      <button class="set-no" data-a="edSetMenu" data-i="${i}" data-j="${j}">${j + 1}</button>
      ${tpl ? '' : `<span class="prev">${p ? setText(ex.type, p) : '—'}</span>`}
      ${F.map(([f]) => `<input class="set-in" inputmode="${f === 'w' || f === 'km' ? 'decimal' : 'numeric'}" data-i="${i}" data-j="${j}" data-f="${f}" value="${esc(s[f] ?? '')}" placeholder="${esc(p?.[f] ?? '')}" autocomplete="off">`).join('')}
      ${tpl ? '' : `<button class="chk ${s.done ? 'on' : ''}" data-a="edCheck" data-i="${i}" data-j="${j}">${I.check}</button>`}
    </div>`;
  }).join('');
  return `<div class="ex-card">
    <div class="ex-head"><span class="ex-bar" style="background:${PART[ex.part]?.color}"></span><div class="ex-name" data-a="openExStats" data-id="${ex.id}">${esc(ex.name)}<small>${PART[ex.part]?.name || ''}${prev ? '　・　前回 ' + prev.length + 'セット' : ''}</small></div><button class="icon" data-a="edExMenu" data-i="${i}">${I.more}</button></div>
    ${hdr}${rows}
    <div class="ex-actions"><button class="btn" data-a="edDelSet" data-i="${i}">セット削除</button><button class="btn" data-a="edAddSet" data-i="${i}">${I.plus}セット追加</button></div>
  </div>`;
}
function edChanged() { if (S.editor.mode === 'live') saveSoon(); else S.editor.dirty = true; }
function newSetsFor(exId, mode, D) {
  const prev = prevSets(exId, D?.id, D?.date);
  if (isTpl(mode)) return prev ? prev.map(s => setsOnly(s)) : [{}, {}, {}];
  return Array.from({ length: prev?.length || 3 }, () => ({ done: false }));
}
function fillFromPrev(D, i, j) {
  const it = D.items[i]; const s = it.sets[j]; const ex = getEx(it.exerciseId);
  const prev = prevSets(it.exerciseId, D.id, D.date);
  fieldsOf(ex.type).forEach(([f]) => {
    if (s[f] === undefined || s[f] === '') { const v = prev?.[j]?.[f] ?? it.sets[j - 1]?.[f]; if (v !== undefined && v !== '') s[f] = v; }
  });
}
function startWorkout(src) {
  const go = () => {
    const d = new Date();
    S.data.active = {
      id: uid(), start: Date.now(), date: today(),
      title: src?.title || `${d.getMonth() + 1}月${d.getDate()}日のワークアウト`,
      items: (src?.items || []).map(it => ({ exerciseId: it.exerciseId, sets: it.sets.map(s => ({ ...setsOnly(s), done: false })) })),
      note: '', routineId: src?.routineId || null, planId: src?.planId || null,
    };
    save(); closeAllSheets(); S.editor = { mode: 'live' }; render();
  };
  if (S.data.active) {
    uiMenu('進行中のワークアウトがあります', [{ label: '進行中のワークアウトを再開', value: 'resume' }, { label: '破棄して新しく開始', value: 'new', danger: true }]).then(v => {
      if (v === 'resume') { closeAllSheets(); S.editor = { mode: 'live' }; render(); }
      else if (v === 'new') { S.data.active = null; go(); }
    });
  } else go();
}
function startRoutine(id) { const r = findR(id); if (r) startWorkout({ title: r.name, items: r.items, routineId: r.id }); }
function openEditWorkout(w, isNew) {
  closeAllSheets();
  S.editor = { mode: 'edit', isNew, draft: { ...clone(w), durMin: Math.round((w.dur || 0) / 60) } };
  render();
}
function openRoutineEditor(r, isNew) { closeAllSheets(); S.editor = { mode: 'routine', isNew, draft: clone(r) }; render(); }
function openPlanEditor(p, isNew) { closeAllSheets(); S.editor = { mode: 'plan', isNew, draft: clone(p) }; render(); }
async function edClose() {
  if (S.editor.dirty && !(await uiConfirm('変更を破棄しますか？', '破棄', true))) return;
  S.editor = null; render();
}

/* finishing */
function bestBefore(exId, excludeId) {
  let mw = 0, me = 0, has = false;
  S.data.workouts.forEach(w => { if (w.id === excludeId) return; w.items.forEach(it => { if (it.exerciseId !== exId) return; has = true; it.sets.forEach(s => { mw = Math.max(mw, num(s.w)); me = Math.max(me, e1rm(num(s.w), num(s.r))); }); }); });
  return { mw, me, has };
}
function findPRs(w) {
  const out = [];
  w.items.forEach(it => {
    if (getEx(it.exerciseId).type !== 'wr') return;
    const b = bestBefore(it.exerciseId, w.id); if (!b.has) return;
    let mw = 0, me = 0; it.sets.forEach(s => { mw = Math.max(mw, num(s.w)); me = Math.max(me, e1rm(num(s.w), num(s.r))); });
    const u = S.data.settings.unit, n = getEx(it.exerciseId).name;
    if (mw > b.mw) out.push({ n, k: '最大重量', v: `${fmtN(mw)}${u}` });
    else if (me > b.me) out.push({ n, k: '推定1RM', v: `${fmtN(me)}${u}` });
  });
  return out;
}
async function edFinish() {
  const e = S.editor, D = edData();
  if (!D.items.length) {
    if (e.mode === 'live') { if (await uiConfirm('種目がありません。ワークアウトを破棄しますか？', '破棄', true)) discardActive(); }
    else uiAlert('種目を追加してください');
    return;
  }
  let undone = 0; D.items.forEach(it => it.sets.forEach(s => { if (!s.done) undone++; }));
  let mode = 'done';
  if (undone) {
    mode = await uiMenu(`未完了のセットが${undone}件あります`, [{ label: 'すべて完了にして保存', value: 'all' }, { label: '完了したセットのみ保存', value: 'done' }]);
    if (!mode) return;
  } else if (e.mode === 'live' && !(await uiConfirm('ワークアウトを完了しますか？', '完了'))) return;
  if (mode === 'all') D.items.forEach((it, i) => it.sets.forEach((s, j) => { if (!s.done) { fillFromPrev(D, i, j); s.done = true; } }));
  const items = D.items.map(it => ({ exerciseId: it.exerciseId, sets: it.sets.filter(s => s.done).map(s => ({ ...setsOnly(s), done: true })) })).filter(it => it.sets.length);
  if (!items.length) { uiAlert('完了したセットがありません'); return; }
  let w;
  if (e.mode === 'live') {
    w = { id: D.id, date: D.date, start: D.start, dur: Math.round((Date.now() - D.start) / 1000), title: D.title || 'ワークアウト', items, note: D.note || '', routineId: D.routineId || null };
    S.data.workouts.push(w); S.data.active = null; S.rest = null; renderRest();
    if (D.planId) S.data.plans = S.data.plans.filter(p => p.id !== D.planId);
  } else {
    const o = new Date(D.start || Date.now()); const nd = parseD(D.date); nd.setHours(o.getHours(), o.getMinutes());
    w = { id: D.id, date: D.date, start: nd.getTime(), dur: Math.max(0, num(D.durMin)) * 60, title: D.title || 'ワークアウト', items, note: D.note || '', routineId: D.routineId || null };
    const k = S.data.workouts.findIndex(x => x.id === w.id);
    if (k >= 0) S.data.workouts[k] = w; else S.data.workouts.push(w);
  }
  save(); S.editor = null; S.ui.sel = w.date; const wd = parseD(w.date); S.ui.month = [wd.getFullYear(), wd.getMonth()];
  render();
  if (e.mode === 'live') {
    const prs = findPRs(w);
    const r = w.routineId && findR(w.routineId);
    if (r && JSON.stringify(r.items) !== JSON.stringify(tplItems(items))) {
      if (await uiConfirm(`ルーティン「${r.name}」を今回の内容（種目・重量・回数）で更新しますか？`, '更新')) {
        r.items = tplItems(items); save(); toast('ルーティンを更新しました');
      }
    }
    showSummary(w, prs);
  } else toast('保存しました');
}
function showSummary(w, prs) {
  const st = wStats(w);
  openSheet(() => `<div class="summary-hero"><div class="laurel">${I.trophy}</div><div class="eyebrow">WORKOUT COMPLETE</div><h2>お疲れさまでした</h2><div class="muted small">${esc(w.title)}　・　${fmtDateJP(w.date)}</div></div>
    <div class="msum"><div><small>TIME</small><b>${Math.round(w.dur / 60)}</b><em>分</em></div><div><small>VOLUME</small><b>${fmtN(st.vol)}</b><em>${S.data.settings.unit}</em></div><div><small>SETS</small><b>${st.sets}</b></div></div>
    ${prs.length ? `<div class="sec-title"><span>PERSONAL RECORDS</span><small>自己ベスト更新</small></div>${prs.map(p => `<div class="pr">${I.trophy}<div class="grow"><b>${esc(p.n)}</b><small>${p.k}</small></div><span class="num">${p.v}</span></div>`).join('')}` : ''}
    <div class="sh-foot"><button class="btn primary block big" data-a="closeSheet">閉じる</button></div>`);
}
function discardActive() { S.data.active = null; S.rest = null; save(); S.editor = null; renderRest(); render(); }

/* ===================== rest timer ===================== */
let actx = null;
function ensureAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { } }
function beep() {
  if (!S.data.settings.sound || !actx) return;
  try {
    [0, 0.28, 0.56].forEach(t => {
      const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(actx.destination);
      const t0 = actx.currentTime + t; g.gain.setValueAtTime(0.35, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22); o.start(t0); o.stop(t0 + 0.24);
    });
  } catch (e) { }
}
function startRest(sec) { ensureAudio(); S.rest = { end: Date.now() + sec * 1000, total: sec }; renderRest(); }
function renderRest() {
  const r = $('#rest');
  if (!S.rest) { r.hidden = true; r.innerHTML = ''; return; }
  r.hidden = false;
  r.innerHTML = `<div class="rest-in"><div class="rest-prog"></div><div class="rest-row"><span class="lbl">REST</span><b id="rest-t" class="num"></b><button data-a="restAdj" data-v="-10">−10</button><button data-a="restAdj" data-v="10">＋10</button><button data-a="restSkip">スキップ</button></div></div>`;
  tickRest();
}
function tickRest() {
  if (!S.rest) return;
  const left = (S.rest.end - Date.now()) / 1000;
  if (left <= 0) {
    S.rest = null; renderRest(); beep();
    if (S.data.settings.vibrate && navigator.vibrate) navigator.vibrate([250, 120, 250]);
    toast('休憩終了　次のセットへ'); return;
  }
  const t = $('#rest-t'); if (t) t.textContent = fmtDur(Math.ceil(left));
  const p = $('.rest-prog'); if (p) p.style.width = (left / S.rest.total * 100) + '%';
}
setInterval(() => {
  const a = S.data.active;
  if (a) { const t = fmtDur((Date.now() - a.start) / 1000); const e1 = $('#ed-timer'); if (e1) e1.textContent = t; const e2 = $('#ab-timer'); if (e2) e2.textContent = t; }
  tickRest();
}, 250);

/* ===================== exercise picker ===================== */
function chips(st, act) { return `<div class="chips">${[{ id: 'all', name: 'すべて' }, ...PARTS].map(p => `<button class="chip ${st.part === p.id ? 'on' : ''}" data-a="${act}" data-v="${p.id}">${p.name}</button>`).join('')}</div>`; }
function pickExercises(cb, { multi = true, title = '種目を選択' } = {}) {
  openSheet(h => {
    const st = h.state;
    return `<div class="sh-head"><h2>${esc(title)}</h2><button class="btn sm" data-a="pkNew">${I.plus}新しい種目</button></div>
      <div class="search-wrap">${I.search}<input id="pk-q" class="search" type="search" placeholder="種目名で検索" value="${esc(st.q)}" autocomplete="off"></div>
      ${chips(st, 'pkPart')}
      <div id="pk-list">${pkList(st)}</div>
      ${multi ? `<div class="sh-foot"><button class="btn primary block big" data-a="pkDone" ${st.sel.length ? '' : 'disabled'}>${st.sel.length ? st.sel.length + '種目を追加' : '種目を選んでください'}</button></div>` : ''}`;
  }, { full: true, state: { q: '', part: 'all', sel: [], multi, cb } });
}
function pkList(st) {
  const q = st.q.trim().toLowerCase(); const us = usage();
  let list = visibleEx().filter(e => (st.part === 'all' || e.part === st.part) && (!q || e.name.toLowerCase().includes(q)));
  const order = new Map(S.data.exercises.map((e, i) => [e.id, i]));
  list.sort((a, b) => (us[b.id] || 0) - (us[a.id] || 0) || order.get(a.id) - order.get(b.id));
  if (!list.length) return '<div class="empty">見つかりません。「新しい種目」から追加できます</div>';
  return list.map(e => `<div class="pk-row ${st.sel.includes(e.id) ? 'on' : ''}" data-a="pkToggle" data-id="${e.id}">${dot(e.part)}<div class="grow"><div>${esc(e.name)}</div><small>${PART[e.part]?.name}　・　${TYPES[e.type]}${us[e.id] ? '　・　' + us[e.id] + '回' : ''}</small></div>${st.multi ? `<span class="pk-chk">${I.check}</span>` : ''}</div>`).join('');
}
function exForm(ex) {
  return new Promise(res => {
    const el = dlg(`<h3>${ex ? '種目を編集' : '新しい種目'}</h3>
      <label>名前<input id="xf-name" value="${esc(ex?.name || '')}" autocomplete="off"></label>
      <label>部位<select id="xf-part">${PARTS.map(p => `<option value="${p.id}" ${ex?.part === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label>
      <label>記録タイプ<select id="xf-type">${Object.entries(TYPES).map(([k, v]) => `<option value="${k}" ${(ex?.type || 'wr') === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <div class="dlg-btns">${ex ? '<button class="btn ghost-danger" data-r="del">削除</button>' : ''}<button class="btn" data-r="cancel">キャンセル</button><button class="btn primary" data-r="ok">保存</button></div>`);
    setTimeout(() => $('#xf-name', el).focus(), 60);
    el.addEventListener('click', ev => {
      const b = ev.target.closest('[data-r]'); if (!b && ev.target !== el) return; ev.stopPropagation();
      const r = b?.dataset.r || 'cancel';
      if (r === 'ok') { const name = $('#xf-name', el).value.trim(); if (!name) { $('#xf-name', el).focus(); return; } closeDlg(el); res({ name, part: $('#xf-part', el).value, type: $('#xf-type', el).value }); }
      else { closeDlg(el); res(r === 'del' ? 'delete' : null); }
    });
  });
}
async function createExercise() {
  const r = await exForm(null); if (!r || r === 'delete') return null;
  const ex = { id: uid(), ...r, custom: true }; S.data.exercises.push(ex); save(); toast('種目を追加しました'); return ex;
}
function exUsed(id) {
  const has = arr => arr.some(x => x.items.some(i => i.exerciseId === id));
  return has(S.data.workouts) || has(S.data.routines) || has(S.data.plans) || S.data.active?.items.some(i => i.exerciseId === id);
}
async function editExercise(id) {
  const ex = S.data.exercises.find(e => e.id === id); if (!ex) return;
  const r = await exForm(ex); if (!r) return;
  if (r === 'delete') {
    if (!(await uiConfirm(`「${ex.name}」を削除しますか？\n（過去の記録は残ります）`, '削除', true))) return;
    if (exUsed(id)) ex.hidden = true; else S.data.exercises.splice(S.data.exercises.indexOf(ex), 1);
  } else Object.assign(ex, r);
  save(); render();
}
const libList = list => list.map(e => `<div class="pk-row" data-a="libEdit" data-id="${e.id}">${dot(e.part)}<div class="grow"><div>${esc(e.name)}</div><small>${PART[e.part]?.name}　・　${TYPES[e.type]}</small></div><span class="muted">${I.chev}</span></div>`).join('') || '<div class="empty">見つかりません</div>';
const libFilter = st => { const q = st.q.trim().toLowerCase(); return visibleEx().filter(e => (st.part === 'all' || e.part === st.part) && (!q || e.name.toLowerCase().includes(q))); };
function openLib() {
  openSheet(h => `<div class="sh-head"><h2>種目の管理</h2><button class="btn sm primary" data-a="libNew">${I.plus}新しい種目</button></div>
      <div class="search-wrap">${I.search}<input id="lib-q" class="search" type="search" placeholder="検索" value="${esc(h.state.q)}"></div>
      ${chips(h.state, 'libPart')}
      <div id="lib-list">${libList(libFilter(h.state))}</div>`, { full: true, state: { q: '', part: 'all' } });
}

/* ===================== sheets ===================== */
function sheetWorkout(id) {
  openSheet(() => {
    const w = findW(id); if (!w) return null; const st = wStats(w);
    return `<div class="sh-head"><div><div class="eyebrow">WORKOUT</div><h2>${esc(w.title)}</h2><div class="muted small">${fmtDateJP(w.date)}${w.start ? '　' + new Date(w.start).toTimeString().slice(0, 5) : ''}</div></div><button class="icon" data-a="closeSheet">${I.close}</button></div>
    <div class="msum"><div><small>TIME</small><b>${Math.round((w.dur || 0) / 60)}</b><em>分</em></div><div><small>VOLUME</small><b>${fmtN(st.vol)}</b><em>${S.data.settings.unit}</em></div><div><small>SETS</small><b>${st.sets}</b></div></div>
    ${w.items.map(it => { const ex = getEx(it.exerciseId); return `<div class="d-ex"><div class="d-ex-h" data-a="openExStats" data-id="${ex.id}">${dot(ex.part)}${esc(ex.name)}</div>${it.sets.map((s, j) => `<div class="d-set"><i>${j + 1}</i><span class="num">${setText(ex.type, s)}</span></div>`).join('')}</div>`; }).join('')}
    ${w.note ? `<div class="card note">${esc(w.note)}</div>` : ''}
    <div class="btns" style="margin-top:10px"><button class="btn primary" data-a="wRepeat" data-id="${w.id}">${I.play}もう一度行う</button><button class="btn" data-a="wEdit" data-id="${w.id}">編集</button></div>
    <div class="btns" style="margin-top:8px"><button class="btn" data-a="wToRoutine" data-id="${w.id}">ルーティンに保存</button><button class="btn ghost-danger" data-a="wDelete" data-id="${w.id}">削除</button></div>`;
  });
}
function sheetRoutine(id) {
  openSheet(() => {
    const r = findR(id); if (!r) return null;
    const last = sortedWorkouts().find(w => w.routineId === r.id);
    return `<div class="sh-head"><div><div class="eyebrow">${esc(findF(r.folderId)?.name || 'ROUTINE')}</div><h2>${esc(r.name)}</h2><div class="muted small">${last ? '最終実施 ' + fmtDateJP(last.date) : '未実施'}</div></div><button class="icon" data-a="routineMenu" data-id="${r.id}">${I.more}</button></div>
    ${r.items.length ? r.items.map(it => { const ex = getEx(it.exerciseId); return `<div class="d-ex"><div class="d-ex-h">${dot(ex.part)}${esc(ex.name)}<span class="muted small" style="margin-left:auto;font-weight:400">${it.sets.length}セット</span></div>${it.sets.map((s, j) => `<div class="d-set"><i>${j + 1}</i><span class="num">${Object.keys(setsOnly(s)).length ? setText(ex.type, s) : '—'}</span></div>`).join('')}</div>`; }).join('') : '<div class="empty">種目がありません</div>'}
    ${r.note ? `<div class="card note">${esc(r.note)}</div>` : ''}
    <div class="sh-foot btns"><button class="btn" data-a="routineEdit" data-id="${r.id}">編集</button><button class="btn" data-a="routineToPlan" data-id="${r.id}">予定に追加</button><button class="btn primary" data-a="startRoutine" data-id="${r.id}">${I.play}開始</button></div>`;
  });
}
function chooseRoutine(title, cb) {
  openSheet(() => `<div class="sh-head"><h2>${esc(title)}</h2><button class="icon" data-a="closeSheet">${I.close}</button></div>` +
    S.data.folders.map(f => { const rs = S.data.routines.filter(r => r.folderId === f.id); return rs.length ? `<div class="sec-title"><span>${esc(f.name)}</span></div><div class="folder">${rs.map(r => `<div class="rt-row" data-a="rtChoose" data-id="${r.id}"><div class="rt-main"><b>${esc(r.name)}</b><div class="tags">${partsOf(r.items).map(tag).join('')}</div></div><span class="muted">${I.chev}</span></div>`).join('')}</div>` : ''; }).join(''),
    { full: true, state: { cb } });
}
function exHistory(exId) {
  const out = [];
  [...S.data.workouts].sort((a, b) => a.date.localeCompare(b.date) || (a.start || 0) - (b.start || 0)).forEach(w => {
    w.items.forEach(it => {
      if (it.exerciseId !== exId) return;
      const s = it.sets; let maxw = 0, best = 0, vol = 0, reps = 0, maxr = 0, maxs = 0, m = 0, km = 0;
      s.forEach(x => { const W = num(x.w), R = num(x.r); maxw = Math.max(maxw, W); best = Math.max(best, e1rm(W, R)); vol += W * R; reps += R; maxr = Math.max(maxr, R); maxs = Math.max(maxs, num(x.s)); m += num(x.m); km += num(x.km); });
      out.push({ w, sets: s, maxw, e1rm: best, vol, reps, maxr, maxs, m, km });
    });
  });
  return out;
}
function sheetExercise(exId) {
  openSheet(h => {
    const ex = getEx(exId); const hist = exHistory(exId); const u = S.data.settings.unit;
    const M = { wr: [['e1rm', '推定1RM', u], ['maxw', '最大重量', u], ['vol', 'ボリューム', u]], r: [['maxr', '最大回数', '回'], ['reps', '合計回数', '回']], sec: [['maxs', '最長時間', '秒']], cardio: [['m', '時間', '分'], ['km', '距離', 'km']] }[ex.type] || [];
    const met = M.find(m => m[0] === h.state.m) || M[0];
    const mx = k => hist.reduce((a, x) => Math.max(a, x[k]), 0);
    let recs = '';
    if (ex.type === 'wr') {
      let bestSet = null; hist.forEach(x => x.sets.forEach(s => { if (!bestSet || e1rm(num(s.w), num(s.r)) > e1rm(num(bestSet.w), num(bestSet.r))) bestSet = s; }));
      recs = `<div><small>ESTIMATED 1RM</small><b>${fmtN(mx('e1rm'))}<em>${u}</em></b></div><div><small>MAX WEIGHT</small><b>${fmtN(mx('maxw'))}<em>${u}</em></b></div><div><small>BEST SET</small><b>${bestSet ? setText('wr', bestSet) : '—'}</b></div><div><small>BEST VOLUME</small><b>${fmtN(mx('vol'))}<em>${u}</em></b></div>`;
    } else if (ex.type === 'r') recs = `<div><small>MAX REPS</small><b>${mx('maxr')}<em>回</em></b></div><div><small>BEST TOTAL</small><b>${mx('reps')}<em>回</em></b></div>`;
    else if (ex.type === 'sec') recs = `<div><small>LONGEST</small><b>${mx('maxs')}<em>秒</em></b></div><div><small>SESSIONS</small><b>${hist.length}<em>回</em></b></div>`;
    else recs = `<div><small>LONGEST</small><b>${mx('m')}<em>分</em></b></div><div><small>DISTANCE</small><b>${fmtN(mx('km'))}<em>km</em></b></div>`;
    return `<div class="sh-head"><div><div class="eyebrow">${PART[ex.part]?.name}　・　${TYPES[ex.type]}</div><h2>${esc(ex.name)}</h2><div class="muted small">${hist.length}回実施</div></div><button class="icon" data-a="closeSheet">${I.close}</button></div>
      <div class="rec-grid">${recs}</div>
      ${M.length > 1 ? `<div class="seg" style="margin-bottom:10px">${M.map(m => `<button class="${m === met ? 'on' : ''}" data-a="exMetric" data-v="${m[0]}">${m[1]}</button>`).join('')}</div>` : ''}
      <div class="card">${met ? lineChart(hist.slice(-40).map(x => ({ l: fmtMD(x.w.date), v: x[met[0]] })), { unit: met[2] }) : ''}</div>
      <div class="sec-title"><span>HISTORY</span><small>履歴</small></div>
      ${hist.length ? [...hist].reverse().slice(0, 50).map(x => `<div class="d-ex"><div class="d-ex-h"><span>${fmtDateJP(x.w.date)}</span><span class="muted small" style="margin-left:auto;font-weight:400">${esc(x.w.title)}</span></div>${x.sets.map((s, j) => `<div class="d-set"><i>${j + 1}</i><span class="num">${setText(ex.type, s)}</span>${ex.type === 'wr' ? `<span class="muted small num" style="margin-left:auto">1RM ${fmtN(e1rm(num(s.w), num(s.r)))}</span>` : ''}</div>`).join('')}</div>`).join('') : '<div class="empty">まだ記録がありません</div>'}`;
  }, { full: true, state: { m: null } });
}
function bodyForm(b) {
  return new Promise(res => {
    const el = dlg(`<h3>${b ? '体重記録を編集' : '体重を記録'}</h3>
      <label>日付<input type="date" id="bf-d" value="${b?.date || today()}"></label>
      <label>体重（kg）<input id="bf-w" inputmode="decimal" value="${esc(b?.w || '')}"></label>
      <label>体脂肪率（%）任意<input id="bf-f" inputmode="decimal" value="${esc(b?.fat || '')}"></label>
      <div class="dlg-btns">${b ? '<button class="btn ghost-danger" data-r="del">削除</button>' : ''}<button class="btn" data-r="cancel">キャンセル</button><button class="btn primary" data-r="ok">保存</button></div>`);
    setTimeout(() => $('#bf-w', el).focus(), 60);
    el.addEventListener('click', ev => {
      const bt = ev.target.closest('[data-r]'); if (!bt && ev.target !== el) return; ev.stopPropagation();
      const r = bt?.dataset.r || 'cancel';
      if (r === 'ok') { const w = num($('#bf-w', el).value); if (!w) { $('#bf-w', el).focus(); return; } closeDlg(el); res({ date: $('#bf-d', el).value || today(), w: r1(w), fat: num($('#bf-f', el).value) ? r1(num($('#bf-f', el).value)) : '' }); }
      else { closeDlg(el); res(r === 'del' ? 'delete' : null); }
    });
  });
}

/* ===================== folders ===================== */
async function chooseFolder(title = 'フォルダを選択', exclude) {
  const items = S.data.folders.filter(f => f.id !== exclude).map(f => ({ label: f.name, value: f.id }));
  items.push({ label: '＋ 新しいフォルダ', value: '__new' });
  const v = await uiMenu(title, items); if (!v) return null;
  if (v === '__new') return await newFolder();
  return v;
}
async function newFolder() {
  const name = await uiPrompt('新しいフォルダ', '', '例：胸の日、PPL、自宅トレ'); if (!name) return null;
  const f = { id: uid(), name }; S.data.folders.push(f); save(); render(); return f.id;
}
function ensureFolder() { if (!S.data.folders.length) { S.data.folders.push({ id: 'f_default', name: 'マイルーティン' }); save(); } return S.data.folders[0].id; }

/* ===================== cloud sync (GitHub private repo) ===================== */
let SY = loadJSON(SYNCKEY);
const saveSY = () => { try { localStorage.setItem(SYNCKEY, JSON.stringify(SY)); } catch (e) { } };
const FILE = 'mytraining.json';
let syncing = false, syncAgain = false, syncT = null;
function scheduleSync() { if (!SY.token) return; clearTimeout(syncT); syncT = setTimeout(() => syncNow(), 2500); }
function gh(path, opt = {}) {
  return fetch('https://api.github.com' + path, {
    ...opt, cache: 'no-store',
    headers: { Authorization: 'Bearer ' + SY.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opt.headers || {}) },
  });
}
const b64 = s => { const b = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(bin); };
function ghErr(r, what) {
  if (r.status === 401) return new Error('トークンが無効か期限切れです');
  if (r.status === 403 || r.status === 404) return new Error(`${what}にアクセスできません（リポジトリ名と権限を確認してください）`);
  return new Error(`${what}でエラーが発生しました（${r.status}）`);
}
async function ghPull() {
  const ls = await gh(`/repos/${SY.owner}/${SY.repo}/contents/`);
  if (ls.status === 404) { const t = await ls.json().catch(() => ({})); if (/empty/i.test(t.message || '')) return null; throw ghErr(ls, 'リポジトリ'); }
  if (!ls.ok) throw ghErr(ls, 'リポジトリ');
  const ent = (await ls.json()).find(e => e.name === FILE); if (!ent) return null;
  const r = await gh(`/repos/${SY.owner}/${SY.repo}/contents/${FILE}`, { headers: { Accept: 'application/vnd.github.raw+json' } });
  if (!r.ok) throw ghErr(r, 'データ');
  return { sha: ent.sha, data: JSON.parse(await r.text()) };
}
async function ghPush(str, sha) {
  const r = await gh(`/repos/${SY.owner}/${SY.repo}/contents/${FILE}`, { method: 'PUT', body: JSON.stringify({ message: 'sync ' + new Date().toISOString(), content: b64(str), ...(sha ? { sha } : {}) }) });
  if (r.status === 409 || r.status === 422) return false;
  if (!r.ok) throw ghErr(r, '保存');
  return true;
}
function merge(L, R) {
  R = normalize(R);
  const out = { ...L, deleted: { ...L.deleted } };
  Object.entries(R.deleted).forEach(([k, t]) => { out.deleted[k] = Math.max(out.deleted[k] || 0, t); });
  const NO = (R.orderU || 0) > (L.orderU || 0) ? R : L, OO = NO === R ? L : R;
  COLS.forEach(c => {
    const m = new Map();
    [...NO[c], ...OO[c]].forEach(it => { const ex = m.get(it.id); if (!ex || (it.u || 0) > (ex.u || 0)) m.set(it.id, it); });
    const ids = [...new Set([...NO[c].map(i => i.id), ...OO[c].map(i => i.id)])];
    out[c] = ids.map(id => m.get(id)).filter(it => !((out.deleted[c + ':' + it.id] || 0) > (it.u || 0)));
  });
  if ((R.settingsU || 0) > (L.settingsU || 0)) { out.settings = R.settings; out.settingsU = R.settingsU; }
  if ((R.activeU || 0) > (L.activeU || 0)) { out.active = R.active; out.activeU = R.activeU; }
  out.orderU = Math.max(L.orderU || 0, R.orderU || 0);
  // drop empty duplicate folders that were created separately on each device (e.g. the default one)
  const byName = {}; out.folders.forEach(f => (byName[f.name] = byName[f.name] || []).push(f));
  Object.values(byName).forEach(g => {
    if (g.length < 2) return;
    const used = g.filter(f => out.routines.some(r => r.folderId === f.id)); const keep = used.length ? used : [g[0]];
    g.forEach(f => { if (!keep.includes(f)) { out.folders = out.folders.filter(x => x !== f); out.deleted['folders:' + f.id] = Date.now(); } });
  });
  return out;
}
async function syncNow(manual) {
  if (!SY.token || !SY.owner) return;
  if (!navigator.onLine && !manual) return;
  if (syncing) { syncAgain = true; return; }
  syncing = true; updSyncSt();
  try {
    flushSave();
    for (let attempt = 0; attempt < 3; attempt++) {
      const remote = await ghPull();
      const before = JSON.stringify(S.data);
      const merged = remote ? merge(S.data, remote.data) : S.data;
      if (JSON.stringify(merged) !== before) {
        S.data = merged; exCache = null; rebuildSnap(); persist();
        if (S.editor?.mode === 'live' && !S.data.active) S.editor = null;
        render();
      }
      const str = JSON.stringify(S.data);
      if (remote && str === JSON.stringify(remote.data)) break;
      if (await ghPush(str, remote?.sha)) break;
    }
    SY.last = Date.now(); SY.err = ''; saveSY();
    if (manual) toast('同期しました');
  } catch (e) {
    SY.err = e.message || '通信エラー'; saveSY();
    if (manual) uiAlert('同期できませんでした：' + SY.err);
  }
  syncing = false; updSyncSt();
  if (syncAgain) { syncAgain = false; syncNow(); }
}
function updSyncSt() { const el = $('#sync-st'); if (el) el.textContent = syncStatusText(); }
function syncSetupDialog() {
  return new Promise(res => {
    const el = dlg(`<h3>クラウド同期の設定</h3>
      <p class="muted small" style="margin:0 0 10px">GitHubの非公開リポジトリに記録を保存します。Safari・ホーム画面のアプリ・他の端末で同じトークンを入力すると、記録が共有されます。</p>
      <ol class="steps">
        <li><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">トークン作成ページ</a>を開く</li>
        <li>Token name に「MyTraining」、Expiration に「No expiration」（または長めの期限）を設定</li>
        <li>Repository access で「Only select repositories」→ <b>mytraining-data</b> を選択</li>
        <li>Permissions の「Contents」を <b>Read and write</b> にして作成</li>
        <li>表示されたトークン（github_pat_…）をコピーして下に貼り付け</li>
      </ol>
      <label>トークン<input id="sy-token" type="password" autocomplete="off" placeholder="github_pat_..." value="${esc(SY.token || '')}"></label>
      <label>保存先リポジトリ名<input id="sy-repo" autocomplete="off" value="${esc(SY.repo || 'mytraining-data')}"></label>
      <div class="dlg-btns"><button class="btn" data-r="0">キャンセル</button><button class="btn primary" data-r="1">接続</button></div>`);
    el.addEventListener('click', ev => {
      const b = ev.target.closest('[data-r]'); if (!b && ev.target !== el) return; ev.stopPropagation();
      if (b?.dataset.r === '1') { const t = $('#sy-token', el).value.trim(), r = $('#sy-repo', el).value.trim(); if (!t) { $('#sy-token', el).focus(); return; } closeDlg(el); res({ token: t, repo: r || 'mytraining-data' }); }
      else { closeDlg(el); res(null); }
    });
  });
}

/* ===================== actions ===================== */
const A = {
  tab: d => { S.ui.tab = d.tab; S.ui.sortRt = false; closeAllSheets(); render(); window.scrollTo(0, 0); },
  closeSheet: (d, el) => closeSheet(sheetOf(el)),
  // home
  month: d => { let [y, m] = S.ui.month; m += +d.v; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } S.ui.month = [y, m]; render(); },
  monthToday: () => { const n = new Date(); S.ui.month = [n.getFullYear(), n.getMonth()]; S.ui.sel = today(); render(); },
  selDay: d => { S.ui.sel = d.d; render(); },
  startEmpty: () => startWorkout(null),
  startFromRoutine: () => {
    if (!S.data.routines.length) { uiConfirm('ルーティンがまだありません。作成しますか？', '作成').then(ok => { if (ok) A.newRoutine({}); }); return; }
    openSheet(() => `<div class="sh-head"><div><div class="eyebrow">START</div><h2>ルーティンから開始</h2></div><button class="icon" data-a="closeSheet">${I.close}</button></div>` +
      S.data.folders.map(f => { const rs = S.data.routines.filter(r => r.folderId === f.id); return rs.length ? `<div class="sec-title"><span>${esc(f.name)}</span></div><div class="folder">${rs.map(r => rtRow(r)).join('')}</div>` : ''; }).join(''), { full: true });
  },
  logPast: () => openEditWorkout({ id: uid(), date: S.ui.sel, start: parseD(S.ui.sel).getTime() + 18 * 3600e3, dur: 3600, title: `${fmtMD(S.ui.sel)}のワークアウト`, items: [], note: '' }, true),
  addPlan: async () => {
    const date = S.ui.sel;
    const v = S.data.routines.length ? await uiMenu(`${fmtDateJP(date)} の予定`, [{ label: 'ルーティンから予定を作成', value: 'rt' }, { label: '種目を選んで予定を作成', value: 'new' }]) : 'new';
    if (v === 'rt') chooseRoutine('予定にするルーティン', r => { S.data.plans.push({ id: uid(), date, title: r.name, items: clone(r.items), note: '', routineId: r.id }); save(); render(); toast('予定を追加しました'); });
    else if (v === 'new') openPlanEditor({ id: uid(), date, title: `${fmtMD(date)}の予定`, items: [], note: '', routineId: null }, true);
  },
  rtChoose: (d, el) => { const h = sheetOf(el); const r = findR(d.id); closeSheet(h); h.state.cb(r); },
  planEdit: d => openPlanEditor(findP(d.id), false),
  planStart: d => { const p = findP(d.id); if (p) startWorkout({ title: p.title, items: p.items, routineId: p.routineId, planId: p.id }); },
  planMenu: async d => {
    const p = findP(d.id);
    const v = await uiMenu(p.title, [{ label: '日付を変更', value: 'date' }, { label: '別の日に複製', value: 'dup' }, { label: 'ルーティンとして保存', value: 'rt' }, { label: '予定を削除', value: 'del', danger: true }]);
    if (v === 'date') { const nd = await datePrompt(p.date); if (nd) { p.date = nd; save(); S.ui.sel = nd; const dd = parseD(nd); S.ui.month = [dd.getFullYear(), dd.getMonth()]; render(); } }
    else if (v === 'dup') { const nd = await datePrompt(p.date); if (nd) { S.data.plans.push({ ...clone(p), id: uid(), date: nd }); save(); render(); toast('予定を複製しました'); } }
    else if (v === 'rt') { const fid = await chooseFolder('保存先のフォルダ'); if (!fid) return; S.data.routines.push({ id: uid(), folderId: fid, name: p.title, items: tplItems(p.items), note: '' }); save(); render(); toast('ルーティンに保存しました'); }
    else if (v === 'del') { if (await uiConfirm('この予定を削除しますか？', '削除', true)) { S.data.plans = S.data.plans.filter(x => x.id !== p.id); save(); render(); } }
  },
  openWorkout: d => sheetWorkout(d.id),
  resume: () => { S.editor = { mode: 'live' }; render(); },
  wEdit: d => openEditWorkout(findW(d.id), false),
  wRepeat: d => { const w = findW(d.id); startWorkout({ title: w.title, items: w.items, routineId: w.routineId && findR(w.routineId) ? w.routineId : null }); },
  wDelete: async d => { if (!(await uiConfirm('このワークアウト記録を削除しますか？', '削除', true))) return; S.data.workouts = S.data.workouts.filter(w => w.id !== d.id); save(); render(); toast('削除しました'); },
  wToRoutine: async d => {
    const w = findW(d.id); const fid = await chooseFolder('保存先のフォルダ'); if (!fid) return;
    const name = await uiPrompt('ルーティン名', w.title); if (name === null) return;
    S.data.routines.push({ id: uid(), folderId: fid, name: name || w.title, items: tplItems(w.items), note: '' });
    S.ui.closed[fid] = false; save(); render(); toast('ルーティンに保存しました');
  },
  // routines
  newFolder: () => newFolder(),
  rtSort: () => { S.ui.sortRt = true; S.ui.q = ''; render(); window.scrollTo(0, 0); },
  rtSortDone: () => { S.ui.sortRt = false; render(); },
  toggleFolder: d => { S.ui.closed[d.id] = !S.ui.closed[d.id]; saveUI(); $('#rt-list').innerHTML = vRoutineList(); },
  folderMenu: async (d, el, ev) => {
    ev.stopPropagation();
    const f = findF(d.id); const rs = S.data.routines.filter(r => r.folderId === f.id);
    const v = await uiMenu(f.name, [{ label: 'ルーティンを追加', value: 'add' }, { label: '名前を変更', value: 'rename' }, { label: '並び替え', value: 'sort' }, { label: 'フォルダを削除', value: 'del', danger: true }]);
    if (v === 'add') A.newRoutine({ f: f.id });
    else if (v === 'sort') A.rtSort();
    else if (v === 'rename') { const n = await uiPrompt('フォルダ名', f.name); if (n) { f.name = n; save(); render(); } }
    else if (v === 'del') {
      if (!rs.length) { if (await uiConfirm(`フォルダ「${f.name}」を削除しますか？`, '削除', true)) { S.data.folders = S.data.folders.filter(x => x !== f); save(); render(); } return; }
      const opts = [{ label: `ルーティン${rs.length}件ごと削除`, value: 'all', danger: true }];
      if (S.data.folders.length > 1) opts.unshift({ label: 'ルーティンを別フォルダへ移動して削除', value: 'move' });
      const how = await uiMenu(`「${f.name}」には${rs.length}件のルーティンがあります`, opts);
      if (how === 'move') { const to = await chooseFolder('移動先のフォルダ', f.id); if (!to) return; rs.forEach(r => r.folderId = to); S.data.folders = S.data.folders.filter(x => x !== f); save(); render(); }
      else if (how === 'all') { if (!(await uiConfirm(`フォルダとルーティン${rs.length}件を削除します。元に戻せません。`, '削除', true))) return; S.data.routines = S.data.routines.filter(r => r.folderId !== f.id); S.data.folders = S.data.folders.filter(x => x !== f); save(); render(); }
    }
  },
  newRoutine: d => { const fid = d.f || ensureFolder(); openRoutineEditor({ id: uid(), folderId: fid, name: '', items: [], note: '' }, true); },
  openRoutine: d => sheetRoutine(d.id),
  startRoutine: (d, el, ev) => { ev.stopPropagation(); startRoutine(d.id); },
  routineEdit: d => openRoutineEditor(findR(d.id), false),
  routineToPlan: async d => {
    const r = findR(d.id); const nd = await datePrompt(S.ui.sel >= today() ? S.ui.sel : today(), '予定日'); if (!nd) return;
    S.data.plans.push({ id: uid(), date: nd, title: r.name, items: clone(r.items), note: '', routineId: r.id }); save(); render(); toast(`${fmtDateJP(nd)} に予定を追加しました`);
  },
  routineMenu: async d => {
    const r = findR(d.id);
    const v = await uiMenu(r.name, [{ label: '編集', value: 'edit' }, { label: '名前を変更', value: 'rename' }, { label: '複製', value: 'dup' }, { label: '別のフォルダへ移動', value: 'move' }, { label: '並び替え', value: 'sort' }, { label: '削除', value: 'del', danger: true }]);
    const arr = S.data.routines;
    if (v === 'edit') openRoutineEditor(r, false);
    else if (v === 'rename') { const n = await uiPrompt('ルーティン名', r.name); if (n) { r.name = n; save(); render(); } }
    else if (v === 'dup') { const c = { ...clone(r), id: uid(), name: r.name + '（コピー）' }; arr.splice(arr.indexOf(r) + 1, 0, c); save(); render(); toast('複製しました'); }
    else if (v === 'move') { const to = await chooseFolder('移動先のフォルダ', r.folderId); if (to) { r.folderId = to; S.ui.closed[to] = false; save(); render(); toast('移動しました'); } }
    else if (v === 'sort') { closeAllSheets(); S.ui.tab = 'routines'; A.rtSort(); }
    else if (v === 'del') { if (await uiConfirm(`ルーティン「${r.name}」を削除しますか？`, '削除', true)) { S.data.routines = arr.filter(x => x.id !== r.id); save(); render(); toast('削除しました'); } }
  },
  // editor
  edMin: () => { flushSave(); S.editor = null; render(); },
  edClose: () => edClose(),
  edFinish: () => edFinish(),
  edSort: () => { S.editor.sort = true; renderEditor(); $('#ed-body').scrollTop = 0; },
  edSortDone: () => { S.editor.sort = false; renderEditor(); },
  edDiscard: async () => { if (await uiConfirm('このワークアウトを破棄しますか？記録は保存されません。', '破棄', true)) discardActive(); },
  edDeleteW: async () => { const D = edData(); if (!(await uiConfirm('この記録を削除しますか？', '削除', true))) return; S.data.workouts = S.data.workouts.filter(w => w.id !== D.id); save(); S.editor = null; render(); toast('削除しました'); },
  edDeletePlan: async () => { const D = edData(); if (!(await uiConfirm('この予定を削除しますか？', '削除', true))) return; S.data.plans = S.data.plans.filter(p => p.id !== D.id); save(); S.editor = null; render(); toast('削除しました'); },
  edSaveRoutine: () => {
    const D = S.editor.draft;
    const r = { id: D.id, folderId: D.folderId, name: (D.name || '').trim() || '新しいルーティン', note: D.note || '', items: tplItems(D.items) };
    const k = S.data.routines.findIndex(x => x.id === r.id);
    if (k >= 0) S.data.routines[k] = r; else S.data.routines.push(r);
    S.ui.closed[r.folderId] = false; save(); S.editor = null; render(); toast('ルーティンを保存しました');
  },
  edSavePlan: () => {
    const D = S.editor.draft;
    const p = { id: D.id, date: D.date || today(), title: (D.title || '').trim() || 'トレーニング予定', note: D.note || '', routineId: D.routineId || null, items: tplItems(D.items) };
    const k = S.data.plans.findIndex(x => x.id === p.id);
    if (k >= 0) S.data.plans[k] = p; else S.data.plans.push(p);
    S.ui.sel = p.date; const dd = parseD(p.date); S.ui.month = [dd.getFullYear(), dd.getMonth()];
    save(); S.editor = null; render(); toast('予定を保存しました');
  },
  edAddEx: () => {
    pickExercises(ids => {
      const e = S.editor, D = edData();
      ids.forEach(id => D.items.push({ exerciseId: id, sets: newSetsFor(id, e.mode, D) }));
      e.scrollBottom = true; edChanged(); renderEditor();
    });
  },
  edExMenu: async d => {
    const D = edData(), i = +d.i, it = D.items[i];
    const v = await uiMenu(getEx(it.exerciseId).name, [{ label: '並び替え', value: 'sort' }, { label: '記録・履歴を見る', value: 'hist' }, { label: '種目を変更', value: 'swap' }, { label: '種目を削除', value: 'del', danger: true }]);
    if (v === 'sort') return A.edSort();
    if (v === 'hist') return sheetExercise(it.exerciseId);
    if (v === 'swap') return pickExercises(ids => { it.exerciseId = ids[0]; edChanged(); renderEditor(); }, { multi: false, title: '変更先の種目' });
    if (v === 'del') { D.items.splice(i, 1); edChanged(); renderEditor(); }
  },
  edAddSet: d => {
    const D = edData(), it = D.items[+d.i]; const last = it.sets[it.sets.length - 1];
    const s = last ? setsOnly(last) : {}; if (!isTpl(S.editor.mode)) s.done = false;
    it.sets.push(s); edChanged(); renderEditor();
  },
  edDelSet: d => { const D = edData(), it = D.items[+d.i]; if (it.sets.length) it.sets.pop(); edChanged(); renderEditor(); },
  edSetMenu: async d => {
    const D = edData(), it = D.items[+d.i], j = +d.j;
    const v = await uiMenu(`セット ${j + 1}`, [{ label: 'このセットを複製', value: 'dup' }, { label: 'このセットを削除', value: 'del', danger: true }]);
    if (v === 'dup') it.sets.splice(j + 1, 0, { ...setsOnly(it.sets[j]), ...(!isTpl(S.editor.mode) ? { done: false } : {}) });
    else if (v === 'del') it.sets.splice(j, 1);
    else return;
    edChanged(); renderEditor();
  },
  edCheck: d => {
    ensureAudio();
    const D = edData(), i = +d.i, j = +d.j, s = D.items[i].sets[j];
    if (!s.done) {
      fillFromPrev(D, i, j); s.done = true;
      if (S.editor.mode === 'live' && S.data.settings.autoRest) startRest(+S.data.settings.rest);
    } else s.done = false;
    edChanged(); renderEditor();
  },
  restManual: async () => { const v = await uiMenu('休憩タイマー', REST_OPTS.map(x => ({ label: fmtDur(x), value: x }))); if (v) startRest(v); },
  restAdj: d => { if (!S.rest) return; S.rest.end += +d.v * 1000; S.rest.total = Math.max(S.rest.total + Math.max(0, +d.v), (S.rest.end - Date.now()) / 1000); tickRest(); },
  restSkip: () => { S.rest = null; renderRest(); },
  // picker
  pkPart: (d, el) => { const h = sheetOf(el); h.state.part = d.v; drawSheet(h); },
  pkToggle: (d, el) => {
    const h = sheetOf(el), st = h.state;
    if (!st.multi) { closeSheet(h); st.cb([d.id]); return; }
    const k = st.sel.indexOf(d.id); if (k >= 0) st.sel.splice(k, 1); else st.sel.push(d.id);
    drawSheet(h);
  },
  pkDone: (d, el) => { const h = sheetOf(el); if (!h.state.sel.length) return; closeSheet(h); h.state.cb([...h.state.sel]); },
  pkNew: async (d, el) => {
    const h = sheetOf(el); const ex = await createExercise(); if (!ex) return;
    if (!h.state.multi) { closeSheet(h); h.state.cb([ex.id]); return; }
    h.state.sel.push(ex.id); h.state.q = ''; h.state.part = 'all'; drawSheet(h);
  },
  // stats
  openExStats: d => sheetExercise(d.id),
  exMetric: (d, el) => { const h = sheetOf(el); h.state.m = d.v; drawSheet(h); },
  statPickEx: () => pickExercises(ids => sheetExercise(ids[0]), { multi: false, title: '種目の記録を見る' }),
  addBody: async () => { const r = await bodyForm(null); if (!r || r === 'delete') return; S.data.body.push({ id: uid(), ...r }); save(); render(); },
  editBody: async d => {
    const b = S.data.body.find(x => x.id === d.id); const r = await bodyForm(b); if (!r) return;
    if (r === 'delete') S.data.body = S.data.body.filter(x => x.id !== d.id); else Object.assign(b, r);
    save(); render();
  },
  // settings
  setUnit: d => { S.data.settings.unit = d.v; save(); render(); },
  toggleSet: d => { S.data.settings[d.k] = !S.data.settings[d.k]; save(); render(); },
  openLib: () => openLib(),
  libPart: (d, el) => { const h = sheetOf(el); h.state.part = d.v; drawSheet(h); },
  libNew: async () => { if (await createExercise()) render(); },
  libEdit: d => editExercise(d.id),
  syncSetup: async () => {
    const r = await syncSetupDialog(); if (!r) return;
    const prev = { ...SY };
    SY = { token: r.token, repo: r.repo, owner: '' };
    try {
      const u = await gh('/user'); if (!u.ok) throw ghErr(u, 'GitHub');
      SY.owner = (await u.json()).login;
      const rp = await gh(`/repos/${SY.owner}/${SY.repo}`); if (!rp.ok) throw ghErr(rp, 'リポジトリ');
      saveSY(); render(); await syncNow(true); render();
    } catch (e) { SY = prev; saveSY(); render(); uiAlert('接続できませんでした：' + e.message); }
  },
  syncNowBtn: () => syncNow(true),
  syncOff: async () => { if (!(await uiConfirm('この端末の同期を解除しますか？（端末内とクラウドのデータは残ります）', '解除', true))) return; SY = {}; saveSY(); render(); },
  exportData: () => {
    const blob = new Blob([JSON.stringify(S.data, null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mytraining-backup-${today()}.json`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('バックアップを書き出しました');
  },
  importData: () => $('#imp-file').click(),
  resetAll: async () => {
    if (!(await uiConfirm('すべての記録・ルーティン・設定を削除します。元に戻せません。' + (SY.token ? '\n同期先のクラウドのデータも削除されます。' : ''), '削除', true))) return;
    if (!(await uiConfirm('本当に削除しますか？（先にバックアップを推奨）', 'すべて削除', true))) return;
    const del = { ...S.data.deleted }; const now = Date.now();
    COLS.forEach(c => S.data[c].forEach(it => { del[c + ':' + it.id] = now; }));
    S.data = fresh(); S.data.deleted = del; S.data.orderU = S.data.settingsU = S.data.activeU = now;
    COLS.forEach(c => S.data[c].forEach(it => { it.u = now + 1; }));
    S.editor = null; S.rest = null; rebuildSnap(); persist(); scheduleSync(); renderRest(); render(); toast('初期化しました');
  },
};

/* ===================== events ===================== */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-a]'); if (!el) return;
  const fn = A[el.dataset.a]; if (!fn) return;
  ev.preventDefault(); fn(el.dataset, el, ev);
});
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.classList.contains('set-in')) {
    const D = edData(); if (!D) return;
    D.items[+t.dataset.i].sets[+t.dataset.j][t.dataset.f] = t.value.trim();
    edChanged();
    const v = $('#ed-vol'); if (v) v.textContent = fmtN(edVol(D)) + S.data.settings.unit;
    return;
  }
  if (t.dataset.ed) { const D = edData(); if (!D) return; D[t.dataset.ed] = t.value; edChanged(); return; }
  if (t.dataset.set) { S.data.settings[t.dataset.set] = +t.value; save(); return; }
  if (t.id === 'rt-q') { S.ui.q = t.value; $('#rt-list').innerHTML = vRoutineList(); return; }
  if (t.id === 'pk-q') { const h = sheetOf(t); h.state.q = t.value; $('#pk-list', h.el).innerHTML = pkList(h.state); return; }
  if (t.id === 'lib-q') { const h = sheetOf(t); h.state.q = t.value; $('#lib-list', h.el).innerHTML = libList(libFilter(h.state)); }
});
document.addEventListener('keydown', ev => {
  const t = ev.target;
  if (ev.key === 'Enter' && t.classList?.contains('set-in')) {
    ev.preventDefault();
    const all = [...document.querySelectorAll('#ed-body .set-in')]; const k = all.indexOf(t);
    if (all[k + 1]) all[k + 1].focus(); else t.blur();
  }
});
document.addEventListener('focusin', ev => { if (ev.target.classList?.contains('set-in')) setTimeout(() => ev.target.select?.(), 0); });
$('#imp-file').addEventListener('change', async ev => {
  const f = ev.target.files[0]; ev.target.value = ''; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.exercises) || !Array.isArray(d.workouts)) throw new Error('形式が違います');
    if (!(await uiConfirm(`バックアップを復元します。\nルーティン ${d.routines?.length || 0}件 / 記録 ${d.workouts.length}件\n現在のデータは上書きされます。`, '復元', true))) return;
    const now = Date.now();
    S.data = normalize(d); S.data.orderU = S.data.settingsU = S.data.activeU = now;
    COLS.forEach(c => S.data[c].forEach(it => { it.u = now; }));
    rebuildSnap(); persist(); scheduleSync(); S.editor = null; render(); toast('復元しました');
  } catch (e) { uiAlert('読み込みに失敗しました：' + e.message); }
});

/* ===================== boot ===================== */
render(); renderRest();
if (navigator.storage?.persist) navigator.storage.persist().catch(() => { });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
syncNow();
