export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const { number } = req.query;
  const key = req.query.key || req.query.slug || null;

  if (!number) {
    return res.status(400).json({
      status: "error",
      message: "number parameter required",
      developer: "Jamal",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }

  if (!key || !key.toLowerCase().startsWith('jamal')) {
    return res.status(401).json({
      status: "error",
      message: "invalid or missing key",
      developer: "Jamal",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }

  try {
    const upstream = await fetch(
      `https://numberinfo-api-adibhai.vercel.app/api/number?number=${encodeURIComponent(number)}`
    );
    const data = await upstream.json();

    let telegramStyleText = "No data found";
    
    if (data.data) {
      let d = data.data;
      telegramStyleText = `👤 Record #1\n`;
      telegramStyleText += `├── Name      : ${d.name || d.NAME || 'N/A'}\n`;
      telegramStyleText += `├── Father    : ${d.fatherName || d.father_name || d.FATHER_NAME || 'N/A'}\n`;
      telegramStyleText += `├── Mobile    : ${number}\n`;
      telegramStyleText += `├── Alt. Num  : ${d.alt || d.ALT || 'N/A'}\n`;
      telegramStyleText += `├── 🆔 ID/Doc : ${d.aadhaar || d.ID || d.id || d.ADHAAR || 'N/A'}\n`;
      telegramStyleText += `├── Email     : ${d.email || d.EMAIL || 'N/A'}\n`;
      telegramStyleText += `├── Circle    : ${d.circle || d.CIRCLE || 'N/A'}\n`;
      telegramStyleText += `└── Address   : ${d.address || d.ADDRESS || 'N/A'}`;

      // Agar upstream se koi bhi aur extra fields aate hain, toh unhe bhi automatically jod do
      for (const k in d) {
        if (!["name", "NAME", "fatherName", "father_name", "FATHER_NAME", "alt", "ALT", "aadhaar", "ID", "id", "ADHAAR", "email", "EMAIL", "circle", "CIRCLE", "address", "ADDRESS"].includes(k)) {
          telegramStyleText += `\n├── ${k} : ${d[k]}`;
        }
      }
    }

    return res.status(200).json({
      status: data.status || "success",
      developer: "Jamal",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester",
      bot_format: telegramStyleText,
      raw_data: data.data || null
    });
    
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "upstream fetch failed",
      developer: "Jamal",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }
}
