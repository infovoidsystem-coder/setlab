function SetScreen({ mySet, setMySet, onFind }) {
  const moveUp=i=>{if(i===0)return;const a=[...mySet];[a[i-1],a[i]]=[a[i],a[i-1]];setMySet(a);};
  const moveDown=i=>{if(i===mySet.length-1)return;const a=[...mySet];[a[i],a[i+1]]=[a[i+1],a[i]];setMySet(a);};
  const remove=id=>setMySet(p=>p.filter(t=>t.id!==id));
  if(mySet.length===0) return React.createElement(EmptyState, {"icon": React.createElement(LogoMark, {"size": 56}), "headline": "tu set está vacío", "sub": "Explorá LIBRARY para descubrir tracks\ny usá BUILD para encontrar el siguiente\ntrack compatible. Agregá con '+'."}); 
  const avgBpm=Math.round(mySet.reduce((a,t)=>a+t.bpm,0)/mySet.length);
  const avgE=(mySet.reduce((a,t)=>a+t.energy,0)/mySet.length).toFixed(1);
  const dur=mySet.length*7;
  let harmSum=0;
  for(let i=1;i<mySet.length;i++) harmSum+=camelotScore(mySet[i-1].key,mySet[i].key);
  const harm=mySet.length>1?Math.round(harmSum/(mySet.length-1)):100;
  const harmColor=harm>=80?T.green:harm>=60?T.yellow:T.orange;
  return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",height:"100%"}}, React.createElement("div", {"style": {margin:"8px 12px 0",display:"flex",background:"#080706",border:"1px solid #141210",borderRadius:14,overflow:"hidden",flexShrink:0}}, [[mySet.length,"TRACKS"],[`${Math.floor(dur/60)}h${dur%60>0?` ${dur%60}m`:""}`, "DUR"],[avgBpm,"BPM"],[avgE,"NRG"]].map(([v,l],i,arr)=>(
          React.createElement("div", {"key": l, "style": {flex:1,padding:"11px 0",textAlign:"center",borderRight:i<arr.length-1?"1px solid #100e0c":"none"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:i===0?18:15,color:T.text,letterSpacing:-0.3}}, v), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:6.5,color:T.textGhost,letterSpacing:1.5,marginTop:3,textTransform:"uppercase"}}, l))
        ))), React.createElement("div", {"style": {margin:"5px 12px 0",background:"#080706",border:"1px solid #141210",borderRadius:10,padding:"9px 15px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:7.5,color:T.textGhost,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}, "cohesión armónica"), React.createElement("div", {"style": {height:2,width:150,background:"#141210",borderRadius:2}}, React.createElement("div", {"style": {height:"100%",width:`${harm}%`,background:harmColor,borderRadius:2,transition:"width 0.5s"}}))), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:20,color:harmColor,letterSpacing:-1}}, harm, "%")), mySet.length>=2&&(
        React.createElement("div", {"style": {margin:"4px 12px 0",background:"#080706",border:"1px solid #141210",borderRadius:10,flexShrink:0}}, React.createElement(EnergyFlowChart, {"tracks": mySet}))
      ), React.createElement("div", {"style": {padding:"6px 16px 2px",display:"flex",justifyContent:"space-between",flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8.5,color:T.textGhost}}, "orden del set"), React.createElement("button", {"onClick": ()=>setMySet([]), "style": {background:"none",border:"none",fontFamily:T.sans,fontWeight:500,color:"#3a1a1a",fontSize:9,cursor:"pointer"}}, "limpiar todo")), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"0 10px 90px",scrollbarWidth:"none"}}, React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:0}}, mySet.map((track,i)=>{
            const prev=mySet[i-1];
            return (
              React.createElement("div", {"key": track.id}, prev&&React.createElement(CompatConnector, {"from": prev, "to": track}), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:6,marginBottom:2}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:8.5,color:T.textGhost,width:20,textAlign:"center",flexShrink:0}}, i+1), React.createElement("div", {"style": {flex:1,minWidth:0,background:T.surface,border:`1px solid ${T.border}`,borderRadius:11,padding:"10px 12px"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:12,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:-0.2}}, track.title), React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:400,fontSize:9,color:T.textDim,marginTop:2}}, track.artist), track.label&&React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:3,marginTop:3}}, React.createElement("svg", {"width": "7", "height": "7", "viewBox": "0 0 20 20", "fill": "none"}, React.createElement("circle", {"cx": "10", "cy": "10", "r": "9", "stroke": T.goldDim, "strokeWidth": "1.5"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "3", "stroke": T.goldDim, "strokeWidth": "1.2"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "1", "fill": T.goldDim})), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:T.goldDim,letterSpacing:0.3}}, track.label))), React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center",flexShrink:0}}, React.createElement(KeyPill, {"k": track.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:9,color:T.textDim}}, track.bpm))), React.createElement("div", {"style": {marginTop:6}}, React.createElement(EBar, {"energy": track.energy, "showLabel": true}))), React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:3,flexShrink:0}}, [["↑",()=>moveUp(i),"#3a3836"],["↓",()=>moveDown(i),"#3a3836"],["✕",()=>remove(track.id),"#501818"]].map(([lbl,fn,col])=>(
                      React.createElement("button", {"key": lbl, "onClick": fn, "style": {background:T.surface,border:`1px solid ${T.border}`,color:col,width:24,height:24,borderRadius:6,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent",fontWeight:700,fontFamily:T.sans}}, lbl)
                    )))))
            );
          }))))
  );
}

const TabIcon=({id,active})=>{
  const c=active?(id==="djs"?DJ_ACCENT:T.gold):"#302e2c";
  if(id==="library") return (
    React.createElement("svg", {"width": "20", "height": "20", "viewBox": "0 0 24 24", "fill": "none", "stroke": c, "strokeWidth": "1.5", "strokeLinecap": "round", "strokeLinejoin": "round"}, React.createElement("rect", {"x": "3", "y": "4", "width": "4", "height": "16", "rx": "1"}), React.createElement("rect", {"x": "9", "y": "4", "width": "4", "height": "16", "rx": "1"}), React.createElement("path", {"d": "M15 4l4 16"}), React.createElement("path", {"d": "M15 9l4 0"}))
  );
  if(id==="build") return (
    React.createElement("svg", {"width": "20", "height": "20", "viewBox": "0 0 24 24", "fill": "none", "stroke": c, "strokeWidth": "1.5", "strokeLinecap": "round"}, React.createElement("path", {"d": "M12 2L2 7l10 5 10-5-10-5z"}), React.createElement("path", {"d": "M2 17l10 5 10-5"}), React.createElement("path", {"d": "M2 12l10 5 10-5"}))
  );
  if(id==="djs") return (
    React.createElement("svg", {"width": "20", "height": "20", "viewBox": "0 0 24 24", "fill": "none", "stroke": c, "strokeWidth": "1.5", "strokeLinecap": "round", "strokeLinejoin": "round"}, React.createElement("circle", {"cx": "9", "cy": "7", "r": "4"}), React.createElement("path", {"d": "M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"}), React.createElement("path", {"d": "M16 3.13a4 4 0 0 1 0 7.75"}), React.createElement("path", {"d": "M21 21v-2a4 4 0 0 0-3-3.85"}))
  );
  return (
    React.createElement("svg", {"width": "20", "height": "20", "viewBox": "0 0 24 24", "fill": "none", "stroke": c, "strokeWidth": "1.5", "strokeLinecap": "round"}, React.createElement("path", {"d": "M9 6h10M9 12h10M9 18h10M5 6v.01M5 12v.01M5 18v.01"}))
  );
};

// ── DJS EMERGENTES — STORAGE ──────────────────────────────────────────────
const DJ_KEY = "setlab_dj_tracks_v1";
function loadDjTracks() {
  try { return JSON.parse(localStorage.getItem(DJ_KEY) || "[]"); } catch { return []; }
}
function saveDjTracks(tracks) {
  try { localStorage.setItem(DJ_KEY, JSON.stringify(tracks)); } catch {}
}
function newDjId() { return "dj_" + Date.now() + "_" + Math.random().toString(36).slice(2,7); }

const CAMELOT_KEYS = ["1A","2A","3A","4A","5A","6A","7A","8A","9A","10A","11A","12A","1B","2B","3B","4B","5B","6B","7B","8B","9B","10B","11B","12B"];
const ALL_STYLES = ["techno","dark","hard techno","industrial techno","deep techno","hypnotic","melodic techno","ambient techno","dub techno","minimal","electro","acid","deep house","dark house","melodic house","chicago","ghetto house","dubstep","drum and bass","tribal","industrial"];

const DJ_ACCENT = "#a855f7"; // violet para DJs emergentes

// ── FORMULARIO DE NUEVO TRACK ─────────────────────────────────────────────
// ── PWA INSTALL BANNER ───────────────────────────────────────────────────
function InstallBanner() {
  const [show, setShow] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isIOS, setIsIOS] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    // Ya instalada → no mostrar
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Ya descartada antes
    try { if (localStorage.getItem('setlab_banner_dismissed')) return; } catch {}

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    if (ios) { setIsIOS(true); setTimeout(()=>setShow(true), 3000); return; }

    const handler = e => { e.preventDefault(); setDeferredPrompt(e); setTimeout(()=>setShow(true), 3000); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('setlab_banner_dismissed', '1');
  }

  async function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
    }
  }

  if (!show || dismissed) return null;

  return (
    React.createElement("div", {"style": {
      position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)",
      width:"calc(100% - 32px)", maxWidth:398, zIndex:300,
      background:"linear-gradient(135deg,#0e0b06,#1a1206)",
      border:`1px solid ${T.gold}44`, borderRadius:16,
      padding:"14px 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.6)",
      animation:"slideUp 0.4s cubic-bezier(.2,0,.2,1)"
    }}, React.createElement("style", null, `@keyframes slideUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`), React.createElement("button", {"onClick": dismiss, "style": {position:"absolute",top:10,right:12,background:"none",border:"none",color:T.textDim,fontSize:14,cursor:"pointer",padding:2}}, "✕"), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:12}}, React.createElement("div", {"style": {width:44,height:44,borderRadius:12,background:"#030302",border:`1px solid ${T.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}, React.createElement(LogoMark, {"size": 32})), React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:13,color:T.gold,letterSpacing:-0.3}}, "Instalá SetLab"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:T.textMid,marginTop:2,lineHeight:1.5}}, isIOS ? "Tocá compartir 􀈂 → \"Agregar a inicio\"" : "Agregá la app a tu pantalla de inicio")), !isIOS && (
          React.createElement("button", {"onClick": install, "style": {
            background:`${T.gold}18`, border:`1px solid ${T.gold}55`,
            color:T.gold, fontFamily:T.sans, fontWeight:800, fontSize:10,
            padding:"8px 14px", borderRadius:10, cursor:"pointer",
            flexShrink:0, letterSpacing:0.3, WebkitTapHighlightColor:"transparent"
          }}, "Instalar")
        )), isIOS && (
        React.createElement("div", {"style": {marginTop:10,padding:"8px 12px",background:"#080706",borderRadius:10,border:"1px solid #1e1c18"}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:8}}, React.createElement("span", {"style": {fontSize:16}}, "1️⃣"), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:9,color:T.textMid}}, "Tocá el botón", React.createElement("strong", {"style": {color:T.text}}, "Compartir"), "en Safari (ícono de flecha hacia arriba)")), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:8,marginTop:6}}, React.createElement("span", {"style": {fontSize:16}}, "2️⃣"), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:9,color:T.textMid}}, "Seleccioná", React.createElement("strong", {"style": {color:T.text}}, "\"Agregar a pantalla de inicio\""))), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:8,marginTop:6}}, React.createElement("span", {"style": {fontSize:16}}, "3️⃣"), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:9,color:T.textMid}}, "Tocá", React.createElement("strong", {"style": {color:T.text}}, "\"Agregar\""), "— SetLab queda en tu inicio")))
      ))
  );
}

function DjTrackForm({ onSave, onCancel, initial }) {
  const [form, setForm] = React.useState(initial || {
    title:"", artist:"", bpm:130, key:"10A", energy:7,
    style:[], label:"", previewUrl:"", soundcloudUrl:"", instagramUrl:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleStyle = s => set("style", form.style.includes(s) ? form.style.filter(x=>x!==s) : [...form.style, s].slice(0,4));
  const valid = form.title.trim() && form.artist.trim() && form.style.length > 0;

  const iStyle = {
    width:"100%", borderRadius:10, padding:"12px 14px",
    fontFamily:T.sans, fontSize:13, outline:"none",
    background: T.isDark ? "#252018" : "#f8f6f2",
    border: `1.5px solid ${T.isDark ? "#3e3a34" : "#d4cfc8"}`,
    color: T.isDark ? "#f0ece4" : "#1c1a17",
    transition:"border-color 0.2s, background 0.2s",
    display:"block",
  };
  const iStyleActive = (active) => ({
    ...iStyle,
    border:`1.5px solid ${active ? DJ_ACCENT+"99" : iStyle.border}`,
    background: active ? (T.isDark?"#2e2820":"#ffffff") : iStyle.background,
  });

  return (
    React.createElement("div", {"style": {position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"flex-end",backdropFilter:"blur(8px)"}}, React.createElement("div", {"style": {
        width:"100%",
        background: T.isDark ? "#18140f" : "#ffffff",
        borderTop: `2px solid ${T.isDark?"#3e3a34":T.border}`,
        borderRadius:"24px 24px 0 0",
        maxHeight:"92vh", overflow:"hidden",
        display:"flex", flexDirection:"column",
        boxShadow: T.isDark?"0 -12px 60px rgba(0,0,0,0.9)":"0 -12px 60px rgba(0,0,0,0.12)",
      }}, React.createElement("div", {"style": {padding:"12px 20px 14px", borderBottom:`1px solid ${T.isDark?"#2e2a24":T.border}`, flexShrink:0}}, React.createElement("div", {"style": {display:"flex",justifyContent:"center",marginBottom:14}}, React.createElement("div", {"style": {width:40,height:4,borderRadius:2,background:T.isDark?"#3e3a34":"#d4cfc8"}})), React.createElement("div", {"style": {display:"flex",alignItems:"center",justifyContent:"space-between"}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:8.5,color:DJ_ACCENT,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:600,opacity:0.9}}, "DJs Emergentes"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:22,fontWeight:800,color:T.isDark?"#f5f0e8":"#1c1a17",letterSpacing:-0.5,lineHeight:1}}, initial?"Editar track":"Agregar track")), React.createElement("button", {"onClick": onCancel, "style": {
              background:T.isDark?"#2e2a24":"#f0ede8",
              border:`1px solid ${T.isDark?"#3e3a34":"#d4cfc8"}`,
              color:T.isDark?"#d0ccc4":"#5a5652",
              fontSize:15,cursor:"pointer",
              width:36,height:36,borderRadius:10,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontWeight:700,lineHeight:1,
            }}, "✕"))), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"18px 20px 28px",scrollbarWidth:"none"}}, React.createElement("div", {"style": {marginBottom:14}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "Artista *"), React.createElement("input", {"value": form.artist, "onChange": e=>set("artist",e.target.value), "placeholder": "Nombre del DJ / Artista", "style": iStyleActive(form.artist.length>0)})), React.createElement("div", {"style": {marginBottom:14}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "Título del track *"), React.createElement("input", {"value": form.title, "onChange": e=>set("title",e.target.value), "placeholder": "Nombre del track", "style": iStyleActive(form.title.length>0)})), React.createElement("div", {"style": {display:"flex",gap:10,marginBottom:14}}, React.createElement("div", {"style": {flex:1}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "BPM"), React.createElement("input", {"type": "number", "value": form.bpm, "min": 80, "max": 180, "onChange": e=>set("bpm",Math.min(180,Math.max(80,+e.target.value))), "style": {...iStyle,fontFamily:T.mono,fontSize:16,fontWeight:600}})), React.createElement("div", {"style": {flex:1}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "Clave (Camelot)"), React.createElement("select", {"value": form.key, "onChange": e=>set("key",e.target.value), "style": {...iStyle,fontFamily:T.mono,cursor:"pointer"}}, CAMELOT_KEYS.map(k=>React.createElement("option", {"key": k, "value": k}, k))))), React.createElement("div", {"style": {marginBottom:16}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",marginBottom:7}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}, "Energía"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:14,color:DJ_ACCENT,fontWeight:700}}, "e", form.energy)), React.createElement("input", {"type": "range", "min": 1, "max": 10, "value": form.energy, "onChange": e=>set("energy",+e.target.value), "style": {width:"100%",accentColor:DJ_ACCENT,cursor:"pointer"}}), React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",marginTop:4}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost}}, "ambient"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost}}, "peak"))), React.createElement("div", {"style": {marginBottom:16}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:9,fontWeight:600}}, "Estilo * (máx. 4)"), React.createElement("div", {"style": {display:"flex",flexWrap:"wrap",gap:6}}, ALL_STYLES.map(s=>{
                const on=form.style.includes(s);
                return (
                  React.createElement("button", {"key": s, "onClick": ()=>toggleStyle(s), "style": {
                    background:on?`${DJ_ACCENT}22`:T.isDark?"#252018":"#ece8e2",
                    color:on?DJ_ACCENT:T.isDark?"#d0ccc4":"#5a5652",
                    border:`1.5px solid ${on?DJ_ACCENT+"77":T.isDark?"#3e3a34":"#d4cfc8"}`,
                    fontSize:8.5, padding:"5px 12px", borderRadius:20, cursor:"pointer",
                    letterSpacing:0.8, textTransform:"uppercase", fontFamily:T.sans,
                    fontWeight:on?700:500, transition:"all 0.15s", WebkitTapHighlightColor:"transparent",
                  }}, s)
                );
              }))), React.createElement("div", {"style": {marginBottom:14}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:T.isDark?"#a09888":"#6a6460",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "Sello (opcional)"), React.createElement("input", {"value": form.label, "onChange": e=>set("label",e.target.value), "placeholder": "Nombre del sello / Independiente", "style": iStyle})), React.createElement("div", {"style": {marginBottom:14}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:DJ_ACCENT,letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "▶ URL de audio directo (opcional)"), React.createElement("input", {"value": form.previewUrl, "onChange": e=>set("previewUrl",e.target.value), "placeholder": "https://… .mp3 / .ogg / .wav", "style": {...iStyle,fontFamily:T.mono,fontSize:11}}), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost,marginTop:5,lineHeight:1.6}}, "Pegá una URL directa a un archivo de audio (.mp3, .ogg, etc.) para que el botón ▶ lo reproduzca al instante. Funciona con Dropbox (dl=1), Google Drive, o cualquier CDN de audio.")), React.createElement("div", {"style": {marginBottom:14}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:"#ff5500",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "☁ SoundCloud URL — preescucha"), React.createElement("input", {"value": form.soundcloudUrl, "onChange": e=>set("soundcloudUrl",e.target.value), "placeholder": "https://soundcloud.com/artista/track", "style": {...iStyle,fontFamily:T.mono,fontSize:11}}), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7.5,color:"#ff550088",marginTop:5,lineHeight:1.6}}, "Pegá la URL de la página del track en SoundCloud. El botón ▶ intentará reproducirlo inline; si el track es privado, lo abrirá en SoundCloud.")), React.createElement("div", {"style": {marginBottom:24}}, React.createElement("label", {"style": {fontFamily:T.mono,fontSize:8,color:"#e1306c",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:7,fontWeight:600}}, "◈ Instagram (opcional)"), React.createElement("input", {"value": form.instagramUrl, "onChange": e=>set("instagramUrl",e.target.value), "placeholder": "https://instagram.com/…", "style": {...iStyle,fontFamily:T.mono,fontSize:11}})), React.createElement("button", {"onClick": ()=>valid&&onSave(form), "style": {
            width:"100%",
            background:valid?`${DJ_ACCENT}22`:T.isDark?"#1e1a14":"#f0ede8",
            border:`2px solid ${valid?DJ_ACCENT+"88":T.isDark?"#2e2a24":"#d4cfc8"}`,
            color:valid?DJ_ACCENT:T.isDark?"#504844":"#9a9490",
            padding:"16px", borderRadius:12,
            cursor:valid?"pointer":"not-allowed",
            fontFamily:T.sans, fontWeight:800, fontSize:14,
            letterSpacing:0.3, transition:"all 0.2s", WebkitTapHighlightColor:"transparent",
          }}, valid ? "✓  Guardar track" : "Completá los campos obligatorios (*)"))))
  );
}

// ── DJ TRACK CARD (versión compacta con badge EMERGENTE) ──────────────────
function DjTrackCard({ track, onAdd, onRemove, inSet, onEdit, onDelete, mySet }) {
  const [pressed, setPressed] = React.useState(false);
  const [showDel, setShowDel] = React.useState(false);
  const links = [];
  if (track.soundcloudUrl) links.push({ icon:"☁", color:"#ff5500", url:track.soundcloudUrl, hint:"SoundCloud" });
  if (track.instagramUrl)  links.push({ icon:"◈", color:"#e1306c", url:track.instagramUrl,  hint:"Instagram"  });
  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  links.push({ icon:"B", color:"#01ff95", url:bpUrl(q), hint:"Beatport" });
  const hasDirectAudio = track.previewUrl && isDirectAudioUrl(track.previewUrl);

  return (
    React.createElement("div", {"style": {background:"#070509",border:`1px solid ${DJ_ACCENT}22`,borderRadius:12,overflow:"hidden",position:"relative"}}, React.createElement("div", {"style": {position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${DJ_ACCENT}55,transparent)`}}), React.createElement("div", {"onPointerDown": ()=>setPressed(true), "onPointerUp": ()=>setPressed(false), "onPointerLeave": ()=>setPressed(false), "style": {padding:"12px 14px",transform:pressed?"scale(0.983)":"scale(1)",transition:"transform 0.1s ease",WebkitTapHighlightColor:"transparent"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontSize:13,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:-0.3}}, track.title), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6,color:DJ_ACCENT,background:`${DJ_ACCENT}15`,border:`1px solid ${DJ_ACCENT}30`,padding:"1px 6px",borderRadius:3,letterSpacing:1.5,textTransform:"uppercase",flexShrink:0}}, "emergente")), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:10,fontWeight:400,color:DJ_ACCENT,marginTop:2,opacity:0.85}}, track.artist), track.label&&React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:4,marginTop:4}}, React.createElement("svg", {"width": "9", "height": "9", "viewBox": "0 0 20 20", "fill": "none"}, React.createElement("circle", {"cx": "10", "cy": "10", "r": "9", "stroke": DJ_ACCENT, "strokeWidth": "1.5", "opacity": ".5"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "3", "stroke": DJ_ACCENT, "strokeWidth": "1.2", "opacity": ".5"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "1", "fill": DJ_ACCENT, "opacity": ".5"})), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:DJ_ACCENT,opacity:0.5,letterSpacing:0.4}}, track.label))), React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}, React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement(KeyPill, {"k": track.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:10,color:T.textDim,letterSpacing:0.5}}, track.bpm)), React.createElement(EBar, {"energy": track.energy, "showLabel": true}))), React.createElement("div", {"style": {marginTop:9,display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("div", {"style": {display:"flex",gap:3,flexWrap:"wrap"}}, track.style.slice(0,2).map(s=>(
              React.createElement("span", {"key": s, "style": {fontFamily:T.sans,fontWeight:500,fontSize:7.5,color:DJ_ACCENT,background:`${DJ_ACCENT}0a`,border:`1px solid ${DJ_ACCENT}20`,padding:"2px 7px",borderRadius:20,letterSpacing:0.5,textTransform:"uppercase",opacity:0.8}}, s)
            ))), React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement(PreviewButton, {"track": track, "accent": DJ_ACCENT}), hasDirectAudio && (
              React.createElement("span", {"title": "Tiene audio directo — reproducción instantánea", "style": {fontFamily:T.mono,fontSize:6.5,color:DJ_ACCENT,background:`${DJ_ACCENT}15`,border:`1px solid ${DJ_ACCENT}30`,padding:"1px 5px",borderRadius:3,letterSpacing:1,flexShrink:0}}, "AUDIO")
            ), links.map(l=>(
              React.createElement("a", {"key": l.hint, "href": l.url, "target": "_blank", "rel": "noopener noreferrer", "onClick": e=>e.stopPropagation(), "title": l.hint, "style": {background:"#0e0e0c",border:`1px solid ${l.color}33`,color:l.color,fontSize:10,width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",flexShrink:0,fontFamily:T.mono,fontWeight:700}}, l.icon)
            )), React.createElement("button", {"onClick": e=>{e.stopPropagation();onEdit(track);}, "title": "Editar track", "style": {background:"#0e0e0c",border:"1px solid #2a2826",color:"#6a6460",fontSize:11,width:26,height:26,borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,WebkitTapHighlightColor:"transparent",transition:"all 0.15s"}}, "✎"), React.createElement("button", {"onClick": e=>{e.stopPropagation();setShowDel(v=>!v);}, "title": "Eliminar track", "style": {background:showDel?"#3a0808":"#150505",border:`1px solid ${showDel?"#7a1818":"#3a1010"}`,color:showDel?"#ff6060":"#8a3030",fontSize:10,width:26,height:26,borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,WebkitTapHighlightColor:"transparent",transition:"all 0.15s",fontWeight:700}}, "✕"), React.createElement("button", {"onClick": e=>{e.stopPropagation();inSet?(onRemove&&onRemove(track.id)):onAdd(track);}, "style": {background:inSet?"#071a07":"#0e0e0c",border:`1px solid ${inSet?"#22c55e44":"#1e1c1a"}`,color:inSet?T.green:"#383430",fontSize:inSet?10:14,width:26,height:26,borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",WebkitTapHighlightColor:"transparent",fontWeight:600,fontFamily:T.sans}, "title": inSet?"Quitar del set":"Agregar al set"}, inSet?"✓":"+"))), showDel&&(
          React.createElement("div", {"style": {marginTop:8,padding:"10px 12px",background:"#1a0606",border:"1px solid #5a1515",borderRadius:10,display:"flex",alignItems:"center",gap:10}}, React.createElement("svg", {"width": "14", "height": "14", "viewBox": "0 0 24 24", "fill": "none", "stroke": "#ff6060", "strokeWidth": "2", "strokeLinecap": "round"}, React.createElement("polyline", {"points": "3 6 5 6 21 6"}), React.createElement("path", {"d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:9.5,color:"#d08080",flex:1}}, "¿Eliminar", React.createElement("strong", {"style": {color:"#ff8080"}}, track.title), "?"), React.createElement("button", {"onClick": e=>{e.stopPropagation();onDelete(track.id);}, "style": {background:"#5a0a0a",border:"1px solid #8a1a1a",color:"#ff7070",fontFamily:T.sans,fontSize:9,padding:"4px 12px",borderRadius:7,cursor:"pointer",fontWeight:700,letterSpacing:0.3}}, "Eliminar"), React.createElement("button", {"onClick": e=>{e.stopPropagation();setShowDel(false);}, "style": {background:"#1a1614",border:"1px solid #2a2422",color:T.textDim,fontFamily:T.sans,fontSize:9,padding:"4px 10px",borderRadius:7,cursor:"pointer"}}, "Cancelar"))
        )))
  );
}

// ── ARTISTA CARD (vista base de datos) ───────────────────────────────────
function ArtistCard({ artist, tracks, onEditTrack, onDeleteTrack, onAddToSet, onRemoveFromSet, mySet, expanded, onToggle }) {
  const inSet = tracks.filter(t=>mySet.some(s=>s.id===t.id)).length;
  const styles = [...new Set(tracks.flatMap(t=>t.style))].slice(0,4);
  const avgBpm = Math.round(tracks.reduce((a,t)=>a+t.bpm,0)/tracks.length);
  const avgE = (tracks.reduce((a,t)=>a+t.energy,0)/tracks.length).toFixed(1);

  return (
    React.createElement("div", {"style": {background:"#060408",border:`1px solid ${DJ_ACCENT}22`,borderRadius:14,overflow:"hidden",marginBottom:6}}, React.createElement("button", {"onClick": onToggle, "style": {width:"100%",background:"none",border:"none",cursor:"pointer",padding:"12px 14px",WebkitTapHighlightColor:"transparent",textAlign:"left"}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:10}}, React.createElement("div", {"style": {width:36,height:36,borderRadius:10,background:`${DJ_ACCENT}18`,border:`1px solid ${DJ_ACCENT}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:14,color:DJ_ACCENT}}, artist[0].toUpperCase())), React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:13,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, artist), React.createElement("div", {"style": {display:"flex",gap:8,alignItems:"center",marginTop:2}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost}}, tracks.length, "track", tracks.length!==1?"s":""), React.createElement("span", {"style": {color:"#1e1c1a"}}, "·"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost}}, "~", avgBpm, "BPM"), React.createElement("span", {"style": {color:"#1e1c1a"}}, "·"), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost}}, "e", avgE), inSet>0&&React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7,color:T.green,background:"#071a07",border:"1px solid #22c55e22",padding:"1px 5px",borderRadius:4}}, inSet, "en set"))), React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}, React.createElement("svg", {"width": "12", "height": "12", "viewBox": "0 0 24 24", "fill": "none", "stroke": DJ_ACCENT, "strokeWidth": "2", "strokeLinecap": "round", "style": {transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",opacity:0.5}}, React.createElement("path", {"d": "M6 9l6 6 6-6"})), React.createElement("div", {"style": {display:"flex",gap:2,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:100}}, styles.slice(0,2).map(s=>React.createElement("span", {"key": s, "style": {fontFamily:T.mono,fontSize:6,color:DJ_ACCENT,opacity:0.5,background:`${DJ_ACCENT}0a`,border:`1px solid ${DJ_ACCENT}15`,padding:"1px 4px",borderRadius:3,letterSpacing:0.5,textTransform:"uppercase",whiteSpace:"nowrap"}}, s)))))), expanded&&(
        React.createElement("div", {"style": {borderTop:`1px solid ${DJ_ACCENT}12`}}, tracks.map((t,i)=>(
            React.createElement("div", {"key": t.id, "style": {padding:"9px 14px",borderBottom:i<tracks.length-1?`1px solid ${DJ_ACCENT}0a`:"none",display:"flex",alignItems:"center",gap:8}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:600,fontSize:11.5,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, t.title), React.createElement("div", {"style": {display:"flex",gap:6,alignItems:"center",marginTop:2}}, React.createElement(KeyPill, {"k": t.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost}}, t.bpm), React.createElement(EBar, {"energy": t.energy, "showLabel": true}))), React.createElement("div", {"style": {display:"flex",gap:4,alignItems:"center",flexShrink:0}}, React.createElement(PreviewButton, {"track": t, "accent": DJ_ACCENT}), React.createElement("button", {"onClick": ()=>onEditTrack(t), "title": "Editar", "style": {background:"#0e0e0c",border:"1px solid #2a2826",color:"#6a6460",fontSize:10,width:24,height:24,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,WebkitTapHighlightColor:"transparent"}}, "✎"), React.createElement("button", {"onClick": ()=>mySet.some(s=>s.id===t.id)?onRemoveFromSet(t.id):onAddToSet(t), "title": mySet.some(s=>s.id===t.id)?"Quitar del set":"Agregar al set", "style": {background:mySet.some(s=>s.id===t.id)?"#071a07":"#0e0e0c",border:`1px solid ${mySet.some(s=>s.id===t.id)?"#22c55e33":"#1e1c1a"}`,color:mySet.some(s=>s.id===t.id)?T.green:"#484440",fontSize:mySet.some(s=>s.id===t.id)?9:13,width:24,height:24,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.sans,fontWeight:600,WebkitTapHighlightColor:"transparent",transition:"all 0.15s"}}, mySet.some(s=>s.id===t.id)?"✓":"+")))
          )))
      ))
  );
}

// ── DJ SET BUILDER — armado de set solo con tracks emergentes ─────────────
function DjSetBuilder({ djTracks, mySet, addToSet, removeFromSet }) {
  const [djSet, setDjSet] = React.useState([]); // set local de emergentes
  const [seed, setSeed] = React.useState(null);
  const [showSeedPicker, setShowSeedPicker] = React.useState(false);

  // Guardar/cargar set local en localStorage
  const DJ_SET_KEY = "setlab_dj_set_v1";
  React.useEffect(()=>{
    try { const s=JSON.parse(localStorage.getItem(DJ_SET_KEY)||"[]"); if(s.length) setDjSet(s); } catch {}
  },[]);
  function saveDjSet(s){ setDjSet(s); try{localStorage.setItem(DJ_SET_KEY,JSON.stringify(s));}catch{} }

  const addToDjSet = t => { if(!djSet.some(s=>s.id===t.id)) saveDjSet([...djSet,t]); };
  const removeFromDjSet = id => saveDjSet(djSet.filter(t=>t.id!==id));
  const moveUp = i => { if(i===0)return; const a=[...djSet];[a[i-1],a[i]]=[a[i],a[i-1]];saveDjSet(a); };
  const moveDown = i => { if(i===djSet.length-1)return; const a=[...djSet];[a[i],a[i+1]]=[a[i+1],a[i]];saveDjSet(a); };

  // Auto-build: dado un seed (primer track), construir secuencia armónica
  function autoBuild() {
    if(!seed||djTracks.length<2) return;
    const used = new Set([seed.id]);
    const seq = [seed];
    let last = seed;
    for(let i=0;i<Math.min(djTracks.length-1,15);i++){
      const candidates = djTracks
        .filter(t=>!used.has(t.id))
        .map(t=>({t, score:scoreMatch(last,t).total}))
        .filter(x=>x.score>0)
        .sort((a,b)=>b.score-a.score);
      if(!candidates.length) break;
      const next = candidates[0].t;
      seq.push(next); used.add(next.id); last=next;
    }
    saveDjSet(seq);
  }

  // Stats del set
  const avgBpm = djSet.length ? Math.round(djSet.reduce((a,t)=>a+t.bpm,0)/djSet.length) : 0;
  const avgE = djSet.length ? (djSet.reduce((a,t)=>a+t.energy,0)/djSet.length).toFixed(1) : 0;
  const dur = djSet.length*7;
  let harmSum=0;
  for(let i=1;i<djSet.length;i++) harmSum+=camelotScore(djSet[i-1].key,djSet[i].key);
  const harm = djSet.length>1 ? Math.round(harmSum/(djSet.length-1)) : 100;
  const harmColor = harm>=80?T.green:harm>=60?T.yellow:T.orange;

  // Exportar al set global
  function exportToMainSet(){
    djSet.forEach(t=>addToSet(t));
  }

  return (
    React.createElement("div", {"style": {display:"flex",flexDirection:"column",height:"100%"}}, djSet.length>0&&(
        React.createElement("div", {"style": {margin:"8px 12px 0",display:"flex",background:"#060408",border:`1px solid ${DJ_ACCENT}18`,borderRadius:12,overflow:"hidden",flexShrink:0}}, [[djSet.length,"TRACKS"],[`${Math.floor(dur/60)}h${dur%60>0?` ${dur%60}m`:""}`, "DUR"],[avgBpm,"BPM"],[avgE,"NRG"]].map(([v,l],i,arr)=>(
            React.createElement("div", {"key": l, "style": {flex:1,padding:"10px 0",textAlign:"center",borderRight:i<arr.length-1?`1px solid ${DJ_ACCENT}12`:"none"}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:i===0?16:13,color:DJ_ACCENT,letterSpacing:-0.3}}, v), React.createElement("div", {"style": {fontFamily:T.mono,fontSize:6,color:T.textGhost,letterSpacing:1.5,marginTop:2,textTransform:"uppercase"}}, l))
          )))
      ), djSet.length>1&&(
        React.createElement("div", {"style": {margin:"5px 12px 0",background:"#060408",border:`1px solid ${DJ_ACCENT}12`,borderRadius:10,padding:"8px 14px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("div", null, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:7,color:T.textGhost,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}, "cohesión armónica"), React.createElement("div", {"style": {height:2,width:120,background:"#141210",borderRadius:2}}, React.createElement("div", {"style": {height:"100%",width:`${harm}%`,background:harmColor,borderRadius:2,transition:"width 0.5s"}}))), React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:800,fontSize:18,color:harmColor,letterSpacing:-1}}, harm, "%"))
      ), React.createElement("div", {"style": {padding:"8px 12px 4px",display:"flex",gap:6,alignItems:"center",flexShrink:0}}, React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textGhost,flex:1}}, djSet.length, "tracks en el set emergente"), React.createElement("button", {"onClick": ()=>setShowSeedPicker(true), "style": {background:`${DJ_ACCENT}12`,border:`1px solid ${DJ_ACCENT}33`,color:DJ_ACCENT,fontFamily:T.sans,fontWeight:700,fontSize:8,padding:"5px 10px",borderRadius:8,cursor:"pointer",letterSpacing:0.3,WebkitTapHighlightColor:"transparent",whiteSpace:"nowrap"}}, "⚡ Auto-build"), djSet.length>0&&React.createElement("button", {"onClick": exportToMainSet, "style": {background:"#071a07",border:"1px solid #22c55e33",color:T.green,fontFamily:T.sans,fontWeight:700,fontSize:8,padding:"5px 10px",borderRadius:8,cursor:"pointer",letterSpacing:0.3,WebkitTapHighlightColor:"transparent",whiteSpace:"nowrap"}}, "→ Exportar al Set"), djSet.length>0&&React.createElement("button", {"onClick": ()=>saveDjSet([]), "style": {background:"none",border:"none",fontFamily:T.sans,fontWeight:500,color:"#3a1a1a",fontSize:8,cursor:"pointer",padding:0,whiteSpace:"nowrap"}}, "limpiar")), showSeedPicker&&(
        React.createElement("div", {"style": {position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.93)",display:"flex",flexDirection:"column",backdropFilter:"blur(8px)",borderRadius:14}}, React.createElement("div", {"style": {padding:"16px 16px 8px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${DJ_ACCENT}20`}}, React.createElement("span", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:13,color:DJ_ACCENT,flex:1}}, "⚡ Elegí el track semilla"), React.createElement("button", {"onClick": ()=>setShowSeedPicker(false), "style": {background:"none",border:"none",color:T.textDim,fontSize:16,cursor:"pointer",padding:0}}, "✕")), React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"8px 12px 20px"}}, djTracks.length===0&&React.createElement("div", {"style": {textAlign:"center",padding:"40px 0",fontFamily:T.sans,fontSize:11,color:T.textDim}}, "No hay tracks emergentes aún"), djTracks.map(t=>(
              React.createElement("button", {"key": t.id, "onClick": ()=>{setSeed(t);setShowSeedPicker(false);setTimeout(()=>autoBuildWith(t),50);}, "style": {width:"100%",background:"#0a0609",border:`1px solid ${DJ_ACCENT}18`,borderRadius:10,padding:"10px 12px",marginBottom:5,cursor:"pointer",textAlign:"left",WebkitTapHighlightColor:"transparent",transition:"border-color 0.15s"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:12,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, t.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:DJ_ACCENT,marginTop:1}}, t.artist)), React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center",flexShrink:0}}, React.createElement(KeyPill, {"k": t.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textDim}}, t.bpm), React.createElement(EBar, {"energy": t.energy, "showLabel": true}))))
            ))))
      ), djSet.length===0&&!showSeedPicker&&(
        React.createElement("div", {"style": {flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"0 40px",textAlign:"center"}}, React.createElement("div", {"style": {fontSize:32,opacity:0.1}}, "🎛"), React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:12,color:T.textMid}}, "Set emergente vacío"), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9.5,color:T.textDim,lineHeight:2}}, "Usá", React.createElement("span", {"style": {color:DJ_ACCENT,fontWeight:700}}, "⚡ Auto-build"), "para armar una secuencia armónica automática, o agregá tracks desde la pestaña Tracks."), djTracks.length>0&&React.createElement("button", {"onClick": ()=>setShowSeedPicker(true), "style": {background:`${DJ_ACCENT}15`,border:`1px solid ${DJ_ACCENT}44`,color:DJ_ACCENT,fontFamily:T.sans,fontWeight:700,fontSize:11,padding:"10px 22px",borderRadius:10,cursor:"pointer",letterSpacing:0.3,WebkitTapHighlightColor:"transparent"}}, "⚡ Auto-build ahora"), djTracks.length===0&&React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:T.textGhost}}, "Primero agregá tracks en la pestaña Tracks"))
      ), djSet.length>0&&(
        React.createElement("div", {"style": {flex:1,overflowY:"auto",padding:"0 10px 90px",scrollbarWidth:"none"}}, React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:0}}, djSet.map((track,i)=>{
              const prev=djSet[i-1];
              const compat=prev?keyCompat(prev.key,track.key):null;
              return (
                React.createElement("div", {"key": track.id}, compat&&(
                    React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:5,padding:"1px 4px 1px 28px"}}, React.createElement("div", {"style": {width:1,height:12,background:`${compat.color}25`,flexShrink:0}}), React.createElement("span", {"style": {fontFamily:T.sans,fontSize:6,fontWeight:700,color:compat.color,letterSpacing:1}}, compat.label), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6,color:T.textGhost}}, prev.key, "→", track.key), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6,color:Math.abs(track.bpm-prev.bpm)>6?T.orange:T.textGhost}}, "Δ", Math.abs(track.bpm-prev.bpm), "bpm"))
                  ), React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:5,marginBottom:1}}, React.createElement("div", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost,width:18,textAlign:"center",flexShrink:0}}, i+1), React.createElement("div", {"style": {flex:1,minWidth:0,background:"#070509",border:`1px solid ${DJ_ACCENT}18`,borderRadius:10,padding:"9px 12px"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontWeight:700,fontSize:11.5,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}, track.title), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:9,color:DJ_ACCENT,marginTop:1,opacity:0.8}}, track.artist)), React.createElement("div", {"style": {display:"flex",gap:4,alignItems:"center",flexShrink:0}}, React.createElement(KeyPill, {"k": track.key}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:8,color:T.textDim}}, track.bpm), React.createElement(EBar, {"energy": track.energy, "showLabel": true})))), React.createElement("div", {"style": {display:"flex",flexDirection:"column",gap:2,flexShrink:0}}, [["↑",()=>moveUp(i),"#3a3836"],["↓",()=>moveDown(i),"#3a3836"],["✕",()=>removeFromDjSet(track.id),"#501818"]].map(([lbl,fn,col])=>(
                        React.createElement("button", {"key": lbl, "onClick": fn, "style": {background:"#070509",border:`1px solid ${DJ_ACCENT}12`,color:col,width:22,height:22,borderRadius:5,cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent",fontWeight:700,fontFamily:T.sans}}, lbl)
                      )))))
              );
            })))
      ))
  );

  // Helper para auto-build con track específico (evita closure stale)
  function autoBuildWith(seedTrack) {
    if(!seedTrack||djTracks.length<1) return;
    const used = new Set([seedTrack.id]);
    const seq = [seedTrack];
    let last = seedTrack;
    for(let i=0;i<Math.min(djTracks.length-1,20);i++){
      const candidates = djTracks
        .filter(t=>!used.has(t.id))
        .map(t=>({t, score:scoreMatch(last,t).total}))
        .filter(x=>x.score>0)
        .sort((a,b)=>b.score-a.score);
      if(!candidates.length) break;
      const next = candidates[0].t;
      seq.push(next); used.add(next.id); last=next;
    }
    saveDjSet(seq);
  }
}

// ── PANTALLA DJS EMERGENTES — con sub-tabs ────────────────────────────────