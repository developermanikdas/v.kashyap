/**
 * Parse the raw source text of a scenario from the database
 * to extract its structured columns.
 */
export const parseScenarioText = (sc) => {
  if (!sc || !sc.source_text) return null;
  
  const text = sc.source_text;
  const result = {
    id: sc.id,
    number: sc.number,
    title: sc.title,
    risk_level: sc.risk_level,
    category_id: sc.category_id,
    parsed: {
      description: "",
      ocd_layer: "Differentiate between situational awareness and internal worry.",
      response: "Prioritize creating physical distance and seeking safe harbor.",
      say: "N/A",
      do_not: "Do not confront or escalate the situation.",
      escalation: "Move toward populated commercial establishments or alert security.",
      evidence: "N/A",
      report: "Notify local authorities or platform managers.",
      aftercare: "Take a few minutes to practice box breathing and ground your senses."
    }
  };

  const headings = [
    { key: 'OCD Layer:', name: 'ocd_layer' },
    { key: 'Response:', name: 'response' },
    { key: 'Say:', name: 'say' },
    { key: 'Do NOT:', name: 'do_not' },
    { key: 'Escalation:', name: 'escalation' },
    { key: 'Evidence:', name: 'evidence' },
    { key: 'Report:', name: 'report' },
    { key: 'Aftercare:', name: 'aftercare' }
  ];

  // Find index of all present headings
  const matches = [];
  headings.forEach(h => {
    const idx = text.indexOf(h.key);
    if (idx !== -1) {
      matches.push({ key: h.key, name: h.name, index: idx });
    }
  });

  // Sort matches by their appearance in the text
  matches.sort((a, b) => a.index - b.index);

  // Extract substrings for each section
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index + current.key.length;
    const end = next ? next.index : text.length;
    result.parsed[current.name] = text.substring(start, end).trim();
  }

  // Extract Description (text before the first heading and title)
  const firstMatchIndex = matches.length > 0 ? matches[0].index : text.length;
  let descriptionPart = text.substring(0, firstMatchIndex).trim();
  
  // Clean prefix like "1. Title: Concerning." from description
  const prefixRegex = /^\d+\.\s+[^:]+:\s*(🔴|🟡|🟠)?\s*[^.]+\./i;
  descriptionPart = descriptionPart.replace(prefixRegex, '').trim();
  if (descriptionPart.startsWith(':')) {
    descriptionPart = descriptionPart.substring(1).trim();
  }
  
  result.parsed.description = descriptionPart || "Observe the warning signs in your surroundings.";

  return result;
};
