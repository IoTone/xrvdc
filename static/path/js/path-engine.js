// Hackathon Path Tool — recommendation engine.
// Pure functions, no DOM: the SAME module runs in the browser app and in the
// headless tests (tests/path/run-tests.mjs). All routing logic lives here;
// all tunable numbers live in path-data.js (WEIGHTS).

import { PATHS, WEIGHTS, TIE_ORDER } from './path-data.js';

// answers shape:
//   { firstHack:'yes'|'no', role:<roleKey>, gamedev:'yes'|'some'|'no'|'na',
//     ai:'none'|'low'|'high'|'optout', xr:'new'|'some'|'exp',
//     platform:'macSilicon'|'macIntel'|'pc'|'phoneBrowser',
//     formfactor:'glasses'|'immersive'|'none' }

export function score(a) {
  const totals = {};
  for (const id of Object.keys(PATHS)) totals[id] = 0;

  const apply = (table) => {
    if (!table) return;
    for (const [id, delta] of Object.entries(table)) {
      totals[id] = (totals[id] || 0) + delta;
    }
  };

  apply(WEIGHTS.role[a.role]);
  apply(WEIGHTS.firstHack[a.firstHack]);
  apply(WEIGHTS.gamedev[a.gamedev || 'na']);
  apply(WEIGHTS.formfactor[a.formfactor || 'none']);
  apply(WEIGHTS.ai[a.ai]);
  apply(WEIGHTS.xr[a.xr]);
  apply(WEIGHTS.platform[a.platform]);

  return totals;
}

// Rank all paths: score desc, then fixed tie-break order (deterministic).
function rank(totals) {
  return Object.keys(PATHS)
    .map((id) => ({ id, score: totals[id] }))
    .sort((x, y) => (y.score - x.score) || (TIE_ORDER.indexOf(x.id) - TIE_ORDER.indexOf(y.id)));
}

export function recommend(a) {
  const totals = score(a);
  const ranked = rank(totals);

  const macSilicon = a.platform === 'macSilicon';
  const aiOptout = a.ai === 'optout';

  // Guards (applied after scoring):
  //  1. Native visionOS (P4) can only be PRIMARY on an Apple-Silicon Mac.
  //  2. AI opt-out fully removes the AI-centric path (P9) from the result.
  const eligible = (r) => {
    if (r.id === 'P4' && !macSilicon) return false;
    if (r.id === 'P9' && aiOptout) return false;
    return true;
  };

  // Primary: highest eligible path with a positive score; else fall back to a
  // sane floor (WebXR for engineer-ish roles, STYLY otherwise).
  let primary = ranked.filter(eligible).find((r) => r.score > 0);
  if (!primary) {
    const engineerRoles = ['coder', 'designer3d'];
    const fbId = engineerRoles.includes(a.role) ? 'P3' : 'P1';
    primary = ranked.find((r) => r.id === fbId);
  }

  // Up to two alternates: next eligible, positive-scoring, distinct paths.
  const alternates = [];
  for (const r of ranked) {
    if (r.id === primary.id) continue;
    if (!eligible(r)) continue;
    if (r.score <= 0) continue;
    alternates.push(r);
    if (alternates.length >= 2) break;
  }

  const decorate = (r) => ({
    id: r.id,
    score: r.score,
    name_en: PATHS[r.id].name_en,
    name_ja: PATHS[r.id].name_ja,
    avpRuntime: PATHS[r.id].avpRuntime === true,
    // AI note shown only when the path has one AND the user didn't opt out.
    showAiNote: !!PATHS[r.id].aiNote_en && !aiOptout,
    articles: PATHS[r.id].articles,
  });

  return {
    answers: a,
    totals,
    primary: decorate(primary),
    alternates: alternates.map(decorate),
    aiOptout,
    macSilicon,
  };
}
