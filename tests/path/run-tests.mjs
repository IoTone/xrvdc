// Headless verification for the Hackathon Path Tool.
//   node tests/path/run-tests.mjs
// Three layers:
//   A. Golden personas — the explicit routing rules must hold.
//   B. Full cross-product audit — every legal answer set respects the invariants.
//   C. Coverage matrix — role × platform → primary, printed for human review.
// Exits non-zero on any failure.

import { recommend } from '../../static/path/js/path-engine.js';
import { PATHS, QUESTIONS } from '../../static/path/js/path-data.js';
import { GOLDEN } from './personas.mjs';

let failures = 0;
const fail = (msg) => { failures++; console.log('  ✗ ' + msg); };

const resultIds = (r) => [r.primary.id, ...r.alternates.map((x) => x.id)];

// ───── A. Golden personas ─────
console.log('\nA. Golden personas');
for (const g of GOLDEN) {
  const r = recommend(g.ans);
  const ids = resultIds(r);
  let ok = true;
  if (!g.primary.includes(r.primary.id)) {
    ok = false;
    fail(`${g.id}: primary ${r.primary.id} not in [${g.primary}] (ranked: ${rankStr(r)})`);
  }
  for (const inc of (g.include || [])) {
    if (!ids.includes(inc)) { ok = false; fail(`${g.id}: expected ${inc} in result, got [${ids}]`); }
  }
  for (const fb of (g.forbid || [])) {
    if (ids.includes(fb)) { ok = false; fail(`${g.id}: ${fb} must NOT appear, got [${ids}]`); }
  }
  if (ok) console.log(`  ✓ ${g.id} → ${r.primary.id} (+ ${r.alternates.map((x) => x.id).join(', ') || '—'})`);
}

function rankStr(r) {
  return Object.entries(r.totals).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}:${v}`).join(' ');
}

// ───── Enumerate all legal answer combinations ─────
const roles = QUESTIONS.find((q) => q.id === 'role').options;
const opts = (id) => QUESTIONS.find((q) => q.id === id).options;
const combos = [];
for (const firstHack of opts('firstHack'))
  for (const role of roles) {
    const gamedevs = (role === 'coder' || role === 'designer3d') ? opts('gamedev') : ['na'];
    for (const gamedev of gamedevs)
      for (const ai of opts('ai'))
        for (const xr of opts('xr'))
          for (const platform of opts('platform'))
            for (const formfactor of opts('formfactor'))
              combos.push({ firstHack, role, gamedev, ai, xr, platform, formfactor });
  }

// ───── B. Cross-product invariants ─────
console.log(`\nB. Cross-product audit (${combos.length} legal combinations)`);
const primaryCount = {};
for (const id of Object.keys(PATHS)) primaryCount[id] = 0;
let invViolations = 0;
const note = (m) => { invViolations++; if (invViolations <= 12) console.log('  ✗ ' + m); };

for (const c of combos) {
  const r = recommend(c);
  const ids = resultIds(r);
  primaryCount[r.primary.id]++;

  // 1. A primary always exists.
  if (!r.primary || !r.primary.id) note(`no primary for ${JSON.stringify(c)}`);
  // 2. Guard: P4 primary only on Apple-Silicon Mac.
  if (r.primary.id === 'P4' && c.platform !== 'macSilicon') note(`P4 primary off mac-silicon: ${JSON.stringify(c)}`);
  // 3. Guard: P9 never present when AI opt-out.
  if (c.ai === 'optout' && ids.includes('P9')) note(`P9 present on AI opt-out: ${JSON.stringify(c)}`);
  // 4. Guard: no AI note anywhere when AI opt-out.
  if (c.ai === 'optout') {
    const anyAi = [r.primary, ...r.alternates].some((p) => p.showAiNote);
    if (anyAi) note(`AI note shown on opt-out: ${JSON.stringify(c)}`);
  }
  // 5. No duplicate path between primary and alternates.
  if (new Set(ids).size !== ids.length) note(`duplicate path in result: [${ids}] ${JSON.stringify(c)}`);
}

// 6. Reachability: every path is primary for at least one persona.
for (const id of Object.keys(PATHS)) {
  if (primaryCount[id] === 0) note(`path ${id} is never recommended as primary (dead path)`);
}
// 7. AVP reachability: on every platform, at least one persona's result carries
//    an AVP-runtime path (so AVP is never categorically off-limits).
for (const platform of opts('platform')) {
  const reachable = combos.filter((c) => c.platform === platform).some((c) => {
    const r = recommend(c);
    return [r.primary, ...r.alternates].some((p) => p.avpRuntime);
  });
  if (!reachable) note(`no AVP-runtime path reachable on platform=${platform}`);
}

if (invViolations === 0) console.log('  ✓ all invariants hold');
else console.log(`  … ${invViolations} invariant violation(s)`);

console.log('\n  Primary distribution:');
for (const [id, n] of Object.entries(primaryCount).sort((x, y) => y[1] - x[1])) {
  console.log(`    ${id} ${PATHS[id].name_en.padEnd(28)} ${n}`);
}

// ───── C. Coverage matrix: role × platform → modal primary ─────
console.log('\nC. Coverage matrix (role × platform → most common primary)');
const platforms = opts('platform');
console.log('  ' + 'role'.padEnd(14) + platforms.map((p) => p.padEnd(13)).join(''));
for (const role of roles) {
  const row = [role.padEnd(14)];
  for (const platform of platforms) {
    const tally = {};
    for (const c of combos.filter((c) => c.role === role && c.platform === platform)) {
      const id = recommend(c).primary.id;
      tally[id] = (tally[id] || 0) + 1;
    }
    const top = Object.entries(tally).sort((x, y) => y[1] - x[1])[0][0];
    row.push(top.padEnd(13));
  }
  console.log('  ' + row.join(''));
}

// ───── Verdict ─────
const total = failures + invViolations;
console.log(`\n${total === 0 ? '✓ PASS' : '✗ FAIL'} — ${failures} golden failure(s), ${invViolations} invariant violation(s)\n`);
process.exit(total === 0 ? 0 : 1);
