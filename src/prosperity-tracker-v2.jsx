import { useState, useEffect, useRef } from "react";

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    @keyframes slideInUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes scaleIn    { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
    @keyframes bounceIn   { 0% { opacity:0; transform:scale(0.6); } 60% { opacity:1; transform:scale(1.06); } 100% { transform:scale(1); } }
    @keyframes verseSlide { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
    .reveal      { animation: slideInUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .reveal-fast { animation: slideInUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
    .scale-in    { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
    .bounce      { animation: bounceIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .verse-in    { animation: verseSlide 0.55s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in     { animation: fadeIn 0.4s ease both; }
    .d1 { animation-delay:0.07s; } .d2 { animation-delay:0.15s; }
    .d3 { animation-delay:0.23s; } .d4 { animation-delay:0.31s; }
    .d5 { animation-delay:0.39s; }
    button:active { transform:scale(0.97) !important; }
    ::-webkit-scrollbar { display:none; }
    textarea { font-family: 'Instrument Sans', system-ui, sans-serif; }
    textarea:focus { outline:none; }
    textarea::placeholder { color:#B0AAA3; }
    input:focus { outline:none; }
  `}</style>
);

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:           "#F9F7F3",
  warm:         "#EDE9E2",
  surface:      "#FFFFFF",
  ink:          "#181614",
  inkMid:       "#3D3934",
  inkMute:      "#7A7570",
  inkFaint:     "#B0AAA3",
  stroke:       "#E5E1D9",
  primary:      "#1E4D30",
  primaryLight: "#EAF0EC",
  primaryMid:   "#2D6B43",
  primaryGlow:  "rgba(30,77,48,0.15)",
  amber:        "#8A6020",
  amberLight:   "#F5EDD8",
  amberGlow:    "rgba(138,96,32,0.12)",
  danger:       "#8A2020",
  dangerLight:  "#FAE8E8",
  areas: {
    spirit:    { c:"#7A5800", bg:"#FBF3E2", stroke:"#E8CF8A", glow:"rgba(122,88,0,0.08)"   },
    finance:   { c:"#1E4D30", bg:"#EAF0EC", stroke:"#90C4A4", glow:"rgba(30,77,48,0.08)"   },
    character: { c:"#3D2075", bg:"#EDE8FA", stroke:"#B09ADE", glow:"rgba(61,32,117,0.08)"  },
    relation:  { c:"#7A2020", bg:"#FAE8E8", stroke:"#DE9A9A", glow:"rgba(122,32,32,0.08)"  },
  },
  levels: {
    1: { name:"Salida",        color:"#1E4D30", bg:"#EAF0EC", symbol:"◎" },
    2: { name:"Crecimiento",   color:"#8A6020", bg:"#F5EDD8", symbol:"◈" },
    3: { name:"Consolidación", color:"#3D2075", bg:"#EDE8FA", symbol:"◆" },
    4: { name:"Mayordomía",    color:"#7A2020", bg:"#FAE8E8", symbol:"✦" },
  }
};

const D = "'Syne', system-ui, sans-serif";
const B = "'Instrument Sans', system-ui, sans-serif";

// ── VERSE BANKS ───────────────────────────────────────────────────────────────
const VERSE_BANKS = {
  oracion: [
    { text:"En nada estéis afanosos; sino sean conocidas vuestras peticiones delante de Dios en toda oración.", ref:"Filipenses 4:6" },
    { text:"Clama a mí y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", ref:"Jeremías 33:3" },
    { text:"La oración eficaz del justo puede mucho.", ref:"Santiago 5:16" },
    { text:"Orad sin cesar.", ref:"1 Tesalonicenses 5:17" },
    { text:"Entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en secreto.", ref:"Mateo 6:6" },
  ],
  palabra: [
    { text:"Nunca se apartará de tu boca este libro... medita en él de día y de noche... entonces harás prosperar tu camino.", ref:"Josué 1:8" },
    { text:"Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", ref:"Salmos 119:105" },
    { text:"La fe viene por el oír, y el oír por la palabra de Dios.", ref:"Romanos 10:17" },
    { text:"La palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos.", ref:"Hebreos 4:12" },
    { text:"Toda la Escritura es inspirada por Dios y útil para enseñar, para redargüir, para corregir.", ref:"2 Timoteo 3:16" },
  ],
  administracion: [
    { text:"El que es fiel en lo muy poco, también en lo más es fiel.", ref:"Lucas 16:10" },
    { text:"Sé diligente en conocer el estado de tus ovejas, y mira con cuidado por tus rebaños.", ref:"Proverbios 27:23" },
    { text:"Con sabiduría se edifica la casa, y con prudencia se afirma.", ref:"Proverbios 24:3" },
    { text:"¿Quién de vosotros, queriendo edificar una torre, no se sienta primero y calcula los gastos?", ref:"Lucas 14:28" },
    { text:"Encomienda al Señor tus obras, y tus pensamientos serán afirmados.", ref:"Proverbios 16:3" },
  ],
  ahorro: [
    { text:"Tesoro precioso y aceite hay en la casa del sabio, pero el hombre necio todo lo disipa.", ref:"Proverbios 21:20" },
    { text:"Ve a la hormiga... la cual en el verano hace su provisión y recoge en el tiempo de la siega.", ref:"Proverbios 6:6-8" },
    { text:"Los pensamientos del diligente ciertamente son ventajosos.", ref:"Proverbios 21:5" },
    { text:"Las riquezas de vanidad disminuyen, pero el que recoge con mano laboriosa las aumenta.", ref:"Proverbios 13:11" },
    { text:"El alma generosa será prosperada; y el que saciare, él también será saciado.", ref:"Proverbios 11:25" },
  ],
  diligencia: [
    { text:"La mano negligente empobrece, pero la mano de los diligentes enriquece.", ref:"Proverbios 10:4" },
    { text:"Todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.", ref:"Colosenses 3:23" },
    { text:"¿Has visto hombre solícito en su trabajo? Delante de los reyes estará.", ref:"Proverbios 22:29" },
    { text:"Todo lo que te viniere a la mano para hacer, hazlo según tus fuerzas.", ref:"Eclesiastés 9:10" },
    { text:"La mano de los diligentes gobernará, pero la negligencia será tributaria.", ref:"Proverbios 12:24" },
  ],
  honestidad: [
    { text:"El peso falso es abominación al Señor, pero la pesa exacta le agrada.", ref:"Proverbios 11:1" },
    { text:"Mejor es el pobre que camina en su integridad, que el rico de perversos caminos.", ref:"Proverbios 28:6" },
    { text:"El que habla verdad declara justicia.", ref:"Proverbios 12:17" },
    { text:"En Cristo fuisteis también circuncidados... siendo sepultados con él.", ref:"Colosenses 2:11-12" },
    { text:"No debáis a nadie nada, sino el amaros unos a otros.", ref:"Romanos 13:8" },
  ],
  comunidad: [
    { text:"El hierro con hierro se aguza, y el hombre aguza el rostro de su amigo.", ref:"Proverbios 27:17" },
    { text:"Mejores son dos que uno... porque si cayeren, el uno levantará a su compañero.", ref:"Eclesiastés 4:9-10" },
    { text:"No dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos.", ref:"Hebreos 10:25" },
    { text:"El que anda con sabios, sabio será; mas el que se junta con necios será quebrantado.", ref:"Proverbios 13:20" },
    { text:"Así nosotros, siendo muchos, somos un cuerpo en Cristo.", ref:"Romanos 12:5" },
  ],
  mentores: [
    { text:"Los pensamientos son frustrados donde no hay consejo, pero en la multitud de consejeros se afirman.", ref:"Proverbios 15:22" },
    { text:"Escucha el consejo y acepta la corrección, para que seas sabio en tu vejez.", ref:"Proverbios 19:20" },
    { text:"El camino del necio es recto en su opinión; mas el que obedece al consejo es sabio.", ref:"Proverbios 12:15" },
    { text:"La sabiduría es mejor que la fuerza.", ref:"Eclesiastés 9:16" },
    { text:"En la multitud de consejeros está la victoria.", ref:"Proverbios 11:14" },
  ],
};

// type:"guided"    = app helps you DO it right now
// type:"three_way" = ✓ did it / ○ will do today / ✗ not today
const PRINCIPLES = [
  { id:"oracion", area:"Espiritual", areaKey:"spirit", icon:"✦", name:"Oración",
    type:"guided",
    guide:{
      intro:"Tómate dos minutos ahora mismo.",
      focusBank:[
        "Tu meta y lo que necesitas para avanzar en ella",
        "Algo que te está generando ansiedad hoy",
        "Una persona que necesita tu oración hoy",
        "Gratitud genuina por algo concreto de tu vida",
        "Sabiduría para una decisión que tienes pendiente",
      ],
      done:"Lo hice — oré ahora",
      later:"Lo haré más tarde hoy",
    },
    questions:[
      "¿Tuviste hoy un momento real con Dios — aunque sea corto?",
      "¿Le confiaste algo a Dios hoy o lo cargaste tú solo?",
      "¿Hubo algo que te preocupó hoy que pudiste llevar a Él?",
      "¿Sentiste la presencia de Dios en algún momento de tu día?",
      "¿Le hablaste a Dios sobre lo que estás construyendo?",
    ]},
  { id:"palabra", area:"Espiritual", areaKey:"spirit", icon:"✦", name:"Palabra",
    type:"guided",
    guide:{
      intro:"Lee esto con calma. No hay prisa.",
      done:"Lo leí — medité en esto",
      later:"Lo leeré más tarde hoy",
    },
    questions:[
      "¿Hubo algo en la Palabra hoy que te habló directamente?",
      "¿Dedicaste aunque sea cinco minutos a leer o escuchar la Biblia?",
      "¿Hay una verdad bíblica que estés aplicando esta semana?",
      "¿Meditaste hoy en algo que Dios ya te había dicho?",
      "¿La Palabra de Dios está guiando tus decisiones de esta semana?",
    ]},
  { id:"administracion", area:"Financiero", areaKey:"finance", icon:"◈", name:"Administración",
    type:"three_way",
    nudge:"Tómate 5 minutos hoy para revisar tus gastos — aunque sea una vez.",
    questions:[
      "¿Sabes a dónde fue cada peso que salió de tus manos hoy?",
      "¿Tomaste alguna decisión financiera hoy de la que te sientas bien?",
      "¿Fuiste fiel con los recursos que Dios puso en tus manos hoy?",
      "¿Hubo algo que quisiste comprar y decidiste esperar?",
      "¿Revisaste hoy cómo están tus finanzas aunque sea brevemente?",
    ]},
  { id:"ahorro", area:"Financiero", areaKey:"finance", icon:"◈", name:"Ahorro",
    type:"three_way",
    nudge:"Aunque sea un porcentaje pequeño — aparta algo hoy antes de gastar.",
    questions:[
      "¿Pusiste algo aparte hoy, aunque sea pequeño, para tu futuro?",
      "¿Estás siendo la hormiga que guarda en verano, o el que gasta todo?",
      "¿Tienes claro cuánto estás ahorrando este mes?",
      "¿Tu futuro self te agradecería las decisiones que tomaste hoy?",
      "¿Hiciste algo hoy que te acerque a tu fondo de emergencia?",
    ]},
  { id:"diligencia", area:"Carácter", areaKey:"character", icon:"◆", name:"Diligencia",
    type:"three_way",
    nudge:"Elige una tarea pendiente y resuélvela antes de cerrar el día.",
    questions:[
      "¿Diste lo mejor de ti hoy o hiciste lo mínimo para salir del paso?",
      "¿Hay algo que dejaste pendiente hoy que podrías haber resuelto?",
      "¿Trabajaste hoy como si Dios estuviera mirando cada detalle?",
      "¿Tu esfuerzo de hoy te acerca a donde quieres estar en un año?",
      "¿Fuiste productivo con el tiempo que Dios te dio hoy?",
    ]},
  { id:"honestidad", area:"Carácter", areaKey:"character", icon:"◆", name:"Honestidad",
    type:"three_way",
    nudge:"Si hay algo pendiente de aclarar con alguien — hoy es el día.",
    questions:[
      "¿Fuiste completamente honesto en todas tus interacciones de hoy?",
      "¿Hubo algo hoy donde elegiste la integridad aunque costara?",
      "¿Tu palabra vale tanto como tu firma en este momento de tu vida?",
      "¿Actuaste hoy igual con o sin testigos?",
      "¿Hay algo pendiente de resolver con alguien por falta de honestidad?",
    ]},
  { id:"comunidad", area:"Relacional", areaKey:"relation", icon:"◉", name:"Comunidad",
    type:"three_way",
    nudge:"Envía un mensaje hoy a alguien que te edifica — aunque sea breve.",
    questions:[
      "¿Estuviste hoy conectado con alguien que te edifica de verdad?",
      "¿Hiciste algo hoy para fortalecer una relación que importa?",
      "¿Hubo alguien hoy a quien pudiste ayudar o motivar?",
      "¿Tu círculo más cercano sabe hacia dónde vas y te empuja ahí?",
      "¿Te conectaste hoy con alguien de mayor nivel que tú?",
    ]},
  { id:"mentores", area:"Relacional", areaKey:"relation", icon:"◉", name:"Consejo Sabio",
    type:"three_way",
    nudge:"Si tienes una decisión pendiente — habla con alguien antes de decidir.",
    questions:[
      "¿Buscaste o aplicaste consejo de alguien más sabio esta semana?",
      "¿Tienes a alguien a quien rendir cuentas de verdad?",
      "¿Hay una decisión que deberías consultar antes de tomar?",
      "¿Estás aprendiendo de alguien que ya está donde quieres llegar?",
      "¿Eres tú también consejo y apoyo para alguien que está empezando?",
    ]},
];

const PRINCIPLE_IDS = PRINCIPLES.map(p => p.id);

// ── ONBOARDING DATA ───────────────────────────────────────────────────────────
const MINDSET_QUESTIONS = [
  {
    id:"money_feeling",
    q:"Cuando piensas en tener mucho más dinero del que tienes ahora, ¿qué sientes primero?",
    opts:[
      { label:"Emoción — lo visualizo y me motiva",         value:"growth" },
      { label:"Duda — no sé si es realmente para mí",       value:"doubt"  },
      { label:"Miedo — no sé si podría manejarlo",          value:"fear"   },
      { label:"Culpa — siento que no debería quererlo",     value:"guilt"  },
      { label:"Nada en particular",                          value:"neutral"},
    ]
  },
  {
    id:"money_belief",
    q:"¿Con cuál de estas frases te identificas más en este momento?",
    opts:[
      { label:"El dinero es una herramienta — ni buena ni mala",      value:"tool"    },
      { label:"El dinero cambia a las personas, para mal",            value:"fear"    },
      { label:"El dinero es una bendición que hay que saber llevar",  value:"growth"  },
      { label:"El dinero es para disfrutarlo, no para acumularlo",    value:"consume" },
      { label:"El dinero trae más problemas que soluciones",          value:"guilt"   },
    ]
  },
  {
    id:"others_success",
    q:"Cuando alguien de tu círculo logra una mejora económica grande, ¿qué es lo primero que piensas?",
    opts:[
      { label:"Me alegra — me inspira que es posible",          value:"growth"  },
      { label:"Me alegra pero siento algo de envidia",          value:"scarcity"},
      { label:"Pienso cómo lo logró para aprender",             value:"growth"  },
      { label:"Me pregunto si será sostenible",                 value:"doubt"   },
      { label:"Depende mucho de la persona",                    value:"neutral" },
    ]
  },
  {
    id:"family_money",
    q:"¿Cómo describirías la relación con el dinero que viste en tu familia cuando crecías?",
    opts:[
      { label:"Era un tema de tensión y preocupación constante",  value:"scarcity" },
      { label:"Era normal — ni mucho ni poco, se vivía bien",     value:"neutral"  },
      { label:"Era algo de lo que no se hablaba",                 value:"avoid"    },
      { label:"Era un tema de fe — Dios proveerá",               value:"faith"    },
      { label:"Era algo que había que trabajar duro para tener",  value:"growth"   },
    ]
  },
  {
    id:"money_purpose",
    q:"¿Cuál de estas frases describe mejor para qué quieres prosperar?",
    opts:[
      { label:"Para no preocuparme más por el dinero",              value:"security"    },
      { label:"Para poder dar y ayudar a otros",                    value:"steward"     },
      { label:"Para disfrutar la vida que me merezco",              value:"consume"     },
      { label:"Para dejarle algo importante a mi familia",          value:"legacy"      },
      { label:"Para tener libertad de hacer lo que Dios me llame", value:"purpose"     },
      { label:"Todavía no tengo muy claro para qué",               value:"unclear"     },
    ]
  },
  {
    id:"self_admin",
    q:"Si tuvieras que describirte como administrador de lo que tienes ahora, ¿qué dirías?",
    opts:[
      { label:"Soy bastante ordenado con mis recursos",              value:"good"    },
      { label:"Me falta más disciplina de la que tengo",             value:"growing" },
      { label:"No tengo suficiente como para administrar",           value:"level1"  },
      { label:"Sé que puedo mejorar pero no sé por dónde empezar",  value:"lost"    },
      { label:"Prefiero no pensarlo mucho",                          value:"avoid"   },
    ]
  },
  {
    id:"mistakes",
    q:"Cuando tomas una decisión financiera que después no fue la mejor, ¿qué piensas generalmente?",
    opts:[
      { label:"Fue mala suerte o las circunstancias",          value:"external" },
      { label:"Debí haberlo pensado mejor — aprendo y sigo",   value:"growth"   },
      { label:"Me cuesta mucho soltar ese tipo de errores",    value:"stuck"    },
      { label:"Trato de no darle muchas vueltas",              value:"avoid"    },
      { label:"Lo analizo para no repetirlo",                  value:"growth"   },
    ]
  },
  {
    id:"ask_help",
    q:"¿Qué tan fácil te resulta pedir ayuda o consejo cuando algo no te está funcionando?",
    opts:[
      { label:"Lo hago naturalmente — no me cuesta",                  value:"open"    },
      { label:"Lo hago pero me cuesta un poco",                       value:"growing" },
      { label:"Prefiero resolverlo solo antes de pedir ayuda",        value:"pride"   },
      { label:"Casi nunca pido ayuda — me cuesta mucho",             value:"closed"  },
      { label:"No tengo a quién pedirle realmente",                   value:"alone"   },
    ]
  },
];

const SITUATION_QUESTIONS = [
  {
    id:"income_type",
    q:"¿Cómo describes tu situación de ingresos actualmente?",
    opts:[
      { label:"Empleado fijo",     desc:"Salario estable cada mes o quincena",                    value:"fixed"      },
      { label:"Empleado temporal", desc:"Por contratos o proyectos con ingresos variables",        value:"temp"       },
      { label:"Emprendedor",       desc:"Negocio propio o trabajo independiente",                  value:"entrepreneur"},
      { label:"Inversionista",     desc:"Mis ingresos vienen principalmente de inversiones",       value:"investor"   },
      { label:"Sin ingresos",      desc:"Estoy buscando trabajo o en transición",                  value:"none"       },
    ]
  },
  {
    id:"debt_range",
    q:"¿Cuál es tu situación actual de deudas?",
    opts:[
      { label:"No tengo deudas",          desc:"", value:"none"   },
      { label:"Menos de $1,000",          desc:"", value:"low"    },
      { label:"Entre $1,000 y $5,000",    desc:"", value:"mid"    },
      { label:"Entre $5,000 y $20,000",   desc:"", value:"high"   },
      { label:"Más de $20,000",           desc:"", value:"severe" },
    ]
  },
  {
    id:"savings",
    q:"¿Tienes algún ahorro activo en este momento?",
    opts:[
      { label:"No tengo ahorro",                    desc:"", value:"none"     },
      { label:"Algo, pero muy poco",                desc:"", value:"minimal"  },
      { label:"Sí, ahorro ocasionalmente",          desc:"", value:"occasional"},
      { label:"Sí, tengo un hábito activo de ahorro", desc:"", value:"active" },
    ]
  },
  {
    id:"community",
    q:"¿Tienes comunidad de fe activa en tu vida?",
    opts:[
      { label:"No tengo comunidad actualmente",      desc:"", value:"none"      },
      { label:"Tengo pero asisto poco",              desc:"", value:"minimal"   },
      { label:"Sí, participo ocasionalmente",        desc:"", value:"occasional"},
      { label:"Sí, estoy comprometido activamente",  desc:"", value:"active"    },
    ]
  },
  {
    id:"mentor",
    q:"¿Tienes mentores o personas de accountability en tu vida?",
    opts:[
      { label:"No tengo",                            desc:"", value:"none"     },
      { label:"Tengo pero de manera informal",       desc:"", value:"informal" },
      { label:"Sí, tengo mentoría activa",           desc:"", value:"active"   },
    ]
  },
  {
    id:"tithe",
    q:"¿Diezmas actualmente?",
    opts:[
      { label:"No diezmo",                desc:"", value:"none"         },
      { label:"Ocasionalmente",           desc:"", value:"occasional"   },
      { label:"Sí, consistentemente",     desc:"", value:"consistent"   },
    ]
  },
  {
    id:"bible_version",
    q:"¿Cuál versión de la Biblia prefieres?",
    opts:[
      { label:"RVR 1960", desc:"Reina Valera Revisada — clásica y tradicional",          value:"es-RVR1960" },
      { label:"NVI",      desc:"Nueva Versión Internacional — lenguaje contemporáneo",   value:"es-NVI"     },
      { label:"LBLA",     desc:"La Biblia de las Américas — traducción literal",         value:"es-LBLA"    },
      { label:"DHH",      desc:"Dios Habla Hoy — lenguaje sencillo y accesible",        value:"es-DHH"     },
    ]
  },
];

const GOAL_TIMEFRAMES = [
  { label:"3 meses",        value:"3m"      },
  { label:"6 meses",        value:"6m"      },
  { label:"1 año",          value:"1y"      },
  { label:"2 a 3 años",     value:"2-3y"    },
  { label:"Es un camino de vida", value:"life" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const todayKey   = () => new Date().toISOString().split("T")[0];
const fmt        = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long" });
const fmtShort   = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day:"numeric", month:"short" });
const getLast7   = () => Array.from({ length:7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6-i)); return d.toISOString().split("T")[0]; });
const getDayIdx  = () => Math.floor((new Date() - new Date("2024-01-01")) / 86400000);
const lsGet      = (key, fb) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const lsSet      = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// Detect level from onboarding answers
const detectLevel = (situation, mindset, goalText) => {
  let score = 0;
  if (situation.debt_range === "none")   score += 3;
  if (situation.debt_range === "low")    score += 2;
  if (situation.debt_range === "mid")    score += 1;
  if (situation.savings === "active")    score += 2;
  if (situation.savings === "occasional") score += 1;
  if (situation.income_type === "entrepreneur") score += 1;
  if (situation.income_type === "investor")     score += 2;
  if (situation.tithe === "consistent")  score += 2;
  if (situation.tithe === "occasional")  score += 1;
  if (situation.mentor === "active")     score += 2;
  if (situation.mentor === "informal")   score += 1;
  if (situation.community === "active")  score += 1;
  const mindsetScore = Object.values(mindset).filter(v => v === "growth" || v === "steward" || v === "purpose" || v === "legacy").length;
  score += mindsetScore;
  if (score >= 16) return 3;
  if (score >= 9)  return 2;
  return 1;
};

// Tithe message based on profile
const getTitheMessage = (profile, tithes) => {
  if (profile.situation?.income_type === "none") return { msg:"Cuando Dios te provea, honrarlo primero abre las puertas.", type:"prepare" };
  const recent = (tithes || []).filter(t => (new Date() - new Date(t.date)) / 86400000 <= 30);
  if (recent.length >= 2) return { msg:"Estás en pacto con Dios. Las ventanas del cielo están abiertas sobre ti.", type:"celebrate" };
  if (profile.situation?.income_type === "fixed")       return { msg:"Recuerda honrar a Dios con tus primicias. El diezmo activa tu pacto.", type:"remind" };
  if (profile.situation?.income_type === "entrepreneur") return { msg:"¿Has diezmado esta semana? Tu negocio prospera cuando Dios es el socio principal.", type:"remind" };
  return { msg:"Cada ingreso es una oportunidad de honrar a Dios primero.", type:"remind" };
};

// AI calls
const callClaude = async (body) => {
  try {
    const res = await fetch("/api/claude", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(body) });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch { return null; }
};

// CSS shortcuts
const css = {
  btn:     (bg, color, extra={}) => ({ width:"100%", padding:"16px", background:bg, border:"none", borderRadius:14, color, fontSize:15, fontFamily:D, fontWeight:700, cursor:"pointer", transition:"all 0.2s", ...extra }),
  btnOut:  (color, extra={})     => ({ padding:"12px 20px", background:"transparent", border:`1.5px solid ${C.stroke}`, borderRadius:12, color, fontSize:13, fontFamily:B, cursor:"pointer", ...extra }),
  card:    (extra={})            => ({ background:C.surface, borderRadius:18, border:`1px solid ${C.stroke}`, boxShadow:"0 2px 16px rgba(0,0,0,0.05)", ...extra }),
  label:   (color=C.inkFaint)    => ({ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color, display:"block", marginBottom:8 }),
};

// ── WELCOME SCREENS ───────────────────────────────────────────────────────────
function WelcomeScreen({ screen, onNext, onBack }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = [setTimeout(()=>setStep(1),80), setTimeout(()=>setStep(2),500), setTimeout(()=>setStep(3),900), setTimeout(()=>setStep(4),1300)];
    return () => t.forEach(clearTimeout);
  }, [screen]);

  const isFirst = screen === 0;

  return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", padding:"0 22px 32px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, ${C.primaryGlow} 0%, transparent 70%)`, pointerEvents:"none" }} />

      {/* Dots */}
      {step >= 1 && (
        <div className="reveal" style={{ paddingTop:52, display:"flex", justifyContent:"center", gap:6, marginBottom:36 }}>
          {[0,1].map(i => <div key={i} style={{ width: i === screen ? 22 : 8, height:8, borderRadius:4, background: i === screen ? C.primary : C.warm, transition:"all 0.3s" }} />)}
        </div>
      )}

      {isFirst ? (
        <>
          {step >= 1 && (
            <div className="reveal d1" style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.primary, marginBottom:10 }}>Prospera en Todo</div>
              <h1 style={{ fontSize:30, fontFamily:D, fontWeight:800, color:C.ink, lineHeight:1.2, marginBottom:14 }}>No eres pobre porque Dios quiere que lo seas.</h1>
              <p style={{ fontSize:15, fontFamily:B, color:C.inkMid, lineHeight:1.75 }}>
                La Biblia no llama a los creyentes a ser pobres. Los llama a ser mayordomos. Y un mayordomo necesita recursos para cumplir su mandato.
              </p>
            </div>
          )}
          {step >= 2 && (
            <div className="reveal d1" style={{ background:C.primaryLight, borderRadius:16, padding:"16px 18px", marginBottom:14, border:`1px solid ${C.primary}20` }}>
              <p style={{ fontSize:14, fontFamily:B, color:C.inkMid, lineHeight:1.75 }}>
                No puedes dar al necesitado si eres el necesitado. No puedes financiar visiones si no tienes excedente. <strong style={{ color:C.primary }}>La prosperidad no es orgullo — es herramienta.</strong>
              </p>
            </div>
          )}
          {step >= 3 && (
            <div className="reveal d2" style={{ background:C.surface, borderRadius:16, padding:"16px 18px", marginBottom:14, border:`1px solid ${C.stroke}`, borderLeft:`4px solid ${C.primary}` }}>
              <p style={{ fontSize:13, fontFamily:B, fontStyle:"italic", color:C.inkMid, lineHeight:1.75, marginBottom:6 }}>"Amado, deseo que seas prosperado en todo así como prospera tu alma, y que tengas buena salud."</p>
              <div style={{ fontSize:11, fontFamily:D, fontWeight:700, color:C.inkFaint }}>— 3 Juan 1:2</div>
            </div>
          )}
          {step >= 4 && (
            <div className="reveal d3" style={{ marginTop:"auto" }}>
              <p style={{ fontSize:12, fontFamily:B, color:C.inkFaint, textAlign:"center", marginBottom:16, lineHeight:1.6 }}>Esta app es un espejo. Te mostrará si lo que haces cada día es consistente con lo que dices querer.</p>
              <button onClick={onNext} style={{ ...css.btn(C.primary, "#FFF"), display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:`0 8px 24px ${C.primaryGlow}` }}>
                <span>Siguiente</span><span style={{ fontSize:20 }}>→</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {step >= 1 && (
            <div className="reveal d1" style={{ marginBottom:22 }}>
              <div style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.primary, marginBottom:10 }}>¿Cómo funciona?</div>
              <h2 style={{ fontSize:26, fontFamily:D, fontWeight:800, color:C.ink, lineHeight:1.2, marginBottom:6 }}>Cuatro herramientas, un propósito.</h2>
            </div>
          )}
          {step >= 2 && (
            <div className="reveal d1" style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {[
                { icon:"✦", name:"Check-in",  desc:"Tu rutina diaria. Una pregunta a la vez, conectada a tu meta. Escribe tu reflexión — ese es el corazón de todo." },
                { icon:"◈", name:"Progreso",  desc:"Ve cómo avanzas en 7 días. La IA interpreta tus números y te dice qué significan." },
                { icon:"◉", name:"Historial", desc:"El registro completo de tu camino. Cada día queda guardado con su conclusión." },
              ].map((t,i) => (
                <div key={i} style={{ ...css.card(), padding:"13px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:C.primary, flexShrink:0 }}>{t.icon}</div>
                  <div>
                    <div style={{ fontSize:13, fontFamily:D, fontWeight:700, color:C.ink, marginBottom:3 }}>{t.name}</div>
                    <div style={{ fontSize:12, fontFamily:B, color:C.inkMute, lineHeight:1.6 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {step >= 3 && (
            <div className="reveal d2" style={{ background:C.primaryLight, borderRadius:14, padding:"13px 16px", marginBottom:24, border:`1px solid ${C.primary}20` }}>
              <p style={{ fontSize:13, fontFamily:B, color:C.inkMid, lineHeight:1.7 }}>
                Tu meta principal guía todo. El check-in diario mide si estás siendo consistente con lo que dijiste querer.
              </p>
            </div>
          )}
          {step >= 4 && (
            <div className="reveal d3" style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={onNext} style={{ ...css.btn(C.primary, "#FFF"), display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:`0 8px 24px ${C.primaryGlow}` }}>
                <span>Comenzar mi perfil</span><span style={{ fontSize:20 }}>→</span>
              </button>
              <button onClick={onBack} style={{ ...css.btnOut(C.inkMute), textAlign:"center" }}>← Anterior</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── GOAL SCREEN ───────────────────────────────────────────────────────────────
function GoalScreen({ onNext, onBack }) {
  const [goal, setGoal]         = useState("");
  const [timeframe, setTimeframe] = useState("");
  const MIN = 150;
  const ready = goal.length >= MIN && timeframe;

  return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", padding:"0 22px 32px", overflow:"auto" }}>
      <div style={{ paddingTop:48, marginBottom:28 }}>
        <div className="reveal" style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.primary, marginBottom:8 }}>Tu punto de partida</div>
        <h2 className="reveal d1" style={{ fontSize:26, fontFamily:D, fontWeight:800, color:C.ink, lineHeight:1.2, marginBottom:14 }}>¿Cuál es tu meta?</h2>
        <div className="reveal d2" style={{ background:C.primaryLight, borderRadius:14, padding:"14px 16px", border:`1px solid ${C.primary}20` }}>
          <p style={{ fontSize:13, fontFamily:B, color:C.inkMid, lineHeight:1.75 }}>
            Una meta real no es solo un deseo — es una dirección con propósito. No importa si es grande o pequeña. Lo que importa es que sea honesta: ¿qué quieres que cambie en tu vida? ¿Para qué? ¿Qué diferencia haría lograrlo?
          </p>
        </div>
      </div>

      <div className="reveal d2" style={{ marginBottom:16 }}>
        <span style={css.label()}>Escribe tu meta</span>
        <textarea
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="Describe lo que quieres lograr. Puedes hablar de tu situación actual, por qué quieres cambiarla, qué significaría para ti y para los tuyos..."
          style={{ width:"100%", background:C.surface, border:`1.5px solid ${goal.length >= MIN ? C.primary : C.stroke}`, borderRadius:14, padding:"14px 16px", color:C.ink, fontSize:14, fontFamily:B, resize:"none", height:160, lineHeight:1.7, boxSizing:"border-box", transition:"border-color 0.3s", outline:"none" }}
        />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ fontSize:11, fontFamily:B, color: goal.length >= MIN ? C.primary : C.inkFaint }}>
            {goal.length >= MIN ? "✓ Suficiente para continuar" : `${MIN - goal.length} caracteres más`}
          </span>
          <span style={{ fontSize:11, fontFamily:D, fontWeight:600, color: goal.length >= MIN ? C.primary : C.inkFaint }}>{goal.length}/{MIN}</span>
        </div>
      </div>

      <div className="reveal d3" style={{ marginBottom:28 }}>
        <span style={css.label()}>¿En cuánto tiempo esperas lograrlo?</span>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {GOAL_TIMEFRAMES.map(t => {
            const sel = timeframe === t.value;
            return (
              <button key={t.value} onClick={() => setTimeframe(t.value)} style={{ padding:"12px 16px", background: sel ? C.primaryLight : C.surface, border:`1.5px solid ${sel ? C.primary : C.stroke}`, borderRadius:12, color: sel ? C.primary : C.inkMid, fontSize:13, fontFamily:D, fontWeight: sel ? 700 : 400, cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="reveal d4" style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <button onClick={() => onNext({ goal, timeframe })} disabled={!ready} style={{ ...css.btn(ready ? C.primary : C.warm, ready ? "#FFF" : C.inkFaint), opacity: ready ? 1 : 0.6, cursor: ready ? "pointer" : "not-allowed", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow: ready ? `0 8px 24px ${C.primaryGlow}` : "none" }}>
          <span>Continuar</span><span style={{ fontSize:20 }}>→</span>
        </button>
        <button onClick={onBack} style={{ ...css.btnOut(C.inkMute), textAlign:"center" }}>← Anterior</button>
      </div>
    </div>
  );
}

// ── MINDSET QUESTIONS ─────────────────────────────────────────────────────────
function MindsetScreen({ onNext, onBack }) {
  const [idx, setIdx]           = useState(0);
  const [answers, setAnswers]   = useState({});
  const current  = MINDSET_QUESTIONS[idx];
  const isLast   = idx === MINDSET_QUESTIONS.length - 1;
  const progress = Math.round(((idx) / MINDSET_QUESTIONS.length) * 100);

  const choose = (value) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (isLast) setTimeout(() => onNext(next), 250);
    else setTimeout(() => setIdx(i => i+1), 250);
  };

  return (
    <div key={idx} style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", padding:"0 22px 32px" }}>
      <div style={{ paddingTop:48, marginBottom:28 }}>
        <div className="reveal" style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.amber, marginBottom:8 }}>Tu relación con el dinero</div>
        <div style={{ height:5, background:C.warm, borderRadius:3, overflow:"hidden", marginBottom:8 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:C.amber, borderRadius:3, transition:"width 0.4s" }} />
        </div>
        <div style={{ fontSize:11, fontFamily:B, color:C.inkFaint, marginBottom:24 }}>{idx + 1} de {MINDSET_QUESTIONS.length}</div>
        <h3 className="reveal d1" style={{ fontSize:20, fontFamily:D, fontWeight:700, color:C.ink, lineHeight:1.45 }}>{current.q}</h3>
      </div>

      <div className="reveal d2" style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
        {current.opts.map(opt => {
          const sel = answers[current.id] === opt.value;
          return (
            <button key={opt.value} onClick={() => choose(opt.value)} style={{ padding:"14px 16px", background: sel ? C.amberLight : C.surface, border:`1.5px solid ${sel ? C.amber : C.stroke}`, borderRadius:12, color: sel ? C.amber : C.inkMid, fontSize:13, fontFamily: sel ? D : B, fontWeight: sel ? 700 : 400, cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
              {opt.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop:20, display:"flex", gap:10 }}>
        {idx > 0 && <button onClick={() => setIdx(i => i-1)} style={{ ...css.btnOut(C.inkMute), flex:1, textAlign:"center" }}>← Anterior</button>}
        {idx === 0 && <button onClick={onBack} style={{ ...css.btnOut(C.inkMute), flex:1, textAlign:"center" }}>← Atrás</button>}
      </div>
    </div>
  );
}

// ── SITUATION QUESTIONS ───────────────────────────────────────────────────────
function SituationScreen({ onNext, onBack }) {
  const [idx, setIdx]         = useState(0);
  const [answers, setAnswers] = useState({});
  const current  = SITUATION_QUESTIONS[idx];
  const isLast   = idx === SITUATION_QUESTIONS.length - 1;
  const progress = Math.round((idx / SITUATION_QUESTIONS.length) * 100);

  const choose = (value) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (isLast) setTimeout(() => onNext(next), 250);
    else setTimeout(() => setIdx(i => i+1), 250);
  };

  return (
    <div key={idx} style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", padding:"0 22px 32px" }}>
      <div style={{ paddingTop:48, marginBottom:28 }}>
        <div className="reveal" style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.primary, marginBottom:8 }}>Tu situación actual</div>
        <div style={{ height:5, background:C.warm, borderRadius:3, overflow:"hidden", marginBottom:8 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:C.primary, borderRadius:3, transition:"width 0.4s" }} />
        </div>
        <div style={{ fontSize:11, fontFamily:B, color:C.inkFaint, marginBottom:24 }}>{idx + 1} de {SITUATION_QUESTIONS.length}</div>
        <h3 className="reveal d1" style={{ fontSize:20, fontFamily:D, fontWeight:700, color:C.ink, lineHeight:1.45 }}>{current.q}</h3>
      </div>

      <div className="reveal d2" style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
        {current.opts.map(opt => {
          const sel = answers[current.id] === opt.value;
          return (
            <button key={opt.value} onClick={() => choose(opt.value)} style={{ padding:"13px 16px", background: sel ? C.primaryLight : C.surface, border:`1.5px solid ${sel ? C.primary : C.stroke}`, borderRadius:12, color: sel ? C.primary : C.inkMid, fontSize:13, fontFamily: sel ? D : B, fontWeight: sel ? 700 : 400, cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
              <div>{opt.label}</div>
              {opt.desc && <div style={{ fontSize:11, color: sel ? C.primaryMid : C.inkFaint, marginTop:2 }}>{opt.desc}</div>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop:20 }}>
        <button onClick={() => idx > 0 ? setIdx(i => i-1) : onBack()} style={{ ...css.btnOut(C.inkMute), width:"100%", textAlign:"center" }}>← Anterior</button>
      </div>
    </div>
  );
}

// ── RESULT SCREEN ─────────────────────────────────────────────────────────────
function ResultScreen({ profile, onStart }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = [setTimeout(()=>setStep(1),200), setTimeout(()=>setStep(2),800), setTimeout(()=>setStep(3),1400)];
    return () => t.forEach(clearTimeout);
  }, []);

  const level = profile.level;
  const lv    = C.levels[level];

  const levelMessages = {
    1: "Estás construyendo la base. Este es el paso más importante — sin fundamentos sólidos, nada más dura. Vamos a trabajar en la estabilidad primero.",
    2: "Tienes una base. Ahora el trabajo es hacer que esa base produzca crecimiento real y sostenible. Hay más por construir.",
    3: "Estás en un nivel avanzado. El siguiente desafío es pensar en legado — lo que construyes ahora durará más allá de ti.",
  };

  return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", padding:"0 22px 32px" }}>
      <div style={{ paddingTop:48, marginBottom:28 }}>
        {step >= 1 && (
          <div className="bounce" style={{ width:64, height:64, borderRadius:18, background:lv.bg, border:`2px solid ${lv.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:20 }}>{lv.symbol}</div>
        )}
        {step >= 1 && <div className="reveal" style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:lv.color, marginBottom:6 }}>Tu punto de partida</div>}
        {step >= 1 && <h2 className="reveal d1" style={{ fontSize:28, fontFamily:D, fontWeight:800, color:C.ink, lineHeight:1.2, marginBottom:16 }}>Nivel {level} — {lv.name}</h2>}
        {step >= 2 && (
          <div className="reveal d1" style={{ background:C.surface, borderRadius:16, padding:"16px 18px", marginBottom:14, border:`1px solid ${C.stroke}` }}>
            <p style={{ fontSize:14, fontFamily:B, color:C.inkMid, lineHeight:1.75 }}>{levelMessages[level]}</p>
          </div>
        )}
        {step >= 2 && (
          <div className="reveal d2" style={{ background:lv.bg, borderRadius:14, padding:"13px 16px", border:`1px solid ${lv.color}30`, marginBottom:14 }}>
            <div style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:lv.color, marginBottom:6 }}>Tu meta</div>
            <div style={{ fontSize:14, fontFamily:D, fontWeight:600, color:C.ink, lineHeight:1.4, marginBottom:6 }}>"{profile.goal?.goal?.substring(0,120)}..."</div>
            <div style={{ fontSize:11, fontFamily:B, color:lv.color }}>Tiempo estimado: {GOAL_TIMEFRAMES.find(t => t.value === profile.goal?.timeframe)?.label}</div>
          </div>
        )}
        {step >= 3 && (
          <div className="reveal d2" style={{ background:C.primaryLight, borderRadius:14, padding:"13px 16px", marginBottom:28, border:`1px solid ${C.primary}20` }}>
            <p style={{ fontSize:13, fontFamily:B, color:C.inkMid, lineHeight:1.7 }}>
              Tu check-in diario estará conectado a esta meta y a tu nivel actual. La IA irá analizando tu progreso y ajustando el camino.
            </p>
          </div>
        )}
      </div>
      {step >= 3 && (
        <div className="reveal d3" style={{ marginTop:"auto" }}>
          <button onClick={onStart} style={{ ...css.btn(C.primary, "#FFF"), display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:`0 8px 24px ${C.primaryGlow}` }}>
            <span>Comenzar mi camino</span><span style={{ fontSize:20 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── CHECK-IN ──────────────────────────────────────────────────────────────────
function CheckinTab({ checkins, setCheckins, profile, tithes, setTithes }) {
  const dayIdx = getDayIdx();
  const [idx, setIdx]               = useState(0);
  const [reflections, setReflections] = useState({});
  const [currentRefl, setCurrentRefl] = useState("");
  const [verseVisible, setVerseVisible] = useState(false);
  const [reflVisible, setReflVisible]   = useState(false);
  const [done, setDone]               = useState(false);
  const [showResult, setShowResult]   = useState(false);
  const [dayResult, setDayResult]     = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [showTithe, setShowTithe]     = useState(false);
  const cardKey = useRef(0);

  const principle    = PRINCIPLES[idx];
  const area         = principle ? C.areas[principle.areaKey] : null;
  const question     = principle ? principle.questions[dayIdx % principle.questions.length] : "";
  const verse        = principle ? VERSE_BANKS[principle.id]?.[dayIdx % (VERSE_BANKS[principle.id]?.length || 1)] : null;
  const td           = checkins[todayKey()] || {};
  const doneCount    = PRINCIPLE_IDS.filter(id => td[id]?.done !== undefined).length;
  const pct          = Math.round((doneCount / PRINCIPLES.length) * 100);
  const titheInfo    = getTitheMessage(profile, tithes);
  const tithesToday  = (tithes || []).filter(t => t.date === todayKey()).length > 0;

  useEffect(() => {
    setVerseVisible(false); setReflVisible(false);
    setCurrentRefl(reflections[principle?.id] || "");
    const t1 = setTimeout(() => setVerseVisible(true), 650);
    const t2 = setTimeout(() => setReflVisible(true), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [idx]);

  const setCheck = (id, val) => {
    setCheckins(p => ({ ...p, [todayKey()]: { ...p[todayKey()], [id]: { ...p[todayKey()]?.[id], done: val } } }));
  };

  const answer = (val) => {
    const saved = { ...reflections };
    if (currentRefl.trim()) saved[principle.id] = currentRefl;
    setReflections(saved);
    setCheck(principle.id, val);
    if (currentRefl.trim()) {
      setCheckins(p => ({ ...p, [todayKey()]: { ...p[todayKey()], [principle.id]: { ...p[todayKey()]?.[principle.id], done: val, reflection: currentRefl } } }));
    }
    setCurrentRefl(""); cardKey.current++;
    setTimeout(() => {
      if (idx < PRINCIPLES.length - 1) setIdx(i => i+1);
      else setDone(true);
    }, 280);
  };

  const handleVerResult = async () => {
    setResultLoading(true); setShowResult(true);
    const allReflections = Object.entries(reflections).map(([k,v]) => `${k}: ${v}`).join(" | ");
    const data = await callClaude({ type:"day_conclusion", reflections: allReflections, pct });
    setDayResult(data?.conclusion || {
      message: pct >= 80 ? "Día de excelencia. Esto es lo que produce prosperidad real." : pct >= 50 ? "Buen día. Estás siendo fiel en lo poco." : "Hoy fue difícil. Mañana es un día nuevo — las misericordias de Dios son nuevas cada mañana.",
      verse: pct >= 80 ? "Proverbios 22:29" : pct >= 50 ? "Lucas 16:10" : "Lamentaciones 3:22-23",
      verseText: pct >= 80 ? "¿Has visto hombre solícito en su trabajo? Delante de los reyes estará." : pct >= 50 ? "El que es fiel en lo muy poco, también en lo más es fiel." : "Las misericordias del Señor nunca terminan, nuevas son cada mañana.",
      level: pct >= 80 ? "excellent" : pct >= 50 ? "good" : "restart"
    });
    setResultLoading(false);
  };

  const resultColors = { excellent: C.primary, good: C.primaryMid, building: C.amber, restart: "#7A5800" };

  if (showResult) return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 22px" }}>
      {resultLoading ? (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:16, color:C.primary }}>✦</div>
          <div style={{ fontSize:14, fontFamily:B, color:C.inkMute }}>Analizando tu día...</div>
        </div>
      ) : dayResult ? (
        <>
          <div className="bounce" style={{ width:72, height:72, borderRadius:"50%", background: resultColors[dayResult.level] || C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"#FFF", marginBottom:22 }}>
            {dayResult.level === "excellent" ? "✦" : dayResult.level === "good" ? "◈" : "○"}
          </div>
          <div className="reveal d1" style={{ fontSize:36, fontFamily:D, fontWeight:800, color: resultColors[dayResult.level], marginBottom:4, textAlign:"center" }}>{pct}%</div>
          <div className="reveal d1" style={{ fontSize:13, fontFamily:B, color:C.inkMute, marginBottom:24 }}>{doneCount} de {PRINCIPLES.length} principios hoy</div>
          <div className="reveal d2" style={{ ...css.card(), padding:"18px 20px", marginBottom:24, borderLeft:`4px solid ${resultColors[dayResult.level]}`, borderRadius:"0 14px 14px 0", width:"100%" }}>
            <p style={{ fontSize:15, fontFamily:D, fontWeight:600, color:C.ink, lineHeight:1.65, marginBottom:12 }}>{dayResult.message}</p>
            <p style={{ fontSize:12, fontFamily:B, fontStyle:"italic", color:C.inkMute, lineHeight:1.6, marginBottom:4 }}>"{dayResult.verseText}"</p>
            <div style={{ fontSize:11, fontFamily:D, fontWeight:700, color:C.inkFaint }}>— {dayResult.verse}</div>
          </div>
          <button className="reveal d3" onClick={() => { setShowResult(false); setDone(false); setIdx(0); }} style={{ ...css.btn(C.primary, "#FFF"), boxShadow:`0 8px 24px ${C.primaryGlow}` }}>
            Volver al inicio →
          </button>
        </>
      ) : null}
    </div>
  );

  if (done) return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 22px" }}>
      <div className="bounce" style={{ width:72, height:72, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"#FFF", marginBottom:22 }}>✦</div>
      <div className="reveal d1" style={{ fontSize:28, fontFamily:D, fontWeight:800, color:C.ink, textAlign:"center", marginBottom:6, lineHeight:1.2 }}>Check-in<br />completado</div>
      <div className="reveal d2" style={{ fontSize:40, fontFamily:D, fontWeight:800, color:C.primary, marginBottom:4 }}>{pct}%</div>
      <div className="reveal d2" style={{ fontSize:13, fontFamily:B, color:C.inkMute, marginBottom:32 }}>{doneCount} de {PRINCIPLES.length} principios hoy</div>

      {/* Tithe card at the end */}
      {!tithesToday && (
        <div className="reveal d2" style={{ ...css.card(), padding:"16px 18px", marginBottom:16, width:"100%", borderLeft:`4px solid ${C.areas.spirit.c}`, borderRadius:"0 14px 14px 0" }}>
          <div style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.areas.spirit.c, marginBottom:6 }}>Diezmo</div>
          <p style={{ fontSize:13, fontFamily:B, color:C.inkMid, lineHeight:1.6, marginBottom:12 }}>{titheInfo.msg}</p>
          <button onClick={() => { setTithes(p => [...p, { date:todayKey() }]); }} style={{ ...css.btn(C.areas.spirit.bg, C.areas.spirit.c, { width:"auto", padding:"10px 18px", fontSize:12, boxShadow:"none", border:`1.5px solid ${C.areas.spirit.stroke}` }) }}>
            ✓ Reportar diezmo
          </button>
        </div>
      )}
      {tithesToday && (
        <div className="reveal d2" style={{ background:C.primaryLight, borderRadius:12, padding:"11px 16px", marginBottom:16, width:"100%", textAlign:"center" }}>
          <span style={{ fontSize:13, fontFamily:D, fontWeight:700, color:C.primary }}>✦ Diezmo registrado hoy</span>
        </div>
      )}

      <button className="reveal d3" onClick={handleVerResult} style={{ ...css.btn(C.primary, "#FFF"), marginBottom:10, boxShadow:`0 8px 24px ${C.primaryGlow}` }}>
        Ver cómo me fue hoy →
      </button>
      <button className="reveal d4" onClick={() => { setIdx(0); setDone(false); }} style={{ ...css.btnOut(C.inkMute), width:"100%", textAlign:"center" }}>
        Revisar respuestas
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column" }}>
      {/* Progress */}
      <div style={{ padding:"24px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontSize:11, fontFamily:D, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:C.primary }}>Check-in</div>
          <div style={{ fontSize:12, fontFamily:D, fontWeight:700, color:C.inkMute }}>{idx+1}/{PRINCIPLES.length}</div>
        </div>
        <div style={{ height:5, background:C.warm, borderRadius:3, overflow:"hidden", marginBottom:8 }}>
          <div style={{ height:"100%", width:`${((idx)/PRINCIPLES.length)*100}%`, background:`linear-gradient(90deg, ${C.primary}, ${C.primaryMid})`, borderRadius:3, transition:"width 0.4s ease" }} />
        </div>
        <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
          {PRINCIPLES.map((p,i) => (
            <div key={p.id} style={{ width: i === idx ? 20 : 6, height:6, borderRadius:3, background: td[p.id]?.done !== undefined ? C.primary : i === idx ? C.primaryMid : C.warm, transition:"all 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div key={`${principle.id}-${cardKey.current}`} style={{ flex:1, padding:"14px 16px 0", overflow:"auto", display:"flex", flexDirection:"column" }}>
        <div className="scale-in" style={{ ...css.card(), overflow:"hidden", flex:"0 0 auto" }}>
          <div style={{ height:4, background:area.c, opacity:0.7 }} />

          {/* 1 — Badge */}
          <div style={{ padding:"16px 20px 0", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:area.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:area.c }}>{principle.icon}</div>
            <div>
              <div style={{ fontSize:9, fontFamily:D, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:area.c }}>{principle.area}</div>
              <div style={{ fontSize:12, fontFamily:D, fontWeight:600, color:C.inkMid }}>{principle.name}</div>
            </div>
          </div>

          {/* 2 — Question or guided intro */}
          <div style={{ padding:"16px 20px 0" }}>
            <p style={{ fontSize:20, fontFamily:D, fontWeight:600, color:C.ink, lineHeight:1.5 }}>
              {principle.type === "guided" ? principle.guide.intro : question}
            </p>
          </div>

          {/* 3 — Verse auto-appears (+ guided focus for Oración) */}
          <div style={{ padding:"14px 20px 0" }}>
            {verseVisible && verse && (
              <div className="verse-in" style={{ background:area.bg, borderRadius:14, padding:"13px 16px", border:`1px solid ${area.stroke}`, borderLeft:`4px solid ${area.c}` }}>
                {principle.type === "guided" && principle.guide.focusBank && (
                  <>
                    <div style={{ fontSize:11, fontFamily:D, fontWeight:700, color:area.c, marginBottom:6, letterSpacing:"0.1em", textTransform:"uppercase" }}>Enfócate en esto hoy:</div>
                    <p style={{ fontSize:14, fontFamily:B, color:area.c, lineHeight:1.65, marginBottom:10, fontWeight:600 }}>
                      "{principle.guide.focusBank[getDayIdx() % principle.guide.focusBank.length]}"
                    </p>
                  </>
                )}
                <p style={{ fontSize:12, fontFamily:B, fontStyle:"italic", color:area.c, lineHeight:1.75, marginBottom:7 }}>"{verse.text}"</p>
                <div style={{ fontSize:10, fontFamily:D, fontWeight:700, color:area.c, opacity:0.65 }}>— {verse.ref}</div>
              </div>
            )}
          </div>

          {/* 4 — Reflection always visible */}
          <div style={{ padding:"12px 20px 0" }}>
            {reflVisible && (
              <div className="verse-in">
                <div style={css.label()}>Tu nota</div>
                <textarea
                  value={currentRefl}
                  onChange={e => setCurrentRefl(e.target.value)}
                  placeholder="¿Algo que quieras recordar de hoy?..."
                  style={{ width:"100%", background:C.bg, border:`1.5px solid ${C.stroke}`, borderRadius:12, padding:"12px 14px", color:C.ink, fontSize:13, fontFamily:B, resize:"none", height:78, lineHeight:1.65, boxSizing:"border-box", transition:"border-color 0.2s", outline:"none" }}
                  onFocus={e => e.target.style.borderColor = area.c}
                  onBlur={e => e.target.style.borderColor = C.stroke}
                />
              </div>
            )}
          </div>

          <div style={{ margin:"14px 20px 0", height:1, background:C.stroke }} />

          {/* 5 — Buttons: GUIDED vs THREE-WAY */}
          {principle.type === "guided" ? (
            <div style={{ padding:"14px 20px 20px" }}>
              <button onClick={() => answer(true)} style={{ ...css.btn(area.c, "#FFF"), boxShadow:`0 4px 14px ${area.glow}`, marginBottom:10 }}>
                {principle.guide.done}
              </button>
              <button onClick={() => answer("later")} style={{ ...css.btnOut(C.inkFaint), width:"100%", textAlign:"center", fontSize:12 }}>
                {principle.guide.later}
              </button>
            </div>
          ) : (
            <div style={{ padding:"14px 20px 20px", display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={() => answer(true)} style={{ ...css.btn(area.c, "#FFF"), boxShadow:`0 4px 14px ${area.glow}` }}>
                ✓ Sí, lo hice
              </button>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => answer("later")} style={{ flex:1, padding:"12px", background:C.primaryLight, border:`1.5px solid ${C.primary}30`, borderRadius:12, color:C.primary, fontSize:12, fontFamily:D, fontWeight:600, cursor:"pointer", minHeight:44 }}>
                  Lo haré hoy todavía
                </button>
                <button onClick={() => answer(false)} style={{ flex:1, padding:"12px", background:"transparent", border:`1.5px solid ${C.stroke}`, borderRadius:12, color:C.inkFaint, fontSize:12, fontFamily:D, cursor:"pointer", minHeight:44 }}>
                  Hoy no pudo ser
                </button>
              </div>
              {principle.nudge && (
                <div style={{ background:C.amberLight, borderRadius:10, padding:"9px 13px", border:`1px solid ${C.amber}20` }}>
                  <p style={{ fontSize:11, fontFamily:B, color:C.amber, lineHeight:1.6 }}>💡 {principle.nudge}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ height:20, flexShrink:0 }} />
      </div>
    </div>
  );
}

// ── PROGRESS TAB ──────────────────────────────────────────────────────────────
function ProgressTab({ checkins, profile }) {
  const last7    = getLast7();
  const weekData = last7.map(date => { const day = checkins[date] || {}; return { date, pct: Math.round((PRINCIPLE_IDS.filter(id => day[id]?.done === true).length / PRINCIPLES.length) * 100) }; });
  const areaGroups = ["spirit","finance","character","relation"];
  const areaNames  = { spirit:"Espiritual", finance:"Financiero", character:"Carácter", relation:"Relacional" };
  const areaPrinciples = {
    spirit:    PRINCIPLES.filter(p => p.areaKey === "spirit"),
    finance:   PRINCIPLES.filter(p => p.areaKey === "finance"),
    character: PRINCIPLES.filter(p => p.areaKey === "character"),
    relation:  PRINCIPLES.filter(p => p.areaKey === "relation"),
  };

  const areaStats = areaGroups.map(key => {
    const ids = areaPrinciples[key].map(p => p.id);
    let tot = 0, sum = 0;
    last7.forEach(date => { const day = checkins[date] || {}; ids.forEach(id => { if (day[id]?.done !== undefined) { tot++; if (day[id]?.done) sum++; } }); });
    return { key, pct: tot > 0 ? Math.round((sum/tot)*100) : 0 };
  });

  const totalDays  = Object.keys(checkins).length;
  const totalDone  = Object.values(checkins).reduce((a,d) => a + PRINCIPLE_IDS.filter(id => d[id]?.done === true).length, 0);
  const avgPct     = totalDays > 0 ? Math.round((totalDone / (totalDays * PRINCIPLES.length)) * 100) : 0;
  let streak = 0;
  const d = new Date();
  while (true) {
    const k = d.toISOString().split("T")[0];
    const day = checkins[k];
    if (!day || PRINCIPLE_IDS.filter(id => day[id] !== undefined).length < PRINCIPLES.length * 0.5) break;
    streak++; d.setDate(d.getDate()-1);
  }

  const lv     = C.levels[profile.level || 1];
  const goalTf = GOAL_TIMEFRAMES.find(t => t.value === profile.goal?.timeframe)?.label;

  return (
    <div style={{ minHeight:"100%", background:C.bg, padding:"24px 16px 16px" }}>

      {/* Goal strip */}
      {profile.goal?.goal && (
        <div className="reveal" style={{ background:C.surface, borderRadius:16, padding:"14px 16px", marginBottom:10, border:`1px solid ${C.stroke}`, borderTop:`3px solid ${lv.color}` }}>
          <div style={{ fontSize:9, fontFamily:D, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:lv.color, marginBottom:5 }}>Tu meta</div>
          <div style={{ fontSize:13, fontFamily:D, fontWeight:600, color:C.ink, lineHeight:1.4, marginBottom:5 }}>"{profile.goal.goal.substring(0,100)}..."</div>
          {goalTf && <div style={{ fontSize:11, fontFamily:B, color:C.inkFaint }}>Plazo estimado: {goalTf}</div>}
        </div>
      )}

      {/* Stats */}
      <div className="reveal d1" style={{ display:"flex", gap:10, marginBottom:10 }}>
        {[{ v:`${streak}`, l:"Racha" },{ v:`${avgPct}%`, l:"Promedio" }].map(({ v, l }) => (
          <div key={l} style={{ flex:1, ...css.card(), padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:32, fontFamily:D, fontWeight:800, color:C.primary, lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:9, fontFamily:D, fontWeight:600, color:C.inkMute, marginTop:5, textTransform:"uppercase", letterSpacing:"0.1em" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* 7-day chart */}
      <div className="reveal d2" style={{ ...css.card(), padding:"16px", marginBottom:10 }}>
        <div style={css.label()}>Últimos 7 días</div>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:100 }}>
          {weekData.map(({ date, pct: p }, i) => {
            const isT = date === todayKey();
            const bg  = p >= 80 ? C.primary : p >= 50 ? C.primaryMid : p > 0 ? C.warm : "#EDEAE4";
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:9, fontFamily:D, fontWeight:600, color:C.inkFaint }}>{p > 0 ? `${p}` : ""}</div>
                <div style={{ width:"100%", flex:1, display:"flex", alignItems:"flex-end" }}>
                  <div style={{ width:"100%", height:`${Math.max(p, p > 0 ? 10 : 0)}%`, background: isT ? `linear-gradient(180deg, ${C.primaryMid}, ${C.primary})` : bg, borderRadius:"7px 7px 0 0", outline: isT ? `2px solid ${C.primary}` : "none", outlineOffset:2, transition:"height 0.5s" }} />
                </div>
                <div style={{ fontSize:8, fontFamily:D, fontWeight:isT ? 700 : 400, color:isT ? C.primary : C.inkFaint }}>{fmtShort(date).split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Area stats */}
      <div className="reveal d3" style={{ ...css.card(), padding:"16px", marginBottom:10 }}>
        <div style={css.label()}>Por área — 7 días</div>
        {areaStats.map(({ key, pct: p }) => {
          const at = C.areas[key];
          return (
            <div key={key} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:13, fontFamily:B, color:C.inkMid }}>{areaNames[key]}</span>
                <span style={{ fontSize:13, fontFamily:D, fontWeight:700, color:at.c }}>{p}%</span>
              </div>
              <div style={{ height:5, background:C.warm, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${p}%`, background:at.c, borderRadius:3, transition:"width 0.6s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Level */}
      <div className="reveal d4" style={{ ...css.card(), padding:"16px", borderTop:`3px solid ${lv.color}`, borderRadius:"0 0 16px 16px" }}>
        <div style={{ fontSize:9, fontFamily:D, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:lv.color, marginBottom:6 }}>Nivel actual</div>
        <div style={{ fontSize:22, fontFamily:D, fontWeight:800, color:lv.color, marginBottom:4 }}>{lv.symbol} Nivel {profile.level} — {lv.name}</div>
        <div style={{ fontSize:12, fontFamily:B, color:C.inkMute }}>{totalDays} días registrados · {totalDone} principios cumplidos en total</div>
      </div>
    </div>
  );
}

// ── HISTORY TAB ───────────────────────────────────────────────────────────────
function HistoryTab({ checkins }) {
  const sorted = Object.keys(checkins).sort((a,b) => b.localeCompare(a)).slice(0,60);
  const resultColors = { excellent:C.primary, good:C.primaryMid, building:C.amber, restart:"#7A5800" };

  if (!sorted.length) return (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:"0 24px" }}>
      <div style={{ fontSize:32, color:C.warm }}>◈</div>
      <div style={{ fontSize:14, fontFamily:B, color:C.inkFaint, textAlign:"center" }}>Comienza tu check-in para ver el historial aquí</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100%", background:C.bg, padding:"24px 16px 16px" }}>
      {sorted.map(date => {
        const day  = checkins[date];
        const done = PRINCIPLE_IDS.filter(id => day[id]?.done === true).length;
        const p    = Math.round((done / PRINCIPLES.length) * 100);
        const isT  = date === todayKey();
        const conclusion = day.conclusion;
        return (
          <div key={date} style={{ ...css.card(), padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, fontFamily:D, fontWeight:600, color:C.ink }}>{fmt(date)}</span>
                {isT && <span style={{ fontSize:9, fontFamily:D, fontWeight:700, color:C.primary, background:C.primaryLight, padding:"2px 7px", borderRadius:10 }}>HOY</span>}
                {day.closed && <span style={{ fontSize:9, fontFamily:D, fontWeight:600, color:C.inkFaint }}>✓ Cerrado</span>}
              </div>
              <span style={{ fontSize:14, fontFamily:D, fontWeight:800, color: p >= 80 ? C.primary : p >= 50 ? C.primaryMid : C.inkFaint }}>{p}%</span>
            </div>
            <div style={{ height:4, background:C.warm, borderRadius:2, overflow:"hidden", marginBottom:7 }}>
              <div style={{ height:"100%", width:`${p}%`, background: p >= 80 ? C.primary : p >= 50 ? C.primaryMid : C.warm, borderRadius:2 }} />
            </div>
            <div style={{ fontSize:11, fontFamily:B, color:C.inkFaint, marginBottom: conclusion ? 8 : 0 }}>{done} de {PRINCIPLES.length} principios</div>
            {conclusion && (
              <div style={{ fontSize:12, fontFamily:B, fontStyle:"italic", color: resultColors[conclusion.level] || C.inkMute, lineHeight:1.5 }}>"{conclusion.message}"</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  // Onboarding flow
  const [obStage, setObStage]   = useState("loading"); // loading|welcome0|welcome1|goal|mindset|situation|result|app
  const [goalData, setGoalData] = useState(null);
  const [mindset, setMindset]   = useState(null);
  const [situation, setSituation] = useState(null);

  // App state
  const [tab, setTab]           = useState("checkin");
  const [checkins, setCheckins] = useState({});
  const [tithes, setTithes]     = useState([]);
  const [profile, setProfile]   = useState({});
  const [loaded, setLoaded]     = useState(false);

  // Load
  useEffect(() => {
    const ob = lsGet("v2_onboarded", false);
    setCheckins(lsGet("v2_checkins", {}));
    setTithes(lsGet("v2_tithes", []));
    setProfile(lsGet("v2_profile", {}));
    setLoaded(true);
    setObStage(ob ? "app" : "welcome0");
  }, []);

  // Persist checkins
  useEffect(() => { if (loaded) lsSet("v2_checkins", checkins); }, [checkins, loaded]);
  useEffect(() => { if (loaded) lsSet("v2_tithes", tithes); }, [tithes, loaded]);

  const finishOnboarding = (sit) => {
    const level = detectLevel(sit, mindset || {}, goalData?.goal || "");
    const newProfile = { level, goal: goalData, mindset, situation: sit, bibleVersion: sit.bible_version || "es-RVR1960" };
    setProfile(newProfile);
    lsSet("v2_profile", newProfile);
    lsSet("v2_onboarded", true);
    setObStage("result");
    setSituation(sit);
  };

  const TABS = [
    { id:"checkin",  icon:"✦", label:"Hoy"      },
    { id:"progress", icon:"◈", label:"Progreso" },
    { id:"history",  icon:"◉", label:"Historial"},
  ];

  const lv = C.levels[profile.level || 1];

  const renderStage = () => {
    switch(obStage) {
      case "loading":   return <div style={{ minHeight:"100%", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ fontSize:24, color:C.primary }}>✦</div></div>;
      case "welcome0":  return <WelcomeScreen screen={0} onNext={() => setObStage("welcome1")} onBack={() => {}} />;
      case "welcome1":  return <WelcomeScreen screen={1} onNext={() => setObStage("goal")} onBack={() => setObStage("welcome0")} />;
      case "goal":      return <GoalScreen onNext={(data) => { setGoalData(data); setObStage("mindset"); }} onBack={() => setObStage("welcome1")} />;
      case "mindset":   return <MindsetScreen onNext={(data) => { setMindset(data); setObStage("situation"); }} onBack={() => setObStage("goal")} />;
      case "situation": return <SituationScreen onNext={finishOnboarding} onBack={() => setObStage("mindset")} />;
      case "result":    return <ResultScreen profile={{ ...profile, level: profile.level || detectLevel(situation||{}, mindset||{}, ""), goal: goalData }} onStart={() => setObStage("app")} />;
      case "app":       return renderApp();
      default:          return null;
    }
  };

  const renderApp = () => (
    <div style={{ minHeight:"100%", background:C.bg, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.stroke}`, padding:"16px 20px 12px", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:10, fontFamily:D, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:C.primary, marginBottom:2 }}>Prospera en Todo</div>
            <div style={{ fontSize:13, fontFamily:B, color:C.inkFaint, fontStyle:"italic" }}>{fmt(todayKey())}</div>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", background:lv.bg, border:`1px solid ${lv.color}30`, borderRadius:20 }}>
            <span style={{ fontSize:11 }}>{lv.symbol}</span>
            <span style={{ fontSize:10, fontFamily:D, fontWeight:700, color:lv.color, letterSpacing:"0.1em", textTransform:"uppercase" }}>N{profile.level} · {lv.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:"auto" }}>
        {tab === "checkin"  && <CheckinTab  checkins={checkins} setCheckins={setCheckins} profile={profile} tithes={tithes} setTithes={setTithes} />}
        {tab === "progress" && <ProgressTab checkins={checkins} profile={profile} />}
        {tab === "history"  && <HistoryTab  checkins={checkins} />}
      </div>

      {/* Bottom nav */}
      <div style={{ background:C.surface, borderTop:`1px solid ${C.stroke}`, display:"flex", paddingBottom:8, flexShrink:0 }}>
        {TABS.map(({ id, icon, label }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:"12px 0 6px", background:"none", border:"none", borderTop:`2.5px solid ${active ? C.primary : "transparent"}`, color:active ? C.primary : C.inkFaint, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all 0.2s" }}>
              <span style={{ fontSize:15 }}>{icon}</span>
              <span style={{ fontSize:9, fontFamily:D, fontWeight:active ? 700 : 500, letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <GlobalStyles />
      {renderStage()}
    </div>
  );
}