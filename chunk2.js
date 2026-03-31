function SpotifyEmbed({ track }) {
  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  // Spotify oEmbed / search embed — abre búsqueda inline
  const src = `https://open.spotify.com/search/${q}`;
  const embedSrc = `https://open.spotify.com/embed/search/${q}`;
  return React.createElement("div", { style: { margin: "0 16px", borderRadius: 14, overflow: "hidden", background: "#0d1117" } },
    React.createElement("iframe", {
      src: embedSrc,
      width: "100%", height: 152,
      frameBorder: "0",
      allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
      loading: "lazy",
      style: { border: "none", borderRadius: 14, display: "block" }
    }),
    React.createElement("a", {
      href: `https://open.spotify.com/search/${q}`,
      target: "_blank", rel: "noopener noreferrer",
      style: { display: "block", textAlign: "center", padding: "8px 0", fontFamily: T.mono, fontSize: 8, color: "#1db954", letterSpacing: 1, textDecoration: "none", opacity: 0.8 }
    }, "Abrir en Spotify ↗")
  );
}

function YouTubeEmbed({ track }) {
  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${q}`;
  const [videoId, setVideoId] = React.useState(null);
  const [status, setStatus]   = React.useState("loading"); // loading | found | failed

  React.useEffect(() => {
    setStatus("loading"); setVideoId(null);
    searchYouTubeVideoIdRelaxed(track).then(vid => {
      if (vid) { setVideoId(vid); setStatus("found"); }
      else setStatus("failed");
    });
  }, [track.id]);

  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`
    : null;

  return React.createElement("div", { style: { margin: "0 16px", borderRadius: 14, overflow: "hidden", background: "#0a0a0a", border: "1px solid #1a1010" } },
    status === "loading" && React.createElement("div", { style: { height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 } },
      React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", border: "2px solid #ff444433", borderTopColor: "#ff4444", animation: "spin 0.8s linear infinite" } }),
      React.createElement("style", null, "@keyframes spin{to{transform:rotate(360deg)}}"),
      React.createElement("span", { style: { fontFamily: T.mono, fontSize: 9, color: "#ff444488", letterSpacing: 1 } }, "buscando en " + YT_INVIDIOUS.length + " servidores…")
    ),
    status === "found" && embedSrc && React.createElement("iframe", {
      src: embedSrc,
      width: "100%", height: 215,
      frameBorder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true,
      style: { border: "none", display: "block" }
    }),
    status === "failed" && React.createElement("div", { style: { height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 } },
      React.createElement("span", { style: { fontSize: 24 } }, "📺"),
      React.createElement("span", { style: { fontFamily: T.mono, fontSize: 9, color: "#ff444488", letterSpacing: 0.5 } }, "No encontrado inline — abrí en YouTube"),
    ),
    React.createElement("a", {
      href: ytSearchUrl, target: "_blank", rel: "noopener noreferrer",
      style: { display: "block", textAlign: "center", padding: "8px 0", fontFamily: T.mono, fontSize: 8, color: "#ff4444", letterSpacing: 1, textDecoration: "none", opacity: 0.75 }
    }, "Abrir en YouTube ↗")
  );
}

// ── MOTOR DE BÚSQUEDA YT — PARALELO TOTAL ───────────────────────────────
// Todas las instancias se llaman en paralelo. Primera que responde gana.
// Acepta: track oficial, feat, collab, rip de set, compilación, cualquier
// video que mencione el título del track.

const YT_INVIDIOUS = [
  "https://invidious.privacyredirect.com",
  "https://invidious.nerdvpn.de",
  "https://invidious.fdn.fr",
  "https://inv.nadeko.net",
  "https://yt.artemislena.eu",
  "https://invidious.lunar.icu",
  "https://invidious.reallyawfu.com",
  "https://invidious.io",
  "https://yewtu.be",
  "https://iv.melmac.space",
];

const YT_PIPED = [
  "https://pipedapi.kavin.rocks",
  "https://piped-api.garudalinux.org",
  "https://pipedapi.tokhmi.xyz",
  "https://pipedapi.mha.fi",
  "https://piped.privacydev.net/api",
  "https://pipedapi.reallyawfu.com",
];

// Extrae videoId de un resultado de Invidious o Piped
function extractVideoId(item) {
  return item?.videoId || item?.url?.replace("/watch?v=", "") || null;
}

// Score relajado — acepta si el título del track aparece en el video
function relaxedTitleMatch(videoTitle, trackTitle) {
  const vt = normStr(videoTitle);
  const tt = normStr(normTitle(trackTitle));
  const words = tt.split(" ").filter(w => w.length > 3);
  if (!words.length) return normStr(videoTitle).includes(normStr(trackTitle));
  // Al menos 70% de las palabras del título deben estar en el título del video
  const matched = words.filter(w => vt.includes(w));
  return matched.length >= Math.ceil(words.length * 0.7);
}

// Busca en una instancia Invidious
async function searchInvidious(base, query) {
  const res = await fetch(
    `${base}/api/v1/search?q=${query}&fields=videoId,title,author&type=video&page=1`,
    { signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error("not ok");
  return await res.json();
}

// Busca en una instancia Piped
async function searchPiped(base, query) {
  const res = await fetch(
    `${base}/search?q=${query}&filter=videos`,
    { signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error("not ok");
  const data = await res.json();
  return (data?.items || []).map(i => ({
    videoId: (i.url || "").replace("/watch?v=", ""),
    title: i.title,
    author: i.uploaderName,
  }));
}

// Selecciona el mejor video de una lista de resultados
function pickBestVideo(results, track) {
  if (!Array.isArray(results) || !results.length) return null;
  // 1. Match estricto artista+título
  const strict = results
    .map(v => ({ v, s: matchScore(v.author || "", v.title || "", track) }))
    .filter(x => x.s >= 30)
    .sort((a, b) => b.s - a.s)[0];
  if (strict) return extractVideoId(strict.v);
  // 2. Match relajado — solo el título
  const relaxed = results.find(v => relaxedTitleMatch(v.title || "", track.title));
  if (relaxed) return extractVideoId(relaxed);
  return null;
}

// Lanza TODAS las instancias en paralelo — primera que responde con resultado gana
async function searchYouTubeVideoIdRelaxed(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  const queries = [
    encodeURIComponent(`${a1} ${t1c}`),
    encodeURIComponent(`${track.artist} ${track.title}`),
    encodeURIComponent(`${t1c} ${a1}`),
    encodeURIComponent(t1c),
  ];

  for (const q of queries) {
    // Lanzar todas las instancias Invidious + Piped en paralelo
    const invidiousProms = YT_INVIDIOUS.map(base =>
      searchInvidious(base, q).then(data => pickBestVideo(data, track)).catch(() => null)
    );
    const pipedProms = YT_PIPED.map(base =>
      searchPiped(base, q).then(data => pickBestVideo(data, track)).catch(() => null)
    );
    const all = [...invidiousProms, ...pipedProms];

    // Esperar hasta 7s — tomar el primer resultado no-null
    const result = await Promise.race([
      // Primero que devuelva un videoId gana
      new Promise(resolve => {
        let done = false;
        let pending = all.length;
        all.forEach(p => p.then(vid => {
          if (vid && !done) { done = true; resolve(vid); }
          else if (--pending === 0 && !done) resolve(null);
        }).catch(() => { if (--pending === 0 && !done) resolve(null); }));
      }),
      new Promise(resolve => setTimeout(() => resolve(null), 7000)),
    ]);

    if (result) return result;
  }
  return null;
}

function BeatportEmbed({ track }) {
  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  // Beatport no tiene embed público — mostramos un panel con PreviewButton + link
  return React.createElement("div", { style: { margin: "0 16px", borderRadius: 14, background: "#050f0a", border: "1px solid #01ff9520", padding: "18px 16px" } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 } },
      React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "#01ff9510", border: "1px solid #01ff9540", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
        React.createElement("span", { style: { fontFamily: T.mono, fontSize: 18, color: "#01ff95", fontWeight: 700 } }, "B")
      ),
      React.createElement("div", null,
        React.createElement("div", { style: { fontFamily: T.sans, fontWeight: 700, fontSize: 13, color: T.text } }, "Beatport"),
        React.createElement("div", { style: { fontFamily: T.sans, fontSize: 9, color: T.textDim, marginTop: 2 } }, "Preview de 2 min · WAV / MP3 descargable")
      )
    ),
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } },
      React.createElement(PreviewButton, { track, accent: "#01ff95" }),
      React.createElement("div", { style: { fontFamily: T.sans, fontSize: 10, color: T.textMid } }, "▶ intentar preescucha automática (Deezer / iTunes / SC)")
    ),
    React.createElement("a", {
      href: `https://www.beatport.com/search?q=${q}`,
      target: "_blank", rel: "noopener noreferrer",
      style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#01ff9510", border: "1px solid #01ff9530", borderRadius: 10, padding: "10px 14px", textDecoration: "none", color: "#01ff95", fontFamily: T.sans, fontWeight: 700, fontSize: 11, letterSpacing: 0.3 }
    }, "Buscar en Beatport ↗")
  );
}

function FindModal({ track, onClose }) {
  const labelLinks = getLabelLinks(track.label);
  const [tab, setTab]         = React.useState("preview");
  const [prevTab, setPrevTab] = React.useState("youtube");

  const q = encodeURIComponent(`${track.artist} ${track.title}`);
  const storeKey = LABEL_STORE[track.label];

  const storeLinks = [
    storeKey && STORE_DEF[storeKey] && { name: STORE_DEF[storeKey].hint, icon: STORE_DEF[storeKey].icon, color: STORE_DEF[storeKey].color, url: STORE_DEF[storeKey].getUrl(q), hint: storeKey==="beatport"?"Compra / descarga WAV":storeKey==="bandcamp"?"Descarga directa al artista":"Info del release / vinilo", primary: true },
    storeKey!=="discogs" && { name:"Discogs", icon:"◎", color:"#aaa", url:`https://www.discogs.com/search/?q=${q}&type=release`, hint:"Info del release / vinilo" },
    { name:"SoundCloud", icon:"☁", color:"#ff5500", url:`https://soundcloud.com/search?q=${q}`, hint:"Escucha gratuita / sets" },
    { name:"YouTube", icon:"▶", color:"#ff4444", url:`https://www.youtube.com/results?search_query=${q}`, hint:"Preescucha visual gratuita" },
    storeKey!=="beatport" && { name:"Beatport", icon:"B", color:"#01ff95", url:`https://www.beatport.com/search?q=${q}`, hint:"Compra / descarga WAV" },
    storeKey!=="bandcamp" && { name:"Bandcamp", icon:"◈", color:"#1da0c3", url:`https://bandcamp.com/search?q=${q}`, hint:"Compra directa al artista" },
  ].filter(Boolean);

  const mainTabs = [["preview","🎧 Preescucha"],["links","🔗 Tiendas"],["label","🏷 Sello"]];
  const prevTabs = [
    { id:"spotify",  label:"Spotify",  color:"#1db954" },
    { id:"youtube",  label:"YouTube",  color:"#ff4444" },
    { id:"beatport", label:"Beatport", color:"#01ff95" },
  ];

  return (
    React.createElement("div", { onClick: onClose, style: {position:"absolute",inset:0,zIndex:100,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)"} },
      React.createElement("div", { onClick: e=>e.stopPropagation(), style: {width:"100%",background:"#080706",border:"1px solid #1c1a18",borderTop:"1px solid #252220",borderRadius:"22px 22px 0 0",paddingBottom:36,maxHeight:"90vh",overflowY:"auto"} },
        React.createElement("style", null, `@keyframes sheetUp{from{transform:translateY(44px);opacity:0}to{transform:translateY(0);opacity:1}}`),

        // ── Handle ──
        React.createElement("div", { style:{display:"flex",justifyContent:"center",padding:"14px 0 10px"} },
          React.createElement("div", { style:{width:32,height:3,borderRadius:2,background:"#201e1b"} })
        ),

        // ── Header ──
        React.createElement("div", { style:{padding:"4px 20px 14px",borderBottom:"1px solid #141210"} },
          React.createElement("div", { style:{fontFamily:T.mono,fontSize:7,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6} }, "preescucha & encontrar"),
          React.createElement("div", { style:{display:"flex",alignItems:"center",gap:10} },
            React.createElement("div", { style:{flex:1,minWidth:0} },
              React.createElement("div", { style:{fontFamily:T.sans,fontSize:17,fontWeight:700,color:T.text,letterSpacing:-0.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"} }, track.title),
              React.createElement("div", { style:{fontFamily:T.sans,fontSize:11,color:T.textMid,marginTop:2} }, track.artist)
            ),
            React.createElement("div", { style:{display:"flex",gap:6,flexShrink:0} },
              React.createElement(KeyPill, { k: track.key }),
              React.createElement("span", { style:{fontFamily:T.mono,fontSize:10,color:T.textDim} }, track.bpm)
            )
          )
        ),

        // ── Main tabs ──
        React.createElement("div", { style:{display:"flex",margin:"10px 16px 0",background:"#0c0a08",border:"1px solid #181614",borderRadius:10,overflow:"hidden"} },
          mainTabs.map(([id,lbl]) =>
            React.createElement("button", { key:id, onClick:()=>setTab(id), style:{flex:1,background:tab===id?`${T.gold}15`:"transparent",border:"none",padding:"8px 0",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:9,color:tab===id?T.gold:T.textDim,letterSpacing:0.3,transition:"all 0.15s",WebkitTapHighlightColor:"transparent"} }, lbl)
          )
        ),

        // ══ TAB: PREESCUCHA ══
        tab === "preview" && React.createElement("div", { style:{marginTop:12} },
          // Sub-tabs
          React.createElement("div", { style:{display:"flex",margin:"0 16px 12px",gap:6} },
            prevTabs.map(pt =>
              React.createElement("button", { key:pt.id, onClick:()=>setPrevTab(pt.id), style:{flex:1,background:prevTab===pt.id?`${pt.color}15`:"#0c0a08",border:`1px solid ${prevTab===pt.id?pt.color+"44":"#181614"}`,borderRadius:8,padding:"7px 0",cursor:"pointer",fontFamily:T.mono,fontWeight:700,fontSize:9,color:prevTab===pt.id?pt.color:T.textGhost,letterSpacing:0.5,transition:"all 0.15s",WebkitTapHighlightColor:"transparent"} }, pt.label)
            )
          ),
          prevTab === "spotify"  && React.createElement(SpotifyEmbed,  { track }),
          prevTab === "youtube"  && React.createElement(YouTubeEmbed,  { track }),
          prevTab === "beatport" && React.createElement(BeatportEmbed, { track }),
          React.createElement("div", { style:{textAlign:"center",marginTop:8,fontFamily:T.mono,fontSize:7.5,color:T.textGhost} }, "Los resultados dependen de lo que esté disponible en cada plataforma")
        ),

        // ══ TAB: TIENDAS / LINKS ══
        tab === "links" && React.createElement("div", { style:{padding:"10px 16px 0"} },
          storeLinks.map(link =>
            React.createElement("a", { key:link.name, href:link.url, target:"_blank", rel:"noopener noreferrer", style:{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",marginBottom:4,background:link.primary?"#0e0c06":"#0c0a09",border:`1px solid ${link.primary?link.color+"33":"#181614"}`,borderRadius:12,textDecoration:"none"} },
              React.createElement("div", { style:{width:34,height:34,borderRadius:10,background:`${link.color}0e`,border:`1px solid ${link.color}${link.primary?"44":"20"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0} },
                React.createElement("span", { style:{fontFamily:T.mono,fontSize:13,color:link.color,fontWeight:700} }, link.icon)
              ),
              React.createElement("div", { style:{flex:1} },
                React.createElement("div", { style:{display:"flex",alignItems:"center",gap:6} },
                  React.createElement("div", { style:{fontFamily:T.sans,fontSize:12,fontWeight:600,color:T.text} }, link.name),
                  link.primary && React.createElement("span", { style:{fontFamily:T.mono,fontSize:6.5,color:link.color,background:`${link.color}15`,border:`1px solid ${link.color}30`,padding:"1px 5px",borderRadius:4,letterSpacing:1} }, "PRINCIPAL")
                ),
                React.createElement("div", { style:{fontFamily:T.sans,fontSize:9,color:T.textMid,marginTop:1} }, link.hint)
              ),
              React.createElement("svg", { width:12,height:12,viewBox:"0 0 24 24",fill:"none",stroke:link.primary?link.color+"66":"#2a2826",strokeWidth:2,strokeLinecap:"round" },
                React.createElement("path", { d:"M7 17L17 7M17 7H7M17 7v10" })
              )
            )
          )
        ),

        // ══ TAB: SELLO ══
        tab === "label" && track.label && React.createElement("div", null,
          React.createElement("div", { style:{margin:"12px 16px 0",background:"#0e0b06",border:"1px solid #2a2210",borderRadius:14,padding:"14px 16px"} },
            React.createElement("div", { style:{display:"flex",alignItems:"center",gap:10,marginBottom:10} },
              React.createElement("div", { style:{width:40,height:40,borderRadius:12,background:"#1a1206",border:`1px solid ${T.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0} },
                React.createElement("svg", { width:20,height:20,viewBox:"0 0 20 20",fill:"none" },
                  React.createElement("circle", { cx:10,cy:10,r:9,stroke:T.gold,strokeWidth:1.5 }),
                  React.createElement("circle", { cx:10,cy:10,r:3.5,stroke:T.gold,strokeWidth:1.2 }),
                  React.createElement("circle", { cx:10,cy:10,r:1.2,fill:T.gold })
                )
              ),
              React.createElement("div", null,
                React.createElement("div", { style:{fontFamily:T.mono,fontSize:7,color:T.goldDim,letterSpacing:2,textTransform:"uppercase",marginBottom:3} }, "sello discográfico"),
                React.createElement("div", { style:{fontFamily:T.sans,fontSize:15,fontWeight:800,color:T.gold,letterSpacing:-0.3} }, track.label)
              )
            ),
            React.createElement("div", { style:{fontFamily:T.sans,fontSize:9,color:T.textDim,lineHeight:1.7} }, "Explorá el catálogo completo del sello para encontrar más tracks underground y descargar en tu tienda preferida.")
          ),
          React.createElement("div", { style:{padding:"10px 16px 0"} },
            React.createElement("div", { style:{fontFamily:T.mono,fontSize:7.5,color:T.textGhost,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8} }, "buscar sello en"),
            labelLinks.map(link =>
              React.createElement("a", { key:link.name, href:link.url, target:"_blank", rel:"noopener noreferrer", style:{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",marginBottom:4,background:"#0c0a09",border:"1px solid #1e1c18",borderRadius:12,textDecoration:"none"} },
                React.createElement("div", { style:{width:34,height:34,borderRadius:10,background:`${link.color}0e`,border:`1px solid ${link.color}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0} },
                  React.createElement("span", { style:{fontFamily:T.mono,fontSize:13,color:link.color,fontWeight:700} }, link.icon)
                ),
                React.createElement("div", { style:{flex:1} },
                  React.createElement("div", { style:{fontFamily:T.sans,fontSize:12,fontWeight:600,color:T.text} }, link.name),
                  React.createElement("div", { style:{fontFamily:T.sans,fontSize:9,color:T.textMid,marginTop:1} }, link.hint)
                ),
                React.createElement("svg", { width:12,height:12,viewBox:"0 0 24 24",fill:"none",stroke:"#2a2826",strokeWidth:2,strokeLinecap:"round" },
                  React.createElement("path", { d:"M7 17L17 7M17 7H7M17 7v10" })
                )
              )
            )
          )
        ),

        React.createElement("div", { style:{textAlign:"center",marginTop:14} },
          React.createElement("span", { style:{fontFamily:T.mono,fontSize:8,color:T.textGhost} }, "tocá afuera para cerrar")
        )
      )
    )
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MOTOR DE PREESCUCHA — Multi-fuente paralelo con matching estricto
// Fuentes: Deezer JSONP → iTunes → Beatport embed → YouTube iframe
// ══════════════════════════════════════════════════════════════════════════════

let _previewAudio = null;
let _previewSetState = null;
let _previewTrackId = null;

// ── Normalización de texto ────────────────────────────────────────────────
function normStr(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ").trim();
}

// Limpia sufijos comunes de remixes/versiones del título
function normTitle(s) {
  return normStr(s)
    .replace(/\b(original mix|original|extended mix|extended|club mix|radio mix|radio edit|remaster(?:ed)?|album version|single version|feat\.?.*$)\b/g, '')
    .replace(/\s+/g, ' ').trim();
}

// Calcula score artista+título — versión potenciada
function matchScore(rArtistRaw, rTitleRaw, track) {
  const rArtist  = normStr(rArtistRaw);
  const rTitle   = normStr(rTitleRaw);
  const tArtist  = normStr(track.artist);
  const tTitle   = normStr(track.title);
  // Versiones sin sufijos de versión
  const rTitleC  = normTitle(rTitleRaw);
  const tTitleC  = normTitle(track.title);

  // ── Check artista ──────────────────────────────────────────────────────
  const artistWords = tArtist.split(' ').filter(w => w.length > 2);
  // Coincidencia de artista (al menos la primera palabra significativa)
  const fw = artistWords[0] || tArtist;
  const artistOk = rArtist === tArtist
    || rArtist.includes(tArtist) || tArtist.includes(rArtist)
    || (fw.length > 2 && rArtist.includes(fw))
    || artistWords.some(w => w.length > 3 && rArtist.includes(w));
  if (!artistOk) return 0;

  // ── Check título — contra versión limpia ──────────────────────────────
  const titleWords = tTitleC.split(' ').filter(w => w.length > 2);
  const titleOk = rTitle === tTitle
    || rTitleC === tTitleC
    || rTitle.includes(tTitle)   || tTitle.includes(rTitle)
    || rTitleC.includes(tTitleC) || tTitleC.includes(rTitleC)
    || (titleWords.length > 0 && titleWords.every(w => rTitle.includes(w)))
    || (titleWords.length > 0 && titleWords.some(w => w.length > 4 && rTitle.includes(w)));
  if (!titleOk) return 0;

  let score = 0;

  // Artista (0-50)
  if (rArtist === tArtist) score += 50;
  else if (rArtist.includes(tArtist) || tArtist.includes(rArtist)) score += 42;
  else {
    const am = artistWords.filter(w => rArtist.includes(w));
    score += artistWords.length > 0 ? Math.round((am.length / artistWords.length) * 35) : 0;
  }

  // Título (0-50)
  if (rTitle === tTitle || rTitleC === tTitleC) score += 50;
  else if (rTitle.includes(tTitle) || tTitle.includes(rTitle)
        || rTitleC.includes(tTitleC) || tTitleC.includes(rTitleC)) score += 40;
  else {
    const tw = tTitleC.split(' ').filter(w => w.length > 2);
    const tm = tw.filter(w => rTitle.includes(w));
    score += tw.length > 0 ? Math.round((tm.length / tw.length) * 32) : 0;
  }

  return score; // umbral recomendado: ≥45 para directas, ≥35 para YT/SC
}

// ── FUENTE 1: Deezer JSONP ────────────────────────────────────────────────
function deezerJsonp(query) {
  return new Promise((resolve, reject) => {
    const cb = '__dz_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const timer = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, 8000);
    function cleanup() { clearTimeout(timer); delete window[cb]; try { document.head.removeChild(script); } catch {} }
    window[cb] = d => { cleanup(); resolve(d); };
    script.onerror = () => { cleanup(); reject(new Error('error')); };
    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=50&output=jsonp&callback=${cb}`;
    document.head.appendChild(script);
  });
}

async function searchDeezerPreview(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  const queries = [
    `artist:"${a1}" track:"${t1c}"`,
    `artist:"${a1}" track:"${track.title}"`,
    `${a1} ${t1c}`,
    `${track.artist} ${track.title}`,
    `${a1}`,
  ];
  for (const q of queries) {
    try {
      const data = await deezerJsonp(q);
      if (!data?.data?.length) continue;
      const best = data.data
        .filter(r => r.preview)
        .map(r => ({ r, s: matchScore(r.artist?.name, r.title, track) }))
        .filter(x => x.s >= 45)
        .sort((a, b) => b.s - a.s)[0];
      if (best) return { url: best.r.preview, source: "Deezer" };
    } catch {}
  }
  return null;
}

// ── FUENTE 2: iTunes ──────────────────────────────────────────────────────
async function searchItunesPreview(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  const queries = [
    `${a1} ${t1c}`,
    `${track.artist} ${track.title}`,
    `${a1} ${track.title}`,
    `${a1}`,
  ];
  for (const q of queries) {
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=50&entity=song`, { signal: AbortSignal.timeout(6000) });
      const data = await res.json();
      const best = (data.results || [])
        .filter(r => r.previewUrl)
        .map(r => ({ r, s: matchScore(r.artistName, r.trackName, track) }))
        .filter(x => x.s >= 45)
        .sort((a, b) => b.s - a.s)[0];
      if (best) return { url: best.r.previewUrl, source: "iTunes" };
    } catch {}
  }
  return null;
}

// ── FUENTE 3: MusicBrainz (solo metadata, sin audio) ─────────────────────
async function searchMusicBrainz(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  const q = `recording:"${t1c}" AND artist:"${a1}"`;
  try {
    const res = await fetch(
      `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(q)}&limit=10&fmt=json`,
      { headers: { 'User-Agent': 'SetLabDJ/1.0 (setlab@example.com)' }, signal: AbortSignal.timeout(6000) }
    );
    const data = await res.json();
    const recs = data?.recordings || [];
    const best = recs
      .map(r => ({ r, s: matchScore(r['artist-credit']?.[0]?.name || '', r.title, track) }))
      .filter(x => x.s >= 45)
      .sort((a, b) => b.s - a.s)[0];
    if (best) return { mbid: best.r.id, title: best.r.title };
  } catch {}
  return null;
}

// ── FUENTE 4: SoundCloud API pública ─────────────────────────────────────
async function searchSoundCloudPreview(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  const queries = [`${a1} ${t1c}`, `${track.artist} ${track.title}`];
  const SC_CLIENT = "iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX";
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(q)}&limit=20&client_id=${SC_CLIENT}`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const best = (data?.collection || [])
        .map(r => ({ r, s: matchScore(r.user?.username || r.user?.full_name || '', r.title, track) }))
        .filter(x => x.s >= 40)
        .sort((a, b) => b.s - a.s)[0];
      if (best?.r?.permalink_url) return { scUrl: best.r.permalink_url, source: "SC" };
    } catch {}
  }
  return null;
}

// ── FUENTE 5: Beatport API ────────────────────────────────────────────────
async function searchBeatportPreview(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  try {
    const res = await fetch(
      `https://www.beatport.com/api/v4/catalog/search?q=${encodeURIComponent(`${a1} ${t1c}`)}&per_page=5&type=tracks`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const tracks = data?.tracks?.data || data?.results || [];
    const best = tracks
      .map(r => ({ r, s: matchScore(r.artists?.[0]?.name || '', r.name || r.title, track) }))
      .filter(x => x.s >= 45)
      .sort((a, b) => b.s - a.s)[0];
    if (best?.r?.id) {
      return { url: `https://geo-samples.beatport.com/track/${best.r.id}.LOFI.mp3`, source: "Beatport" };
    }
  } catch {}
  return null;
}

// ── FUENTE 6: Audius (descentralizado, mucho techno/electrónica) ──────────
async function searchAudiusPreview(track) {
  const a1 = track.artist.split(/[&,+]/)[0].trim();
  const t1c = normTitle(track.title);
  // Audius tiene múltiples endpoints (nodos) — probamos el principal
  const endpoints = [
    'https://discoveryprovider.audius.co',
    'https://discoveryprovider2.audius.co',
    'https://discoveryprovider3.audius.co',
  ];
  for (const base of endpoints) {
    try {
      const res = await fetch(
        `${base}/v1/tracks/search?query=${encodeURIComponent(`${a1} ${t1c}`)}&limit=10&app_name=SetLab`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const results = data?.data || [];
      const best = results
        .filter(r => r.downloadable || r.is_streamable !== false)
        .map(r => ({ r, s: matchScore(r.user?.name || '', r.title, track) }))
        .filter(x => x.s >= 45)
        .sort((a, b) => b.s - a.s)[0];
      if (best?.r?.id) {
        // URL de stream de Audius
        const streamUrl = `${base}/v1/tracks/${best.r.id}/stream?app_name=SetLab`;
        return { url: streamUrl, source: "Audius" };
      }
    } catch {}
  }
  return null;
}

// ── FUENTE 7: Jamendo ─────────────────────────────────────────────────────
async function searchJamendoPreview(track) {
  const CLIENT_ID = "b6747d04";
  const q = encodeURIComponent(`${track.artist.split(/[&,+]/)[0].trim()} ${normTitle(track.title)}`);
  try {
    const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&namesearch=${q}&audioformat=mp32`, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const best = (data?.results || [])
      .filter(r => r.audio)
      .map(r => ({ r, s: matchScore(r.artist_name, r.name, track) }))
      .filter(x => x.s >= 45)
      .sort((a, b) => b.s - a.s)[0];
    if (best) return { url: best.r.audio, source: "Jamendo" };
  } catch {}
  return null;
}

// ── ORQUESTADOR PRINCIPAL ─────────────────────────────────────────────────
// Lanza TODAS las fuentes en paralelo — primera que encuentre audio gana.
// Prioridad implícita por velocidad: Deezer > iTunes > Beatport > Audius > SC > Jamendo
async function findPreviewUrl(track) {
  return new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done) { done = true; resolve(r); } };

    // Fuentes de audio directo MP3 — todas en paralelo
    const mp3Sources = [
      searchDeezerPreview(track),
      searchItunesPreview(track),
      searchBeatportPreview(track),
      searchAudiusPreview(track),
      searchJamendoPreview(track),
    ];

    let mp3Pending = mp3Sources.length;
    mp3Sources.forEach(p => {
      p.then(r => {
        if (r?.url) finish(r);
        else if (--mp3Pending === 0 && !done) launchSC();
      }).catch(() => { if (--mp3Pending === 0 && !done) launchSC(); });
    });

    // SoundCloud como segunda opción (requiere widget iframe)
    function launchSC() {
      searchSoundCloudPreview(track)
        .then(r => { if (r?.scUrl) finish({ scUrl: r.scUrl, source: "SC" }); else if (!done) finish(null); })
        .catch(() => { if (!done) finish(null); });
    }

    setTimeout(() => finish(null), 10000);
  });
}

// ── YouTube iframe fallback ───────────────────────────────────────────────
let _ytIframe = null;
let _ytReady = false;
let _ytPlaying = false;
let _ytTrackId = null;
let _ytSetState = null;
let _ytOnEnd = null;

function getYTIframe() {
  if (_ytIframe) return _ytIframe;
  const iframe = document.createElement("iframe");
  iframe.id = "yt-hidden-player";
  iframe.allow = "autoplay; encrypted-media";
  iframe.style.cssText = "position:fixed;width:1px;height:1px;bottom:0;right:0;opacity:0;pointer-events:none;border:none;";
  iframe.src = "about:blank";
  document.body.appendChild(iframe);
  _ytIframe = iframe;
  return iframe;
}

function loadYTVideo(videoId) {
  return new Promise((resolve, reject) => {
    const iframe = getYTIframe();
    const to = setTimeout(() => reject(new Error("YT timeout")), 12000);
    function onMsg(e) {
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d?.event === "onReady") { clearTimeout(to); window.removeEventListener("message", onMsg); resolve(); }
        if (d?.event === "onStateChange" && d?.info === 0 && _ytOnEnd) { _ytOnEnd(); _ytOnEnd = null; }
        if (d?.event === "onError") { clearTimeout(to); window.removeEventListener("message", onMsg); reject(new Error("YT error")); }
      } catch {}
    }
    window.addEventListener("message", onMsg);
    iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&origin=${encodeURIComponent(location.origin || "https://localhost")}`;
  });
}

function stopYT() {
  if (_ytIframe) { _ytIframe.src = "about:blank"; }
  _ytPlaying = false; _ytTrackId = null;
  if (_ytSetState) { _ytSetState("idle"); _ytSetState = null; }
  _ytOnEnd = null;
}

// Busca videoId via Invidious (instancias públicas con CORS)
function getYouTubeSearchUrl(track) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(track.artist + " " + track.title)}`;
}

// searchYouTubeVideoId → alias to the parallel version
async function searchYouTubeVideoId(track) { return searchYouTubeVideoIdRelaxed(track); }


function isDirectAudioUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (/\.(mp3|ogg|wav|aac|m4a|flac|opus)(\?|$)/i.test(u.pathname)) return true;
    if (u.hostname.includes('dl.dropbox') || u.hostname.includes('storage.googleapis') || u.hostname.includes('amazonaws')) return true;
    return false;
  } catch { return false; }
}

// Detecta si es una URL de página de SoundCloud
function isSoundCloudUrl(url) {
  if (!url) return false;
  try { return new URL(url).hostname.includes('soundcloud.com'); } catch { return false; }
}

// ── SOUNDCLOUD WIDGET PLAYER (iframe) ─────────────────────────────────────
let _scIframe = null;
let _scReady = false;
let _scReadyCallbacks = [];
let _scPlayingUrl = null;
let _scOnEnd = null;
let _scPlayingSetState = null;
let _scPlayingTrackId = null;

function getSCWidgetIframe() {
  if (_scIframe) return _scIframe;
  const iframe = document.createElement("iframe");
  iframe.id = "sc-widget-hidden";
  iframe.allow = "autoplay";
  iframe.style.cssText = "position:fixed;width:1px;height:1px;bottom:0;left:0;opacity:0;pointer-events:none;border:none;";
  iframe.src = "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com&auto_play=false&show_artwork=false&visual=false";
  document.body.appendChild(iframe);
  _scIframe = iframe;
  window.addEventListener("message", (e) => {
    if (!e.origin.includes("soundcloud.com")) return;
    try {
      const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      if (!d?.soundcloudmessage) return;
      if (d.soundcloudmessage === "ready") { _scReady = true; _scReadyCallbacks.forEach(fn => fn()); _scReadyCallbacks = []; }
      if (d.soundcloudmessage === "finish" && _scOnEnd) { _scOnEnd(); _scOnEnd = null; }
    } catch {}
  });
  return iframe;
}

function playSoundCloudTrack(scPageUrl) {
  return new Promise((resolve, reject) => {
    const iframe = getSCWidgetIframe();
    _scReady = false; _scPlayingUrl = scPageUrl;
    const timeout = setTimeout(() => reject(new Error("SC timeout")), 12000);
    _scReadyCallbacks.push(() => { clearTimeout(timeout); resolve(); });
    iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(scPageUrl)}&auto_play=true&show_artwork=false&visual=false&buying=false&sharing=false&download=false&show_comments=false&show_playcount=false&show_user=false`;
  });
}

function stopSoundCloud() {
  if (_scIframe) { try { _scIframe.contentWindow?.postMessage(JSON.stringify({ method: "pause" }), "*"); } catch {} }
  _scPlayingUrl = null; _scOnEnd = null;
}

// ── PREVIEW BUTTON — usa el orquestador multi-fuente ──────────────────────
function PreviewButton({ track, accent }) {
  const [state, setState] = React.useState(() => {
    if (_previewTrackId === track.id && _previewAudio && !_previewAudio.paused) return "playing";
    if (_scPlayingTrackId === track.id && _scPlayingUrl) return "playing";
    if (_ytTrackId === track.id && _ytPlaying) return "playing";
    return "idle";
  });
  const [source, setSource] = React.useState(""); // muestra de qué fuente viene

  React.useEffect(() => {
    if (_previewTrackId === track.id) _previewSetState = setState;
    if (_scPlayingTrackId === track.id) _scPlayingSetState = setState;
    if (_ytTrackId === track.id) _ytSetState = setState;
  });

  function stopAll() {
    // Audio nativo
    if (_previewAudio) { _previewAudio.pause(); _previewAudio = null; }
    if (_previewSetState && _previewSetState !== setState) _previewSetState("idle");
    _previewSetState = null; _previewTrackId = null;
    // SoundCloud
    stopSoundCloud();
    if (_scPlayingSetState && _scPlayingSetState !== setState) _scPlayingSetState("idle");
    _scPlayingSetState = null; _scPlayingTrackId = null;
    // YouTube
    stopYT();
  }

  async function playAudioUrl(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      _previewAudio = audio; _previewSetState = setState; _previewTrackId = track.id;
      audio.addEventListener("canplay", () => audio.play().then(resolve).catch(reject), { once: true });
      audio.addEventListener("error", () => reject(new Error("audio error")), { once: true });
      setTimeout(() => reject(new Error("timeout")), 8000);
      audio.load();
    });
  }

  async function handleClick(e) {
    e.stopPropagation();

    // Parar si ya está sonando
    if (state === "playing" || state === "loading") {
      stopAll(); setState("idle"); setSource(""); return;
    }
    stopAll();
    setState("loading");

    // ── PRIORIDAD 1: URL SoundCloud explícita en el track ───────────────
    if (isSoundCloudUrl(track.soundcloudUrl)) {
      try {
        _scPlayingSetState = setState; _scPlayingTrackId = track.id;
        await playSoundCloudTrack(track.soundcloudUrl);
        setState("playing"); setSource("SC");
        _scOnEnd = () => { setState("idle"); setSource(""); _scPlayingSetState = null; _scPlayingTrackId = null; };
        return;
      } catch { stopAll(); }
    }

    // ── PRIORIDAD 2: URL de audio directo en el track ───────────────────
    if (track.previewUrl && isDirectAudioUrl(track.previewUrl)) {
      try {
        await playAudioUrl(track.previewUrl);
        setState("playing"); setSource("direct");
        _previewAudio.addEventListener("ended", () => { setState("idle"); setSource(""); _previewAudio = null; _previewSetState = null; _previewTrackId = null; });
        return;
      } catch { stopAll(); }
    }

    // ── PRIORIDAD 3: Race multi-fuente (Deezer + iTunes + Beatport + SC + Jamendo) ──
    try {
      const result = await findPreviewUrl(track);
      if (result?.url) {
        await playAudioUrl(result.url);
        setState("playing"); setSource(result.source || "");
        _previewAudio.addEventListener("ended", () => { setState("idle"); setSource(""); _previewAudio = null; _previewSetState = null; _previewTrackId = null; });
        return;
      }
      // SoundCloud widget (resultado con scUrl)
      if (result?.scUrl) {
        try {
          _scPlayingSetState = setState; _scPlayingTrackId = track.id;
          await playSoundCloudTrack(result.scUrl);
          setState("playing"); setSource("SC");
          _scOnEnd = () => { setState("idle"); setSource(""); _scPlayingSetState = null; _scPlayingTrackId = null; };
          return;
        } catch { stopAll(); }
      }
    } catch { stopAll(); }

    // ── PRIORIDAD 4: YouTube iframe (último recurso — visual) ────────────
    try {
      const vid = await searchYouTubeVideoIdRelaxed(track);
      if (vid) {
        _ytSetState = setState; _ytTrackId = track.id; _ytPlaying = true;
        await loadYTVideo(vid);
        setState("playing"); setSource("YT");
        _ytOnEnd = () => { setState("idle"); setSource(""); _ytPlaying = false; _ytTrackId = null; _ytSetState = null; };
        return;
      }
    } catch { stopAll(); }

    // Nada encontró — abrir YouTube directamente como fallback
    setState("nf"); setSource("");
    window.open(getYouTubeSearchUrl(track), "_blank");
    setTimeout(() => setState("idle"), 3000);
  }

  const isSC = isSoundCloudUrl(track.soundcloudUrl);
  const isYT = source === "YT";
  const activeColor = isSC ? "#ff5500" : isYT ? "#ff4444" : accent;

  const map = {
    idle:    { icon:"▶", color: isSC ? "#ff5500" : T.textDim, bg: T.surface, border: T.border, title: "Preescucha" },
    loading: { icon:"…", color:"#f59e0b", bg:"#1a1200", border:"#f59e0b33", title:"Buscando en Deezer / iTunes / SoundCloud / YouTube…" },
    playing: { icon:"■", color: activeColor, bg:`${activeColor}12`, border:`${activeColor}55`, title:`Detener (${source || "audio"})` },
    nf:      { icon:"▶", color: "#ff4444", bg:"#1a0808", border:"#ff444433", title:"Abriendo YouTube…" },
  };
  const s = map[state] || map.idle;

  return (
    React.createElement("div", {"style": { position:"relative", flexShrink:0 }}, React.createElement("button", {"onClick": handleClick, "title": s.title, "style": {
        background: s.bg, border:`1px solid ${s.border}`, color: s.color,
        fontSize: state === "loading" ? 9 : 11, width:26, height:26, borderRadius:7,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.2s", WebkitTapHighlightColor:"transparent",
        fontWeight:700, fontFamily:T.mono, flexShrink:0,
      }}, s.icon), source && state === "playing" && (
        React.createElement("div", {"style": { position:"absolute", bottom:-11, left:"50%", transform:"translateX(-50%)", fontFamily:T.mono, fontSize:6, color:activeColor, letterSpacing:0.5, whiteSpace:"nowrap", opacity:0.85 }}, source)
      ))
  );
}

function TrackCard({ track, onSelect, onAdd, onFind, isSelected, inSet, scoreData, showScore, compact }) {
  const [pressed, setPressed] = useState(false);
  const house = isHouseTrack(track);
  const accent = house ? HOUSE_ACCENT : T.gold;
  const q = encodeURIComponent(`${track.artist} ${track.title}`);

  return (
    React.createElement("div", {"style": {background:isSelected?(house?"#090c12":"#0e0b06"):T.surface,border:`1px solid ${isSelected?(house?"#1e304055":"#3a2e1035"):T.border}`,borderRadius:12,overflow:"hidden",transition:"border-color 0.2s",position:"relative"}}, React.createElement("div", {"style": {position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${accent}44,transparent)`,opacity:isSelected?1:0.25}}), React.createElement("div", {"onPointerDown": ()=>setPressed(true), "onPointerUp": ()=>setPressed(false), "onPointerLeave": ()=>setPressed(false), "onClick": onSelect, "style": {padding:compact?"10px 12px":"12px 14px",cursor:onSelect?"pointer":"default",transform:pressed?"scale(0.983)":"scale(1)",transition:"transform 0.1s ease",WebkitTapHighlightColor:"transparent"}}, React.createElement("div", {"style": {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}, React.createElement("div", {"style": {flex:1,minWidth:0}}, React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:7,minWidth:0}}, React.createElement("div", {"style": {fontFamily:T.sans,fontSize:13,fontWeight:700,color:isSelected?accent:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:-0.3}}, track.title), house&&React.createElement("span", {"style": {fontFamily:T.mono,fontSize:6.5,color:HOUSE_ACCENT,background:"#0a1422",border:`1px solid ${HOUSE_ACCENT}25`,padding:"1px 5px",borderRadius:3,letterSpacing:1,textTransform:"uppercase",flexShrink:0}}, "house")), React.createElement("div", {"style": {fontFamily:T.sans,fontSize:10,fontWeight:400,color:T.textMid,marginTop:2.5}}, track.artist), track.label&&(
              React.createElement("div", {"style": {display:"flex",alignItems:"center",gap:4,marginTop:5}}, React.createElement("svg", {"width": "9", "height": "9", "viewBox": "0 0 20 20", "fill": "none"}, React.createElement("circle", {"cx": "10", "cy": "10", "r": "9", "stroke": house?HOUSE_ACCENT:T.goldDim, "strokeWidth": "1.5"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "3", "stroke": house?HOUSE_ACCENT:T.goldDim, "strokeWidth": "1.2"}), React.createElement("circle", {"cx": "10", "cy": "10", "r": "1", "fill": house?HOUSE_ACCENT:T.goldDim})), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:house?"#2a4a6a":T.goldDim,letterSpacing:0.4,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:140}}, track.label))
            )), React.createElement("div", {"style": {display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}, React.createElement("div", {"style": {display:"flex",gap:5,alignItems:"center"}}, React.createElement(KeyPill, {"k": track.key, "highlight": isSelected}), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:10,color:T.textDim,letterSpacing:0.5}}, track.bpm)), React.createElement(EBar, {"energy": track.energy, "showLabel": true}))), showScore&&scoreData&&React.createElement("div", {"style": {marginTop:9}}, React.createElement(ScoreBreakdown, scoreData)), !compact&&(
          React.createElement("div", {"style": {marginTop:9,display:"flex",justifyContent:"space-between",alignItems:"center"}}, React.createElement("div", {"style": {display:"flex",gap:3,flexWrap:"wrap"}}, track.style.slice(0,2).map(s=>(
                React.createElement("span", {"key": s, "style": {fontFamily:T.sans,fontWeight:600,fontSize:7.5,color:T.isDark?"#c8c4be":"#5a5652",background:T.isDark?"#1e1c18":"#ece8e2",border:`1px solid ${T.isDark?"#2e2c28":"#d4cfc8"}`,padding:"2px 8px",borderRadius:20,letterSpacing:0.5,textTransform:"uppercase"}}, s)
              ))), React.createElement("div", {"style": {display:"flex",gap:6,alignItems:"center"}}, React.createElement(PreviewButton, {"track": track, "accent": accent}), getStoreButtons(track).map(({icon,color,hint,url})=>(
                React.createElement("a", {"key": hint, "href": url, "target": "_blank", "rel": "noopener noreferrer", "onClick": e=>e.stopPropagation(), "title": hint, "style": {background:T.surface,border:`1px solid ${color}44`,color:color,fontSize:10,width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",flexShrink:0,fontFamily:T.mono,fontWeight:700,transition:"border-color 0.15s"}}, icon)
              )), React.createElement("span", {"style": {fontFamily:T.mono,fontSize:7.5,color:T.textGhost}}, "pop", track.pop), onAdd&&(
                React.createElement("button", {"onClick": e=>{e.stopPropagation();onAdd(track);}, "style": {background:inSet?T.isDark?"#071a07":"#e8f5e9":T.surface,border:`1px solid ${inSet?"#22c55e44":T.border}`,color:inSet?T.green:T.textDim,fontSize:inSet?10:14,width:26,height:26,borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",WebkitTapHighlightColor:"transparent",fontWeight:600,fontFamily:T.sans}}, inSet?"✓":"+")
              )))
        )))
  );
}
