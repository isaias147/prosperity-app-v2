import { useState, useEffect, useRef } from "react";

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
  accent: "#2D5A3D",
  accentLight: "#E8F0EB",
  accentMid: "#4A7A5A",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
  warning: "#8A5A00",
  warningLight: "#FDF3E0",
  areas: {
    Espiritual: { color: "#8B6914", bg: "#FBF5E6", border: "#E8D48A" },
    Financiero: { color: "#1A5C42", bg: "#E8F5EF", border: "#8ECFB0" },
    "Carácter":  { color: "#4A2D8A", bg: "#F0EBFA", border: "#B89EE0" },
    Relacional:  { color: "#8A2D2D", bg: "#FAE8E8", border: "#E0A0A0" },
  },
};

// ── VERSE BANKS — rotating per principle ─────────────────────────────────────
const VERSE_BANKS = {
  diezmo: [
    { ref: "Malaquías 3:10", text: "Traed todos los diezmos al alfolí... y probadme ahora en esto, si no os abriré las ventanas de los cielos." },
    { ref: "Proverbios 3:9-10", text: "Honra al Señor con tus bienes y con las primicias de todos tus frutos; y serán llenos tus graneros con abundancia." },
    { ref: "Deuteronomio 8:18", text: "Acuérdate del Señor tu Dios, porque él te da el poder para hacer las riquezas." },
    { ref: "Lucas 21:4", text: "Todos echaron de lo que les sobra; pero ésta, de su pobreza echó todo el sustento que tenía." },
    { ref: "2 Corintios 9:7", text: "Cada uno dé como propuso en su corazón, no con tristeza ni por necesidad, porque Dios ama al dador alegre." },
  ],
  oracion: [
    { ref: "Filipenses 4:6", text: "En nada estéis afanosos; sino sean conocidas vuestras peticiones delante de Dios en toda oración." },
    { ref: "1 Tesalonicenses 5:17", text: "Orad sin cesar." },
    { ref: "Mateo 6:6", text: "Entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en secreto; y tu Padre que ve en secreto te recompensará." },
    { ref: "Santiago 5:16", text: "La oración eficaz del justo puede mucho." },
    { ref: "Jeremías 33:3", text: "Clama a mí y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces." },
  ],
  palabra: [
    { ref: "Josué 1:8", text: "Nunca se apartará de tu boca este libro... medita en él de día y de noche... entonces harás prosperar tu camino." },
    { ref: "Salmos 119:105", text: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." },
    { ref: "Romanos 10:17", text: "La fe viene por el oír, y el oír por la palabra de Dios." },
    { ref: "Hebreos 4:12", text: "La palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos." },
    { ref: "2 Timoteo 3:16", text: "Toda la Escritura es inspirada por Dios y útil para enseñar, para redargüir, para corregir, para instruir en justicia." },
  ],
  administracion: [
    { ref: "Lucas 16:10", text: "El que es fiel en lo muy poco, también en lo más es fiel." },
    { ref: "Proverbios 27:23", text: "Sé diligente en conocer el estado de tus ovejas, y mira con cuidado por tus rebaños." },
    { ref: "Proverbios 24:3-4", text: "Con sabiduría se edifica la casa, y con prudencia se afirma." },
    { ref: "Lucas 14:28", text: "¿Quién de vosotros, queriendo edificar una torre, no se sienta primero y calcula los gastos?" },
    { ref: "Eclesiastés 11:2", text: "Reparte a siete, y aun a ocho; porque no sabes el mal que vendrá sobre la tierra." },
  ],
  ahorro: [
    { ref: "Proverbios 21:20", text: "Tesoro precioso y aceite hay en la casa del sabio, pero el hombre necio todo lo disipa." },
    { ref: "Proverbios 6:6-8", text: "Ve a la hormiga... la cual en el verano hace su provisión y recoge en el tiempo de la siega su mantenimiento." },
    { ref: "Génesis 41:35", text: "Recojan todos los alimentos de esos años buenos que vienen, y almacenen el trigo." },
    { ref: "Proverbios 13:11", text: "Las riquezas de vanidad disminuyen, pero el que recoge con mano laboriosa las aumenta." },
    { ref: "Proverbios 21:5", text: "Los pensamientos del diligente ciertamente son ventajosos." },
  ],
  deudas: [
    { ref: "Romanos 13:8", text: "No debáis a nadie nada, sino el amaros unos a otros." },
    { ref: "Proverbios 22:7", text: "El rico domina a los pobres, y el que toma prestado es siervo del que presta." },
    { ref: "Deuteronomio 28:12", text: "Prestarás a muchas naciones, pero tú no pedirás prestado." },
    { ref: "Proverbios 22:26-27", text: "No seas de aquellos que se comprometen, ni de los que salen por fiadores de deudas." },
    { ref: "Salmos 37:21", text: "El impío toma prestado y no devuelve; mas el justo tiene misericordia y da." },
  ],
  diligencia: [
    { ref: "Proverbios 10:4", text: "La mano negligente empobrece, pero la mano de los diligentes enriquece." },
    { ref: "Proverbios 22:29", text: "¿Has visto hombre solícito en su trabajo? Delante de los reyes estará." },
    { ref: "Colosenses 3:23", text: "Todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres." },
    { ref: "Proverbios 12:24", text: "La mano de los diligentes gobernará, pero la negligencia será tributaria." },
    { ref: "Eclesiastés 9:10", text: "Todo lo que te viniere a la mano para hacer, hazlo según tus fuerzas." },
  ],
  honestidad: [
    { ref: "Proverbios 11:1", text: "El peso falso es abominación al Señor, pero la pesa exacta le agrada." },
    { ref: "Proverbios 12:17", text: "El que habla verdad declara justicia; mas el testigo mentiroso, engaño." },
    { ref: "Lucas 16:10", text: "El que es fiel en lo muy poco, también en lo más es fiel." },
    { ref: "Proverbios 19:1", text: "Mejor es el pobre que camina en integridad, que el de perversos labios y fatuo." },
    { ref: "Proverbios 28:6", text: "Mejor es el pobre que camina en su integridad, que el rico de perversos caminos." },
  ],
  disciplina: [
    { ref: "3 Juan 1:2", text: "Amado, deseo que seas prosperado en todo así como prospera tu alma." },
    { ref: "1 Corintios 9:27", text: "Golpeo mi cuerpo y lo pongo en servidumbre, no sea que... yo mismo venga a ser eliminado." },
    { ref: "Hebreos 12:11", text: "Ninguna disciplina al presente parece ser causa de gozo... pero después da fruto apacible de justicia." },
    { ref: "Proverbios 25:16", text: "¿Hallaste miel? Come lo que te basta, no sea que de hastío la vomites." },
    { ref: "Gálatas 5:23", text: "Templanza; contra tales cosas no hay ley." },
  ],
  comunidad: [
    { ref: "Proverbios 27:17", text: "El hierro con hierro se aguza, y el hombre aguza el rostro de su amigo." },
    { ref: "Eclesiastés 4:9-10", text: "Mejores son dos que uno... porque si cayeren, el uno levantará a su compañero." },
    { ref: "Hebreos 10:25", text: "No dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos." },
    { ref: "Proverbios 18:1", text: "El hombre que se aparta busca su propio deseo, se opone a todo consejo." },
    { ref: "Romanos 12:5", text: "Así nosotros, siendo muchos, somos un cuerpo en Cristo." },
  ],
  mentores: [
    { ref: "Proverbios 15:22", text: "Los pensamientos son frustrados donde no hay consejo, pero en la multitud de consejeros se afirman." },
    { ref: "Proverbios 19:20", text: "Escucha el consejo y acepta la corrección, para que seas sabio en tu vejez." },
    { ref: "Proverbios 12:15", text: "El camino del necio es recto en su opinión; mas el que obedece al consejo es sabio." },
    { ref: "Eclesiastés 9:16", text: "La sabiduría es mejor que la fuerza." },
    { ref: "Proverbios 11:14", text: "En la multitud de consejeros está la victoria." },
  ],
  red: [
    { ref: "Eclesiastés 4:9", text: "Mejores son dos que uno; porque tienen mejor paga de su trabajo." },
    { ref: "Proverbios 17:17", text: "En todo tiempo ama el amigo, y es como un hermano en tiempo de angustia." },
    { ref: "Amós 3:3", text: "¿Andarán dos juntos si no estuvieren de acuerdo?" },
    { ref: "Proverbios 13:20", text: "El que anda con sabios, sabio será; mas el que se junta con necios será quebrantado." },
    { ref: "1 Corintios 15:33", text: "Las malas conversaciones corrompen las buenas costumbres." },
  ],
};

const GRACE_MESSAGES = {
  financial: {
    audio: "grace_financial.mp3",
    verse: "Proverbios 24:16",
    verseText: "Porque siete veces cae el justo y vuelve a levantarse.",
    message: "Fallar en lo financiero no te define. Te define lo que haces después de caer.",
  },
  discipline: {
    audio: "grace_discipline.mp3",
    verse: "Lamentaciones 3:22-23",
    verseText: "Las misericordias del Señor nunca terminan... nuevas son cada mañana.",
    message: "La disciplina no se construye en un día. Se construye un día a la vez.",
  },
  streak: {
    audio: "grace_streak.mp3",
    verse: "1 Juan 1:9",
    verseText: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados.",
    message: "La racha se rompió, no el pacto. Hoy es un día nuevo.",
  },
  shame: {
    audio: "grace_shame.mp3",
    verse: "Romanos 8:1",
    verseText: "Ninguna condenación hay para los que están en Cristo Jesús.",
    message: "La vergüenza dice quédate. La gracia dice vuelve. Vuelve.",
  },
};

const TITHE_MESSAGES = {
  noIncome: "Cuando Dios te provea, honrarlo primero abrirá más puertas. Malaquías 3:10",
  consistent: "Estás en pacto con Dios. Las ventanas del cielo están abiertas sobre ti. Malaquías 3:10",
  reminder_fixed: "Recuerda honrar a Dios con tus primicias. El diezmo es tu pacto activo.",
  reminder_independent: "Ha pasado una semana. ¿Has diezmado? Tu negocio prospera cuando Dios es el socio principal.",
  reminder_temporary: "Cada ingreso es una oportunidad de honrar a Dios primero.",
};

const PRINCIPLES = [
  {
    area: "Espiritual", icon: "✦",
    items: [
      { id: "oracion",  name: "Oración",        promise: "Filipenses 4:6",   practice: "¿Oré y presenté mis metas a Dios hoy?" },
      { id: "palabra",  name: "Palabra",         promise: "Josué 1:8",        practice: "¿Leí y medité en la Palabra hoy?" },
    ]
  },
  {
    area: "Financiero", icon: "◈",
    items: [
      { id: "administracion", name: "Administración", promise: "Lucas 16:10",      practice: "¿Administré bien cada recurso hoy?" },
      { id: "ahorro",         name: "Ahorro",          promise: "Proverbios 21:20", practice: "¿Aparté algo para ahorro o inversión hoy?" },
      { id: "deudas",         name: "Deudas",          promise: "Romanos 13:8",     practice: "¿Trabajé en reducir mis deudas hoy?" },
    ]
  },
  {
    area: "Carácter", icon: "◆",
    items: [
      { id: "diligencia", name: "Diligencia", promise: "Proverbios 10:4", practice: "¿Trabajé con excelencia y sin pereza hoy?" },
      { id: "honestidad", name: "Honestidad", promise: "Proverbios 11:1", practice: "¿Fui completamente honesto en todo hoy?" },
      { id: "disciplina", name: "Disciplina", promise: "3 Juan 1:2",      practice: "¿Me discipliné en hábitos que prosperan mi alma?" },
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
  { id: 1, name: "Salida",        color: "#1A5C42", objective: "Estabilidad financiera",  minDays: 60,  minPct: 65, minGoals: 1 },
  { id: 2, name: "Crecimiento",   color: "#8B6914", objective: "Abundancia sostenible",   minDays: 90,  minPct: 70, minGoals: 2 },
  { id: 3, name: "Consolidación", color: "#4A2D8A", objective: "Riqueza generacional",    minDays: 120, minPct: 75, minGoals: 3 },
  { id: 4, name: "Mayordomía",    color: "#8A2D2D", objective: "Impacto del Reino",       minDays: 0,   minPct: 0,  minGoals: 0 },
];

// Onboarding questions
const OB_STEPS = [
  {
    id: "has_income",
    q: "¿Tienes algún tipo de ingreso actualmente?",
    opts: [
      { label: "Sí, tengo ingresos", desc: "" },
      { label: "No tengo ingresos", desc: "" },
    ]
  },
  {
    id: "employment_type",
    q: "¿Cómo describes tu situación laboral?",
    conditional: { key: "has_income", value: 0 },
    opts: [
      { label: "Empleado fijo", desc: "Recibes un salario estable cada mes o quincena" },
      { label: "Empleado temporal", desc: "Trabajas por contratos o proyectos con ingresos variables" },
      { label: "Emprendedor", desc: "Tienes tu propio negocio o trabajas de forma independiente" },
      { label: "Inversionista", desc: "Tus ingresos provienen principalmente de inversiones o activos" },
    ]
  },
  {
    id: "has_debts",
    q: "¿Cuál es tu situación actual de deudas?",
    opts: [
      { label: "Tengo deudas significativas", desc: "" },
      { label: "Estoy reduciendo deudas", desc: "" },
      { label: "Sin deudas o mínimas", desc: "" },
    ]
  },
  {
    id: "has_savings",
    q: "¿Ahorras regularmente?",
    opts: [
      { label: "No tengo ahorro", desc: "" },
      { label: "Ahorro ocasional", desc: "" },
      { label: "Ahorro activo y constante", desc: "" },
    ]
  },
  {
    id: "has_community",
    q: "¿Tienes comunidad de fe activa?",
    opts: [
      { label: "No tengo", desc: "" },
      { label: "Ocasional", desc: "" },
      { label: "Activa y comprometida", desc: "" },
    ]
  },
  {
    id: "has_mentor",
    q: "¿Tienes mentores o personas de accountability?",
    opts: [
      { label: "No tengo", desc: "" },
      { label: "Informal", desc: "" },
      { label: "Mentoría activa", desc: "" },
    ]
  },
  {
    id: "bible_version",
    q: "¿Cuál versión de la Biblia prefieres?",
    opts: [
      { label: "RVR 1960", desc: "Reina Valera Revisada — clásica y tradicional" },
      { label: "NVI", desc: "Nueva Versión Internacional — lenguaje contemporáneo" },
      { label: "LBLA", desc: "La Biblia de las Américas — traducción literal" },
      { label: "DHH", desc: "Dios Habla Hoy — lenguaje sencillo y accesible" },
    ]
  },
];

const VERSION_MAP = { 0: "es-RVR1960", 1: "es-NVI", 2: "es-LBLA", 3: "es-DHH" };

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ALL_IDS = PRINCIPLES.flatMap(p => p.items.map(i => i.id));
const todayKey   = () => new Date().toISOString().split("T")[0];
const fmt        = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
const fmtShort   = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" });
const getLast7   = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split("T")[0]; });
const lsGet      = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const lsSet      = (key, value)    => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const areaTokens = (a) => T.areas[a] || T.areas.Espiritual;

// Get rotating verse for a principle based on day
const getDailyVerse = (principleId) => {
  const bank = VERSE_BANKS[principleId] || [];
  if (!bank.length) return null;
  const diff = Math.floor((new Date() - new Date("2024-01-01")) / 86400000);
  return bank[diff % bank.length];
};

// Score onboarding answers to determine level
const scoreToLevel = (answers) => {
  let score = 0;
  if (answers.has_income === 0) score += 1;
  if (answers.has_debts === 1) score += 1;
  if (answers.has_debts === 2) score += 2;
  if (answers.has_savings === 1) score += 1;
  if (answers.has_savings === 2) score += 2;
  if (answers.has_community === 1) score += 1;
  if (answers.has_community === 2) score += 2;
  if (answers.has_mentor === 1) score += 1;
  if (answers.has_mentor === 2) score += 2;
  if (score >= 9) return 2;
  return 1;
};

// Get tithe reminder message based on profile
const getTitheMessage = (profile, tithes) => {
  if (!profile.has_income || profile.has_income === 1) return TITHE_MESSAGES.noIncome;
  const recentTithes = tithes.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    const diffDays = (now - d) / 86400000;
    return diffDays <= 30;
  });
  if (recentTithes.length >= 2) return TITHE_MESSAGES.consistent;
  if (profile.employment_type === 0) return TITHE_MESSAGES.reminder_fixed;
  if (profile.employment_type === 2) return TITHE_MESSAGES.reminder_independent;
  return TITHE_MESSAGES.reminder_temporary;
};

// AI calls
const generateGoalPlan = async (goalTitle, userLevel, profile) => {
  const levelName = LEVELS.find(l => l.id === userLevel)?.name || "Salida";
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "goal_plan",
        goal: goalTitle,
        levelId: userLevel,
        levelName,
        employmentType: profile.employment_type,
        hasDebts: profile.has_debts,
        hasSavings: profile.has_savings,
      }),
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

const getGracePlan = async (reflection, graceType) => {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "grace_plan", reflection, graceType }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.plan;
  } catch {
    return [
      "Hoy: un solo check-in completo, sin presión",
      "Mañana: enfócate en un principio que domines",
      "Pasado: vuelve a tu rutina completa con gracia",
    ];
  }
};

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const css = {
  card:       { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 12 },
  label:      { fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6, display: "block" },
  input:      { width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", color: T.text, fontSize: 14, fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" },
  btnPrimary: { width: "100%", padding: "14px", background: T.accent, border: "none", borderRadius: 10, color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  btnOutline: { padding: "10px 16px", background: "transparent", border: `1.5px solid ${T.borderStrong}`, borderRadius: 8, color: T.textMid, fontSize: 13, cursor: "pointer" },
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function App() {
  // Onboarding
  const [onboarded, setOnboarded] = useState(false);
  const [obStep, setObStep]       = useState(0);
  const [obAnswers, setObAnswers] = useState({});

  // Core
  const [tab, setTab]           = useState("checkin");
  const [checkins, setCheckins] = useState({});
  const [goals, setGoals]       = useState([]);
  const [tithes, setTithes]     = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [profile, setProfile]   = useState({});
  const [bibleVersion, setBibleVersion] = useState("es-RVR1960");
  const [streak, setStreak]     = useState(0);
  const [loaded, setLoaded]     = useState(false);

  // UI
  const [expanded, setExpanded]   = useState(null);
  const [verseOpen, setVerseOpen] = useState(true);

  // Goals
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [aiQuestions, setAiQuestions]   = useState([]);
  const [selectedQ, setSelectedQ]       = useState([]);
  const [aiLoading, setAiLoading]       = useState(false);
  const [goalStep, setGoalStep]         = useState("form");

  // Grace
  const [showGrace, setShowGrace]       = useState(false);
  const [graceType, setGraceType]       = useState("streak");
  const [graceReflection, setGraceReflection] = useState("");
  const [gracePlan, setGracePlan]       = useState([]);
  const [graceStep, setGraceStep]       = useState("message");

  // Tithe
  const [showTitheModal, setShowTitheModal] = useState(false);

  // Cert
  const [showCertPrompt, setShowCertPrompt] = useState(false);

  // Load
  useEffect(() => {
    setCheckins(lsGet("checkins", {}));
    setGoals(lsGet("goals", []));
    setTithes(lsGet("tithes", []));
    setOnboarded(lsGet("onboarded", false));
    setUserLevel(lsGet("userLevel", 1));
    setProfile(lsGet("profile", {}));
    const v = localStorage.getItem("bibleVersion");
    if (v) setBibleVersion(v);
    setLoaded(true);
  }, []);

  // Persist + streak
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
    // Detect streak broken → show grace
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yk = yesterday.toISOString().split("T")[0];
    const twoDaysAgo = new Date(); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const tdk = twoDaysAgo.toISOString().split("T")[0];
    if (!checkins[yk] && !checkins[tdk] && Object.keys(checkins).length > 0 && !lsGet("grace_shown_today", false)) {
      setGraceType("streak");
      setShowGrace(true);
      lsSet("grace_shown_today", todayKey());
    }
  }, [checkins, loaded]);

  useEffect(() => { if (loaded) lsSet("goals", goals); }, [goals, loaded]);
  useEffect(() => { if (loaded) lsSet("tithes", tithes); }, [tithes, loaded]);

  // Computed
  const td        = checkins[todayKey()] || {};
  const doneToday = ALL_IDS.filter(id => td[id]?.done === true).length;
  const pctToday  = Math.round((doneToday / ALL_IDS.length) * 100);
  const totalDays = Object.keys(checkins).length;
  const totalDone = Object.values(checkins).reduce((a, d) => a + ALL_IDS.filter(id => d[id]?.done === true).length, 0);
  const avgPct    = totalDays > 0 ? Math.round((totalDone / (totalDays * ALL_IDS.length)) * 100) : 0;
  const last7     = getLast7();
  const weekData  = last7.map(date => { const day = checkins[date] || {}; return { date, pct: Math.round((ALL_IDS.filter(id => day[id]?.done === true).length / ALL_IDS.length) * 100) }; });
  const areaStats = PRINCIPLES.map(area => {
    const ids = area.items.map(i => i.id); let tot = 0, sum = 0;
    last7.forEach(date => { const day = checkins[date] || {}; ids.forEach(id => { if (day[id]?.done !== undefined) { tot++; if (day[id]?.done) sum++; } }); });
    return { ...area, pct: tot > 0 ? Math.round((sum / tot) * 100) : 0 };
  });
  const currentLevel = LEVELS.find(l => l.id === userLevel) || LEVELS[0];
  const nextLevel    = LEVELS.find(l => l.id === userLevel + 1);
  const completedGoals = goals.filter(g => g.done).length;
  const certReady = nextLevel && totalDays >= currentLevel.minDays && avgPct >= currentLevel.minPct && completedGoals >= currentLevel.minGoals && userLevel < 4;
  const titheMessage = getTitheMessage(profile, tithes);

  // Handlers
  const setCheck = (id, val) => {
    setCheckins(p => ({ ...p, [todayKey()]: { ...p[todayKey()], [id]: { ...p[todayKey()]?.[id], done: val } } }));
    // Detect repeated failures
    const failCount = ALL_IDS.filter(id2 => td[id2]?.done === false).length;
    if (val === false && failCount >= 4 && !lsGet("grace_shown_today", false)) {
      setGraceType("discipline");
      setShowGrace(true);
      lsSet("grace_shown_today", todayKey());
    }
  };
  const setRef      = (id, text) => setCheckins(p => ({ ...p, [todayKey()]: { ...p[todayKey()], [id]: { ...p[todayKey()]?.[id], reflection: text } } }));
  const toggleDone  = (gid) => setGoals(p => p.map(g => g.id === gid ? { ...g, done: !g.done } : g));
  const toggleGoalQ = (gid, qi) => setGoals(p => p.map(g => g.id !== gid ? g : { ...g, questionChecks: { ...(g.questionChecks || {}), [todayKey()]: { ...(g.questionChecks?.[todayKey()] || {}), [qi]: !(g.questionChecks?.[todayKey()]?.[qi]) } } }));

  const recordTithe = () => {
    setTithes(p => [...p, { date: todayKey(), recorded: true }]);
    setShowTitheModal(false);
  };

  // ── ONBOARDING ───────────────────────────────────────────────────────────────
  const visibleSteps = OB_STEPS.filter(s => {
    if (!s.conditional) return true;
    return obAnswers[s.conditional.key] === s.conditional.value;
  });

  const finishOnboarding = (answers) => {
    const level = scoreToLevel(answers);
    const ver   = VERSION_MAP[answers.bible_version] || "es-RVR1960";
    setUserLevel(level);
    setBibleVersion(ver);
    setProfile(answers);
    setOnboarded(true);
    lsSet("onboarded", true);
    lsSet("userLevel", level);
    lsSet("profile", answers);
    localStorage.setItem("bibleVersion", ver);
  };

  if (!onboarded && loaded) {
    const currentSteps = OB_STEPS.filter(s => !s.conditional || obAnswers[s.conditional.key] === s.conditional.value);
    const q      = currentSteps[obStep];
    if (!q) { finishOnboarding(obAnswers); return null; }
    const isLast = obStep === currentSteps.length - 1;

    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px" }}>
        <div style={{ maxWidth: 460, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>Prospera en Todo</div>
            <h1 style={{ fontSize: 24, fontWeight: "normal", color: T.text, margin: "0 0 6px" }}>Configura tu perfil</h1>
            <p style={{ fontSize: 13, color: T.textMuted, fontStyle: "italic", margin: 0 }}>Personalicemos tu camino hacia la prosperidad</p>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
            {currentSteps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= obStep ? T.accent : T.border, transition: "background 0.3s" }} />
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 10 }}>{obStep + 1} de {currentSteps.length}</div>
          <div style={{ fontSize: 19, color: T.text, marginBottom: 22, lineHeight: 1.5 }}>{q.q}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => {
              const sel = obAnswers[q.id] === i;
              return (
                <button key={i} onClick={() => {
                  const next = { ...obAnswers, [q.id]: i };
                  setObAnswers(next);
                  if (isLast) setTimeout(() => finishOnboarding(next), 200);
                  else setTimeout(() => setObStep(s => s + 1), 200);
                }} style={{ padding: "14px 16px", background: sel ? T.accentLight : T.surface, border: `1.5px solid ${sel ? T.accent : T.border}`, borderRadius: 10, color: sel ? T.accent : T.textMid, fontSize: 14, cursor: "pointer", textAlign: "left", fontFamily: "Georgia, serif", fontWeight: sel ? 700 : "normal", transition: "all 0.18s" }}>
                  <div>{opt.label}</div>
                  {opt.desc && <div style={{ fontSize: 11, color: sel ? T.accentMid : T.textFaint, marginTop: 3 }}>{opt.desc}</div>}
                </button>
              );
            })}
          </div>

          {obStep > 0 && (
            <button onClick={() => setObStep(s => s - 1)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 12, marginTop: 20, padding: 0 }}>← Anterior</button>
          )}
        </div>
      </div>
    );
  }

  // ── GRACE MODAL ──────────────────────────────────────────────────────────────
  if (showGrace) {
    const grace = GRACE_MESSAGES[graceType] || GRACE_MESSAGES.streak;
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px" }}>
        <div style={{ maxWidth: 460, width: "100%" }}>
          {graceStep === "message" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🕊</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>Un momento para ti</div>
                <div style={{ fontSize: 18, color: T.text, lineHeight: 1.6, marginBottom: 16 }}>{grace.message}</div>
                <div style={{ background: T.accentLight, border: `1px solid ${T.accent}30`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: T.text, fontStyle: "italic", lineHeight: 1.7, marginBottom: 6 }}>"{grace.verseText}"</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.accentMid }}>— {grace.verse}</div>
                </div>
                {/* Audio placeholder — ready for pastor MP3 */}
                <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accentLight, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>▶</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Palabra del pastor</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>Mensaje de gracia para este momento</div>
                  </div>
                </div>
              </div>
              <button onClick={() => setGraceStep("reflection")} style={css.btnPrimary}>Continuar →</button>
              <button onClick={() => { setShowGrace(false); setGraceStep("message"); }} style={{ ...css.btnOutline, width: "100%", marginTop: 10, textAlign: "center" }}>Cerrar por ahora</button>
            </>
          )}

          {graceStep === "reflection" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 16, color: T.text, marginBottom: 16, lineHeight: 1.6 }}>¿Qué pasó? Cuéntame sin filtros — esto es solo entre tú y Dios.</div>
                <textarea value={graceReflection} onChange={e => setGraceReflection(e.target.value)} placeholder="Escribe lo que sientes..." style={{ ...css.input, resize: "vertical", minHeight: 100, lineHeight: 1.7 }} />
              </div>
              <button onClick={async () => {
                if (!graceReflection.trim()) return;
                setGraceStep("plan");
                const plan = await getGracePlan(graceReflection, graceType);
                setGracePlan(plan);
              }} style={{ ...css.btnPrimary, opacity: graceReflection.trim() ? 1 : 0.4, cursor: graceReflection.trim() ? "pointer" : "not-allowed" }}>Ver mi plan de 3 días →</button>
            </>
          )}

          {graceStep === "plan" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.accent, textTransform: "uppercase", marginBottom: 16 }}>Tu plan — próximos 3 días</div>
                {gracePlan.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: T.textMuted }}>Preparando tu plan...</div>
                ) : gracePlan.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.accentLight, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, paddingTop: 4 }}>{step}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setShowGrace(false); setGraceStep("message"); setGraceReflection(""); setGracePlan([]); }} style={css.btnPrimary}>¡Listo para continuar! →</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── TITHE MODAL ───────────────────────────────────────────────────────────────
  const TitheModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowTitheModal(false)}>
      <div style={{ background: T.surface, borderRadius: "20px 20px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 24px" }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>Reportar Diezmo</div>
        <div style={{ fontSize: 16, color: T.text, marginBottom: 16, lineHeight: 1.6 }}>¿Diezmaste en este ciclo?</div>
        <div style={{ background: T.accentLight, border: `1px solid ${T.accent}30`, borderLeft: `4px solid ${T.accent}`, borderRadius: "0 10px 10px 0", padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6, fontStyle: "italic" }}>{titheMessage}</div>
        </div>
        <button onClick={recordTithe} style={css.btnPrimary}>✓ Sí, diezmé</button>
        <button onClick={() => setShowTitheModal(false)} style={{ ...css.btnOutline, width: "100%", marginTop: 10, textAlign: "center" }}>Aún no</button>
      </div>
    </div>
  );

  // ── GOAL FLOW ─────────────────────────────────────────────────────────────────
  const handleGenerateAI = async () => {
    if (!newGoalTitle.trim()) return;
    setAiLoading(true); setGoalStep("select");
    const questions = await generateGoalPlan(newGoalTitle, userLevel, profile);
    setAiQuestions(questions);
    setSelectedQ(questions.map((_, i) => i));
    setAiLoading(false);
  };

  const saveGoal = () => {
    if (!newGoalTitle.trim() || selectedQ.length === 0) return;
    setGoals(p => [...p, { id: Date.now().toString(), title: newGoalTitle, questions: selectedQ.map(i => aiQuestions[i]), questionChecks: {}, createdAt: todayKey(), done: false }]);
    setNewGoalTitle(""); setAiQuestions([]); setSelectedQ([]); setGoalStep("form"); setShowGoalForm(false);
  };

  // ── MAIN RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Georgia, serif", paddingBottom: 90 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>

        {/* HEADER */}
        <div style={{ padding: "28px 0 18px", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: T.accent, textTransform: "uppercase", marginBottom: 4 }}>Prospera en Todo</div>
              <div style={{ fontSize: 13, color: T.textMuted, fontStyle: "italic" }}>{fmt(todayKey())}</div>
            </div>
            {certReady && (
              <button onClick={() => setShowCertPrompt(true)} style={{ background: T.accentLight, border: `1.5px solid ${T.accent}`, borderRadius: 20, padding: "6px 14px", color: T.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                ✦ Listo para subir
              </button>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
            {[{ v: streak, l: "Racha" }, { v: `${pctToday}%`, l: "Hoy" }, { v: `${avgPct}%`, l: "Promedio" }, { v: totalDays, l: "Días" }].map(({ v, l }, i, arr) => (
              <div key={l} style={{ padding: "13px 0", textAlign: "center", borderRight: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>{v}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ height: 5, background: T.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctToday}%`, background: T.accent, borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: T.textFaint }}>{doneToday} de {ALL_IDS.length} principios hoy</span>
            <span style={{ fontSize: 10, color: T.textFaint }}>{pctToday}%</span>
          </div>
        </div>

        {/* CERT PROMPT */}
        {showCertPrompt && (
          <div style={{ ...css.card, background: T.accentLight, border: `1.5px solid ${T.accent}`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>La IA detectó que estás listo</div>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 14, lineHeight: 1.6 }}>{totalDays} días registrados · {avgPct}% promedio · {completedGoals} metas logradas. ¿Listo para el siguiente nivel?</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { alert(`Certificación de Nivel ${userLevel + 1} — ${nextLevel?.name}.\nDisponible en la próxima actualización.`); setShowCertPrompt(false); }} style={{ ...css.btnPrimary, flex: 2 }}>Iniciar certificación</button>
              <button onClick={() => setShowCertPrompt(false)} style={{ ...css.btnOutline, flex: 1 }}>Después</button>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: `1.5px solid ${T.border}`, marginBottom: 22 }}>
          {[{ k: "checkin", l: "Check-in" }, { k: "progreso", l: "Progreso" }, { k: "metas", l: "Metas" }, { k: "historial", l: "Historial" }].map(({ k, l }) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "11px 0", background: "none", border: "none", borderBottom: tab === k ? `2.5px solid ${T.accent}` : "2.5px solid transparent", color: tab === k ? T.accent : T.textMuted, fontSize: 11, fontWeight: tab === k ? 700 : 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", marginBottom: -2 }}>{l}</button>
          ))}
        </div>

        {/* ── CHECK-IN ── */}
        {tab === "checkin" && (
          <div>
            {/* Tithe button — always visible */}
            <div style={{ ...css.card, borderLeft: `4px solid ${T.areas.Espiritual.color}`, borderRadius: "0 12px 12px 0", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.areas.Espiritual.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Diezmo</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, maxWidth: 240 }}>{titheMessage}</div>
                </div>
                <button onClick={() => setShowTitheModal(true)} style={{ background: T.areas.Espiritual.bg, border: `1.5px solid ${T.areas.Espiritual.border}`, borderRadius: 10, padding: "10px 16px", color: T.areas.Espiritual.color, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  Reportar diezmo
                </button>
              </div>
              {tithes.filter(t => t.date === todayKey()).length > 0 && (
                <div style={{ fontSize: 11, color: T.accentMid, fontWeight: 600 }}>✓ Diezmo registrado hoy</div>
              )}
            </div>

            {/* Principles */}
            {PRINCIPLES.map(area => {
              const at = areaTokens(area.area);
              return (
                <div key={area.area} style={{ marginBottom: 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: at.bg, border: `1px solid ${at.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: at.color }}>{area.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: at.color, textTransform: "uppercase" }}>{area.area}</span>
                  </div>
                  {area.items.map(item => {
                    const e      = td[item.id] || {};
                    const isExp  = expanded === item.id;
                    const done   = e.done === true;
                    const no     = e.done === false;
                    const verse  = getDailyVerse(item.id);
                    return (
                      <div key={item.id} style={{ background: T.surface, border: `1.5px solid ${done ? at.border : T.border}`, borderRadius: 10, marginBottom: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: at.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{item.name}</div>
                          <div style={{ fontSize: 13, color: T.textMid, marginBottom: 8, lineHeight: 1.6 }}>{item.practice}</div>
                          {/* Daily rotating verse */}
                          {verse && (
                            <div style={{ background: at.bg, border: `1px solid ${at.border}`, borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                              <div style={{ fontSize: 11, color: at.color, fontStyle: "italic", lineHeight: 1.6 }}>"{verse.text}"</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: at.color, marginTop: 4, opacity: 0.8 }}>— {verse.ref}</div>
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => { setCheck(item.id, true); setExpanded(item.id); }} style={{ flex: 1, padding: "10px", border: `1.5px solid ${done ? at.color : T.border}`, background: done ? at.bg : "transparent", color: done ? at.color : T.textMuted, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: done ? 700 : 400, transition: "all 0.18s", minHeight: 44 }}>✓ Sí</button>
                            <button onClick={() => { setCheck(item.id, false); setExpanded(item.id); }} style={{ flex: 1, padding: "10px", border: `1.5px solid ${no ? T.danger : T.border}`, background: no ? T.dangerLight : "transparent", color: no ? T.danger : T.textMuted, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: no ? 700 : 400, transition: "all 0.18s", minHeight: 44 }}>✗ No</button>
                            <button onClick={() => setExpanded(isExp ? null : item.id)} style={{ padding: "10px 16px", border: `1.5px solid ${isExp ? T.borderStrong : T.border}`, background: isExp ? T.surfaceAlt : "transparent", color: T.textMuted, borderRadius: 8, cursor: "pointer", fontSize: 13, minHeight: 44 }}>✎</button>
                          </div>
                        </div>
                        {isExp && (
                          <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 16px", background: T.bg }}>
                            <label style={css.label}>Reflexión del día</label>
                            <textarea value={e.reflection || ""} onChange={ev => setRef(item.id, ev.target.value)} placeholder="¿Qué aprendiste hoy? ¿Qué mejorarás mañana?" style={{ ...css.input, resize: "vertical", minHeight: 80, lineHeight: 1.7 }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROGRESO ── */}
        {tab === "progreso" && (
          <div>
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

            <div style={css.card}>
              <label style={css.label}>Estadísticas</label>
              {[["Días registrados", totalDays], ["Principios cumplidos", totalDone], ["Promedio diario", `${avgPct}%`], ["Racha actual", `${streak} días`], ["Diezmos registrados", tithes.length], ["Metas activas", goals.filter(g => !g.done).length], ["Metas logradas", completedGoals]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 13, color: T.textMid }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Level — hidden details, just shows current */}
            <div style={{ ...css.card, borderLeft: `4px solid ${currentLevel.color}`, borderRadius: "0 12px 12px 0" }}>
              <label style={{ ...css.label, color: currentLevel.color }}>Tu nivel actual</label>
              <div style={{ fontSize: 22, fontWeight: 700, color: currentLevel.color, marginBottom: 4 }}>{currentLevel.name}</div>
              <div style={{ fontSize: 13, color: T.textMid, fontStyle: "italic" }}>{currentLevel.objective}</div>
            </div>
          </div>
        )}

        {/* ── METAS ── */}
        {tab === "metas" && (
          <div>
            <div style={{ background: T.accentLight, border: `1px solid ${T.accent}30`, borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: T.accentMid, lineHeight: 1.6, fontStyle: "italic" }}>
                "Tu propósito es prosperar en todo — espíritu, alma y cuerpo. Cada meta que defines es un paso en esa dirección." — 3 Juan 1:2
              </div>
            </div>

            <button onClick={() => { setShowGoalForm(!showGoalForm); setGoalStep("form"); setAiQuestions([]); setSelectedQ([]); }} style={{ ...css.btnPrimary, marginBottom: 20 }}>
              {showGoalForm ? "✕ Cancelar" : "+ Nueva Meta"}
            </button>

            {showGoalForm && (
              <div style={css.card}>
                {goalStep === "form" && (
                  <>
                    <label style={css.label}>¿Qué quieres lograr?</label>
                    <input value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} placeholder="Ej: Salir de deudas, aprender a diezmar, ahorrar mi primer fondo..." style={{ ...css.input, marginBottom: 14 }} />
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 14, lineHeight: 1.6, fontStyle: "italic" }}>
                      La IA analizará tu meta, la enmarcará dentro de la prosperidad bíblica y te propondrá un plan personalizado.
                    </div>
                    <button onClick={handleGenerateAI} disabled={!newGoalTitle.trim()} style={{ ...css.btnPrimary, opacity: newGoalTitle.trim() ? 1 : 0.4, cursor: newGoalTitle.trim() ? "pointer" : "not-allowed" }}>
                      Generar plan con IA
                    </button>
                  </>
                )}
                {goalStep === "select" && (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{newGoalTitle}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>
                      {aiLoading ? "La IA está preparando tu plan..." : `Selecciona las preguntas para tu check-in diario (${selectedQ.length} seleccionadas)`}
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
                              <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${sel ? T.accent : T.borderStrong}`, background: sel ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, minWidth: 20 }}>
                                {sel && <span style={{ fontSize: 11, color: "#FFF", fontWeight: 700 }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 13, color: sel ? T.text : T.textMid, lineHeight: 1.55 }}>{q}</span>
                            </div>
                          );
                        })}
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                          <button onClick={() => setGoalStep("form")} style={{ ...css.btnOutline, flex: 1, minHeight: 44 }}>← Editar</button>
                          <button onClick={saveGoal} disabled={selectedQ.length === 0} style={{ ...css.btnPrimary, flex: 2, opacity: selectedQ.length > 0 ? 1 : 0.4, cursor: selectedQ.length > 0 ? "pointer" : "not-allowed", minHeight: 44 }}>
                            Guardar {selectedQ.length} preguntas
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {goals.length === 0 && !showGoalForm && (
              <div style={{ textAlign: "center", padding: "48px 0", color: T.textFaint }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>◈</div>
                <div style={{ fontSize: 13 }}>Define tu primera meta hacia la prosperidad</div>
              </div>
            )}

            {goals.map(goal => {
              const todayChecks  = goal.questionChecks?.[todayKey()] || {};
              const checkedCount = Object.values(todayChecks).filter(Boolean).length;
              const total        = goal.questions?.length || 0;
              const pct          = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
              return (
                <div key={goal.id} style={{ ...css.card, opacity: goal.done ? 0.5 : 1, borderLeft: `4px solid ${T.accent}`, borderRadius: "0 12px 12px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 3 }}>{fmt(goal.createdAt)}</div>
                      <div style={{ fontSize: 15, color: goal.done ? T.textMuted : T.text, textDecoration: goal.done ? "line-through" : "none", lineHeight: 1.4 }}>{goal.title}</div>
                    </div>
                    <button onClick={() => toggleDone(goal.id)} style={{ ...css.btnOutline, fontSize: 11, padding: "8px 12px", whiteSpace: "nowrap", minHeight: 44, borderColor: goal.done ? T.accent : T.border, color: goal.done ? T.accent : T.textMuted }}>
                      {goal.done ? "✓ Logrado" : "Completar"}
                    </button>
                  </div>

                  {goal.questions?.length > 0 && !goal.done && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Hoy</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.accent }}>{checkedCount}/{total}</span>
                      </div>
                      <div style={{ height: 4, background: T.surfaceAlt, borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: T.accent, borderRadius: 2, transition: "width 0.4s" }} />
                      </div>
                      {goal.questions.map((q, i) => {
                        const checked = todayChecks[i];
                        return (
                          <div key={i} onClick={() => toggleGoalQ(goal.id, i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                            <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? T.accent : T.borderStrong}`, background: checked ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, minWidth: 18, transition: "all 0.18s" }}>
                              {checked && <span style={{ fontSize: 10, color: "#FFF", fontWeight: 700 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 13, color: checked ? T.textMuted : T.textMid, textDecoration: checked ? "line-through" : "none", lineHeight: 1.55 }}>{q}</span>
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
                      {isT && <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, background: T.accentLight, padding: "2px 7px", borderRadius: 10 }}>HOY</span>}
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

      {/* BOTTOM NAV — mobile friendly */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.surface, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 50 }}>
        {[{ k: "checkin", l: "Check-in", icon: "✦" }, { k: "progreso", l: "Progreso", icon: "◈" }, { k: "metas", l: "Metas", icon: "◆" }, { k: "historial", l: "Historial", icon: "◉" }].map(({ k, l, icon }) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 0 14px", background: "none", border: "none", borderTop: tab === k ? `2.5px solid ${T.accent}` : "2.5px solid transparent", color: tab === k ? T.accent : T.textMuted, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: tab === k ? 700 : 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</span>
          </button>
        ))}
      </div>

      {/* TITHE MODAL */}
      {showTitheModal && <TitheModal />}
    </div>
  );
}