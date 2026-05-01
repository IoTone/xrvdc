// 8 menu items for the 8 octagon faces.
// Summaries are written for spatial reading — short, readable in 1-2 breaths at 1.2m distance.

export const MENU = [
  {
    id: "about",
    index: "01",
    title: "ABOUT",
    href: "/about/",
    summary:
      "VisionDevCamp carries 18+ years of hackathon heritage, from iPhoneDevCamp through iOSDevCamp and now the spatial-computing era. Collaboration over competition, no qualification gate, flexible judging, mixed-skill teams, public recognition, loaner hardware.",
  },
  {
    id: "schedule",
    index: "02",
    title: "SCHEDULE",
    href: "/schedule/2026/",
    summary:
      "Friday 26 to Sunday 28 June 2026 in Fukuoka. Fri 17:00 doors, keynote, mixer, late-night hacking. Sat full hacking day. Sun 12:00 submission cutoff, 13-15:00 judging, 16:00 awards. Closing party with taco truck outdoors. Multiple venues converging on CIC Fukuoka.",
  },
  {
    id: "hackathon",
    index: "03",
    title: "HACKATHON",
    href: "/hackathon/",
    summary:
      "Core values: contribution, sharing, openness, can-do attitude. Teams of 1-6, formed on-site or in advance. Entry deadline 12:00 JST Sunday. 3-minute demos. Source code released that evening. AI tools allowed with required disclosure of tools, paid services, and runtime needs.",
  },
  {
    id: "gallery",
    index: "04",
    title: "GALLERY",
    href: "/gallery/",
    summary:
      "Field recordings from the 2025 Fukuoka edition - 40 photos from Engineer Cafe, plus a small set of XR demo clips. Click any frame in the 2D view to open a fullscreen lightbox with HUD chrome and prev/next navigation.",
  },
  {
    id: "badge",
    index: "05",
    title: "BADGE",
    href: "/badge/",
    summary:
      "Generate a personalized share card declaring your attendance. Upload a selfie, type a name and comment, and the canvas composites a 1200x628 image with cyberpunk HUD frame and an AVP goggles overlay. Download or share to X, Facebook, or LinkedIn.",
  },
  {
    id: "organizers",
    index: "06",
    title: "ORGANIZERS",
    href: "/organizers/",
    summary:
      "The local team running XR VisionDevCamp Fukuoka 2026. David Kordsmeier (founder, IoTone Japan) and Laurie Griffiths (Engineer Cafe community manager) lead organization on the ground in Fukuoka.",
  },
  {
    id: "sponsors",
    index: "07",
    title: "SPONSORS",
    href: "/sponsors/",
    summary:
      "Sponsorship for 2026 is open - XR device sponsors, prize sponsors, venue partners, and meal sponsors are all welcome. The 2025 edition was supported by Engineer Cafe, IoTone Japan, STYLY, Tagstand, and Unity Technologies Japan.",
  },
  {
    id: "contact",
    index: "08",
    title: "CONTACT",
    href: "/contact/",
    summary:
      "For sponsorship enquiries, partnership proposals, press requests, or general questions: email xrvdc@duck.com or use the contact form linked on the 2D site. We aim to reply within a few business days.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FONT ASSET (MSDF) — three-mesh-ui's bundled Roboto Bold via CDN, v1 only.
//
// ⚠️  GLYPH-SET CONSTRAINT — READ BEFORE EDITING ANY ThreeMeshUI.Text content.
//
// MSDF atlases only render characters that were rasterised into them.
// Hitting an unsupported character throws an UNCAUGHT TypeError inside
// MSDFGlyph.mapUVs and stops the entire render loop.  There's no graceful
// fallback in three-mesh-ui v6.5.x.
//
// This Roboto-msdf set covers:
//     A-Z  a-z  0-9
//     space  !  "  #  $  %  &  '  (  )  *  +  ,  -  .  /
//     :  ;  =  ?  @  [  \  ]  _  {  |  }  ~
//     plus extended-Latin (à á â ä ñ ö ø ü æ ß etc.) and Greek
//
// NOT included (will crash):
//     <  >  ^  `   (basic ASCII gaps!)
//     ▸  ▾  ▮  ●  ▸  ◂  ←  →  ↑  ↓   (geometric shapes / arrows)
//     —  ·  …  ©  ®  ™  •                (typography & symbols)
//     CJK, Cyrillic, Hebrew, Arabic, etc.
//
// Safe cyberpunk substitutes:
//     >>     →  use  //
//     ▸      →  use  //  or  >>  (NO — > not in atlas!) or  ::
//     ▾ X    →  use  [ X ]
//     —      →  use  --  or  -
//     ·      →  use  ::  or  //
//     …      →  use  ...
//     →      →  use  ->  (NO — > not in atlas!) — use  =>  or  to
//     ●      →  use  *  or  o
//
// Verification script (run before any new content lands):
//     /usr/bin/python3 static/xr/scripts/check-glyphs.py
//
// V2 PLAN — swap to a custom Orbitron Bold MSDF atlas generated with an
// explicit glyph list including `< > ^ ▸ ▾ ▮ ●` and box-drawing chars.
// Use msdf-bmfont-xml or msdf-atlas-gen with --charset orbitron-glyphs.txt.
// Then this whole constraint goes away and we get our wipeout-XL typography.
// ─────────────────────────────────────────────────────────────────────────────
export const FONT = {
  json: "https://cdn.jsdelivr.net/gh/felixmariotto/three-mesh-ui@master/examples/assets/Roboto-msdf.json",
  png: "https://cdn.jsdelivr.net/gh/felixmariotto/three-mesh-ui@master/examples/assets/Roboto-msdf.png",
};

// Colors — warm cyberpunk palette compliant with the optical-passthrough rule
// (no blue / cyan; warm browns instead of pure black).
export const PAL = {
  bgPanel: 0x1a0f08, // warm dark brown (replaces #050505)
  bgSky:   0x0d0805, // even warmer for VR sky
  yellow:  0xffea00,
  magenta: 0xff006e,
  amber:   0xffb86b, // warm amber for body text
  amberDim:0x6e5238, // muted edge tone (per doc's 0xb8a380 family)
  warmEdge:0xb8a380,
  white:   0xffffff,
};
