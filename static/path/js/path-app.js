// Hackathon Path Tool — UI. Mounts on #pathtool (data-lang en|ja), walks the
// participant through the questions (Q2b is conditional), and renders the
// recommendation. All routing lives in path-engine.js; this file is presentation
// + state only. Result is shareable via the URL hash.

import { QUESTIONS, STRINGS, PATHS, CATALOG } from './path-data.js';
import { recommend } from './path-engine.js';

const mount = document.getElementById('pathtool');
const LANG = (mount && mount.dataset.lang === 'ja') ? 'ja' : 'en';
const T = STRINGS[LANG];
const ORDER = QUESTIONS.map((q) => q.id); // fixed field order for hash encoding

const state = { answers: {}, visible: [], step: 0 };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Which questions apply, given current answers (Q2b depends on role).
function visibleQuestions(answers) {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

function articleLink(key) {
  const c = CATALOG[key];
  if (!c) return '';
  const href = LANG === 'ja' ? c.ja : c.en;
  const label = LANG === 'ja' ? c.t_ja : c.t_en;
  return `<li><a href="${esc(href)}">${esc(label)} ↗</a></li>`;
}

function pathCard(p, kind) {
  const path = PATHS[p.id];
  const name = LANG === 'ja' ? p.name_ja : p.name_en;
  const blurb = LANG === 'ja' ? path.blurb_ja : path.blurb_en;
  const aiNote = p.showAiNote ? (LANG === 'ja' ? path.aiNote_ja : path.aiNote_en) : '';
  const needsMac = p.id === 'P4' && !state.lastResult.macSilicon;
  return `
    <div class="pt-path pt-path--${kind}">
      <h3>${esc(name)}</h3>
      <p class="pt-blurb">${esc(blurb)}</p>
      ${needsMac ? `<p class="pt-flag">⚠ ${esc(T.needs_mac)}</p>` : ''}
      ${aiNote ? `<p class="pt-ai">✨ ${esc(aiNote)}</p>` : ''}
      ${p.avpRuntime ? `<p class="pt-avp">▸ Apple Vision Pro</p>` : ''}
      <p class="pt-articles-label">${esc(T.result_articles)}</p>
      <ul class="pt-articles">${path.articles.map(articleLink).join('')}</ul>
    </div>`;
}

function answerChips() {
  return state.visible.map((q) => {
    const v = state.answers[q.id];
    return `<span class="pt-chip">${esc(T.q[q.id].opts[v] || v)}</span>`;
  }).join('');
}

// ───── Renders ─────
function renderIntro() {
  mount.innerHTML = `
    <section class="pt-card pt-intro">
      <p class="pt-id">// PATH_FINDER</p>
      <h2>${esc(T.intro_title)}</h2>
      <p>${esc(T.intro_body)}</p>
      <button class="pt-btn pt-btn--go" data-act="start">${esc(T.start)}</button>
    </section>`;
}

function renderQuestion() {
  const q = state.visible[state.step];
  const qs = T.q[q.id];
  const total = state.visible.length;
  const progress = T.progress.replace('{n}', state.step + 1).replace('{total}', total);
  mount.innerHTML = `
    <section class="pt-card pt-question">
      <div class="pt-progress"><span>${esc(progress)}</span>
        <div class="pt-dots">${state.visible.map((_, i) =>
          `<i class="pt-dot${i < state.step ? ' is-done' : i === state.step ? ' is-now' : ''}"></i>`).join('')}</div>
      </div>
      <h2>${esc(qs.title)}</h2>
      <div class="pt-opts">
        ${q.options.map((v) =>
          `<button class="pt-opt${state.answers[q.id] === v ? ' is-sel' : ''}" data-q="${q.id}" data-v="${v}">${esc(qs.opts[v])}</button>`).join('')}
      </div>
      <div class="pt-nav">
        ${state.step > 0 ? `<button class="pt-btn pt-btn--ghost" data-act="back">${esc(T.back)}</button>` : '<span></span>'}
      </div>
    </section>`;
}

function renderResult() {
  const r = state.lastResult;
  mount.innerHTML = `
    <section class="pt-card pt-result">
      <p class="pt-id">// RECOMMENDATION</p>
      <h2>${esc(T.result_title)}</h2>
      <p class="pt-matched">${esc(T.result_matched)}: ${answerChips()}</p>
      <p class="pt-section-label">${esc(T.result_primary)}</p>
      ${pathCard(r.primary, 'primary')}
      ${r.alternates.length ? `<p class="pt-section-label">${esc(T.result_alts)}</p>
        <div class="pt-alts">${r.alternates.map((p) => pathCard(p, 'alt')).join('')}</div>` : ''}
      <div class="pt-avp-footer">
        <strong>${esc(T.avp_footer_title)}</strong>
        <p>${esc(T.avp_footer_body)}</p>
      </div>
      <div class="pt-nav">
        <button class="pt-btn pt-btn--ghost" data-act="restart">${esc(T.restart)}</button>
      </div>
    </section>`;
}

// ───── Flow ─────
function advance() {
  // Recompute visible set (role may have changed) and move to next unanswered.
  state.visible = visibleQuestions(state.answers);
  if (state.step < state.visible.length) { renderQuestion(); return; }
  finish();
}

function finish() {
  // Ensure conditional questions left stale answers don't leak (e.g. gamedev na).
  const a = { ...state.answers };
  if (!(a.role === 'coder' || a.role === 'designer3d')) a.gamedev = 'na';
  state.lastResult = recommend(a);
  writeHash(a);
  renderResult();
}

function writeHash(a) {
  const enc = ORDER.map((k) => a[k] ?? '').join('-');
  history.replaceState(null, '', '#p=' + enc);
}

function readHash() {
  const m = location.hash.match(/#p=([a-zA-Z-]+)/);
  if (!m) return null;
  const parts = m[1].split('-');
  if (parts.length !== ORDER.length) return null;
  const a = {};
  ORDER.forEach((k, i) => { a[k] = parts[i]; });
  // Validate every field against its allowed options.
  for (const q of QUESTIONS) {
    const allowed = q.id === 'gamedev' ? [...q.options, 'na'] : q.options;
    if (!allowed.includes(a[q.id])) return null;
  }
  return a;
}

// ───── Events ─────
mount.addEventListener('click', (e) => {
  const opt = e.target.closest('.pt-opt');
  if (opt) {
    state.answers[opt.dataset.q] = opt.dataset.v;
    state.visible = visibleQuestions(state.answers);
    state.step += 1;
    advance();
    return;
  }
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'start') { state.step = 0; state.answers = {}; advance(); }
  else if (act === 'back') { state.step = Math.max(0, state.step - 1); renderQuestion(); }
  else if (act === 'restart') { state.answers = {}; state.step = 0; history.replaceState(null, '', location.pathname); renderIntro(); }
});

// ───── Boot ─────
const fromHash = readHash();
if (fromHash) {
  state.answers = fromHash;
  state.visible = visibleQuestions(fromHash);
  state.lastResult = recommend(fromHash);
  renderResult();
} else {
  renderIntro();
}
