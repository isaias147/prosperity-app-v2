export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type } = req.body;

  try {
    let prompt = "";

    if (type === "goal_plan") {
      const { goal, levelId, levelName, employmentType, hasDebts, hasSavings, narrative } = req.body;
      const empLabels  = ["empleado fijo", "empleado temporal", "emprendedor", "inversionista"];
      const debtLabels = ["deudas significativas", "reduciendo deudas", "sin deudas"];
      const savLabels  = ["sin ahorro", "ahorro ocasional", "ahorro constante"];
      prompt = `Eres un coach de prosperidad bíblica. El propósito de todos los usuarios es prosperar bíblicamente según 3 Juan 1:2.

Usuario — Nivel ${levelId} (${levelName}):
- Situación laboral: ${empLabels[employmentType] || "no especificado"}
- Deudas: ${debtLabels[hasDebts] || "no especificado"}
- Ahorro: ${savLabels[hasSavings] || "no especificado"}
- Narrativa personal: "${narrative || "no disponible"}"

Meta: "${goal}"

Instrucciones:
1. Si la meta no es directamente financiera, encuádrala dentro de la prosperidad bíblica integral.
2. Si el usuario no tiene empleo, la primera submeta debe ser conseguir estabilidad laboral.
3. Genera exactamente 5 submetas concretas y progresivas para llegar a esta meta.
4. Cada submeta debe ser un paso real y medible, no una actitud ni un sentimiento.
5. Las submetas deben conectarse con los principios bíblicos de la app: Espiritual, Financiero, Carácter, Relacional.

Responde SOLO con un array JSON de 5 strings. Sin explicaciones, sin markdown, solo el array JSON puro.`;

    } else if (type === "day_conclusion") {
      const { checkinData, reflections, pct } = req.body;
      prompt = `Eres un coach de prosperidad bíblica. Analiza el check-in del día de este usuario.

Porcentaje de principios cumplidos hoy: ${pct}%
Reflexiones escritas hoy: "${reflections || "ninguna"}"

Genera una conclusión personalizada del día que:
1. Sea honesta — no niegues lo que sucedió si fue un día difícil
2. Aplique gracia bíblica — nunca condenes, siempre restaura
3. Impulse hacia adelante — termine con esperanza concreta
4. Incluya un verso bíblico apropiado al nivel de cumplimiento
5. Sea corta — máximo 2 oraciones de mensaje + 1 verso

Responde SOLO con un objeto JSON con estos campos exactos:
{"message": "...", "verse": "Referencia bíblica", "verseText": "...", "level": "excellent|good|building|restart"}

Sin markdown, sin explicaciones adicionales. Solo el JSON puro.`;

    } else if (type === "goal_progress") {
      const { goalTitle, subgoals, recentReflections } = req.body;
      prompt = `Eres un coach de prosperidad bíblica. Analiza si el usuario está avanzando en su meta basándote en sus reflexiones recientes.

Meta: "${goalTitle}"
Submetas:
${subgoals.map((s, i) => `${i}: ${s}`).join("\n")}

Reflexiones recientes del check-in diario:
${recentReflections.join("\n")}

Para cada submeta, determina si está:
- "completed": hay evidencia clara de que se logró
- "in_progress": hay señales de avance aunque no completo
- "pending": no hay evidencia de avance aún

Responde SOLO con un array JSON donde cada elemento tiene: {"index": número, "subgoal": "texto", "status": "completed|in_progress|pending", "evidence": "frase corta de evidencia o vacío"}

Sin markdown, sin explicaciones. Solo el array JSON puro.`;

    } else if (type === "grace_plan") {
      const { reflection, graceType } = req.body;
      const graceLabels = { streak: "racha rota", discipline: "múltiples fallos del día", financial: "fallo financiero", shame: "vergüenza de volver" };
      prompt = `Eres un pastor coach de prosperidad bíblica que aplica gracia y verdad bíblica.

El usuario experimentó: ${graceLabels[graceType] || "un momento difícil"}.
Su reflexión: "${reflection}"

Crea un plan de restauración de 3 pasos para los próximos 3 días:
- Pequeño y completamente alcanzable
- Con gracia bíblica, sin condenación
- Específico y concreto
- Comienza con "Día 1:", "Día 2:", "Día 3:"

Responde SOLO con un array JSON de 3 strings. Sin markdown, solo el array JSON puro.`;

    } else {
      return res.status(400).json({ error: "Unknown type" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic error:", await response.json());
      return res.status(500).json({ error: "AI service error" });
    }

    const data  = await response.json();
    const text  = data.content?.[0]?.text || "[]";
    const clean = text.replace(/```json|```/g, "").trim();

    let result;
    try { result = JSON.parse(clean); } catch {
      if (type === "day_conclusion") result = { message: "Hoy es un paso más en tu camino. Mañana sigue adelante.", verse: "Lamentaciones 3:22-23", verseText: "Las misericordias del Señor nunca terminan, nuevas son cada mañana.", level: "building" };
      else if (type === "grace_plan") result = ["Día 1: Un solo check-in completo, sin presión", "Día 2: Enfócate en un principio que domines", "Día 3: Vuelve a tu rutina completa con gracia"];
      else if (type === "goal_progress") result = [];
      else result = ["Definir un primer paso concreto", "Identificar el principal obstáculo", "Buscar consejo de alguien que ya lo logró", "Aplicar un principio bíblico específico", "Medir el avance con un indicador concreto"];
    }

    const keyMap = { goal_plan: "questions", day_conclusion: "conclusion", goal_progress: "progress", grace_plan: "plan" };
    return res.status(200).json({ [keyMap[type]]: result });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}