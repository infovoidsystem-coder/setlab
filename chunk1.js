
const { useState, useMemo, useRef, useEffect, useContext, createContext } = React;

// ── TEMA GLOBAL (mutable para cambio sin refactor) ────────────────────────
const DARK_T = {
  gold: "#c9a84c", goldDim: "#7a6230", goldGlow: "#c9a84c22",
  surface: "#080808", border: "#141414",
  bg: "#030302", bgAlt: "#050403",
  text: "#e8e2d9", textMid: "#a09890", textDim: "#706860", textGhost: "#504844",
  green: "#22c55e", lime: "#84cc16", yellow: "#eab308",
  orange: "#f97316", red: "#ef4444",
  sans: "'Syne', sans-serif", mono: "'DM Mono', monospace",
  isDark: true,
};
const LIGHT_T = {
  gold: "#9a7030", goldDim: "#c4962a", goldGlow: "#9a703018",
  surface: "#ffffff", border: "#e4dfd8",
  bg: "#f2efe9", bgAlt: "#f8f6f2",
  text: "#1c1a17", textMid: "#6a6460", textDim: "#9a9490", textGhost: "#c0bbb4",
  green: "#16a34a", lime: "#65a30d", yellow: "#ca8a04",
  orange: "#c2410c", red: "#dc2626",
  sans: "'Syne', sans-serif", mono: "'DM Mono', monospace",
  isDark: false,
};

const T = { ...DARK_T };
function applyScale(s) {
  const el = document.getElementById("app-scaler");
  if (!el) return;
  if (s === 1) {
    el.style.transform = "";
    el.style.width = "";
    el.style.height = "";
  } else {
    el.style.transform = `scale(${s})`;
    el.style.width = `${100/s}%`;
    el.style.height = `${100/s}%`;
  }
}

function applyTheme(name) {
  const src = name === "light" ? LIGHT_T : DARK_T;
  Object.assign(T, src);
  document.body.style.background = T.bg;
  document.body.className = name === "light" ? "light" : "";
  try { localStorage.setItem("setlab_theme", name); } catch {}
}

// Font scale context
const ScaleCtx = createContext(1);
function useScale() { return useContext(ScaleCtx); }
function fs(base, scale) { return Math.round(base * scale); }

const E_COLORS = ["","#2d3748","#1e40af","#2563eb","#0284c7","#059669","#65a30d","#ca8a04","#ea580c","#dc2626","#9f1239"];
const HOUSE_ACCENT = "#4a90d9";

function LogoMark({ size = 36 }) {
  const g = T.gold;
  return (
    React.createElement("div", {"style": { position:"relative", width:size, height:size }}, React.createElement("style", null, `
        @keyframes slSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slBub1 { 0%,100%{transform:translateY(0);opacity:.7} 50%{transform:translateY(-4px);opacity:.25} }
        @keyframes slBub2 { 0%,100%{transform:translateY(0);opacity:.5} 60%{transform:translateY(-5px);opacity:.15} }
        @keyframes slBub3 { 0%,100%{transform:translateY(0);opacity:.55} 40%{transform:translateY(-3px);opacity:.2} }
        @keyframes slNeedle { from{transform:rotate(-26deg)} to{transform:rotate(-13deg)} }
        .sl-disk { transform-origin: 50% 50%; animation: slSpin 4s linear infinite; }
        .sl-b1 { animation: slBub1 2.2s ease-in-out infinite; }
        .sl-b2 { animation: slBub2 2.8s ease-in-out infinite .6s; }
        .sl-b3 { animation: slBub3 2s ease-in-out infinite 1.1s; }
        .sl-needle { transform-origin: 94% 30%; animation: slNeedle 1.2s cubic-bezier(.4,0,.2,1) forwards .3s; transform:rotate(-26deg); }
      `), React.createElement("svg", {"width": size, "height": size, "viewBox": "0 0 44 44", "fill": "none", "overflow": "visible"}, React.createElement("g", {"className": "sl-disk"}, React.createElement("circle", {"cx": "22", "cy": "22", "r": "20", "fill": "#0c0a08"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "20", "fill": "none", "stroke": g, "strokeWidth": "0.5", "opacity": "0.35"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "18.5", "fill": "none", "stroke": "#4a4540", "strokeWidth": "1.1"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "16", "fill": "none", "stroke": "#3d3830", "strokeWidth": "0.8"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "13.5", "fill": "none", "stroke": "#4a4540", "strokeWidth": "0.8"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "11", "fill": "none", "stroke": g, "strokeWidth": "0.4", "opacity": "0.3"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "9", "fill": "#1f1a0e"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "9", "fill": "none", "stroke": g, "strokeWidth": "0.8", "opacity": "0.7"}), React.createElement("rect", {"x": "19.5", "y": "13.5", "width": "5", "height": "5.5", "rx": "1.2", "fill": "none", "stroke": g, "strokeWidth": "1.1"}), React.createElement("line", {"x1": "20.2", "y1": "16.5", "x2": "24.2", "y2": "16.5", "stroke": g, "strokeWidth": "0.5", "opacity": "0.45"}), React.createElement("path", {"d": "M19.5 19 L14 30 Q13.5 32 15.5 32 L28.5 32 Q30.5 32 30 30 L24.5 19 Z", "fill": "#0e0c07", "stroke": g, "strokeWidth": "1.1", "strokeLinejoin": "round"}), React.createElement("path", {"d": "M14.5 28.5 L29.5 28.5 Q30.2 32 28.5 32 L15.5 32 Q13.8 32 14.5 28.5 Z", "fill": g, "opacity": "0.2"}), React.createElement("ellipse", {"cx": "22", "cy": "27", "rx": "5.5", "ry": "2.2", "fill": "none", "stroke": g, "strokeWidth": "0.4", "opacity": "0.25"}), React.createElement("ellipse", {"cx": "22", "cy": "27", "rx": "3", "ry": "1.2", "fill": "none", "stroke": g, "strokeWidth": "0.35", "opacity": "0.18"}), React.createElement("circle", {"className": "sl-b1", "cx": "17", "cy": "24", "r": "0.9", "fill": g, "opacity": "0.7"}), React.createElement("circle", {"className": "sl-b2", "cx": "22", "cy": "26", "r": "0.7", "fill": g, "opacity": "0.5"}), React.createElement("circle", {"className": "sl-b3", "cx": "19.5", "cy": "21", "r": "0.6", "fill": g, "opacity": "0.55"}), React.createElement("circle", {"cx": "25.5", "cy": "25", "r": "0.5", "fill": g, "opacity": "0.3"})), React.createElement("circle", {"cx": "22", "cy": "22", "r": "1.4", "fill": "#030201"}), React.createElement("circle", {"cx": "22", "cy": "22", "r": "1.4", "fill": "none", "stroke": g, "strokeWidth": "0.4", "opacity": "0.4"}), React.createElement("circle", {"cx": "40", "cy": "7", "r": "2.8", "fill": "#141210", "stroke": g, "strokeWidth": "0.6", "opacity": "0.7"}), React.createElement("circle", {"cx": "40", "cy": "7", "r": "1.2", "fill": g, "opacity": "0.55"}), React.createElement("g", {"className": "sl-needle"}, React.createElement("line", {"x1": "40", "y1": "7", "x2": "27", "y2": "30", "stroke": g, "strokeWidth": "1.1", "strokeLinecap": "round", "opacity": "0.75"}), React.createElement("rect", {"x": "24.5", "y": "28.5", "width": "5", "height": "3", "rx": "1", "fill": "#1a1408", "stroke": g, "strokeWidth": "0.8", "opacity": "0.9"}), React.createElement("circle", {"cx": "27", "cy": "33", "r": "1.1", "fill": g, "opacity": "0.95"}))))
  );
}

function LogoFull() {
  return (
    React.createElement("div", {"style": { display:"flex", alignItems:"center", gap:11 }}, React.createElement(LogoMark, {"size": 36}), React.createElement("div", {"style": { display:"flex", flexDirection:"column", gap:0, lineHeight:1 }}, React.createElement("div", {"style": { display:"flex", alignItems:"baseline", gap:0 }}, React.createElement("span", {"style": {fontFamily:T.sans,fontSize:18,fontWeight:800,letterSpacing:-0.5,color:T.gold,lineHeight:1}}, "SET"), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:18,fontWeight:300,letterSpacing:4,color:"#aca49a",lineHeight:1,marginLeft:2}}, "LAB")), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:6.5,letterSpacing:2.5,color:"#b8b0a8",textTransform:"uppercase",marginTop:2}}, "dj set planner")))
  );
}

const TRACKS = [
  // --- TECHNO OSCURO / BERLIN ---
  {id:1,  title:"Heartbeat",              artist:"Adam Beyer",           bpm:132,key:"11A",energy:8,style:["techno","dark"],               pop:42, label:"Drumcode"},
  {id:2,  title:"Your Mind Is a Box (Let Us Fill It With Wonder)", artist:"Adam Beyer & Ida Engberg", bpm:130,key:"10A",energy:7,style:["techno","dark"],pop:38,label:"Drumcode"},
  {id:3,  title:"Doppler",                artist:"Charlotte de Witte",   bpm:134,key:"12A",energy:9,style:["techno","hard techno"],         pop:52, label:"KNTXT"},
  {id:4,  title:"Doppler (Remixed)",      artist:"Charlotte de Witte",   bpm:136,key:"1A", energy:9,style:["techno","hard techno"],         pop:48, label:"KNTXT"},
  {id:5,  title:"Return to Nowhere",      artist:"Charlotte de Witte",   bpm:131,key:"11B",energy:8,style:["techno","dark"],                pop:55, label:"KNTXT"},
  {id:6,  title:"Obscur",                 artist:"Amelie Lens",          bpm:133,key:"12B",energy:8,style:["techno","dark"],                pop:50, label:"Exhale"},
  {id:7,  title:"LOVE",                   artist:"Amelie Lens",          bpm:135,key:"2A", energy:9,style:["techno","hard techno"],         pop:58, label:"Exhale"},
  {id:8,  title:"Exhale",                 artist:"Amelie Lens",          bpm:129,key:"10B",energy:7,style:["techno","dark"],                pop:45, label:"Exhale"},
  {id:9,  title:"Skin",                   artist:"Ben Klock",            bpm:126,key:"9A", energy:6,style:["deep techno","dark"],           pop:40, label:"Ostgut Ton"},
  {id:10, title:"Subzero",                artist:"Ben Klock",            bpm:128,key:"10A",energy:7,style:["deep techno","dark"],           pop:38, label:"Ostgut Ton"},
  {id:11, title:"One",                    artist:"Ben Klock",            bpm:125,key:"8B", energy:7,style:["techno","dark"],                pop:44, label:"Ostgut Ton"},
  {id:12, title:"Solitary Daze",          artist:"Ben Klock",            bpm:130,key:"11A",energy:8,style:["techno","dark"],                pop:36, label:"Ostgut Ton"},
  {id:13, title:"Tresor",                 artist:"Surgeon",              bpm:127,key:"9B", energy:7,style:["techno","industrial"],          pop:32, label:"Counterbalance"},
  {id:14, title:"Force + Form",           artist:"Surgeon",              bpm:130,key:"10A",energy:8,style:["techno","industrial"],          pop:28, label:"Counterbalance"},
  {id:15, title:"Magneze",                artist:"Marcel Dettmann",      bpm:127,key:"9A", energy:7,style:["deep techno","dark"],           pop:35, label:"MDR"},
  {id:16, title:"Undulation",             artist:"Marcel Dettmann",      bpm:125,key:"8A", energy:6,style:["deep techno","minimal"],        pop:30, label:"MDR"},
  {id:17, title:"Pylon",                  artist:"Perc",                 bpm:133,key:"11A",energy:8,style:["industrial techno","hard techno"],pop:22,label:"Perc Trax"},
  {id:18, title:"Black Acid",             artist:"Perc",                 bpm:130,key:"10A",energy:8,style:["industrial techno","acid"],     pop:19, label:"Perc Trax"},
  {id:19, title:"Predator",               artist:"Ancient Methods",      bpm:134,key:"10B",energy:9,style:["industrial techno","dark"],     pop:28, label:"Figure"},
  {id:20, title:"Metropolis",             artist:"Ancient Methods",      bpm:136,key:"11A",energy:9,style:["industrial techno","hard techno"],pop:24,label:"Figure"},
  // --- TECHNO HIPNÓTICO / BERGHAIN ---
  {id:21, title:"Ritual",                 artist:"DVS1",                 bpm:126,key:"9A", energy:7,style:["deep techno","dark"],           pop:30, label:"Houndstooth"},
  {id:22, title:"Nothing Is Real",        artist:"DVS1",                 bpm:127,key:"8A", energy:7,style:["techno","dark"],                pop:28, label:"Houndstooth"},
  {id:23, title:"Aleph",                  artist:"Donato Dozzy",         bpm:117,key:"5B", energy:4,style:["deep techno","hypnotic"],       pop:25, label:"Spazio Disponibile"},
  {id:24, title:"K",                      artist:"Donato Dozzy",         bpm:115,key:"4A", energy:4,style:["hypnotic","deep techno"],       pop:22, label:"Spazio Disponibile"},
  {id:25, title:"Mono No Aware",          artist:"Shifted",              bpm:122,key:"7A", energy:6,style:["deep techno","minimal"],        pop:18, label:"Mote-Evolver"},
  {id:26, title:"Phase Space",            artist:"Phase Fatale",         bpm:126,key:"8A", energy:7,style:["dark techno","hypnotic"],       pop:32, label:"Afterlife"},
  {id:27, title:"Eltanin",                artist:"Phase Fatale",         bpm:128,key:"9B", energy:7,style:["dark techno","hypnotic"],       pop:29, label:"Afterlife"},
  {id:28, title:"Labyrinth",              artist:"Svreca",               bpm:131,key:"11B",energy:8,style:["industrial techno","hard techno"],pop:18,label:"Semantica Records"},
  {id:29, title:"Arrhythmia",             artist:"Cio D'Or",             bpm:125,key:"8A", energy:6,style:["techno","minimal"],             pop:15, label:"Semantica Records"},
  {id:30, title:"Klartraum",              artist:"Rrose",                bpm:123,key:"7B", energy:6,style:["techno","ambient techno"],      pop:20, label:"Eaux"},
  // --- TECHNO DURO / HARD TECHNO ---
  {id:31, title:"Hydro Bounce",           artist:"Headless Horseman",    bpm:138,key:"1A", energy:9,style:["hard techno","industrial"],     pop:28, label:"Muscletone"},
  {id:32, title:"Bionic",                 artist:"Headless Horseman",    bpm:140,key:"2A", energy:9,style:["hard techno","dark"],           pop:25, label:"Muscletone"},
  {id:33, title:"Trinity",                artist:"Reinier Zonneveld",    bpm:141,key:"3A", energy:9,style:["hard techno","techno"],         pop:42, label:"Filth on Acid"},
  {id:34, title:"Psycho",                 artist:"Reinier Zonneveld",    bpm:138,key:"12B",energy:9,style:["hard techno","industrial"],     pop:38, label:"Filth on Acid"},
  {id:35, title:"Machine",               artist:"Alignment",            bpm:136,key:"1B", energy:9,style:["hard techno","dark"],           pop:35, label:"Filth on Acid"},
  {id:36, title:"Labyrinth",             artist:"Alignment",            bpm:134,key:"12A",energy:8,style:["hard techno","techno"],         pop:30, label:"Filth on Acid"},
  {id:37, title:"Machination",            artist:"Drumcell",             bpm:133,key:"11A",energy:8,style:["industrial techno","hard techno"],pop:18,label:"Droid Recordings"},
  // --- DUB TECHNO / MINIMAL ---
  {id:38, title:"C2",                     artist:"Kareem",               bpm:124,key:"8B", energy:6,style:["techno","dub techno"],          pop:14, label:"Sandwell District"},
  {id:39, title:"Wad",                    artist:"Developer",            bpm:126,key:"9A", energy:6,style:["techno","industrial"],          pop:12, label:"Sandwell District"},
  {id:40, title:"Refraction",             artist:"Answer Code Req.",     bpm:128,key:"10A",energy:7,style:["techno","dub techno"],          pop:18, label:"Token Records"},
  {id:41, title:"Demonize",               artist:"Answer Code Req.",     bpm:130,key:"11A",energy:7,style:["techno","dark"],                pop:15, label:"Token Records"},
  // --- ELECTRO / ACID ---
  {id:42, title:"Drexciyan Storm",        artist:"DJ Stingray 313",      bpm:123,key:"9A", energy:7,style:["electro","techno"],             pop:30, label:"Tresor Records"},
  {id:43, title:"Poltergeist",            artist:"Legowelt",             bpm:119,key:"6A", energy:5,style:["acid","electro"],               pop:28, label:"Clone Records"},
  {id:44, title:"The Simulation",         artist:"I-f",                  bpm:130,key:"10A",energy:8,style:["acid","electro"],               pop:20, label:"Clone Records"},
  {id:45, title:"Lost in Space",          artist:"Nina Kraviz",          bpm:131,key:"11B",energy:8,style:["techno","acid"],                pop:52, label:"трип"},
  {id:46, title:"I'm Gonna Get You",      artist:"Nina Kraviz",          bpm:128,key:"9A", energy:7,style:["techno","acid"],                pop:55, label:"трип"},
  {id:47, title:"Ghetto Kraviz",          artist:"Nina Kraviz",          bpm:126,key:"8B", energy:7,style:["techno","chicago"],             pop:60, label:"трип"},
  // --- MELODIC TECHNO / DARK TRANCE ---
  {id:48, title:"Menhir",                 artist:"Innellea",             bpm:130,key:"10B",energy:7,style:["melodic techno","dark"],        pop:32, label:"Innellea"},
  {id:49, title:"The Ritual",             artist:"Alignment",            bpm:133,key:"12A",energy:8,style:["melodic techno","dark"],        pop:28, label:"Afterlife"},
  {id:50, title:"Pantheon",               artist:"Tale Of Us",           bpm:128,key:"9A", energy:6,style:["melodic techno","ambient techno"],pop:55,label:"Afterlife"},
  {id:51, title:"Another Earth",          artist:"Tale Of Us",           bpm:126,key:"8A", energy:5,style:["melodic techno","deep techno"], pop:48, label:"Afterlife"},
  {id:52, title:"Koor",                   artist:"Recondite",            bpm:120,key:"7A", energy:5,style:["deep techno","ambient techno"], pop:22, label:"Ghostly International"},
  {id:53, title:"Hinterland",             artist:"Recondite",            bpm:118,key:"6A", energy:4,style:["deep techno","minimal"],        pop:20, label:"Ghostly International"},
  // --- TECHNO CLÁSICO / DETROIT ---
  {id:54, title:"Strings of Life",        artist:"Derrick May",          bpm:122,key:"7A", energy:7,style:["detroit techno","classic"],     pop:55, label:"Transmat"},
  {id:55, title:"Beyond the Dance",       artist:"Derrick May",          bpm:120,key:"6B", energy:6,style:["detroit techno","classic"],     pop:45, label:"Transmat"},
  {id:56, title:"It Is What It Is",       artist:"Surgeon",              bpm:129,key:"10B",energy:7,style:["techno","industrial"],          pop:24, label:"Counterbalance"},
  // --- DARK HOUSE / DUB HOUSE ---
  {id:57, title:"Creep",                  artist:"Pearson Sound",        bpm:126,key:"8B", energy:7,style:["dark house","bass"],            pop:24, label:"Hessle Audio"},
  {id:58, title:"Agnes Apparatus",        artist:"Objekt",               bpm:126,key:"10A",energy:7,style:["techno","dark"],               pop:30, label:"TJ Hertz / Objekt"},
  {id:59, title:"Two Completely Different Things", artist:"Objekt",      bpm:124,key:"9B", energy:6,style:["techno","minimal"],             pop:32, label:"TJ Hertz / Objekt"},
  {id:60, title:"Violence",               artist:"Andy Stott",           bpm:119,key:"5A", energy:5,style:["dark house","dub"],             pop:28, label:"Modern Love"},
  {id:61, title:"Needle & Thread",        artist:"Andy Stott",           bpm:117,key:"4B", energy:4,style:["dark house","ambient"],        pop:26, label:"Modern Love"},
  {id:62, title:"Shed",                   artist:"Shed",                 bpm:122,key:"7B", energy:6,style:["deep house","dark"],            pop:15, label:"Ostgut Ton"},
  {id:63, title:"Substance",              artist:"L.B. Dub Corp",        bpm:119,key:"6B", energy:5,style:["dub house","deep house"],       pop:10, label:"Ostgut Ton"},
  {id:64, title:"Untitled 4",             artist:"Actress",              bpm:118,key:"5B", energy:4,style:["dark house","minimal"],         pop:18, label:"Werkdiscs"},
  // --- DEEP HOUSE / CLÁSICOS ---
  {id:65, title:"You're Mine",            artist:"Larry Heard",          bpm:116,key:"3B", energy:4,style:["deep house","chicago"],        pop:38, label:"Alleviated Records"},
  {id:66, title:"The Sun Can't Compare",  artist:"Larry Heard",          bpm:115,key:"3A", energy:4,style:["deep house","chicago"],        pop:35, label:"Alleviated Records"},
  {id:67, title:"Glisten",                artist:"Bicep",                bpm:128,key:"10A",energy:6,style:["deep house","melodic house"],   pop:62, label:"Ninja Tune"},
  {id:68, title:"Orca",                   artist:"Bicep",                bpm:130,key:"11B",energy:7,style:["deep house","melodic house"],   pop:58, label:"Ninja Tune"},
  {id:69, title:"Aura",                   artist:"Bicep",                bpm:124,key:"8A", energy:5,style:["melodic house","deep house"],   pop:55, label:"Ninja Tune"},
  {id:70, title:"Atlas",                  artist:"Bicep",                bpm:126,key:"9B", energy:6,style:["melodic house","deep house"],   pop:50, label:"Ninja Tune"},
  {id:71, title:"I'm Gonna Get You",      artist:"DJ Deeon",             bpm:127,key:"8A", energy:7,style:["ghetto house","chicago"],      pop:14, label:"Dance Mania"},
  {id:72, title:"We On",                  artist:"DJ Deeon",             bpm:126,key:"7B", energy:7,style:["ghetto house","chicago"],      pop:12, label:"Dance Mania"},
  // --- DRUM & BASS / DUBSTEP ---
  {id:73, title:"Nothing",               artist:"Burial",               bpm:140,key:"5A", energy:5,style:["dubstep","dark house"],        pop:45, label:"Hyperdub"},
  {id:74, title:"Archangel",             artist:"Burial",               bpm:138,key:"4B", energy:6,style:["dubstep","ambient"],           pop:48, label:"Hyperdub"},
  {id:75, title:"Blood on My Hands",     artist:"Shackleton",           bpm:138,key:"2B", energy:7,style:["dubstep","tribal"],            pop:20, label:"Skull Disco"},
  {id:76, title:"Northern Exposure",     artist:"Pessimist",            bpm:172,key:"4A", energy:8,style:["drum and bass","dark"],        pop:22, label:"Pessimist Productions"},

  // --- TECHNO ADICIONAL ---
  {id:77,  title:"Siren",                 artist:"Blawan",               bpm:134,key:"12A",energy:9,style:["industrial techno","hard techno"], pop:30, label:"Ternesc"},
  {id:78,  title:"Getting Me Down",       artist:"Blawan",               bpm:132,key:"11A",energy:8,style:["techno","industrial techno"],      pop:28, label:"Ternesc"},
  {id:79,  title:"Cascades",              artist:"Function",             bpm:128,key:"9A", energy:7,style:["deep techno","dark"],              pop:22, label:"Sandwell District"},
  {id:80,  title:"Obsession",             artist:"Function",             bpm:126,key:"8A", energy:6,style:["deep techno","ambient techno"],    pop:20, label:"Sandwell District"},
  {id:81,  title:"Boiler",                artist:"Paula Temple",         bpm:136,key:"1A", energy:9,style:["industrial techno","hard techno"], pop:25, label:"Noise Manifesto"},
  {id:82,  title:"Core",                  artist:"Paula Temple",         bpm:138,key:"2B", energy:9,style:["hard techno","industrial techno"], pop:22, label:"Noise Manifesto"},
  {id:83,  title:"Eternal Drift",         artist:"Truncate",             bpm:130,key:"11A",energy:8,style:["techno","dark"],                   pop:20, label:"Truncate"},
  {id:84,  title:"Payload",               artist:"Truncate",             bpm:128,key:"9B", energy:7,style:["techno","industrial techno"],      pop:18, label:"Truncate"},
  {id:85,  title:"Takt",                  artist:"Sigha",                bpm:127,key:"9A", energy:7,style:["deep techno","minimal"],           pop:15, label:"Token Records"},
  {id:86,  title:"Aether",                artist:"Sigha",                bpm:125,key:"8A", energy:6,style:["deep techno","ambient techno"],    pop:14, label:"Token Records"},
  {id:87,  title:"Parallax",              artist:"Inigo Kennedy",        bpm:129,key:"10A",energy:7,style:["techno","dark"],                   pop:16, label:"Token Records"},
  {id:88,  title:"Void",                  artist:"Inigo Kennedy",        bpm:131,key:"11B",energy:8,style:["techno","industrial techno"],      pop:14, label:"Token Records"},
  {id:89,  title:"Raw Cut",               artist:"Surgeon",              bpm:133,key:"12A",energy:8,style:["techno","industrial"],             pop:24, label:"Counterbalance"},
  {id:90,  title:"Force Majeure",         artist:"Ancient Methods",      bpm:135,key:"1A", energy:9,style:["industrial techno","dark"],        pop:26, label:"Figure"},
  {id:91,  title:"Kharon",               artist:"Rebekah",              bpm:134,key:"12B",energy:8,style:["industrial techno","techno"],      pop:22, label:"Infrastructure"},
  {id:92,  title:"Binary",               artist:"Rebekah",              bpm:132,key:"11A",energy:8,style:["techno","dark"],                   pop:20, label:"Infrastructure"},
  {id:93,  title:"Hyper Tension",        artist:"Truss",                bpm:128,key:"10A",energy:7,style:["techno","industrial techno"],      pop:16, label:"Perc Trax"},
  {id:94,  title:"Plasticity",           artist:"Varg",                 bpm:140,key:"2A", energy:9,style:["hard techno","industrial techno"], pop:20, label:"Northern Electronics"},
  {id:95,  title:"Mördare",              artist:"Varg",                 bpm:138,key:"1B", energy:9,style:["industrial techno","dark"],        pop:18, label:"Northern Electronics"},
  {id:96,  title:"Swarm",               artist:"Orphx",                bpm:136,key:"12A",energy:8,style:["industrial techno","hard techno"], pop:14, label:"Sonic Groove"},
  {id:97,  title:"Overdrive",            artist:"Orphx",                bpm:134,key:"11A",energy:8,style:["techno","industrial techno"],      pop:12, label:"Sonic Groove"},
  {id:98,  title:"System",              artist:"Surgeon",              bpm:131,key:"10B",energy:7,style:["techno","industrial"],             pop:22, label:"Counterbalance"},
  {id:99,  title:"Klaxon",              artist:"Slam",                 bpm:132,key:"11A",energy:8,style:["techno","industrial techno"],      pop:30, label:"Soma Records"},
  {id:100, title:"Positive Education",  artist:"Slam",                 bpm:128,key:"9A", energy:7,style:["techno","dark"],                   pop:35, label:"Soma Records"},
  {id:101, title:"Pitch Black",         artist:"Speedy J",             bpm:130,key:"10A",energy:7,style:["techno","industrial techno"],      pop:28, label:"Tresor Records"},
  {id:102, title:"G Spot",              artist:"Speedy J",             bpm:127,key:"8B", energy:7,style:["techno","acid"],                   pop:25, label:"Tresor Records"},
  {id:103, title:"Mindkiller",          artist:"Oscar Mulero",         bpm:133,key:"12A",energy:8,style:["techno","dark"],                   pop:18, label:"Warm Up Recordings"},
  {id:104, title:"Black Sun",           artist:"Oscar Mulero",         bpm:131,key:"11B",energy:8,style:["industrial techno","dark"],        pop:16, label:"Warm Up Recordings"},

  // --- HYPNOTIC / RAVE ADICIONAL ---
  {id:105, title:"Khohen",              artist:"Kobosil",              bpm:130,key:"10A",energy:7,style:["techno","hypnotic"],               pop:28, label:"RH-05"},
  {id:106, title:"M_REC",              artist:"Kobosil",              bpm:128,key:"9B", energy:7,style:["techno","dark"],                   pop:25, label:"RH-05"},
  {id:107, title:"Strobe",             artist:"Deadmau5",             bpm:128,key:"9A", energy:6,style:["melodic techno","ambient techno"], pop:62, label:"mau5trap"},
  {id:108, title:"Some Chords",        artist:"Deadmau5",             bpm:126,key:"8A", energy:5,style:["melodic techno","deep techno"],    pop:58, label:"mau5trap"},
  {id:109, title:"Fragment",           artist:"Blawan",               bpm:136,key:"1B", energy:9,style:["hard techno","industrial techno"], pop:26, label:"Ternesc"},
  {id:110, title:"Spectral",           artist:"Phase Fatale",         bpm:130,key:"10B",energy:7,style:["dark techno","hypnotic"],          pop:28, label:"Afterlife"},
  {id:111, title:"Onyx",               artist:"Alignment",            bpm:132,key:"12A",energy:8,style:["melodic techno","dark"],           pop:26, label:"Afterlife"},
  {id:112, title:"Nexus",              artist:"Innellea",             bpm:128,key:"9A", energy:6,style:["melodic techno","ambient techno"], pop:28, label:"Innellea"},
  {id:113, title:"Beyond Reason",      artist:"SPFDJ",                bpm:150,key:"3A", energy:9,style:["hard techno","industrial techno"], pop:38, label:"Ilian Tape"},
  {id:114, title:"Netzwerk",           artist:"SPFDJ",                bpm:148,key:"2B", energy:9,style:["hard techno","techno"],            pop:35, label:"Ilian Tape"},
  {id:115, title:"Bevel",              artist:"Skee Mask",            bpm:130,key:"10A",energy:6,style:["deep techno","ambient techno"],    pop:30, label:"Ilian Tape"},
  {id:116, title:"Dial 3",             artist:"Skee Mask",            bpm:128,key:"9B", energy:6,style:["techno","deep techno"],            pop:28, label:"Ilian Tape"},
  {id:117, title:"Shackles",           artist:"I Hate Models",        bpm:142,key:"3B", energy:9,style:["hard techno","industrial techno"], pop:45, label:"Arts"},
  {id:118, title:"Away From Earth",    artist:"I Hate Models",        bpm:138,key:"1A", energy:8,style:["techno","industrial techno"],      pop:40, label:"Arts"},
  {id:119, title:"Hafen",              artist:"HardFist",             bpm:144,key:"4A", energy:9,style:["hard techno","industrial techno"], pop:22, label:"Perc Trax"},

  // --- DEEP HOUSE / MELODIC ADICIONAL ---
  {id:120, title:"Sweat",              artist:"Move D",               bpm:122,key:"7B", energy:5,style:["deep house","chicago"],            pop:18, label:"Running Back"},
  {id:121, title:"Sunshine",           artist:"Move D",               bpm:120,key:"6A", energy:5,style:["deep house","melodic house"],      pop:20, label:"Running Back"},
  {id:122, title:"Cascades",           artist:"dOP",                  bpm:124,key:"8B", energy:5,style:["deep house","minimal"],            pop:22, label:"Innervisions"},
  {id:123, title:"Unison",             artist:"Dixon",                bpm:126,key:"9A", energy:6,style:["deep house","melodic house"],      pop:38, label:"Innervisions"},
  {id:124, title:"Phantasy",           artist:"Âme",                  bpm:128,key:"9B", energy:6,style:["melodic house","deep house"],      pop:42, label:"Innervisions"},
  {id:125, title:"Rej",                artist:"Âme",                  bpm:126,key:"8A", energy:6,style:["deep house","melodic house"],      pop:40, label:"Innervisions"},
  {id:126, title:"Faded",              artist:"Tensnake",             bpm:124,key:"8B", energy:6,style:["deep house","melodic house"],      pop:35, label:"Watergate Records"},
  {id:127, title:"What You Gonna Do",  artist:"Tiger & Woods",        bpm:120,key:"6B", energy:5,style:["deep house","chicago"],            pop:20, label:"Edizioni Mondo"},
  {id:128, title:"Tresillo",           artist:"Tiger & Woods",        bpm:118,key:"5A", energy:5,style:["deep house","minimal"],            pop:18, label:"Edizioni Mondo"},
  {id:129, title:"It's Yours",         artist:"JT Donaldson",         bpm:122,key:"7A", energy:6,style:["deep house","chicago"],            pop:16, label:"Gooiland Electro"},
  {id:130, title:"Raw Cuts",           artist:"Hunee",                bpm:124,key:"8A", energy:5,style:["deep house","chicago"],            pop:24, label:"Running Back"},
  {id:131, title:"Hunch Music",        artist:"Hunee",                bpm:122,key:"7B", energy:5,style:["deep house","melodic house"],      pop:22, label:"Running Back"},
  {id:132, title:"Devotion",           artist:"Peggy Gou",            bpm:126,key:"8B", energy:6,style:["deep house","melodic house"],      pop:52, label:"Gudu Records"},
  {id:133, title:"Han Jan",            artist:"Peggy Gou",            bpm:124,key:"8A", energy:6,style:["melodic house","deep house"],      pop:48, label:"Gudu Records"},
  {id:134, title:"Rebound",            artist:"Mall Grab",            bpm:128,key:"9A", energy:7,style:["dark house","bass"],               pop:30, label:"Steel City Dance Discs"},
  {id:135, title:"Galaxy Thumpin",     artist:"Mall Grab",            bpm:130,key:"10B",energy:7,style:["dark house","deep house"],         pop:28, label:"Steel City Dance Discs"},
  {id:136, title:"Rinse & Repeat",     artist:"Richy Ahmed",          bpm:126,key:"8A", energy:6,style:["deep house","dark house"],         pop:22, label:"Hot Creations"},
];

// Índice de estilos para matching rápido
const STYLE_FAMILY = {
  "hard techno":      ["techno","industrial techno","hard techno"],
  "industrial techno":["techno","industrial techno","hard techno","acid"],
  "dark techno":      ["techno","dark","deep techno","hypnotic"],
  "deep techno":      ["deep techno","hypnotic","minimal","ambient techno","dub techno"],
  "melodic techno":   ["melodic techno","deep techno","ambient techno","melodic house"],
  "ambient techno":   ["ambient techno","deep techno","melodic techno","hypnotic"],
  "detroit techno":   ["techno","detroit techno","classic","acid"],
  "acid":             ["acid","electro","techno","industrial techno"],
  "electro":          ["electro","acid","techno"],
  "dark house":       ["dark house","deep house","dub house","bass"],
  "deep house":       ["deep house","dark house","melodic house","chicago","dub house"],
  "melodic house":    ["melodic house","deep house","melodic techno"],
  "dubstep":          ["dubstep","dark house","bass","ambient"],
  "drum and bass":    ["drum and bass","dark"],
  "chicago":          ["chicago","deep house","ghetto house"],
  "ghetto house":     ["ghetto house","chicago","deep house"],
};

const TECHNO_STYLES = ["all","techno","deep techno","dark","industrial techno","hard techno","acid","electro","dub techno","hypnotic","ambient techno","melodic techno","detroit techno"];
const HOUSE_STYLES  = ["dark house","deep house","melodic house","dub house","chicago","ghetto house","dubstep","bass"];

// Plataforma principal por sello
const LABEL_STORE = {
  "Drumcode":             "beatport",
  "KNTXT":                "beatport",
  "Exhale":               "beatport",
  "Ostgut Ton":           "beatport",
  "Counterbalance":       "beatport",
  "MDR":                  "beatport",
  "Perc Trax":            "beatport",
  "Figure":               "beatport",
  "Houndstooth":          "beatport",
  "Spazio Disponibile":   "beatport",
  "Mote-Evolver":         "beatport",
  "Afterlife":            "beatport",
  "Semantica Records":    "beatport",
  "Eaux":                 "beatport",
  "Muscletone":           "beatport",
  "Filth on Acid":        "beatport",
  "Droid Recordings":     "beatport",
  "Sandwell District":    "beatport",
  "Token Records":        "beatport",
  "Tresor Records":       "beatport",
  "Clone Records":        "beatport",
  "трип":                 "beatport",
  "Innellea":             "beatport",
  "Ghostly International":"beatport",
  "Transmat":             "beatport",
  "Hessle Audio":         "beatport",
  "TJ Hertz / Objekt":   "beatport",
  "Modern Love":          "beatport",
  "Werkdiscs":            "beatport",
  "Ninja Tune":           "beatport",
  "Pessimist Productions":"beatport",
  "Skull Disco":          "bandcamp",
  "Alleviated Records":   "bandcamp",
  "Dance Mania":          "bandcamp",
  "Hyperdub":             "discogs",
  "Ternesc":              "beatport",
  "Infrastructure":       "beatport",
  "Northern Electronics": "bandcamp",
  "Sonic Groove":         "beatport",
  "Soma Records":         "beatport",
  "Warm Up Recordings":   "beatport",
  "RH-05":                "beatport",
  "mau5trap":             "beatport",
  "Ilian Tape":           "beatport",
  "Arts":                 "beatport",
  "Running Back":         "beatport",
  "Innervisions":         "beatport",
  "Watergate Records":    "beatport",
  "Edizioni Mondo":       "bandcamp",
  "Gooiland Electro":     "bandcamp",
  "Gudu Records":         "beatport",
  "Steel City Dance Discs":"beatport",
  "Hot Creations":        "beatport",
  "Noise Manifesto":      "bandcamp",
  "Truncate":             "beatport",
};

// ── BEATPORT AFFILIATE ─────────────────────────────────────────────────────
// Registrate en: https://www.beatport.com/affil/apply
// Reemplazá YOUR_ID con tu ID de afiliado una vez aprobado
const BP_AFFIL = ""; // ej: "setlab2025"
function bpUrl(q) {
  const base = `https://www.beatport.com/search?q=${q}`;
  return BP_AFFIL ? `${base}&affil=${BP_AFFIL}` : base;
}

const STORE_DEF = {
  beatport: { icon:"B",  color:"#01ff95", hint:"Beatport",  getUrl: q=>bpUrl(q) },
  bandcamp: { icon:"◈",  color:"#1da0c3", hint:"Bandcamp",  getUrl: q=>`https://bandcamp.com/search?q=${q}` },
  discogs:  { icon:"◎",  color:"#aaa",    hint:"Discogs",   getUrl: q=>`https://www.discogs.com/search/?q=${q}&type=release` },
};

function getStoreButtons(track) {
  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  const storeKey = LABEL_STORE[track.label];
  if (storeKey && STORE_DEF[storeKey]) {
    const s = STORE_DEF[storeKey];
    return [{ icon: s.icon, color: s.color, hint: s.hint, url: s.getUrl(q) }];
  }
  // Fallback: mostrar los tres si el sello no está mapeado
  return [
    { icon:"B",  color:"#01ff95", hint:"Beatport",  url:`https://www.beatport.com/search?q=${q}` },
    { icon:"◈",  color:"#1da0c3", hint:"Bandcamp",  url:`https://bandcamp.com/search?q=${q}` },
    { icon:"◎",  color:"#aaa",    hint:"Discogs",   url:`https://www.discogs.com/search/?q=${q}&type=release` },
  ];
}

function getLinks(track) {
  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  return [
    { name:"YouTube",    icon:"▶", color:"#ff4444", url:`https://www.youtube.com/results?search_query=${q}`,   hint:"Vista previa gratuita" },
    { name:"Beatport",   icon:"B", color:"#01ff95", url:bpUrl(q),                                              hint:"Compra / descarga WAV" },
    { name:"Bandcamp",   icon:"◈", color:"#1da0c3", url:`https://bandcamp.com/search?q=${q}`,                  hint:"Compra directa al artista" },
    { name:"SoundCloud", icon:"☁", color:"#ff5500", url:`https://soundcloud.com/search?q=${q}`,                hint:"Escucha gratuita / sets" },
    { name:"Discogs",    icon:"◎", color:"#888",    url:`https://www.discogs.com/search/?q=${q}&type=release`, hint:"Info del release / vinilo" },
  ];
}

function getLabelLinks(label) {
  const q = encodeURIComponent(label);
  return [
    { name:"Beatport",  icon:"B", color:"#01ff95", url:`https://www.beatport.com/search/labels?q=${q}`,                     hint:"Catálogo completo del sello" },
    { name:"Discogs",   icon:"◎", color:"#888",    url:`https://www.discogs.com/search/?q=${q}&type=label`,                 hint:"Todos los releases + vinilo" },
    { name:"Bandcamp",  icon:"◈", color:"#1da0c3", url:`https://bandcamp.com/search?q=${q}&item_type=b`,                    hint:"Descargas directas del sello" },
    { name:"SoundCloud",icon:"☁", color:"#ff5500", url:`https://soundcloud.com/search/sets?q=${q}`,                         hint:"Sets y previews del sello" },
  ];
}

function camelotScore(a, b) {
  const nA=parseInt(a), nB=parseInt(b), lA=a.slice(-1), lB=b.slice(-1);
  if(nA===nB&&lA===lB) return 100; // mismo — perfecto
  if(nA===nB) return 75;           // relativo mayor/menor
  const d=Math.min(Math.abs(nA-nB),12-Math.abs(nA-nB));
  if(d===1&&lA===lB) return 90;   // adyacente mismo modo
  if(d===1&&lA!==lB) return 50;   // adyacente cruzado
  if(d===2&&lA===lB) return 30;   // salto de 2 mismo modo
  if(d===2&&lA!==lB) return 15;   // salto de 2 cruzado
  if(d===3&&lA===lB) return 10;   // salto de 3 — arriesgado
  if(d===3&&lA!==lB) return 5;
  return 2;                        // > 3 — muy arriesgado pero no cero (no bloquear autobuild)
}
// styleCompatScore: calcula compatibilidad de estilos usando STYLE_FAMILY
function styleCompatScore(stylesA, stylesB) {
  // Match directo
  for (const s of stylesA) {
    if (stylesB.includes(s)) return 45;
  }
  // Match por familia de estilos
  for (const s of stylesA) {
    const familyA = STYLE_FAMILY[s] || [s];
    for (const t of stylesB) {
      const familyB = STYLE_FAMILY[t] || [t];
      if (familyA.some(f => familyB.includes(f))) return 30;
    }
  }
  return 10;
}

// scoreMatch: solo bloquea si BPM completamente incompatible (>16 BPM de diferencia)
function scoreMatch(seed, t) {
  const d = Math.abs(seed.bpm - t.bpm);
  const bpmScore = d===0?100:d<=2?95:d<=4?85:d<=7?65:d<=12?35:d<=15?10:0;
  const keyScore = camelotScore(seed.key, t.key); // nunca 0
  const eDiff = t.energy - seed.energy;
  const energyScore = eDiff===0?90:eDiff===1?100:eDiff===-1?80:eDiff===2?70:eDiff===-2?60:eDiff===3?50:eDiff===-3?30:10;
  const styleScore = styleCompatScore(seed.style, t.style);
  if(bpmScore===0) return {total:0,bpmScore,keyScore,energyScore,styleScore};
  const popBonus = t.pop > seed.pop + 5 ? 8 : 0;
  const total = bpmScore + keyScore + energyScore + styleScore + popBonus;
  return {total,bpmScore,keyScore,energyScore,styleScore};
}
function keyCompat(a, b) {
  const s=camelotScore(a,b);
  if(s===100) return {label:"PERFECTO", color:T.green, desc:"Misma clave — transición inaudible"};
  if(s>=90)   return {label:"ARMÓNICO", color:T.lime,  desc:"Adyacente mismo modo — fluye"};
  if(s>=75)   return {label:"MODAL",    color:T.yellow,desc:"Relativo mayor/menor"};
  if(s>=50)   return {label:"TENSIÓN",  color:T.orange,desc:"Adyacente cruzado — atrevido"};
  if(s>=15)   return {label:"SALTO",    color:"#f97316",desc:"Salto de 2–3 — requiere habilidad"};
  return             {label:"CHOQUE",   color:T.red,   desc:"Evitar o usar con intención"};
}
function isHouseTrack(track) {
  return track.style.some(s=>["dark house","deep house","dub house","chicago","ghetto house","bass","dub"].includes(s));
}

function KeyPill({ k, highlight }) {
  return (
    React.createElement("span", {"style": {fontFamily:T.mono,fontSize:10,fontWeight:500,background:highlight?"#1a1206":"#0f0f0f",border:`1px solid ${highlight?T.goldDim:"#1c1c1c"}`,padding:"2px 8px",borderRadius:3,color:highlight?T.gold:"#484440",letterSpacing:1.5,flexShrink:0,transition:"all 0.2s"}}, k)
  );
}

function EBar({ energy, showLabel }) {
  return (
    React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6}}, React.createElement("div", {"style": {display:"flex",gap:2}}, [...Array(10)].map((_,i)=>(
          React.createElement("div", {"key": i, "style": {width:3,height:i<energy?4+i*0.3:3,borderRadius:1,background:i<energy?E_COLORS[energy]:"#161614",transition:"all 0.3s",alignSelf:"flex-end"}})
        ))), showLabel&&React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textDim,letterSpacing:0.5}}, "e", energy))
  );
}

function ScoreBreakdown({ bpmScore, keyScore, energyScore, styleScore }) {
  const max=398;
  const segs=[
    {label:"BPM",val:bpmScore,color:"#0891b2"},
    {label:"KEY",val:keyScore,color:T.lime},
    {label:"NRG",val:energyScore,color:T.orange},
    {label:"STL",val:styleScore,color:T.gold},
  ];
  const total=bpmScore+keyScore+energyScore+styleScore;
  return (
    React.createElement("div", null, React.createElement("div", {"style": {display:"flex",height:2,borderRadius:2,overflow:"hidden",gap:1,marginBottom:5}}, segs.map(s=>React.createElement("div", {"key": s.label, "style": {width:`${(s.val/max)*100}%`,background:s.color,transition:"width 0.5s"}})), React.createElement("div", {"style": {flex:1,background:"#0e0e0e"}})), React.createElement("div", {"style": {display:"flex",gap:8,alignItems:"center"}}, segs.map(s=>(
          React.createElement("div", {"key": s.label, "style": {display:"flex",gap:3,alignItems:"center"}}, React.createElement("div", {"style": {width:4,height:4,borderRadius:1,background:s.color,opacity:s.val>0?1:0.2}}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:s.val>0?"#3a3836":"#1e1c1a",letterSpacing:0.5}}, s.label, s.val))
        )), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:9,color:total>240?T.green:total>140?T.yellow:"#3a3836",marginLeft:"auto",fontWeight:600}}, total)))
  );
}

function CompatConnector({ from, to }) {
  const c=keyCompat(from.key,to.key);
  const d=Math.abs(from.bpm-to.bpm);
  return (
    React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6,padding:"2px 4px 2px 30px"}}, React.createElement("div", {"style": {width:1,height:14,background:`${c.color}22`}}), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:7,fontWeight:700,color:c.color,letterSpacing:1.2}}, c.label), React.createElement("span", {"style": {color:"#141412"}}, "·"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textDim}}, from.key, "→", to.key), React.createElement("span", {"style": {color:"#141412"}}, "·"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:d>6?T.orange:T.textDim}}, "Δ", d, "BPM"))
  );
}

function StyleChip({ s, active, onClick, accent }) {
  return (
    React.createElement("button", {"onClick": onClick, "style": {
      flexShrink:0,
      background: active ? accent : T.isDark ? "#1e1c18" : "#ece8e2",
      color: active ? "#000" : T.isDark ? "#c8c4be" : "#5a5652",
      border: `1px solid ${active ? accent : T.isDark ? "#2e2c28" : "#d4cfc8"}`,
      fontSize:7.5, padding:"4px 10px", borderRadius:20, cursor:"pointer",
      letterSpacing:1, textTransform:"uppercase", fontFamily:T.sans,
      fontWeight: active ? 700 : 500,
      transition:"all 0.15s", WebkitTapHighlightColor:"transparent"
    }}, s)
  );
}



// ── PREVIEW EMBEDS ────────────────────────────────────────────────────────