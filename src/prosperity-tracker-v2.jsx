import { useState, useEffect } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F3EF",
  border: "#E8E6E0",
  borderStrong: "#C8C4B8",
  text: "#1A1916",
  textMid: "#4A4840",
  textMuted: "#8A8780",
  textFaint: "#B8B5AE",
  accent: "#2D5A3D",      // deep green — prosperity
  accentLight: "#E8F0EB",
  accentMid: "#4A7A5A",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
  areas: {
    Espiritual: { color: "#8B6914", bg: "#FBF5E6", border: "#E8D48A" },
    Financiero: { color: "#1A5C42", bg: "#E8F5EF", border: "#8ECFB0" },
    "Carácter":  { color: "#4A2D8A", bg: "#F0EBFA", border: "#B89EE0" },
    Relacional:  { color: "#8A2D2D", bg: "#FAE8E8", border: "#E0A0A0" },
  },
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const STATIC_VERSES = [
  { ref: "Josué 1:8", text: "Nunca se apartará de tu boca este libro de la ley; antes bien, de día y de noche meditarás en él... entonces harás prosperar tu camino." },
  { ref: "Proverbios 3:9-10", text: "Honra al Señor con tus bienes y con las primicias de todos tus frutos; y serán llenos tus graneros con abundancia." },
  { ref: "Malaquías 3:10", text: "Probadme ahora en esto, dice el Señor de los ejércitos, si no os abriré las ventanas de los cielos y vaciaré sobre vosotros bendición hasta que sobreabunde." },
  { ref: "Deuteronomio 8:18", text: "Acuérdate del Señor tu Dios, porque él te da el poder para hacer las riquezas, a fin de confirmar su pacto." },
  { ref: "3 Juan 1:2", text: "Amado, deseo que seas prosperado en todo así como prospera tu alma, y que tengas buena salud." },
  { ref: "Proverbios 10:4", text: "La mano negligente empobrece, pero la mano de los diligentes enriquece." },
  { ref: "Filipenses 4:19", text: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús." },
  { ref: "Proverbios 13:11", text: "Las riquezas de vanidad disminuyen, pero el que recoge con mano laboriosa las aumenta." },
  { ref: "Génesis 39:3", text: "Y vio su amo que el Señor estaba con él, y que todo lo que él hacía, el Señor lo hacía prosperar en su mano." },
  { ref: "Salmos 1:3", text: "Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo... y todo lo que hace prosperará." },
  { ref: "Proverbios 21:5", text: "Los pensamientos del diligente ciertamente son ventajosos, pero todo el que se apresura, ciertamente llega a la pobreza." },
  { ref: "Lucas 16:10", text: "El que es fiel en lo muy poco, también en lo más es fiel; y el que en lo muy poco es injusto, también en lo más es injusto." },
  { ref: "Isaías 48:17", text: "Yo soy el Señor Dios tuyo, que te enseña provechosamente, que te encamina por el camino que debes seguir." },
  { ref: "Proverbios 22:29", text: "¿Has visto hombre solícito en su trabajo? Delante de los reyes estará; no estará delante de los de baja condición." },
  { ref: "Salmos 112:1-3", text: "Bienaventurado el hombre que teme al Señor... sus descendientes serán poderosos en la tierra... bienes y riquezas hay en su casa." },
  { ref: "Deuteronomio 28:12", text: "Te abrirá el Señor su buen tesoro, el cielo, para enviar la lluvia a tu tierra en su tiempo, y para bendecir toda obra de tus manos." },
  { ref: "Proverbios 11:25", text: "El alma generosa será prosperada; y el que saciare, él también será saciado." },
  { ref: "Romanos 8:32", text: "El que no escatimó ni a su propio Hijo, ¿cómo no nos dará también con él todas las cosas?" },
  { ref: "Proverbios 16:3", text: "Encomienda al Señor tus obras, y tus pensamientos serán afirmados." },
  { ref: "Mateo 6:33", text: "Buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas." },
  { ref: "Salmos 37:4", text: "Deléitate asimismo en el Señor, y él te concederá las peticiones de tu corazón." },
  { ref: "Proverbios 4:7", text: "Sabiduría ante todo; adquiere sabiduría; y sobre todas tus posesiones adquiere inteligencia." },
  { ref: "Isaías 1:19", text: "Si quisiereis y oyereis, comeréis el bien de la tierra." },
  { ref: "Jeremías 29:11", text: "Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz y no de mal, para daros el fin que esperáis." },
  { ref: "Proverbios 24:3-4", text: "Con sabiduría se edifica la casa, y con prudencia se afirma; y con ciencia se llenan las cámaras de todo bien preciado y agradable." },
  { ref: "Eclesiastés 9:10", text: "Todo lo que te viniere a la mano para hacer, hazlo según tus fuerzas." },
  { ref: "Proverbios 27:23", text: "Sé diligente en conocer el estado de tus ovejas, y mira con cuidado por tus rebaños." },
  { ref: "Colosenses 3:23", text: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres." },
  { ref: "Proverbios 6:6-8", text: "Ve a la hormiga, oh perezoso, mira sus caminos y sé sabio; la cual en el verano hace su provisión." },
  { ref: "2 Crónicas 26:5", text: "Y en estos días en que buscó al Señor, él le prosperó." },
  { ref: "Romanos 13:8", text: "No debáis a nadie nada, sino el amaros unos a otros." },
];

const PRINCIPLES = [
  {
    area: "Espiritual", icon: "✦",
    items: [
      { id: "diezmo",        name: "Diezmo",        promise: "Malaquías 3:10",    practice: "¿Honré a Dios con mis finanzas hoy?" },
      { id: "oracion",       name: "Oración",        promise: "Filipenses 4:6-7",  practice: "¿Oré y presenté mis metas a Dios hoy?" },
      { id: "palabra",       name: "Palabra",        promise: "Josué 1:8",         practice: "¿Leí y medité en la Palabra hoy?" },
    ]
  },
  {
    area: "Financiero", icon: "◈",
    items: [
      { id: "administracion", name: "Administración", promise: "Lucas 16:10",       practice: "¿Administré bien cada recurso hoy?" },
      { id: "ahorro",         name: "Ahorro",         promise: "Proverbios 21:20",  practice: "¿Aparté algo para ahorro o inversión hoy?" },
      { id: "deudas",         name: "Deudas",         promise: "Romanos 13:8",      practice: "¿Trabajé en reducir mis deudas hoy?" },
    ]
  },
  {
    area: "Carácter", icon: "◆",
    items: [
      { id: "diligencia",  name: "Diligencia",  promise: "Proverbios 10:4", practice: "¿Trabajé con excelencia y sin pereza hoy?" },
      { id: "honestidad",  name: "Honestidad",  promise: "Proverbios 11:1", practice: "¿Fui completamente honesto en todo hoy?" },
      { id: "disciplina",  name: "Disciplina",  promise: "3 Juan 1:2",      practice: "¿Me discipliné en hábitos que prosperan mi alma?" },
    ]
  },
  {
    area: "Relacional", icon: "◉",
    items: [
      { id: "comunidad", name: "Comunidad",     promise: "Proverbios 27:17", practice: "¿Me conecté con personas que me edifican hoy?" },
      { id: "mentores",  name: "Consejo Sabio", promise: "Proverbios 15:22", practice: "¿Busqué o apliqué consejo de alguien más sabio?" },
      { id: "red",       name: "Red",           promise: "Eclesiastés 4:9",  practice: "¿Invertí en relaciones estratégicas hoy?" },
    ]
  }
];

const LEVELS = [
  { id: 1, name: "Salida",        color: T.areas.Financiero.color, objective: "Estabilidad financiera",  description: "Deudas activas, ingresos irregulares, comenzando la disciplina" },
  { id: 2, name: "Crecimiento",   color: T.areas.Espiritual.color, objective: "Abundancia sostenible",   description: "Deudas reducidas, ahorro activo, ingresos crecientes" },
  { id: 3, name: "Consolidación", color: T.areas["Carácter"].color, objective: "Riqueza generacional",   description: "Abundancia estable, negocios establecidos, construyendo herencia" },
  { id: 4, name: "Mayordomía",    color: T.areas.Relacional.color,  objective: "Impacto del Reino",      description: "Próspero con responsabilidad social bíblica activa" },
];

const ONBOARDING_Q = [
  { id: "deudas",      q: "¿Cuál es tu situación actual de deudas?",      opts: ["Tengo deudas significativas", "Estoy reduciendo deudas", "Sin deudas o mínimas"],    scores: [0, 1, 2] },
  { id: "ahorro",      q: "¿Ahorras regularmente?",                        opts: ["No tengo ahorro",             "Ahorro ocasional",        "Ahorro activo y constante"], scores: [0, 1, 2] },
  { id: "ingresos",    q: "¿Cómo son tus ingresos actualmente?",           opts: ["Irregulares o insuficientes", "Estables",                "Estables y crecientes"],     scores: [0, 1, 2] },
  { id: "diezmo_ob",   q: "¿Diezmas actualmente?",                         opts: ["No diezmo",                   "Ocasionalmente",          "Sí, consistentemente"],      scores: [0, 1, 2] },
  { id: "comunidad_ob",q: "¿Tienes comunidad de fe activa?",               opts: ["No tengo",                    "Ocasional",               "Activa y comprometida"],     scores: [0, 1, 2] },
  { id: "mentores_ob", q: "¿Tienes mentores o personas de accountability?",opts: ["No tengo",                    "Informal",                "Mentoría activa"],           scores: [0, 1, 2] },
  { id: "version",     q: "¿Cuál versión de la Biblia prefieres?",         opts: ["RVR 1960", "NVI", "LBLA", "DHH"], isVersion: true },
];

const VERSION_MAP = { 0: "es-RVR1960", 1: "es-NVI", 2: "es-LBLA", 3: "es-DHH" };

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ALL_IDS = PRINCIPLES.flatMap(p => p.items.map(i => i.id));
const todayKey = () => new Date().toISOString().split("T")[0];
const fmt = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
const fmtShort = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" });
const getLast7 = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split("T")[0]; });
const getDayVerse = () => { const diff = Math.floor((new Date() - new Date("2024-01-01")) / 86400000); return STATIC_VERSES[diff % STATIC_VERSES.length]; };
const scoreToLevel = (score) => { if (score >= 9) return 3; if (score >= 5) return 2; return 1; };
const lsGet = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const lsSet = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const areaTokens = (a) => T.areas[a] || T.areas.Espiritual;

// ── API CALLS ─────────────────────────────────────────────────────────────────
const fetchDailyVerse = async (bibleVersion) => {
  const refs = ["Joshua/1/8", "Malachi/3/10", "Proverbs/3/9", "Proverbs/10/4", "Luke/16/10"];
  const diff = Math.floor((new Date() - new Date("2024-01-01")) / 86400000);
  try {
    const res = await fetch(`/api/bible?ref=${refs[diff % refs.length]}&version=${bibleVersion || "es-RVR1960"}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch { return getDayVerse(); }
};

const generateChecklist = async (goal, area, userLevel) => {
  const principlesList = PRINCIPLES.find(p => p.area === area)?.items.map(i => `${i.name} (${i.promise})`).join(", ");
  const level = LEVELS.find(l => l.id === userLevel);
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, area, levelId: level?.id, levelName: level?.name, levelObjective: level?.objective, principles: principlesList }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.questions;
  } catch {
    return [
      "¿Dediqué tiempo concreto a esta meta hoy?",
      "¿Tomé al menos una acción medible hacia esta meta?",
      "¿Oré específicamente por esta meta hoy?",
      "¿Apliqué disciplina financiera relacionada con esta meta?",
      "¿Evité decisiones que alejan esta meta?",
      "¿Busqué consejo o aprendí algo nuevo sobre esta meta?",
      "¿Fui honesto en mis decisiones relacionadas con esta meta?",
      "¿Invertí en relaciones que apoyan esta meta?",
    ];
  }
};

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const css = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 22px", marginBottom: 12 },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6, display: "block" },
  input: { width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", color: T.text, fontSize: 14, fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  btnPrimary: { width: "100%", padding: "13px", background: T.accent, border: "none", borderRadius: 8, color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", transition: "opacity 0.2s" },
  btnOutline: { padding: "9px 16px", background: "transparent", border: `1.5px solid ${T.borderStrong}`, borderRadius: 8, color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all 0.2s" },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [onboarded, setOnboarded]     = useState(false);
  const [obStep, setObStep]           = useState(0);
  const [obAnswers, setObAnswers]     = useState({});
  const [tab, setTab]                 = useState("checkin");
  const [checkins, setCheckins]       = useState({});
  const [goals, setGoals]             = useState([]);
  const [userLevel, setUserLevel]     = useState(1);
  const [bibleVersion, setBibleVersion] = useState("es-RVR1960");
  const [expanded, setExpanded]       = useState(null);
  const [streak, setStreak]           = useState(0);
  const [loaded, setLoaded]           = useState(false);
  const [verseOpen, setVerseOpen]     = useState(true);
  const [verse, setVerse]             = useState(getDayVerse());
  const [showForm, setShowForm]       = useState(false);
  const [newGoal, setNewGoal]         = useState({ title: "", area: "Espiritual" });
  const [aiQuestions, setAiQuestions] = useState([]);
  const [selectedQ, setSelectedQ]     = useState([]);
  const [aiLoading, setAiLoading]     = useState(false);
  const [goalStep, setGoalStep]       = useState("form");

  useEffect(() => {
    setCheckins(lsGet("checkins", {}));
    setGoals(lsGet("goals", []));
    setOnboarded(lsGet("onboarded", false));
    setUserLevel(lsGet("userLevel", 1));
    const v = localStorage.getItem("bibleVersion");
    if (v) setBibleVersion(v);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    lsSet("checkins", checkins);
    let s = 0, d = new Date();
    while (true) {
      const k = d.toISOString().split("T")[0];
      const day = checkins[k];
      if (!day || ALL_IDS.filter(id => day[id] !== undefined).length < ALL_IDS.length * 0.5) break;
      s++; d.setDate(d.getDate() - 1);
    }
    setStreak(s);
  }, [checkins, loaded]);

  useEffect(() => { if (loaded) lsSet("goals", goals); }, [goals, loaded]);

  useEffect(() => {
    if (loaded && bibleVersion) fetchDailyVerse(bibleVersion).then(v => { if (v) setVerse(v); });
  }, [loaded, bibleVersion]);

  const td          = checkins[todayKey()] || {};
  const doneToday   = ALL_IDS.filter(id => td[id]?.done === true).length;
  const pctToday    = Math.round((doneToday / ALL_IDS.length) * 100);
  const totalDays   = Object.keys(checkins).length;
  const totalDone   = Object.values(checkins).reduce((a, d) => a + ALL_IDS.filter(id => d[id]?.done === true).length, 0);
  const avgPct      = totalDays > 0 ? Math.round((totalDone / (totalDays * ALL_IDS.length)) * 100) : 0;
  const last7       = getLast7();
  const weekData    = last7.map(date => { const day = checkins[date] || {}; return { date, pct: Math.round((ALL_IDS.filter(id => day[id]?.done === true).length / ALL_IDS.length) * 100) }; });
  const areaStats   = PRINCIPLES.map(area => {
    const ids = area.items.map(i => i.id); let tot = 0, sum = 0;
    last7.forEach(date => { const day = checkins[date] || {}; ids.forEach(id => { if (day[id]?.done !== undefined) { tot++; if (day[id]?.done) sum++; } }); });
    return { ...area, pct: tot > 0 ? Math.round((sum / tot) * 100) : 0 };
  });
  const certReady    = streak >= 21 && avgPct >= 70 && userLevel < 4;
  const currentLevel = LEVELS.find(l => l.id === userLevel) || LEVELS[0];
  const nextLevel    = LEVELS.find(l => l.id === userLevel + 1);

  const setCheck = (id, val) => setCheckins(p => ({ ...p, [todayKey()]: { ...p[todayKey()], [id]: { ...p[todayKey()]?.[id], done: val } } }));
  const setRef   = (id, text) => setCheckins(p => ({ ...p, [todayKey()]: { ...p[todayKey()], [id]: { ...p[todayKey()]?.[id], reflection: text } } }));
  const toggleDone  = (gid) => setGoals(p => p.map(g => g.id === gid ? { ...g, done: !g.done } : g));
  const toggleGoalQ = (gid, qi) => setGoals(p => p.map(g => g.id !== gid ? g : { ...g, questionChecks: { ...(g.questionChecks || {}), [todayKey()]: { ...(g.questionChecks?.[todayKey()] || {}), [qi]: !(g.questionChecks?.[todayKey()]?.[qi]) } } }));

  const finishOnboarding = (answers) => {
    const score = ONBOARDING_Q.filter(q => !q.isVersion).reduce((sum, q) => sum + (q.scores[answers[q.id]] || 0), 0);
    const level = scoreToLevel(score);
    const ver   = VERSION_MAP[answers["version"]] || "es-RVR1960";
    setUserLevel(level); setBibleVersion(ver); setOnboarded(true);
    lsSet("onboarded", true); lsSet("userLevel", level); localStorage.setItem("bibleVersion", ver);
  };

  // ── ONBOARDING ───────────────────────────────────────────────────────────────
  if (!onboarded && loaded) {
    const q      = ONBOARDING_Q[obStep];
    const isLast = obStep === ONBOARDING_Q.length - 1;
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "Georgia, 'Times New Roman', serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 440, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>Prospera en Todo</div>
            <h1 style={{ fontSize: 26, fontWeight: "normal", color: T.text, margin: 0, lineHeight: 1.3 }}>Configura tu perfil</h1>
            <p style={{ fontSize: 13, color: T.textMuted, marginTop: 6, fontStyle: "italic" }}>Esto nos ayuda a personalizarte desde el día uno</p>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 36 }}>
            {ONBOARDING_Q.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= obStep ? T.accent : T.border, transition: "background 0.3s" }} />
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 10 }}>{obStep + 1} de {ONBOARDING_Q.length}</div>
          <div style={{ fontSize: 20, color: T.text, marginBottom: 24, lineHeight: 1.5, fontWeight: "normal" }}>{q.q}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => {
              const sel = obAnswers[q.id] === i;
              return (
                <button key={i} onClick={() => {
                  const next = { ...obAnswers, [q.id]: i };
                  setObAnswers(next);
                  if (isLast) setTimeout(() => finishOnboarding(next), 200);
                  else setTimeout(() => setObStep(s => s + 1), 200);
                }} style={{ padding: "14px 18px", background: sel ? T.accentLight : T.surface, border: `1.5px solid ${sel ? T.accent : T.border}`, borderRadius: 10, color: sel ? T.accent : T.textMid, fontSize: 14, cursor: "pointer", textAlign: "left", transition: "all 0.18s", fontFamily: "Georgia, serif", fontWeight: sel ? 600 : "normal" }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {obStep > 0 && (
            <button onClick={() => setObStep(s => s - 1)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 12, marginTop: 22, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>← Anterior</button>
          )}
        </div>
      </div>
    );
  }

  // ── AI GOAL FLOW ─────────────────────────────────────────────────────────────
  const handleGenerateAI = async () => {
    if (!newGoal.title.trim()) return;
    setAiLoading(true); setGoalStep("select");
    const questions = await generateChecklist(newGoal.title, newGoal.area, userLevel);
    setAiQuestions(questions);
    setSelectedQ(questions.map((_, i) => i));
    setAiLoading(false);
  };

  const saveGoal = () => {
    if (!newGoal.title.trim() || selectedQ.length === 0) return;
    setGoals(p => [...p, { id: Date.now().toString(), title: newGoal.title, area: newGoal.area, questions: selectedQ.map(i => aiQuestions[i]), questionChecks: {}, createdAt: todayKey(), done: false }]);
    setNewGoal({ title: "", area: "Espiritual" });
    setAiQuestions([]); setSelectedQ([]); setGoalStep("form"); setShowForm(false);
  };

  // ── MAIN ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Georgia, 'Times New Roman', serif", paddingBottom: 100 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 18px" }}>

        {/* HEADER */}
        <div style={{ padding: "32px 0 20px", borderBottom: `1px solid ${T.border}`, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.accent, textTransform: "uppercase", marginBottom: 4 }}>Prospera en Todo</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: "normal", color: T.text, lineHeight: 1.2 }}>Agenda de Prosperidad</h1>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4, fontStyle: "italic" }}>{fmt(todayKey())}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: T.accentLight, border: `1px solid ${T.accent}30`, borderRadius: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: currentLevel.color }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: currentLevel.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>N{userLevel} · {currentLevel.name}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 0, marginTop: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
            {[{ v: streak, l: "Racha" }, { v: `${pctToday}%`, l: "Hoy" }, { v: `${avgPct}%`, l: "Promedio" }, { v: totalDays, l: "Días" }].map(({ v, l }, i, arr) => (
              <div key={l} style={{ flex: 1, padding: "14px 0", textAlign: "center", borderRight: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>{v}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 14, height: 5, background: T.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctToday}%`, background: T.accent, borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: T.textFaint }}>Hoy: {doneToday} de {ALL_IDS.length} principios</span>
            <span style={{ fontSize: 10, color: T.textFaint }}>{pctToday}%</span>
          </div>
        </div>

        {/* CERT BANNER */}
        {certReady && (
          <div style={{ background: T.accentLight, border: `1.5px solid ${T.accent}`, borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>La IA detectó preparación</div>
              <div style={{ fontSize: 12, color: T.accentMid }}>{streak} días de racha · {avgPct}% promedio — ¿Listo para Nivel {userLevel + 1}?</div>
            </div>
            <button onClick={() => alert(`Certificación Nivel ${userLevel + 1} — ${nextLevel?.name}.\nDisponible en la próxima actualización.`)} style={{ ...css.btnOutline, whiteSpace: "nowrap", borderColor: T.accent, color: T.accent, fontSize: 12 }}>
              Certificarme →
            </button>
          </div>
        )}

        {/* VERSE */}
        {verseOpen ? (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `4px solid ${T.accent}`, borderRadius: "0 10px 10px 0", padding: "16px 20px", marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: T.accent, textTransform: "uppercase" }}>Versículo del Día</span>
              <button onClick={() => setVerseOpen(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <div style={{ fontSize: 14, color: T.text, fontStyle: "italic", lineHeight: 1.8, marginBottom: 8 }}>"{verse.text}"</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted }}>— {verse.ref}</div>
          </div>
        ) : (
          <button onClick={() => setVerseOpen(true)} style={{ ...css.btnOutline, width: "100%", marginBottom: 18, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Ver versículo del día
          </button>
        )}

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: `2px solid ${T.border}`, marginBottom: 26 }}>
          {[{ k: "checkin", l: "Check-in" }, { k: "progreso", l: "Progreso" }, { k: "metas", l: "Metas" }, { k: "historial", l: "Historial" }].map(({ k, l }) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "11px 0", background: "none", border: "none", borderBottom: tab === k ? `2px solid ${T.accent}` : "2px solid transparent", color: tab === k ? T.accent : T.textMuted, fontSize: 11, fontWeight: tab === k ? 700 : 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", marginBottom: -2, transition: "all 0.2s" }}>{l}</button>
          ))}
        </div>

        {/* ── CHECK-IN ── */}
        {tab === "checkin" && PRINCIPLES.map(area => {
          const at = areaTokens(area.area);
          return (
            <div key={area.area} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: at.bg, border: `1px solid ${at.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: at.color }}>{area.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: at.color, textTransform: "uppercase" }}>{area.area}</span>
              </div>
              {area.items.map(item => {
                const e = td[item.id] || {};
                const isExp = expanded === item.id;
                const done = e.done === true;
                const no   = e.done === false;
                return (
                  <div key={item.id} style={{ background: T.surface, border: `1.5px solid ${done ? at.border : T.border}`, borderRadius: 10, marginBottom: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: at.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: T.textMid, marginBottom: 12, lineHeight: 1.6 }}>{item.practice}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { setCheck(item.id, true); setExpanded(item.id); }} style={{ flex: 1, padding: "8px", border: `1.5px solid ${done ? at.color : T.border}`, background: done ? at.bg : "transparent", color: done ? at.color : T.textMuted, borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: done ? 700 : 400, transition: "all 0.18s" }}>✓ Sí</button>
                        <button onClick={() => { setCheck(item.id, false); setExpanded(item.id); }} style={{ flex: 1, padding: "8px", border: `1.5px solid ${no ? T.danger : T.border}`, background: no ? T.dangerLight : "transparent", color: no ? T.danger : T.textMuted, borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: no ? 700 : 400, transition: "all 0.18s" }}>✗ No</button>
                        <button onClick={() => setExpanded(isExp ? null : item.id)} style={{ padding: "8px 14px", border: `1.5px solid ${isExp ? T.borderStrong : T.border}`, background: isExp ? T.surfaceAlt : "transparent", color: T.textMuted, borderRadius: 7, cursor: "pointer", fontSize: 13 }}>✎</button>
                      </div>
                    </div>
                    {isExp && (
                      <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 16px", background: T.bg }}>
                        <label style={css.label}>Reflexión del día</label>
                        <textarea value={e.reflection || ""} onChange={ev => setRef(item.id, ev.target.value)} placeholder="¿Qué aprendiste hoy? ¿Qué mejorarás mañana?" style={{ ...css.input, resize: "vertical", minHeight: 72, lineHeight: 1.7 }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── PROGRESO ── */}
        {tab === "progreso" && (
          <div>
            {/* 7-day chart */}
            <div style={css.card}>
              <label style={css.label}>Últimos 7 días</label>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 100 }}>
                {weekData.map(({ date, pct: p }) => {
                  const isT = date === todayKey();
                  return (
                    <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 600 }}>{p > 0 ? `${p}%` : ""}</div>
                      <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                        <div style={{ width: "100%", height: `${Math.max(p, p > 0 ? 6 : 0)}%`, minHeight: p > 0 ? 5 : 0, background: p >= 80 ? T.accent : p >= 50 ? T.accentMid : p > 0 ? T.border : T.surfaceAlt, borderRadius: "4px 4px 0 0", transition: "height 0.4s", outline: isT ? `2px solid ${T.accent}` : "none", outlineOffset: 2 }} />
                      </div>
                      <div style={{ fontSize: 8, color: isT ? T.accent : T.textFaint, textAlign: "center", lineHeight: 1.4, fontWeight: isT ? 700 : 400 }}>
                        {fmtShort(date).split(" ")[0]}<br />{fmtShort(date).split(" ")[1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Area stats */}
            <div style={css.card}>
              <label style={css.label}>Por área — 7 días</label>
              {areaStats.map(({ area, pct: p }) => {
                const at = areaTokens(area);
                return (
                  <div key={area} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: T.textMid }}>{area}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: at.color }}>{p}%</span>
                    </div>
                    <div style={{ height: 6, background: T.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p}%`, background: at.color, borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global stats */}
            <div style={css.card}>
              <label style={css.label}>Estadísticas Globales</label>
              {[["Días registrados", totalDays], ["Principios cumplidos en total", totalDone], ["Promedio diario", `${avgPct}%`], ["Racha actual", `${streak} días`], ["Metas activas", goals.filter(g => !g.done).length], ["Metas logradas", goals.filter(g => g.done).length]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 13, color: T.textMid }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Level card */}
            <div style={{ ...css.card, borderLeft: `4px solid ${currentLevel.color}`, borderRadius: "0 12px 12px 0" }}>
              <label style={{ ...css.label, color: currentLevel.color }}>Tu Nivel Actual</label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: currentLevel.color }}>Nivel {userLevel}</div>
                <div style={{ fontSize: 16, color: T.text }}>{currentLevel.name}</div>
              </div>
              <div style={{ fontSize: 13, color: T.textMid, fontStyle: "italic", marginBottom: 3 }}>{currentLevel.objective}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: nextLevel ? 14 : 0 }}>{currentLevel.description}</div>
              {nextLevel && (
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Próximo — Nivel {nextLevel.id}: {nextLevel.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{nextLevel.objective}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── METAS ── */}
        {tab === "metas" && (
          <div>
            <button onClick={() => { setShowForm(!showForm); setGoalStep("form"); setAiQuestions([]); setSelectedQ([]); }} style={{ ...css.btnPrimary, marginBottom: 20, opacity: showForm ? 0.7 : 1 }}>
              {showForm ? "✕ Cancelar" : "+ Nueva Meta"}
            </button>

            {showForm && (
              <div style={css.card}>
                {goalStep === "form" && (
                  <>
                    <label style={css.label}>Definir Meta</label>
                    <input value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="¿Cuál es tu meta?" style={{ ...css.input, marginBottom: 10 }} />
                    <select value={newGoal.area} onChange={e => setNewGoal(p => ({ ...p, area: e.target.value }))} style={{ ...css.input, marginBottom: 16, cursor: "pointer" }}>
                      {PRINCIPLES.map(p => <option key={p.area} value={p.area}>{p.area}</option>)}
                    </select>
                    <button onClick={handleGenerateAI} disabled={!newGoal.title.trim()} style={{ ...css.btnPrimary, opacity: newGoal.title.trim() ? 1 : 0.4, cursor: newGoal.title.trim() ? "pointer" : "not-allowed" }}>
                      Generar preguntas con IA
                    </button>
                  </>
                )}
                {goalStep === "select" && (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{newGoal.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>
                      {aiLoading ? "Generando preguntas..." : `Selecciona las que quieres en tu check-in (${selectedQ.length} seleccionadas)`}
                    </div>
                    {aiLoading ? (
                      <div style={{ textAlign: "center", padding: "32px 0", color: T.textMuted }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>◈</div>
                        <div style={{ fontSize: 13 }}>Consultando con IA...</div>
                      </div>
                    ) : (
                      <>
                        {aiQuestions.map((q, i) => {
                          const sel = selectedQ.includes(i);
                          return (
                            <div key={i} onClick={() => setSelectedQ(prev => sel ? prev.filter(x => x !== i) : [...prev, i])} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                              <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${sel ? T.accent : T.borderStrong}`, background: sel ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                                {sel && <span style={{ fontSize: 10, color: "#FFF" }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 13, color: sel ? T.text : T.textMid, lineHeight: 1.55 }}>{q}</span>
                            </div>
                          );
                        })}
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                          <button onClick={() => setGoalStep("form")} style={{ ...css.btnOutline, flex: 1 }}>← Editar</button>
                          <button onClick={saveGoal} disabled={selectedQ.length === 0} style={{ ...css.btnPrimary, flex: 2, opacity: selectedQ.length > 0 ? 1 : 0.4, cursor: selectedQ.length > 0 ? "pointer" : "not-allowed" }}>
                            Guardar {selectedQ.length} preguntas
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {goals.length === 0 && !showForm && (
              <div style={{ textAlign: "center", padding: "48px 0", color: T.textFaint }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>◈</div>
                <div style={{ fontSize: 13 }}>Aún no tienes metas definidas</div>
              </div>
            )}

            {goals.map(goal => {
              const at = areaTokens(goal.area);
              const todayChecks  = goal.questionChecks?.[todayKey()] || {};
              const checkedCount = Object.values(todayChecks).filter(Boolean).length;
              const total        = goal.questions?.length || 0;
              const pct          = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
              return (
                <div key={goal.id} style={{ ...css.card, opacity: goal.done ? 0.5 : 1, borderLeft: `4px solid ${at.color}`, borderRadius: "0 12px 12px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: at.bg, color: at.color, border: `1px solid ${at.border}` }}>{goal.area}</span>
                        <span style={{ fontSize: 10, color: T.textFaint }}>{fmt(goal.createdAt)}</span>
                      </div>
                      <div style={{ fontSize: 15, color: goal.done ? T.textMuted : T.text, textDecoration: goal.done ? "line-through" : "none", marginBottom: 10, lineHeight: 1.4 }}>{goal.title}</div>
                    </div>
                    <button onClick={() => toggleDone(goal.id)} style={{ ...css.btnOutline, fontSize: 11, padding: "6px 12px", whiteSpace: "nowrap", borderColor: goal.done ? at.color : T.border, color: goal.done ? at.color : T.textMuted }}>
                      {goal.done ? "✓ Logrado" : "Completar"}
                    </button>
                  </div>

                  {goal.questions?.length > 0 && !goal.done && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Hoy</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: at.color }}>{checkedCount}/{total}</span>
                      </div>
                      <div style={{ height: 4, background: T.surfaceAlt, borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: at.color, borderRadius: 2, transition: "width 0.4s" }} />
                      </div>
                      {goal.questions.map((q, i) => {
                        const checked = todayChecks[i];
                        return (
                          <div key={i} onClick={() => toggleGoalQ(goal.id, i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", cursor: "pointer" }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${checked ? at.color : T.borderStrong}`, background: checked ? at.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "all 0.18s" }}>
                              {checked && <span style={{ fontSize: 9, color: "#FFF" }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 13, color: checked ? T.textMuted : T.textMid, textDecoration: checked ? "line-through" : "none", lineHeight: 1.5 }}>{q}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── HISTORIAL ── */}
        {tab === "historial" && (
          <div>
            {Object.keys(checkins).sort((a, b) => b.localeCompare(a)).slice(0, 60).map(date => {
              const day  = checkins[date];
              const done = ALL_IDS.filter(id => day[id]?.done === true).length;
              const p    = Math.round((done / ALL_IDS.length) * 100);
              const isT  = date === todayKey();
              return (
                <div key={date} style={{ ...css.card, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: T.text }}>{fmt(date)}</span>
                      {isT && <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, letterSpacing: "0.14em", background: T.accentLight, padding: "2px 7px", borderRadius: 10 }}>HOY</span>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: p >= 80 ? T.accent : p >= 50 ? T.accentMid : T.textFaint }}>{p}%</span>
                  </div>
                  <div style={{ height: 4, background: T.surfaceAlt, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: p >= 80 ? T.accent : p >= 50 ? T.accentMid : T.border, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, color: T.textFaint, marginTop: 5 }}>{done} de {ALL_IDS.length} principios</div>
                </div>
              );
            })}
            {Object.keys(checkins).length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: T.textFaint }}>
                <div style={{ fontSize: 13 }}>Comienza tu check-in para ver el historial aquí</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(250,250,248,0.97) 50%)", padding: "18px 0 12px", textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: 10, color: T.textFaint, fontStyle: "italic", letterSpacing: "0.05em" }}>"Así como prospera tu alma" · 3 Juan 1:2</div>
      </div>
    </div>
  );
}