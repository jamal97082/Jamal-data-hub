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

  if (!key || key.toLowerCase() !== 'jamal') {
    return res.status(401).json({
      status: "error",
      message: "invalid key",
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
      telegramStyleText = `👤 Record #1\n`;
      telegramStyleText += `├── Name      : ${data.data.name || 'N/A'}\n`;
      telegramStyleText += `├── Father    : ${data.data.fatherName || data.data.father_name || 'N/A'}\n`;
      telegramStyleText += `├── Mobile    : ${number}\n`;
      telegramStyleText += `├── Alt. Num  : ${data.data.alt || 'N/A'}\n`;
      telegramStyleText += `├── 🆔 Aadhaar: ${data.data.aadhaar || 'N/A'}\n`;
      telegramStyleText += `├── Email     : ${data.data.email || 'N/A'}\n`;
      telegramStyleText += `├── Circle    : ${data.data.circle || 'N/A'}\n`;
      telegramStyleText += `└── Address   : ${data.data.address || 'N/A'}`;
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
