export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type } = req.body;

  try {
    let prompt = "";

    if (type === "goal_plan") {
      const { goal, levelId, levelName, employmentType, hasDebts, hasSavings } = req.body;
      const employmentLabels = ["empleado fijo", "empleado temporal", "emprendedor", "inversionista"];
      const debtLabels = ["deudas significativas", "reduciendo deudas", "sin deudas"];
      const savingsLabels = ["sin ahorro", "ahorro ocasional", "ahorro constante"];

      prompt = `Eres un coach de prosperidad bíblica. El propósito de todos los usuarios es prosperar bíblicamente según 3 Juan 1:2.

El usuario está en Nivel ${levelId} (${levelName}) y tiene la siguiente meta: "${goal}"

Contexto del usuario:
- Situación laboral: ${employmentLabels[employmentType] || "no especificado"}
- Deudas: ${debtLabels[hasDebts] || "no especificado"}
- Ahorro: ${savingsLabels[hasSavings] || "no especificado"}

Instrucciones:
1. Si la meta no parece directamente financiera (ej: salud, relaciones, fe), encuádrala dentro de la prosperidad bíblica integral.
2. Si el usuario no tiene empleo, su meta prioritaria debe ser conseguir estabilidad laboral.
3. Genera exactamente 8 preguntas de check-in diario específicas para esta meta.
4. Las preguntas deben: ser respondibles con Sí/No, conectadas directamente a la meta, reflejar hábitos concretos y medibles, estar ancladas en principios bíblicos.

Responde SOLO con un array JSON de 8 strings. Sin explicaciones, sin markdown, solo el array JSON puro.`;

    } else if (type === "grace_plan") {
      const { reflection, graceType } = req.body;
      const graceLabels = {
        streak: "racha rota por ausencia",
        discipline: "múltiples fallos en principios del día",
        financial: "fallo en área financiera",
        shame: "vergüenza de volver",
      };

      prompt = `Eres un pastor coach de prosperidad bíblica que aplica gracia y verdad bíblica. 
      
El usuario ha experimentado: ${graceLabels[graceType] || "un momento difícil"}.

Su reflexión fue: "${reflection}"

Crea un plan de restauración de exactamente 3 pasos para los próximos 3 días. Cada paso debe:
- Ser pequeño y completamente alcanzable
- Aplicar gracia bíblica — no condenación
- Ser específico y concreto
- Comenzar con "Día 1:", "Día 2:", "Día 3:"

Responde SOLO con un array JSON de 3 strings. Sin explicaciones, sin markdown, solo el array JSON puro.`;

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
      const errorData = await response.json();
      console.error("Anthropic API error:", errorData);
      return res.status(500).json({ error: "AI service error" });
    }

    const data  = await response.json();
    const text  = data.content?.[0]?.text || "[]";
    const clean = text.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      result = type === "grace_plan"
        ? ["Día 1: Un solo check-in completo, sin presión", "Día 2: Enfócate en un principio que domines", "Día 3: Vuelve a tu rutina completa con gracia"]
        : ["¿Dediqué tiempo concreto a esta meta hoy?", "¿Tomé al menos una acción medible?", "¿Oré específicamente por esta meta?", "¿Apliqué disciplina financiera?", "¿Evité decisiones que alejan esta meta?", "¿Busqué consejo o aprendí algo nuevo?", "¿Fui honesto en mis decisiones?", "¿Invertí en relaciones que apoyan esta meta?"];
    }

    const key = type === "grace_plan" ? "plan" : "questions";
    return res.status(200).json({ [key]: result });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}