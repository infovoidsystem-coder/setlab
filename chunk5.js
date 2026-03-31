function DJsScreen({ djTracks, setDjTracks, mySet, addToSet, removeFromSet }) {
  const [subTab, setSubTab] = React.useState("tracks"); // tracks | artistas | set
  const [search, setSearch] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editTrack, setEditTrack] = React.useState(null);
  const [expandedArtist, setExpandedArtist] = React.useState(null);

  // Agrupar por artista para la DB
  const artistsMap = React.useMemo(()=>{
    const map = {};
    djTracks.forEach(t=>{
      if(!map[t.artist]) map[t.artist]=[];
      map[t.artist].push(t);
    });
    return map;
  },[djTracks]);
  const artistList = React.useMemo(()=>Object.keys(artistsMap).sort(),[artistsMap]);

  const filtered = React.useMemo(()=>djTracks.filter(t=>{
    if(search){const q=search.toLowerCase();return t.title.toLowerCase().includes(q)||t.artist.toLowerCase().includes(q);}
    return true;
  }),[djTracks,search]);

  const filteredArtists = React.useMemo(()=>artistList.filter(a=>{
    if(!search) return true;
    const q=search.toLowerCase();
    return a.toLowerCase().includes(q)||artistsMap[a].some(t=>t.title.toLowerCase().includes(q));
  }),[artistList,search,artistsMap]);

  function saveTrack(form) {
    if (editTrack) {
      const updated = djTracks.map(t=>t.id===editTrack.id?{...t,...form}:t);
      setDjTracks(updated); saveDjTracks(updated);
    } else {
      const track = {...form, id:newDjId(), pop:5, isEmergent:true, addedAt:Date.now()};
      const updated = [track, ...djTracks];
      setDjTracks(updated); saveDjTracks(updated);
    }
    setShowForm(false); setEditTrack(null);
  }

  function deleteTrack(id) {
    const updated = djTracks.filter(t=>t.id!==id);
    setDjTracks(updated); saveDjTracks(updated);
  }

  function startEdit(track) { setEditTrack(track); setShowForm(true); }

  const SUB_TABS = [
    {id:"tracks", label:"Tracks"},
    {id:"artistas", label:"Artistas"},
    {id:"set", label:"Set Emergente"},
  ];

  return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",height:"100%",position:"relative"}}, React.createElement("div", {"style": {padding:"10px 12px 0",flexShrink:0}}, React.createElement("div", {"style": {display:"flex",background:"#060408",border:`1px solid ${DJ_ACCENT}18`,borderRadius:10,overflow:"hidden"}}, SUB_TABS.map(({id,label})=>(
            React.createElement("button", {"key": id, "onClick": ()=>setSubTab(id), "style": {flex:1,background:subTab===id?`${DJ_ACCENT}18`:"transparent",border:"none",padding:"8px 0",cursor:"pointer",fontFamily:T.sans,fontWeight:subTab===id?700:400,fontSize:9,color:subTab===id?DJ_ACCENT:T.textGhost,letterSpacing:0.4,transition:"all 0.15s",WebkitTapHighlightColor:"transparent",position:"relative"}}, label, subTab===id&&React.createElement("div", {"style": {position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:16,height:1.5,background:DJ_ACCENT,borderRadius:"2px 2px 0 0"}}))
          )))), subTab!=="set"&&(
        React.createElement("div", {"style": {padding:"8px 12px 0",flexShrink:0,display:"flex",gap:8,alignItems:"center"}}, React.createElement("div", {"style": {flex:1,display:"flex",alignItems:"center",gap:8,background:"#070605",border:"1px solid #181614",borderRadius:10,padding:"7px 11px"}}, React.createElement("svg", {"width": "11", "height": "11", "viewBox": "0 0 24 24", "fill": "none", "stroke": "#2a2826", "strokeWidth": "2", "strokeLinecap": "round"}, React.createElement("circle", {"cx": "11", "cy": "11", "r": "8"}), React.createElement("path", {"d": "m21 21-4.35-4.35"})), React.createElement("input", {"value": search, "onChange": e=>setSearch(e.target.value), "placeholder": subTab==="artistas"?"buscar artista…":"buscar artista o track…", "style": {flex:1,background:"none",border:"none",outline:"none",fontSize:11,color:T.text,fontFamily:T.sans}}), search&&React.createElement("button", {"onClick": ()=>setSearch(""), "style": {background:"none",border:"none",color:"#a8a4a0",cursor:"pointer",fontSize:12,padding:0}}, "✕")), React.createElement("button", {"onClick": ()=>{setEditTrack(null);setShowForm(true);}, "style": {background:`${DJ_ACCENT}15`,border:`1px solid ${DJ_ACCENT}44`,color:DJ_ACCENT,width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,flexShrink:0,WebkitTapHighlightColor:"transparent",fontFamily:T.sans}}, "+"))
      ), subTab==="tracks"&&(
        React.createElement(React.Fragment, null, React.createElement("div", {"style": {padding:"5px 14px 3px",display:"flex",justifyContent:"space-between",flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost}}, filtered.length, "tracks emergentes"), djTracks.length>0&&React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:DJ_ACCENT,opacity:0.6}}, djTracks.length, "en total")), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"0 10px 90px",scrollbarWidth:"none"}}, filtered.length===0&&djTracks.length===0&&(
              React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:14,padding:"0 40px",textAlign:"center"}}, React.createElement("div", {"style": {fontSize:32,opacity:0.12}}, "🎧"), React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:12,color:T.textMid}}, "Aún no hay DJs emergentes"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:T.textDim,lineHeight:2}}, "Tocá el", React.createElement("span", {"style": {color:DJ_ACCENT,fontWeight:700}}, "+"), "para agregar el primer track"))
            ), filtered.length===0&&djTracks.length>0&&(
              React.createElement("div", {"style": {textAlign:"center",padding:"60px 0",fontFamily:T.sans,fontSize:11,color:"#8a8480"}}, "sin resultados")
            ), React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:6,paddingTop:4}}, filtered.map(t=>(
                React.createElement(DjTrackCard, {"key": t.id, "track": t, "onAdd": addToSet, "onRemove": removeFromSet, "inSet": mySet.some(s=>s.id===t.id), "onEdit": startEdit, "onDelete": deleteTrack, "mySet": mySet})
              )))))
      ), subTab==="artistas"&&(
        React.createElement(React.Fragment, null, React.createElement("div", {"style": {padding:"5px 14px 3px",flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost}}, filteredArtists.length, "artista", filteredArtists.length!==1?"s":"", "·", djTracks.length, "tracks")), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"0 10px 90px",scrollbarWidth:"none"}}, filteredArtists.length===0&&djTracks.length===0&&(
              React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:14,padding:"0 40px",textAlign:"center"}}, React.createElement("div", {"style": {fontSize:32,opacity:0.12}}, "👤"), React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:12,color:T.textMid}}, "Sin artistas aún"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:T.textDim,lineHeight:2}}, "Agregá tracks en la pestaña", React.createElement("span", {"style": {color:DJ_ACCENT,fontWeight:700}}, "Tracks")))
            ), filteredArtists.length===0&&djTracks.length>0&&(
              React.createElement("div", {"style": {textAlign:"center",padding:"60px 0",fontFamily:T.sans,fontSize:11,color:"#8a8480"}}, "sin resultados")
            ), React.createElement("div", {"style": {paddingTop:4}}, filteredArtists.map(a=>(
                React.createElement(ArtistCard, {"key": a, "artist": a, "tracks": artistsMap[a], "onEditTrack": startEdit, "onDeleteTrack": deleteTrack, "onAddToSet": addToSet, "onRemoveFromSet": removeFromSet, "mySet": mySet, "expanded": expandedArtist===a, "onToggle": ()=>setExpandedArtist(expandedArtist===a?null:a)})
              )))))
      ), subTab==="set"&&(
        React.createElement("div", {"style": {flex:1,overflow:"hidden",position:"relative"}}, React.createElement(DjSetBuilder, {"djTracks": djTracks, "mySet": mySet, "addToSet": addToSet, "removeFromSet": removeFromSet}))
      ), showForm&&React.createElement(DjTrackForm, {"onSave": saveTrack, "onCancel": ()=>{setShowForm(false);setEditTrack(null);}, "initial": editTrack}))
  );
}

// ── BARRA DE CONFIGURACIÓN (tema + tamaño) ────────────────────────────────
function SettingsBar({ theme, setThemeFn, scale, setScaleFn, compact }) {
  const scales = [
    { key:1,    label:"A",  title:"Normal"  },
    { key:1.18, label:"A+", title:"Grande"  },
    { key:1.38, label:"A++",title:"Muy grande"},
  ];
  return (
    React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:compact?6:10}}, React.createElement("div", {"style": {display:"flex",gap:3,alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"3px 5px"}}, scales.map(s=>(
          React.createElement("button", {"key": s.key, "onClick": ()=>setScaleFn(s.key), "title": s.title, "style": {
            background:scale===s.key?`${T.gold}20`:"transparent",
            border:`1px solid ${scale===s.key?T.gold+"55":"transparent"}`,
            color:scale===s.key?T.gold:T.textDim,
            fontFamily:T.sans, fontWeight:scale===s.key?800:500,
            fontSize:scale===s.key?10:8, padding:"3px 7px", borderRadius:6,
            cursor:"pointer", WebkitTapHighlightColor:"transparent",
            transition:"all 0.15s", letterSpacing:0.3,
          }}, s.label)
        ))), React.createElement("button", {"onClick": ()=>setThemeFn(theme==="dark"?"light":"dark"), "title": theme==="dark"?"Modo claro":"Modo oscuro", "style": {
        background:T.surface, border:`1px solid ${T.border}`,
        color:T.textMid, width:32, height:32, borderRadius:8,
        cursor:"pointer", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:15,
        WebkitTapHighlightColor:"transparent", transition:"all 0.2s",
        flexShrink:0,
      }}, theme==="dark" ? "☀️" : "🌙"))
  );
}

function useIsDesktop() {
  const [desk, setDesk] = React.useState(()=>window.innerWidth >= 900);
  React.useEffect(()=>{
    const fn = ()=>setDesk(window.innerWidth>=900);
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);
  return desk;
}

// Pre-calculate safe area top once, outside any component
var SAFE_AREA_TOP = 44;
try {
  var _safeEl = document.createElement('div');
  _safeEl.style.cssText = 'position:fixed;top:env(safe-area-inset-top,0px);height:0;width:0;visibility:hidden;pointer-events:none';
  document.body.appendChild(_safeEl);
  var _safeTop = _safeEl.getBoundingClientRect().top;
  document.body.removeChild(_safeEl);
  if (_safeTop > 0) SAFE_AREA_TOP = _safeTop;
} catch(e) {}

function App() {
  const [tab,setTab]=useState("library");
  const [seed,setSeed]=useState(null);
  const [mySet,setMySet]=useState([]);
  const [style,setStyle]=useState("all");
  const [maxPop,setMaxPop]=useState(65);
  const [search,setSearch]=useState("");
  const [findTrack,setFindTrack]=useState(null);
  const [djTracks,setDjTracks]=useState(()=>loadDjTracks());
  const isDesktop = useIsDesktop();

  // ── TEMA Y ESCALA ─────────────────────────────────────────────────────────
  const [theme, setThemeState] = useState(()=>{
    try { return localStorage.getItem("setlab_theme")||"dark"; } catch { return "dark"; }
  });
  const [scale, setScaleState] = useState(()=>{
    try { return parseFloat(localStorage.getItem("setlab_scale")||"1"); } catch { return 1; }
  });
  const [, forceRender] = useState(0);

  function setThemeFn(name) {
    applyTheme(name);
    setThemeState(name);
    forceRender(n=>n+1);
  }
  function setScaleFn(s) {
    setScaleState(s);
    applyScale(s);
    try { localStorage.setItem("setlab_scale", String(s)); } catch {}
  }

  // Aplicar tema y escala guardados al inicio
  React.useEffect(()=>{
    applyTheme(theme);
    applyScale(scale);
  },[]);

  const addToSet=t=>{if(!mySet.some(s=>s.id===t.id))setMySet(p=>[...p,t]);};
  const removeFromSet=id=>setMySet(p=>p.filter(t=>t.id!==id));
  const handleSeed=t=>{setSeed(t);if(t)setTab("build");};
  const tabs=[
    {id:"library",label:"Library",badge:null},
    {id:"build",  label:"Build",  badge:null},
    {id:"set",    label:"Set",    badge:mySet.length||null},
    {id:"djs",    label:"DJs",    badge:djTracks.length||null},
  ];

  const screenProps = {
    library: {seed, setSeed:handleSeed, mySet, addToSet, maxPop, setMaxPop, styleFilter:style, setStyleFilter:setStyle, search, setSearch, onFind:setFindTrack, djTracks},
    build:   {seed, setSeed:t=>{setSeed(t);if(!t)setTab("library");}, mySet, addToSet, setMySet, maxPop, onFind:setFindTrack, djTracks},
    set:     {mySet, setMySet, onFind:setFindTrack},
    djs:     {djTracks, setDjTracks, mySet, addToSet, removeFromSet},
  };

  const screens = { library:LibraryScreen, build:BuildScreen, set:SetScreen, djs:DJsScreen };
  const ActiveScreen = screens[tab];

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  if (isDesktop) return (
    React.createElement(ScaleCtx.Provider, {"value": scale}, React.createElement("div", {"id": "app-scaler", "style": {minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",}}, React.createElement("div", {"style": {height:56,background:T.bgAlt,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 32px",gap:24,flexShrink:0,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}, React.createElement(LogoFull, null), React.createElement("div", {"style": {width:1,height:24,background:T.border}}), React.createElement("div", {"style": {display:"flex",gap:4,flex:1}}, tabs.map(({id,label,badge})=>{
            const active=tab===id;
            const accent=id==="djs"?DJ_ACCENT:T.gold;
            return (
              React.createElement("button", {"key": id, "onClick": ()=>setTab(id), "style": {position:"relative",background:active?`${accent}15`:"transparent",border:`1px solid ${active?accent+"33":"transparent"}`,borderRadius:8,padding:"6px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,WebkitTapHighlightColor:"transparent",transition:"all 0.15s"}}, React.createElement(TabIcon, {"id": id, "active": active}), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:active?700:500,fontSize:11,color:active?accent:T.textDim,letterSpacing:0.8,textTransform:"uppercase"}}, label), badge&&React.createElement("div", {"style": {background:accent,color:"#000",fontFamily:T.sans,fontWeight:800,fontSize:8,minWidth:16,height:16,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}, badge))
            );
          })), React.createElement(SettingsBar, {"theme": theme, "setThemeFn": setThemeFn, "scale": scale, "setScaleFn": setScaleFn, "compact": false})), React.createElement("div", {"style": {flex:1,display:"flex",maxWidth:1400,width:"100%",margin:"0 auto",padding:"24px 24px 40px",gap:20,alignItems:"flex-start"}}, React.createElement("div", {"style": {flex:"0 0 520px",minWidth:0,background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:20,overflow:"hidden",height:"calc(100vh - 56px - 48px)",display:"flex",flexDirection:"column",position:"sticky",top:80}}, React.createElement(ActiveScreen, screenProps[tab])), React.createElement("div", {"style": {flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:16}}, React.createElement("div", {"style": {background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px 24px"}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}, "set actual"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:18,fontWeight:800,color:T.text,letterSpacing:-0.5}}, mySet.length, "tracks")), mySet.length>0&&React.createElement("button", {"onClick": ()=>setTab("set"), "style": {background:`${T.gold}15`,border:`1px solid ${T.gold}33`,color:T.gold,fontFamily:T.sans,fontWeight:700,fontSize:10,padding:"8px 16px",borderRadius:10,cursor:"pointer",letterSpacing:0.5}}, "Ver set completo →")), mySet.length===0?(
              React.createElement("div", {"style": {textAlign:"center",padding:"24px 0",fontFamily:T.sans,fontSize:11,color:T.textGhost}}, "Agregá tracks desde Library o Build")
            ):(
              React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:6}}, React.createElement(EnergyFlowChart, {"tracks": mySet}), mySet.slice(-3).map((t,i)=>(
                  React.createElement("div", {"key": t.id, "style": {display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost,width:20,textAlign:"center"}}, mySet.length-2+i), React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:11,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, t.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:T.textDim}}, t.artist)), React.createElement(KeyPill, {"k": t.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:9,color:T.textDim}}, t.bpm))
                )), mySet.length>3&&React.createElement("div", {"style": {textAlign:"center",fontFamily:T.mono,fontSize:8,color:T.textGhost}}, "+", mySet.length-3, "más"))
            )), seed&&(
            React.createElement("div", {"style": {background:T.bgAlt,border:`1px solid ${T.gold}22`,borderRadius:20,padding:"20px 24px"}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:8,color:T.goldDim,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}, "semilla activa"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:16,fontWeight:800,color:T.gold,letterSpacing:-0.3,marginBottom:4}}, seed.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:11,color:T.textMid,marginBottom:12}}, seed.artist), React.createElement("div", {"style": {display:"flex",gap:8,alignItems:"center"}}, React.createElement(KeyPill, {"k": seed.key, "highlight": true}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:11,color:T.textDim}}, seed.bpm, "BPM"), React.createElement(EBar, {"energy": seed.energy, "showLabel": true})))
          ), djTracks.length>0&&(
            React.createElement("div", {"style": {background:T.bgAlt,border:`1px solid ${DJ_ACCENT}18`,borderRadius:20,padding:"20px 24px"}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:8,color:DJ_ACCENT,letterSpacing:2,textTransform:"uppercase",opacity:0.7,marginBottom:10}}, "djs emergentes"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:22,fontWeight:800,color:DJ_ACCENT,marginBottom:4}}, djTracks.length), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:10,color:T.textDim,marginBottom:12}}, "tracks en tu catálogo"), React.createElement("button", {"onClick": ()=>setTab("djs"), "style": {background:`${DJ_ACCENT}15`,border:`1px solid ${DJ_ACCENT}33`,color:DJ_ACCENT,fontFamily:T.sans,fontWeight:700,fontSize:10,padding:"8px 16px",borderRadius:10,cursor:"pointer",letterSpacing:0.5}}, "Ver DJs →"))
          ), React.createElement("div", {"style": {background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px 24px"}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:8,color:"#01ff9544",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}, "beatport affiliate"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:11,color:T.textDim,lineHeight:1.8}}, "Cada click en", React.createElement("span", {"style": {color:"#01ff95",fontWeight:700}}, "B"), "genera una comisión cuando el usuario compra. Configurá tu ID en el código para activarlo."), React.createElement("div", {"style": {marginTop:12,fontFamily:T.mono,fontSize:9,color:T.textGhost,background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px"}}, "const BP_AFFIL =", React.createElement("span", {"style": {color:"#01ff95"}}, "\"tu-id-aqui\""), ";")))), findTrack&&React.createElement(FindModal, {"track": findTrack, "onClose": ()=>setFindTrack(null)}), React.createElement(InstallBanner, null)))
  );

  // ── MOBILE LAYOUT — header y footer siempre visibles ──────────────────────
  const HEADER_H = SAFE_AREA_TOP + 52; // safe area + 52 header
  const NAV_H = 64;
  return (
    React.createElement(ScaleCtx.Provider, {"value": scale}, React.createElement("div", {"id": "app-scaler", "style": {height:"100vh",overflow:"hidden",background:T.bg,position:"relative"}}, React.createElement("div", {"style": {position:"fixed",top:0,left:0,right:0,zIndex:100,background:T.bgAlt,borderBottom:`1px solid ${T.border}`}}, React.createElement("div", {"style": {height:SAFE_AREA_TOP}}), React.createElement("div", {"style": {height:52,display:"flex",alignItems:"center",padding:"0 14px 0 20px",justifyContent:"space-between",maxWidth:430,margin:"0 auto",width:"100%"}}, React.createElement(LogoFull, null), React.createElement(SettingsBar, {"theme": theme, "setThemeFn": setThemeFn, "scale": scale, "setScaleFn": setScaleFn, "compact": true}))), React.createElement("div", {"style": {
        position:"absolute", top:HEADER_H, bottom:NAV_H, left:0, right:0,
        overflowY:"auto", overflowX:"hidden",
        WebkitOverflowScrolling:"touch", scrollbarWidth:"none",
      }}, React.createElement("div", {"style": {maxWidth:430, margin:"0 auto", minHeight:"100%", background:T.bgAlt, display:"flex", flexDirection:"column"}}, tab==="library"&&React.createElement(LibraryScreen, {"seed": seed, "setSeed": handleSeed, "mySet": mySet, "addToSet": addToSet, "maxPop": maxPop, "setMaxPop": setMaxPop, "styleFilter": style, "setStyleFilter": setStyle, "search": search, "setSearch": setSearch, "onFind": setFindTrack, "djTracks": djTracks}), tab==="build"&&React.createElement(BuildScreen, {"seed": seed, "setSeed": t=>{setSeed(t);if(!t)setTab("library");}, "mySet": mySet, "addToSet": addToSet, "setMySet": setMySet, "maxPop": maxPop, "onFind": setFindTrack, "djTracks": djTracks}), tab==="set"&&React.createElement(SetScreen, {"mySet": mySet, "setMySet": setMySet, "onFind": setFindTrack}), tab==="djs"&&React.createElement(DJsScreen, {"djTracks": djTracks, "setDjTracks": setDjTracks, "mySet": mySet, "addToSet": addToSet, "removeFromSet": removeFromSet}))), React.createElement("div", {"style": {
        position:"fixed", bottom:0, left:0, right:0, zIndex:100,
        background:T.isDark?"rgba(4,3,2,0.97)":T.bgAlt,
        borderTop:`1px solid ${T.border}`,
        display:"flex", paddingBottom:"env(safe-area-inset-bottom,8px)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      }}, React.createElement("div", {"style": {display:"flex",width:"100%",maxWidth:430,margin:"0 auto"}}, tabs.map(({id,label,badge})=>{
            const active=tab===id;
            const accent=id==="djs"?DJ_ACCENT:T.gold;
            return (
              React.createElement("button", {"key": id, "onClick": ()=>setTab(id), "style": {flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",position:"relative",WebkitTapHighlightColor:"transparent",padding:"10px 0"}}, active&&React.createElement("div", {"style": {position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:20,height:1.5,background:accent,borderRadius:"0 0 2px 2px"}}), React.createElement(TabIcon, {"id": id, "active": active}), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:active?700:500,fontSize:7.5,color:active?accent:T.textGhost,letterSpacing:1.2,textTransform:"uppercase"}}, label), badge&&React.createElement("div", {"style": {position:"absolute",top:5,right:"calc(50% - 20px)",background:accent,color:"#000",fontFamily:T.sans,fontWeight:800,fontSize:7,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}, badge))
            );
          }))), findTrack&&React.createElement(FindModal, {"track": findTrack, "onClose": ()=>setFindTrack(null)}), React.createElement(InstallBanner, null)))
  );
}

