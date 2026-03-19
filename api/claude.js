export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type } = req.body;

  try {
    let prompt = "";

    if (type === "day_conclusion") {
      const { reflections, pct } = req.body;
      prompt = `Eres un coach de prosperidad bíblica. Analiza el día de este usuario.

Porcentaje de principios cumplidos hoy: ${pct}%
Reflexiones escritas hoy: "${reflections || "ninguna"}"

Genera una conclusión personalizada del día que:
1. Sea honesta — si fue difícil, reconócelo sin condenar
2. Aplique gracia bíblica — nunca condenes, siempre restaura
3. Impulse hacia adelante con esperanza concreta
4. Sea corta — máximo 2 oraciones

Responde SOLO con este JSON exacto:
{"message":"...","verse":"Referencia bíblica","verseText":"texto del verso","level":"excellent|good|building|restart"}

Sin markdown, sin texto adicional.`;

    } else if (type === "week_analysis") {
      const { weekData, areaStats, streak, avgPct } = req.body;
      const best = [...(areaStats||[])].sort((a,b) => b.pct - a.pct)[0];
      const weak = [...(areaStats||[])].sort((a,b) => a.pct - b.pct)[0];
      prompt = `Eres un coach de prosperidad bíblica. Analiza la semana en un párrafo corto.

Datos:
- Días activos: ${(weekData||[]).filter(d => d.pct > 0).length} de 7
- Promedio: ${avgPct}%
- Racha: ${streak} días
- Área más fuerte: ${best?.area} (${best?.pct}%)
- Área que necesita atención: ${weak?.area} (${weak?.pct}%)

Escribe UN párrafo de 3-4 oraciones máximo que explique qué significan estos números, identifique el patrón principal y termine con una frase de aliento bíblica. Solo el texto del párrafo, sin JSON ni markdown.`;

    } else if (type === "grace_plan") {
      const { reflection, graceType } = req.body;
      const labels = { streak:"racha rota", discipline:"múltiples fallos del día", financial:"fallo financiero", shame:"vergüenza de volver" };
      prompt = `Eres un pastor coach de prosperidad bíblica. El usuario experimentó: ${labels[graceType] || "un momento difícil"}.
Su reflexión: "${reflection}"

Crea un plan de restauración de 3 pasos para los próximos 3 días. Cada paso pequeño, alcanzable, con gracia bíblica, sin condenación. Comienza con "Día 1:", "Día 2:", "Día 3:".

Responde SOLO con un array JSON de 3 strings. Sin markdown.`;

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
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic error:", await response.text());
      return res.status(500).json({ error: "AI service error" });
    }

    const data  = await response.json();
    const text  = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();

    if (type === "week_analysis") return res.status(200).json({ analysis: clean });

    let result;
    try { result = JSON.parse(clean); } catch {
      if (type === "day_conclusion") result = { message:"Hoy es un paso más en tu camino. Mañana sigue adelante.", verse:"Lamentaciones 3:22-23", verseText:"Las misericordias del Señor nunca terminan, nuevas son cada mañana.", level:"building" };
      else result = ["Día 1: Un check-in completo, sin presión", "Día 2: Enfócate en un principio que domines", "Día 3: Vuelve a tu rutina con gracia"];
    }

    const keyMap = { day_conclusion:"conclusion", grace_plan:"plan" };
    return res.status(200).json({ [keyMap[type] || "result"]: result });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}