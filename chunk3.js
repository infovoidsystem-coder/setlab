function EnergyFlowChart({ tracks }) {
  if(tracks.length<2) return null;
  const W=330,H=60,pad=12;
  const xStep=(W-pad*2)/(tracks.length-1);
  const toY=e=>pad+(H-pad*2)*(1-(e-1)/9);
  const pts=tracks.map((t,i)=>({x:pad+i*xStep,y:toY(t.energy),t}));
  let d=`M ${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<pts.length;i++) d+=` C ${pts[i-1].x+xStep*0.5} ${pts[i-1].y},${pts[i].x-xStep*0.5} ${pts[i].y},${pts[i].x} ${pts[i].y}`;
  return (
    React.createElement("div", {"style": {padding:"10px 12px 4px"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:7.5,color:T.textDim,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}, "flujo de energía"), React.createElement("svg", {"width": W, "height": H, "viewBox": `0 0 ${W} ${H}`}, React.createElement("defs", null, React.createElement("linearGradient", {"id": "eG", "x1": "0", "y1": "0", "x2": "0", "y2": "1"}, React.createElement("stop", {"offset": "0%", "stopColor": T.gold, "stopOpacity": "0.12"}), React.createElement("stop", {"offset": "100%", "stopColor": T.gold, "stopOpacity": "0"}))), [1,3,5,7,9].map(e=>React.createElement("line", {"key": e, "x1": pad, "x2": W-pad, "y1": toY(e), "y2": toY(e), "stroke": "#141210", "strokeWidth": "1", "strokeDasharray": "2,4"})), React.createElement("path", {"d": d+` L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`, "fill": "url(#eG)"}), React.createElement("path", {"d": d, "fill": "none", "stroke": T.gold, "strokeWidth": "1.5", "strokeLinecap": "round"}), pts.map((p,i)=>React.createElement("circle", {"key": i, "cx": p.x, "cy": p.y, "r": "2.5", "fill": E_COLORS[p.t.energy], "stroke": "#060504", "strokeWidth": "1.5"}))), React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",padding:`0 ${pad}px`}}, tracks.map((_,i)=>React.createElement("span", {"key": i, "style": {fontFamily:T.mono,fontSize:6.5,color:T.textGhost}}, i+1))))
  );
}

function EmptyState({ icon, headline, sub }) {
  return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:"0 44px"}}, React.createElement("div", {"style": {opacity:0.2}}, icon), React.createElement("div", {"style": {textAlign:"center"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:13,color:T.textMid,letterSpacing:-0.2,marginBottom:7}}, headline), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:10,fontWeight:400,color:T.textDim,lineHeight:2.2}}, sub)))
  );
}

function LibraryScreen({ seed, setSeed, mySet, addToSet, maxPop, setMaxPop, styleFilter, setStyleFilter, search, setSearch, onFind, djTracks=[] }) {
  const [labelFilter, setLabelFilter] = React.useState(null);
  const allTracks = React.useMemo(()=>[...TRACKS,...djTracks],[djTracks]);
  const allLabels = React.useMemo(()=>[...new Set(allTracks.map(t=>t.label).filter(Boolean))].sort(),[allTracks]);
  const list=useMemo(()=>allTracks.filter(t=>{
    if(!t.isEmergent && t.pop>maxPop) return false; // emergentes siempre pasan
    if(styleFilter!=="all"&&!t.style.includes(styleFilter)) return false;
    if(labelFilter&&t.label!==labelFilter) return false;
    if(search){const q=search.toLowerCase();return t.title.toLowerCase().includes(q)||t.artist.toLowerCase().includes(q)||(t.label||"").toLowerCase().includes(q);}
    return true;
  }),[styleFilter,maxPop,search,labelFilter,allTracks]);
  return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",height:"100%"}}, React.createElement("div", {"style": {padding:"8px 16px 0",flexShrink:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:T.textDim,lineHeight:1.6,fontWeight:400}}, "Tocá un track para marcarlo como", React.createElement("span", {"style": {color:T.gold,fontWeight:700}}, "semilla"), "→ BUILD sugerirá los próximos")), React.createElement("div", {"style": {padding:"8px 14px 0",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:8,background:"#070605",border:"1px solid #181614",borderRadius:10,padding:"8px 12px"}}, React.createElement("svg", {"width": "12", "height": "12", "viewBox": "0 0 24 24", "fill": "none", "stroke": "#2a2826", "strokeWidth": "2", "strokeLinecap": "round"}, React.createElement("circle", {"cx": "11", "cy": "11", "r": "8"}), React.createElement("path", {"d": "m21 21-4.35-4.35"})), React.createElement("input", {"value": search, "onChange": e=>setSearch(e.target.value), "placeholder": "buscar track o artista…", "style": {flex:1,background:"none",border:"none",outline:"none",fontSize:11.5,color:T.text,fontFamily:T.sans,fontWeight:400}}), search&&React.createElement("button", {"onClick": ()=>setSearch(""), "style": {background:"none",border:"none",color:"#a8a4a0",cursor:"pointer",fontSize:13,padding:0}}, "✕"))), React.createElement("div", {"style": {padding:"10px 14px 0",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}, React.createElement("span", {"style": {fontFamily:T.sans,fontSize:9,color:T.textDim,fontWeight:500}}, "popularidad máxima", React.createElement("span", {"style": {color:"#a0a09a"}}, "— anti-mainstream")), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:10,color:T.gold,fontWeight:600}}, "≤", maxPop)), React.createElement("input", {"type": "range", "min": 5, "max": 80, "value": maxPop, "onChange": e=>setMaxPop(+e.target.value), "style": {width:"100%",accentColor:T.gold,cursor:"pointer"}})), React.createElement("div", {"style": {padding:"8px 14px 0",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",flexWrap:"wrap",gap:4,paddingBottom:4}}, TECHNO_STYLES.map(s=>React.createElement(StyleChip, {"key": s, "s": s, "active": styleFilter===s, "onClick": ()=>setStyleFilter(s), "accent": T.gold}))), React.createElement("div", {"style": {display:"flex",flexWrap:"wrap",gap:4,paddingBottom:2,marginTop:5,alignItems:"center"}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:"#b8b0a8",letterSpacing:1.5,textTransform:"uppercase",flexShrink:0,paddingRight:2}}, "house"), HOUSE_STYLES.map(s=>React.createElement(StyleChip, {"key": s, "s": s, "active": styleFilter===s, "onClick": ()=>setStyleFilter(s), "accent": HOUSE_ACCENT})))), React.createElement("div", {"style": {padding:"6px 14px 0",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6,marginBottom:4}}, React.createElement("svg", {"width": "9", "height": "9", "viewBox": "0 0 20 20", "fill": "none"}, React.createElement("circle", {"cx": "10", "cy": "10", "r": "9", "stroke": T.goldDim, "strokeWidth": "1.5"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "3", "stroke": T.goldDim, "strokeWidth": "1.2"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "1", "fill": T.goldDim})), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:T.textDim,letterSpacing:1.5,textTransform:"uppercase"}}, "sello"), labelFilter&&React.createElement("button", {"onClick": ()=>setLabelFilter(null), "style": {background:`${T.gold}15`,border:`1px solid ${T.goldDim}`,color:T.gold,fontFamily:T.mono,fontSize:7,padding:"2px 7px",borderRadius:5,cursor:"pointer",letterSpacing:0.5}}, "✕", labelFilter)), React.createElement("div", {"style": {display:"flex",gap:3,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}, allLabels.map(l=>(
            React.createElement("button", {"key": l, "onClick": ()=>setLabelFilter(labelFilter===l?null:l), "style": {flexShrink:0,background:labelFilter===l?`${T.gold}15`:T.isDark?"#1e1c18":"#ece8e2",color:labelFilter===l?T.gold:T.isDark?"#c8c4be":"#5a5652",border:`1px solid ${labelFilter===l?T.goldDim:T.isDark?"#2e2c28":"#d4cfc8"}`,fontSize:7,padding:"3px 9px",borderRadius:20,cursor:"pointer",letterSpacing:0.5,textTransform:"none",fontFamily:T.mono,fontWeight:labelFilter===l?700:400,transition:"all 0.15s",WebkitTapHighlightColor:"transparent",whiteSpace:"nowrap"}}, l)
          )))), React.createElement("div", {"style": {padding:"6px 16px 4px",display:"flex",justifyContent:"space-between",flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8.5,color:T.textGhost}}, list.length, "tracks", labelFilter?` · ${labelFilter}`:""), seed&&React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8.5,color:T.goldDim}}, "semilla:", seed.title)), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"0 10px 90px",scrollbarWidth:"none"}}, React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:4}}, list.map(t=>(
            React.createElement(TrackCard, {"key": t.id, "track": t, "isSelected": seed?.id===t.id, "onSelect": ()=>setSeed(seed?.id===t.id?null:t), "onAdd": addToSet, "onFind": onFind, "inSet": mySet.some(s=>s.id===t.id)})
          )), list.length===0&&React.createElement("div", {"style": {textAlign:"center",padding:"60px 0",fontFamily:T.sans,fontSize:11,color:"#8a8480"}}, "sin resultados"))))
  );
}

// Todos los estilos únicos del catálogo
const ALL_BUILD_STYLES = [...new Set(Object.values(TRACKS.reduce((acc,t)=>{t.style.forEach(s=>{acc[s]=s});return acc},{})))].sort();

// Chequeo si un estilo entra en el filtro seleccionado (directo o por familia)
function matchesStyleFilter(track, styleFilter) {
  if(styleFilter==="all") return true;
  if(track.style.includes(styleFilter)) return true;
  // Buscar en todas las familias que contengan el filtro elegido
  for(const [fam, members] of Object.entries(STYLE_FAMILY)) {
    if(members.includes(styleFilter) && track.style.some(s=>members.includes(s))) return true;
    if(fam===styleFilter && track.style.some(s=>members.includes(s))) return true;
  }
  return false;
}

// Auto-build greedy: construye la secuencia completa desde el seed
// Usa umbral adaptativo: si no hay candidatos con score alto, baja el umbral
function autoBuild(seed, styleFilter, maxPop, maxTracks=8, allTracks=TRACKS) {
  const pool = allTracks.filter(t =>
    t.id !== seed.id &&
    (t.isEmergent || t.pop <= maxPop) &&
    matchesStyleFilter(t, styleFilter)
  );

  const sequence = [seed];
  const used = new Set([seed.id]);

  for(let step = 0; step < maxTracks - 1; step++) {
    const last = sequence[sequence.length - 1];
    const setStyles = sequence.flatMap(x => x.style);

    const scored = pool
      .filter(t => !used.has(t.id))
      .map(t => {
        const sc = scoreMatch(last, t);

        // Penaliza drift total de BPM respecto al seed
        const bpmDrift = Math.abs(t.bpm - seed.bpm);
        const driftPenalty = bpmDrift > 18 ? -60 : bpmDrift > 12 ? -25 : bpmDrift > 8 ? -10 : 0;

        // Bonus cohesión: el estilo ya apareció en el set
        const cohesionBonus = t.style.filter(s => setStyles.includes(s)).length * 12;

        // Bonus narrativa: leve preferencia a subir energía en primeros pasos, bajar al final
        const progress = step / (maxTracks - 2);
        const eDiff = t.energy - last.energy;
        const narrativeBonus = progress < 0.5 ? (eDiff === 1 ? 15 : eDiff === 0 ? 5 : -5)
                                               : (eDiff === -1 ? 10 : eDiff === 0 ? 5 : -5);

        return {
          ...t,
          scoreData: sc,
          rawTotal: sc.total,
          adjustedTotal: sc.total + driftPenalty + cohesionBonus + narrativeBonus
        };
      })
      .filter(t => t.rawTotal > 0)  // solo descartar si BPM o key son 0
      .sort((a, b) => b.adjustedTotal - a.adjustedTotal);

    if(scored.length === 0) break;

    // Umbral adaptativo: intenta >120 primero, luego baja si no hay
    const best = scored.find(t => t.adjustedTotal >= 120)
               || scored.find(t => t.adjustedTotal >= 80)
               || scored[0];

    sequence.push(best);
    used.add(best.id);
  }

  return sequence.slice(1); // sin la semilla
}

// ── ARCO DE ENERGÍA: define cómo evoluciona la energía a lo largo del set
// Devuelve el target de energía ideal para cada posición (0..1) del set
const ENERGY_ARCS = {
  buildup: {
    label: "Build Up",
    desc: "Empieza suave, termina en peak",
    icon: "↗",
    color: T.orange,
    fn: (p) => 3 + Math.round(p * 6),           // 3→9
  },
  peak: {
    label: "Peak Hour",
    desc: "Directo al máximo, sin escala",
    icon: "▲",
    color: "#ef4444",
    fn: (p) => 8 + Math.round(p),               // 8→9
  },
  chill: {
    label: "Chill / Sunset",
    desc: "Energía baja y constante",
    icon: "〜",
    color: "#0891b2",
    fn: (p) => 3 + Math.round(Math.sin(p * Math.PI * 0.5)),  // 3→4
  },
  wave: {
    label: "Ola / Journey",
    desc: "Sube, baja, sube otra vez",
    icon: "∿",
    color: "#a855f7",
    fn: (p) => 5 + Math.round(Math.sin(p * Math.PI * 1.5) * 3), // 5→wave
  },
  rollercoaster: {
    label: "Rollercoaster",
    desc: "Picos y valles dramáticos",
    icon: "⌇",
    color: T.gold,
    fn: (p, i) => i % 2 === 0 ? 8 : 4,         // alternado
  },
  dropdown: {
    label: "Drop Down",
    desc: "Abre fuerte, cierra suave",
    icon: "↘",
    color: "#65a30d",
    fn: (p) => 9 - Math.round(p * 5),           // 9→4
  },
};

// Auto-build con control de arco de energía, variación aleatoria y fusión de estilos
function autoBuildAdvanced(opts) {
  var styles = opts.styles;
  var arcKey = opts.arc;
  var length = opts.length;
  var maxPop = opts.maxPop;
  var variation = opts.variation;

  var pool = TRACKS.filter(function(t) {
    if (t.pop > maxPop) return false;
    for (var si = 0; si < styles.length; si++) {
      if (matchesStyleFilter(t, styles[si])) return true;
    }
    return false;
  });
  if (pool.length === 0) return { seed: null, tracks: [] };

  var arcFn = (ENERGY_ARCS[arcKey] && ENERGY_ARCS[arcKey].fn) ? ENERGY_ARCS[arcKey].fn : ENERGY_ARCS.buildup.fn;
  var seedETarget = arcFn(0, 0);

  var seedPool = pool.slice().sort(function(a, b) {
    var aDiff = Math.abs(a.energy - seedETarget);
    var bDiff = Math.abs(b.energy - seedETarget);
    var nz = variation * 2.5;
    return (aDiff + Math.random() * nz) - (bDiff + Math.random() * nz);
  });

  var chosenSeed = seedPool[0];
  var sequence = [chosenSeed];
  var usedIds = {};
  usedIds[chosenSeed.id] = true;

  var denom = length > 1 ? length - 1 : 1;

  for (var step = 0; step < length - 1; step++) {
    var progress = (step + 1) / denom;
    var targetE = arcFn(progress, step + 1);
    var last = sequence[sequence.length - 1];

    var usedStylesArr = [];
    for (var si2 = 0; si2 < sequence.length; si2++) {
      for (var si3 = 0; si3 < sequence[si2].style.length; si3++) {
        usedStylesArr.push(sequence[si2].style[si3]);
      }
    }

    var recentArtists = [];
    for (var ri = Math.max(0, sequence.length - 3); ri < sequence.length; ri++) {
      recentArtists.push(sequence[ri].artist);
    }

    var candidates = [];
    for (var ci = 0; ci < pool.length; ci++) {
      var t = pool[ci];
      if (usedIds[t.id]) continue;

      var bpmDiff = Math.abs(t.bpm - last.bpm);
      var bpmScore = bpmDiff===0?100:bpmDiff<=2?95:bpmDiff<=4?85:bpmDiff<=7?65:bpmDiff<=12?35:bpmDiff<=16?15:5;
      var keyScore = camelotScore(last.key, t.key);
      var eDiff = Math.abs(t.energy - targetE);
      var arcBonus = eDiff===0?40:eDiff===1?20:eDiff===2?0:-20*(eDiff-2);

      var cohesion = 0;
      for (var csi = 0; csi < t.style.length; csi++) {
        if (usedStylesArr.indexOf(t.style[csi]) >= 0) cohesion += 10;
      }

      var totalDrift = Math.abs(t.bpm - chosenSeed.bpm);
      var driftPenalty = totalDrift > 18 ? -50 : totalDrift > 12 ? -20 : totalDrift > 8 ? -8 : 0;
      var randNoise = (Math.random() - 0.5) * variation * 40;
      var artistPenalty = recentArtists.indexOf(t.artist) >= 0 ? -35 : 0;
      var score = bpmScore + keyScore + arcBonus + cohesion + driftPenalty + randNoise + artistPenalty;

      candidates.push({ track: t, score: score });
    }

    if (candidates.length === 0) break;
    candidates.sort(function(a, b) { return b.score - a.score; });
    var best = candidates[0].track;
    sequence.push(best);
    usedIds[best.id] = true;
  }

  return { seed: chosenSeed, tracks: sequence.slice(1) };
}

// Estilos con labels bonitos para el modal
const STYLE_BUILD_OPTIONS = [
  { group: "TECHNO", styles: [
    { id:"techno",            label:"Techno",         desc:"Berlin, oscuro, industrial" },
    { id:"deep techno",       label:"Deep Techno",    desc:"Hipnótico, introspectivo" },
    { id:"hard techno",       label:"Hard Techno",    desc:"Rápido, intenso, crudo" },
    { id:"industrial techno", label:"Industrial",     desc:"Máquinas, oscuridad total" },
    { id:"melodic techno",    label:"Melodic Techno", desc:"Afterlife, atmospheric" },
    { id:"ambient techno",    label:"Ambient Techno", desc:"Texturas, minimal, flotante" },
    { id:"acid",              label:"Acid / Electro", desc:"303, ácido, underground" },
    { id:"detroit techno",    label:"Detroit",        desc:"Clásicos, alma, raíces" },
  ]},
  { group: "HOUSE", styles: [
    { id:"deep house",    label:"Deep House",    desc:"Orgánico, soul, groove" },
    { id:"dark house",    label:"Dark House",    desc:"Dub, bass, sombras" },
    { id:"melodic house", label:"Melodic House", desc:"Bicep, emocional, viaje" },
    { id:"chicago",       label:"Chicago House", desc:"Jack, clásico, piano" },
    { id:"ghetto house",  label:"Ghetto House",  desc:"Crudo, percusivo, baile" },
  ]},
  { group: "OTROS", styles: [
    { id:"dubstep",       label:"Dubstep",       desc:"Burial, oscuro, post-UK" },
    { id:"drum and bass", label:"Drum & Bass",   desc:"Neurofunk, oscuro, rápido" },
  ]},
];

const HOUSE_STYLE_IDS = new Set(["deep house","dark house","melodic house","chicago","ghetto house","dub house"]);

// Mini energy arc visualizer (sparkline SVG)
function ArcSparkline({ arcKey, width=120, height=24 }) {
  const arc = ENERGY_ARCS[arcKey];
  if (!arc) return null;
  const pts = 10;
  const vals = Array.from({length:pts},(_,i) => arc.fn(i/(pts-1), i));
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const range = mx - mn || 1;
  const points = vals.map((v,i) => {
    const x = 4 + (i/(pts-1))*(width-8);
    const y = (height-4) - ((v-mn)/range)*(height-8);
    return `${x},${y}`;
  }).join(" ");
  return (
    React.createElement("svg", {"width": width, "height": height, "style": {display:"block"}}, React.createElement("polyline", {"points": points, "fill": "none", "stroke": arc.color, "strokeWidth": "1.5", "strokeLinecap": "round", "strokeLinejoin": "round", "opacity": "0.7"}), vals.map((v,i)=>{
        const x = 4 + (i/(pts-1))*(width-8);
        const y = (height-4) - ((v-mn)/range)*(height-8);
        return React.createElement("circle", {"key": i, "cx": x, "cy": y, "r": "1.5", "fill": arc.color, "opacity": "0.5"});
      }))
  );
}

function AutoBuildModal({ onClose, onBuild, maxPop }) {
  const [selectedStyles, setSelectedStyles] = React.useState([]);
  const [arc, setArc] = React.useState("buildup");
  const [length, setLength] = React.useState(12);
  const [variation, setVariation] = React.useState(0.3); // 0=determinista, 1=muy aleatorio
  const [preview, setPreview] = React.useState(null);
  const [step, setStep] = React.useState(0); // 0=estilos, 1=parámetros

  const compute = (styles, arcKey, len, vari) => {
    if (styles.length === 0) { setPreview(null); return; }
    const result = autoBuildAdvanced({ styles, arc: arcKey, length: len, maxPop, variation: vari });
    setPreview(result);
  };
  const toggleStyle = (styleId) => {
    const next = selectedStyles.includes(styleId) ? selectedStyles.filter(s=>s!==styleId) : [...selectedStyles, styleId];
    setSelectedStyles(next);
    compute(next, arc, length, variation);
  };
  const handleArc = (key) => { setArc(key); compute(selectedStyles, key, length, variation); };
  const handleLength = (n) => { setLength(n); compute(selectedStyles, arc, n, variation); };
  const handleVariation = (v) => { setVariation(v); compute(selectedStyles, arc, length, v); };
  const handleBuild = () => {
    if (!preview?.seed || preview.tracks.length === 0) return;
    onBuild(preview.seed, preview.tracks);
    onClose();
  };
  const handleReshuffle = () => { compute(selectedStyles, arc, length, variation); };

  const canProceed = selectedStyles.length > 0;
  const canBuild = preview?.seed && preview?.tracks?.length > 0;

  return (
    React.createElement("div", {"style": {
      position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:999,
      display:"flex",alignItems:"flex-end",justifyContent:"center"
    }, "onClick": e=>{if(e.target===e.currentTarget)onClose()}}, React.createElement("div", {"style": {
        width:"100%",maxWidth:430,maxHeight:"92vh",display:"flex",flexDirection:"column",
        borderRadius:"18px 18px 0 0",overflow:"hidden",
        background:"#080705",border:"1px solid #1a1816",borderBottom:"none",
        boxShadow:"0 -20px 60px #000c"
      }}, React.createElement("div", {"style": {background:"#0a0906",borderBottom:"1px solid #141210",padding:"14px 18px 12px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:14,color:T.gold,letterSpacing:-0.3}}, "✦ Auto Build"), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7.5,color:"#aca49a",letterSpacing:1,marginTop:2}}, selectedStyles.length===0?"elegí estilo · configurá el arco · generá":
               selectedStyles.length===1?`${selectedStyles[0]} · ${ENERGY_ARCS[arc].label}`:
               `${selectedStyles.length} estilos fusionados · ${ENERGY_ARCS[arc].label}`)), React.createElement("button", {"onClick": onClose, "style": {background:"none",border:"1px solid #1c1a18",color:"#b0aca8",width:26,height:26,borderRadius:7,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.sans,fontWeight:700}}, "✕")), React.createElement("div", {"style": {display:"flex",background:"#060504",borderBottom:"1px solid #0e0c0a",flexShrink:0}}, [["estilos","0"],["energía + variación","1"]].map(([lbl,s])=>(
            React.createElement("button", {"key": s, "onClick": ()=>setStep(+s), "style": {
              flex:1,padding:"9px 0",border:"none",cursor:"pointer",
              background:step===+s?"#0e0c09":"transparent",
              fontFamily:T.sans,fontWeight:700,fontSize:8.5,letterSpacing:0.5,
              color:step===+s?T.gold:"#282624",
              borderBottom:step===+s?`1.5px solid ${T.gold}`:"1.5px solid transparent",
              WebkitTapHighlightColor:"transparent",transition:"all 0.12s"
            }}, lbl, s==="0"&&selectedStyles.length>0?` (${selectedStyles.length})`:"")
          ))), React.createElement("div", {"style": {flex:1,overflowY:"auto",scrollbarWidth:"none"}}, step===0 && (
            React.createElement("div", {"style": {padding:"10px 14px 100px"}}, selectedStyles.length > 1 && (
                React.createElement("div", {"style": {background:"#0d0a05",border:`1px solid ${T.goldDim}`,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}, React.createElement("span", {"style": {fontSize:10,color:T.gold}}, "⊕"), React.createElement("div", {"style": {flex:1}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:9,color:T.gold}}, "Fusión de estilos"), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:"#aca49a",marginTop:1}}, selectedStyles.join(" + "))), React.createElement("button", {"onClick": ()=>setSelectedStyles([]), "style": {background:"none",border:"none",color:"#5a3a1a",fontSize:10,cursor:"pointer",fontFamily:T.sans,fontWeight:700}}, "✕"))
              ), STYLE_BUILD_OPTIONS.map(group => (
                React.createElement("div", {"key": group.group, "style": {marginBottom:12}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:"#a8a4a0",letterSpacing:2,textTransform:"uppercase",marginBottom:6,paddingLeft:2}}, group.group), React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:3}}, group.styles.map(s => {
                      const active = selectedStyles.includes(s.id);
                      const isHs = HOUSE_STYLE_IDS.has(s.id);
                      const ac = isHs ? HOUSE_ACCENT : T.gold;
                      const count = TRACKS.filter(t=>t.pop<=maxPop&&matchesStyleFilter(t,s.id)).length;
                      return (
                        React.createElement("button", {"key": s.id, "onClick": ()=>toggleStyle(s.id), "style": {
                            background:active?`${ac}14`:T.surface,
                            border:`1px solid ${active?ac:T.border}`,
                            borderRadius:10,padding:"9px 13px",cursor:"pointer",
                            display:"flex",justifyContent:"space-between",alignItems:"center",
                            WebkitTapHighlightColor:"transparent",transition:"all 0.1s",textAlign:"left"
                          }}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:11,color:active?ac:T.text,letterSpacing:-0.2}}, s.label), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:active?T.textDim:T.textGhost,marginTop:2}}, s.desc)), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:8,flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:active?ac:T.textGhost}}, count, "tracks"), React.createElement("div", {"style": {
                              width:16,height:16,borderRadius:4,border:`1.5px solid ${active?ac:"#1e1c1a"}`,
                              background:active?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:9,color:"#000",fontWeight:900,flexShrink:0
                            }}, active?"✓":"")))
                      );
                    })))
              )))
          ), step===1 && (
            React.createElement("div", {"style": {padding:"12px 14px 100px"}}, React.createElement("div", {"style": {marginBottom:14}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}, React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:9,color:T.textMid,letterSpacing:0.5}}, "DURACIÓN"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:9.5,color:T.gold}}, length, "tracks", React.createElement("span", {"style": {color:"#a8a4a0",fontSize:7.5}}, "≈", Math.floor(length*7/60), "h", (length*7)%60>0?` ${(length*7)%60}m`:""))), React.createElement("div", {"style": {display:"flex",gap:4}}, [8,12,16,20,25,30].map(n=>(
                    React.createElement("button", {"key": n, "onClick": ()=>handleLength(n), "style": {flex:1,padding:"8px 0",borderRadius:8,cursor:"pointer",border:"none",
                        fontFamily:T.sans,fontWeight:700,fontSize:11,
                        background:length===n?"#1a1508":T.surface,color:length===n?T.gold:"#282624",
                        outline:length===n?`1px solid ${T.goldDim}`:"1px solid #141210",WebkitTapHighlightColor:"transparent"
                      }}, n)
                  )))), React.createElement("div", {"style": {marginBottom:14}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}, React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:9,color:T.textMid,letterSpacing:0.5}}, "ARCO DE ENERGÍA"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:ENERGY_ARCS[arc].color}}, ENERGY_ARCS[arc].icon, ENERGY_ARCS[arc].label)), React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:3}}, Object.entries(ENERGY_ARCS).map(([key,a])=>{
                    const active = arc===key;
                    return (
                      React.createElement("button", {"key": key, "onClick": ()=>handleArc(key), "style": {
                          background:active?`${a.color}10`:"#0a0906",
                          border:`1px solid ${active?a.color:"#141210"}`,
                          borderRadius:10,padding:"9px 13px",cursor:"pointer",
                          display:"flex",justifyContent:"space-between",alignItems:"center",
                          WebkitTapHighlightColor:"transparent",transition:"all 0.1s"
                        }}, React.createElement("div", {"style": {textAlign:"left"}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:7}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:13,color:active?a.color:"#a8a4a0"}}, a.icon), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:11,color:active?a.color:T.textMid}}, a.label)), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:active?"#4a4540":"#1e1c1a",marginTop:2,paddingLeft:22}}, a.desc)), React.createElement(ArcSparkline, {"arcKey": key, "width": 80, "height": 22}))
                    );
                  }))), React.createElement("div", {"style": {background:"#0a0906",border:"1px solid #141210",borderRadius:10,padding:"12px 14px"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:9,color:T.textMid,letterSpacing:0.5}}, "VARIACIÓN"), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:"#a8a4a0",marginTop:2}}, "cuánto cambia el set cada vez")), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:9,color:T.gold}}, variation<0.2?"exacto":variation<0.5?"leve":variation<0.75?"medio":"alto")), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:10}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:"#a8a4a0",width:28,flexShrink:0}}, "fijo"), React.createElement("input", {"type": "range", "min": 0, "max": 1, "step": 0.05, "value": variation, "onChange": e=>handleVariation(+e.target.value), "style": {flex:1,accentColor:T.gold,cursor:"pointer"}}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:"#a8a4a0",width:28,flexShrink:0,textAlign:"right"}}, "🎲")), React.createElement("div", {"style": {marginTop:8,display:"flex",justifyContent:"space-between"}}, ["Siempre igual","Algo diferente","Bastante distinto","Total sorpresa"].map((lbl,i)=>(
                    React.createElement("span", {"key": i, "style": {fontFamily:T.mono,fontSize:6,color:"#9a9490",textAlign:"center",flex:1}}, lbl)
                  )))))
          ), preview?.seed && (
            React.createElement("div", {"style": {margin:"0 14px 8px",background:"#0a0906",border:"1px solid #1a1814",borderRadius:12,padding:"10px 13px",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:"#aca49a",letterSpacing:1.5,textTransform:"uppercase"}}, "preview"), React.createElement("button", {"onClick": handleReshuffle, "style": {background:"none",border:"1px solid #1c1a18",color:"#aca49a",fontFamily:T.mono,fontSize:7,padding:"2px 8px",borderRadius:5,cursor:"pointer",letterSpacing:0.5}}, "⟳ otro set")), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6,marginBottom:5}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:T.goldDim,width:12,textAlign:"center",flexShrink:0}}, "S"), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:10,color:T.gold,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}, preview.seed.title), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:"#a8a4a0",flexShrink:0}}, preview.seed.bpm)), preview.tracks.slice(0,5).map((t,i)=>{
                const eColor = E_COLORS[t.energy] || "#333";
                return (
                  React.createElement("div", {"key": t.id, "style": {display:"flex",alignItems:"center",gap:6,marginBottom:3}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:T.textGhost,width:12,textAlign:"center",flexShrink:0}}, i+1), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:9,color:T.textMid,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, t.title), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:"#a8a4a0",flexShrink:0}}, t.bpm), React.createElement("div", {"style": {width:32,height:4,background:"#141210",borderRadius:2,flexShrink:0}}, React.createElement("div", {"style": {width:`${t.energy*10}%`,height:"100%",background:eColor,borderRadius:2}})), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:eColor,width:8,flexShrink:0}}, t.energy))
                );
              }), preview.tracks.length > 5 && (
                React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7,color:"#a8a4a0",paddingLeft:18,marginTop:2}}, "+", preview.tracks.length-5, "tracks más")
              ), preview.tracks.length === 0 && (
                React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:"#a8a4a0",paddingLeft:18}}, "Sin tracks disponibles con estos filtros.")
              ))
          ), !preview && selectedStyles.length===0 && (
            React.createElement("div", {"style": {textAlign:"center",padding:"20px 24px 8px"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontSize:10,color:"#9a9490",lineHeight:1.8}}, "Seleccioná al menos un estilo", React.createElement("br", null), "para generar el set"))
          )), React.createElement("div", {"style": {background:"rgba(8,7,5,0.97)",borderTop:"1px solid #141210",padding:"10px 14px",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",gap:6}}, canProceed && (
              React.createElement("button", {"onClick": handleReshuffle, "style": {
                  padding:"11px 14px",borderRadius:10,border:"1px solid #1c1a18",cursor:"pointer",
                  background:"#0a0906",fontFamily:T.sans,fontWeight:700,fontSize:11,
                  color:"#b0aca8",WebkitTapHighlightColor:"transparent"
                }}, "⟳")
            ), React.createElement("button", {"onClick": canBuild ? handleBuild : canProceed ? handleReshuffle : ()=>setStep(0), "style": {
                flex:1,padding:"12px 0",borderRadius:10,border:"none",cursor:"pointer",
                background: canBuild ? `linear-gradient(135deg,#1e1608,#0d0b05)` : canProceed ? "#0d0c08" : "#0a0906",
                outline: canBuild ? `1px solid ${T.goldDim}` : canProceed ? `1px solid ${T.goldDim}55` : "1px solid #141210",
                fontFamily:T.sans,fontWeight:800,fontSize:11.5,letterSpacing:0.3,
                color: canBuild ? T.gold : canProceed ? T.goldDim : "#282624",
                transition:"all 0.18s",WebkitTapHighlightColor:"transparent"
              }}, !canProceed ? "↑ seleccioná un estilo primero" :
               !canBuild ? "⟳ generar set" :
               `✦ ARMAR SET · ${(preview.tracks.length+1)} tracks`)))))
  );
}

function BuildScreen({ seed, setSeed, mySet, addToSet, setMySet, maxPop, onFind, djTracks=[] }) {
  const [tab, setTab]               = useState("auto");   // "auto" | "manual"
  const [styleFilter, setStyleFilter] = useState("all");
  const [showInfo, setShowInfo]     = useState(false);
  const [showAutoBuildModal, setShowAutoBuildModal] = useState(false);

  const allTracks = React.useMemo(()=>[...TRACKS,...djTracks],[djTracks]);

  const handleAutoBuild = (newSeed, newTracks) => {
    setSeed(newSeed);
    setMySet(newTracks);
  };

  const availableStyles = React.useMemo(()=>{
    return ["all", ...[...new Set(allTracks.flatMap(t=>t.style))].sort()];
  },[allTracks]);

  // AUTO-BUILD: siempre calculado, sin guard por tab
  const autoTracks = useMemo(()=>{
    if(!seed) return [];
    return autoBuild(seed, styleFilter, maxPop, 30, allTracks);
  },[seed, styleFilter, maxPop, allTracks]);

  // MANUAL: candidatos rankeados
  const recs = useMemo(()=>{
    if(!seed) return [];
    return allTracks
      .filter(t => t.id!==seed.id && (t.isEmergent||t.pop<=maxPop) && matchesStyleFilter(t,styleFilter))
      .map(t => ({...t, scoreData:scoreMatch(seed,t)}))
      .filter(t => t.scoreData.total > 0)
      .sort((a,b) => b.scoreData.total - a.scoreData.total)
      .slice(0,20);
  },[seed, maxPop, styleFilter, allTracks]);

  const handleAddAll = () => {
    const toAdd = autoTracks.filter(t => !mySet.some(s=>s.id===t.id));
    if(toAdd.length > 0) setMySet(prev => [...prev, ...toAdd]);
  };

  if(!seed) return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}, showAutoBuildModal && React.createElement(AutoBuildModal, {"onClose": ()=>setShowAutoBuildModal(false), "onBuild": handleAutoBuild, "maxPop": maxPop}), React.createElement("div", {"style": {flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",gap:24}}, React.createElement("div", {"style": {textAlign:"center"}}, React.createElement(LogoMark, {"size": 56}), React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:15,color:"#a8a4a0",marginTop:16,letterSpacing:-0.3}}, "construí tu set"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:"#9a9490",lineHeight:1.9,marginTop:6,whiteSpace:"pre-line"}}, "Elegí un estilo y dejá que Auto Build\narme toda la secuencia por vos.\nO seleccioná una semilla en Library.")), React.createElement("button", {"onClick": ()=>setShowAutoBuildModal(true), "style": {
            width:"100%",maxWidth:280,padding:"15px 24px",borderRadius:14,
            border:`1px solid ${T.goldDim}`,cursor:"pointer",
            background:"linear-gradient(135deg, #1a1408, #0d0a05)",
            fontFamily:T.sans,fontWeight:800,fontSize:13,
            color:T.gold,letterSpacing:0.3,
            boxShadow:`0 0 30px #c9a84c0a`,
            WebkitTapHighlightColor:"transparent",transition:"all 0.2s"
          }}, "✦ AUTO BUILD POR ESTILO"), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:10,width:"100%",maxWidth:280}}, React.createElement("div", {"style": {flex:1,height:1,background:"#141210"}}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:"#9a9490",letterSpacing:1.5}}, "O"), React.createElement("div", {"style": {flex:1,height:1,background:"#141210"}})), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:"#a8a4a0",textAlign:"center",lineHeight:1.7}}, "Seleccioná un track en", React.createElement("span", {"style": {color:"#aca49a"}}, "LIBRARY"), "como semilla", React.createElement("br", null), "y usalo como punto de partida manual.")))
  );

  const house  = isHouseTrack(seed);
  const accent = house ? HOUSE_ACCENT : T.gold;
  const seedBg = house ? "#080d14" : "#0c0a06";
  const seedBorder = house ? "#1e3040" : "#2a2210";

  return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}, showAutoBuildModal && React.createElement(AutoBuildModal, {"onClose": ()=>setShowAutoBuildModal(false), "onBuild": handleAutoBuild, "maxPop": maxPop}), React.createElement("div", {"style": {margin:"8px 12px 0",background:seedBg,border:`1px solid ${seedBorder}`,borderRadius:14,padding:"12px 15px",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:accent,letterSpacing:2,textTransform:"uppercase",opacity:0.6}}, "semilla"), React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement("button", {"onClick": ()=>setShowAutoBuildModal(true), "style": {background:"#1a1408",border:`1px solid ${T.goldDim}`,color:T.gold,fontSize:7.5,padding:"3px 9px",borderRadius:5,cursor:"pointer",fontFamily:T.sans,fontWeight:700,letterSpacing:0.3,WebkitTapHighlightColor:"transparent"}}, "✦ auto build"), React.createElement("button", {"onClick": ()=>setSeed(null), "style": {background:"none",border:`1px solid ${seedBorder}`,color:"#5a4a1a",fontSize:10,width:20,height:20,borderRadius:5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.sans}}, "✕"))), React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontSize:15,fontWeight:700,color:accent,letterSpacing:-0.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, seed.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:house?"#2a5070":"#6a5828",marginTop:2}}, seed.artist)), React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}, React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement(KeyPill, {"k": seed.key, "highlight": true}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:9,color:T.textMid}}, seed.bpm)), React.createElement(EBar, {"energy": seed.energy, "showLabel": true})))), React.createElement("div", {"style": {margin:"6px 12px 0",display:"flex",background:"#060504",border:"1px solid #141210",borderRadius:10,overflow:"hidden",flexShrink:0}}, [["auto","✦ Auto-Build"],["manual","Manual"]].map(([id,lbl])=>(
          React.createElement("button", {"key": id, "onClick": ()=>setTab(id), "style": {
              flex:1, border:"none", padding:"9px 0", cursor:"pointer",
              background: tab===id ? (id==="auto"?"#12100a":"#0e0e0e") : "transparent",
              fontFamily:T.sans, fontWeight:700, fontSize:9.5, letterSpacing:0.5,
              color: tab===id ? (id==="auto"?T.gold:"#888") : "#282624",
              borderRight: id==="auto" ? "1px solid #141210" : "none",
              transition:"all 0.15s", WebkitTapHighlightColor:"transparent"
            }}, lbl)
        ))), React.createElement("div", {"style": {padding:"6px 12px 0",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6,marginBottom:4}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:"#a8a4a0",letterSpacing:1.5,textTransform:"uppercase"}}, "estilo"), styleFilter!=="all" && (
            React.createElement("button", {"onClick": ()=>setStyleFilter("all"), "style": {background:"#1a1206",border:`1px solid ${T.goldDim}`,color:T.gold,fontFamily:T.mono,fontSize:6.5,padding:"1px 6px",borderRadius:4,cursor:"pointer"}}, "✕")
          )), React.createElement("div", {"style": {display:"flex",gap:3,overflowX:"auto",paddingBottom:3,scrollbarWidth:"none"}}, availableStyles.map(s=>{
            const isHouseStyle = ["dark house","deep house","melodic house","dub house","chicago","ghetto house","dubstep","bass"].includes(s);
            const ac = isHouseStyle ? HOUSE_ACCENT : T.gold;
            const active = styleFilter===s;
            return (
              React.createElement("button", {"key": s, "onClick": ()=>setStyleFilter(s), "style": {
                  flexShrink:0, fontSize:7, padding:"3px 9px", borderRadius:20, cursor:"pointer",
                  letterSpacing:0.8, textTransform:"uppercase", fontFamily:T.sans, fontWeight:active?700:400,
                  background: active?`${ac}20`:"transparent",
                  color: active ? ac : "#282624",
                  border: `1px solid ${active?ac:"#1c1a18"}`,
                  transition:"all 0.12s", WebkitTapHighlightColor:"transparent", whiteSpace:"nowrap"
                }}, s==="all"?"todos":s)
            );
          }))), tab==="auto" && (
        React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"6px 10px 100px",scrollbarWidth:"none"}}, autoTracks.length===0 ? (
            React.createElement("div", {"style": {textAlign:"center",padding:"50px 24px"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontSize:22,marginBottom:10,opacity:0.15}}, "◎"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:11,fontWeight:600,color:"#a8a4a0",marginBottom:6}}, "Sin secuencia posible"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:"#9a9490",lineHeight:1.9}}, styleFilter!=="all" ? `El estilo "${styleFilter}" no tiene tracks compatibles con esta semilla.` : "Subí el límite de popularidad en Library."))
          ) : (
            React.createElement(React.Fragment, null, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 2px 6px"}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost}}, autoTracks.length, "tracks · secuencia armada"), React.createElement("button", {"onClick": handleAddAll, "style": {
                    background:"#071507",border:`1px solid ${T.green}40`,color:T.green,
                    fontFamily:T.sans,fontWeight:700,fontSize:8.5,padding:"5px 13px",
                    borderRadius:8,cursor:"pointer",letterSpacing:0.5,WebkitTapHighlightColor:"transparent"
                  }}, "+ agregar todo al set")), React.createElement("div", {"style": {background:"#070605",border:"1px solid #141210",borderRadius:10,marginBottom:8,padding:"8px 8px 2px"}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:"#a8a4a0",letterSpacing:1.5,textTransform:"uppercase",paddingLeft:4}}, "arco de energía"), React.createElement(EnergyFlowChart, {"tracks": [seed,...autoTracks]})), React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:0}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6,marginBottom:1}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:T.goldDim,width:18,textAlign:"center",flexShrink:0}}, "S"), React.createElement("div", {"style": {flex:1,background:"#0d0b07",border:`1px solid #221a08`,borderRadius:10,padding:"8px 12px",opacity:0.65}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:11,color:T.gold}}, seed.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:8,color:"#4a3a14",marginTop:1}}, seed.artist)), React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement(KeyPill, {"k": seed.key, "highlight": true}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textDim}}, seed.bpm))))), autoTracks.map((track,i)=>{
                  const prev   = i===0 ? seed : autoTracks[i-1];
                  const compat = keyCompat(prev.key, track.key);
                  const dBpm   = track.bpm - prev.bpm;
                  const inSet  = mySet.some(s=>s.id===track.id);
                  return (
                    React.createElement("div", {"key": track.id}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:5,padding:"1px 4px 1px 24px"}}, React.createElement("div", {"style": {width:1,height:14,background:`${compat.color}25`,flexShrink:0}}), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:6.5,fontWeight:700,color:compat.color,letterSpacing:1}}, compat.label), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:"#a8a4a0"}}, prev.key, "→", track.key), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:Math.abs(dBpm)>6?T.orange:"#282624"}}, dBpm>0?"+":"", dBpm, "bpm")), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:5,marginBottom:1}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:T.textGhost,width:18,textAlign:"center",flexShrink:0}}, i+1), React.createElement("div", {"style": {flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 12px"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:12,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:-0.2}}, track.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:8.5,color:T.textDim,marginTop:1.5}}, track.artist), track.label&&(
                                React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:3,marginTop:4}}, React.createElement("svg", {"width": "7", "height": "7", "viewBox": "0 0 20 20", "fill": "none"}, React.createElement("circle", {"cx": "10", "cy": "10", "r": "9", "stroke": T.goldDim, "strokeWidth": "1.5"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "3", "stroke": T.goldDim, "strokeWidth": "1.2"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "1", "fill": T.goldDim})), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:T.goldDim,letterSpacing:0.3}}, track.label))
                              )), React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}, React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement(KeyPill, {"k": track.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8.5,color:T.textDim}}, track.bpm)), React.createElement("div", {"style": {display:"flex",gap:6,alignItems:"center"}}, React.createElement(EBar, {"energy": track.energy, "showLabel": true}), React.createElement("button", {"onClick": ()=>addToSet(track), "style": {
                                    background:inSet?"#071a07":"#0e0e0c",
                                    border:`1px solid ${inSet?"#22c55e40":"#1e1c1a"}`,
                                    color:inSet?T.green:"#383430",
                                    fontSize:inSet?10:14,width:26,height:26,borderRadius:7,
                                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                                    transition:"all 0.15s",WebkitTapHighlightColor:"transparent",
                                    fontWeight:600,fontFamily:T.sans
                                  }}, inSet?"✓":"+")))))))
                  );
                })))
          ))
      ), tab==="manual" && (
        React.createElement(React.Fragment, null, React.createElement("div", {"style": {padding:"5px 14px 0",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost}}, recs.length, "candidatos", styleFilter!=="all"?` · ${styleFilter}`:""), React.createElement("button", {"onClick": ()=>setShowInfo(v=>!v), "style": {background:"none",border:`1px solid ${showInfo?"#242220":"#161412"}`,fontFamily:T.sans,fontSize:8,fontWeight:500,color:showInfo?"#484440":T.textGhost,padding:"3px 9px",borderRadius:6,cursor:"pointer"}}, showInfo?"ocultar":"¿cómo se puntúa?")), showInfo&&(
            React.createElement("div", {"style": {margin:"5px 12px 0",background:"#080706",border:"1px solid #161412",borderRadius:12,padding:"10px 13px",flexShrink:0}}, [
                {c:"#0891b2",lbl:"BPM",desc:"Δ0→100  Δ≤4→85  Δ≤7→65  Δ>15→0"},
                {c:T.lime,  lbl:"KEY",desc:"Camelot: igual→100  +1 modo→90  relativo→75"},
                {c:T.orange,lbl:"NRG",desc:"+1 nivel→100 (narrativa)  igual→90  -1→80"},
                {c:T.gold,  lbl:"STL",desc:"Match directo×45 · familia de estilos→30"},
              ].map(r=>(
                React.createElement("div", {"key": r.lbl, "style": {display:"flex",gap:8,alignItems:"center",marginBottom:5}}, React.createElement("div", {"style": {width:4,height:4,borderRadius:1,background:r.c,flexShrink:0}}), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:8,color:"#484440",width:26}}, r.lbl), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:T.textDim}}, r.desc))
              )))
          ), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"6px 10px 100px",scrollbarWidth:"none"}}, React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:4}}, recs.length===0 ? (
                React.createElement("div", {"style": {textAlign:"center",padding:"40px 20px",fontFamily:T.sans,fontSize:11,color:"#a8a4a0",lineHeight:2}}, "Sin candidatos", styleFilter!=="all"?` para "${styleFilter}"`:"", ".", React.createElement("br", null), "Cambiá el estilo o subí el límite de popularidad.")
              ) : recs.map(t=>{
                const c = keyCompat(seed.key,t.key);
                return (
                  React.createElement("div", {"key": t.id}, React.createElement(TrackCard, {"track": t, "scoreData": t.scoreData, "showScore": true, "onAdd": addToSet, "inSet": mySet.some(s=>s.id===t.id), "onSelect": ()=>{}, "onFind": onFind}), React.createElement("div", {"style": {display:"flex",gap:8,padding:"3px 6px 0",alignItems:"center"}}, React.createElement("span", {"style": {fontFamily:T.sans,fontSize:7.5,fontWeight:700,color:c.color,letterSpacing:0.8}}, c.label), React.createElement("span", {"style": {color:"#141210"}}, "·"), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:7.5,color:T.textDim}}, c.desc)))
                );
              }))))
      ))
  );
}
