// Golden personas — encode the explicit routing rules the tool must honor.
// Each: answers + the primary path(s) we accept + path ids that MUST appear
// somewhere in the result (primary or alternates).
// a(firstHack, role, gamedev, ai, xr, platform, formfactor)
const a = (firstHack, role, gamedev, ai, xr, platform, formfactor) =>
  ({ firstHack, role, gamedev, ai, xr, platform, formfactor });

export const GOLDEN = [
  { id: 'G1  student/no-code/phone',        ans: a('yes', 'student',      'na',  'none',   'new',  'phoneBrowser', 'none'),      primary: ['P1'],        include: [] },
  { id: 'G2  student/AI/phone',             ans: a('yes', 'student',      'na',  'high',   'new',  'phoneBrowser', 'none'),      primary: ['P1'],        include: ['P9'] },
  { id: 'G3  coder/no-VR/PC',               ans: a('no',  'coder',        'no',  'low',    'new',  'pc',           'none'),      primary: ['P3'],        include: ['P5'] },
  { id: 'G4  coder/no-VR/Mac',              ans: a('no',  'coder',        'no',  'low',    'new',  'macSilicon',   'none'),      primary: ['P4'],        include: ['P3'] },
  { id: 'G5  3d-designer/gamedev/PC',       ans: a('no',  'designer3d',   'yes', 'high',   'exp',  'pc',           'none'),      primary: ['P6'],        include: ['P2'] },
  { id: 'G6  artist/AI/android',            ans: a('yes', 'artist',       'na',  'high',   'new',  'phoneBrowser', 'glasses'),   primary: ['P1', 'P8', 'P2'], include: [] },
  { id: 'G7  entrepreneur/AI/browser',      ans: a('yes', 'entrepreneur', 'na',  'high',   'new',  'phoneBrowser', 'none'),      primary: ['P9'],        include: ['P1'] },
  { id: 'G8  videographer/capture',         ans: a('no',  'videographer', 'na',  'none',   'some', 'phoneBrowser', 'none'),      primary: ['P8'],        include: ['P1'] },
  { id: 'G9  coder/AI-optout/PC',           ans: a('yes', 'coder',        'no',  'optout', 'new',  'pc',           'none'),      primary: ['P3'],        include: [], forbid: ['P9'] },
  { id: 'G10 teacher/no-code/browser',      ans: a('yes', 'teacher',      'na',  'none',   'new',  'phoneBrowser', 'none'),      primary: ['P1'],        include: [] },
  { id: 'G11 ux/Mac/glasses',               ans: a('yes', 'uxdesigner',   'na',  'low',    'new',  'macSilicon',   'glasses'),   primary: ['P1', 'P2', 'P3'], include: ['P2'] },
  { id: 'G12 coder/exp/android',            ans: a('no',  'coder',        'no',  'high',   'exp',  'pc',           'glasses'),   primary: ['P5', 'P6', 'P3'], include: [] },
  { id: 'G13 coder/IntelMac/AVP',           ans: a('no',  'coder',        'no',  'low',    'exp',  'macIntel',     'immersive'), primary: ['P3', 'P6'],  include: [], forbid: ['P4'] },
  { id: 'G14 3d-designer/phone/AVP',        ans: a('yes', 'designer3d',   'na',  'low',    'new',  'phoneBrowser', 'immersive'), primary: ['P1', 'P8'],  include: [] },
  { id: 'G15 coder/gamedev/immersive',      ans: a('no',  'coder',        'yes', 'low',    'exp',  'pc',           'immersive'), primary: ['P6'],        include: [] },
  { id: 'G16 3d-designer/gamedev/glasses',  ans: a('no',  'designer3d',   'yes', 'high',   'some', 'macSilicon',   'glasses'),   primary: ['P6', 'P2'],  include: ['P2'] },
  { id: 'G17 coder/not-gamedev/immersive',  ans: a('no',  'coder',        'no',  'low',    'some', 'pc',           'immersive'), primary: ['P3'],        include: [] },
  { id: 'G18 student/glasses/android',      ans: a('yes', 'student',      'na',  'none',   'new',  'phoneBrowser', 'glasses'),   primary: ['P1', 'P5', 'P2'], include: [] },
];
