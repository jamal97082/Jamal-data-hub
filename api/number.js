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

    if (data.data) {
      let d = data.data;
      let name = d.name || d.NAME || 'N/A';
      let father = d.fatherName || d.father_name || d.FATHER_NAME || '';
      let address = d.address || d.ADDRESS || 'N/A';

      // Agar upstream se father name nahi aaya, toh address me se 'S/O', 'C/O', ya 'W/O' nikal kar set kar do
      if (!father || father === 'N/A' || father === '') {
        const soMatch = address.match(/(?:S\/O|C\/O|W\/O)\s+([^,]+)/i);
        if (soMatch && soMatch[1]) {
          father = soMatch[1].trim();
        } else {
          father = 'N/A';
        }
      }

      // JSON aur Bot format dono ke liye clean data taiyar hai
      d.name = name;
      d.fatherName = father;
      d.address = address;

      let telegramStyleText = `👤 Record #1\n`;
      telegramStyleText += `├── Name      : ${name}\n`;
      telegramStyleText += `├── Father    : ${father}\n`;
      telegramStyleText += `├── Mobile    : ${number}\n`;
      telegramStyleText += `├── Alt. Num  : ${d.alt || d.ALT || 'N/A'}\n`;
      telegramStyleText += `├── 🆔 ID/Doc : ${d.aadhaar || d.ID || d.id || d.ADHAAR || 'N/A'}\n`;
      telegramStyleText += `├── Email     : ${d.email || d.EMAIL || 'N/A'}\n`;
      telegramStyleText += `├── Circle    : ${d.circle || d.CIRCLE || 'N/A'}\n`;
      telegramStyleText += `└── Address   : ${address}`;

      return res.status(200).json({
        status: data.status || "success",
        developer: "Jamal",
        contact: "+919708256311",
        telegram: "https://t.me/rginvester",
        bot_format: telegramStyleText,
        data: {
          "👤 Name": name,
          "👨‍👦 Father's Name": father,
          "📱 Mobile": number,
          "📞 Alt. Number": d.alt || 'N/A',
          "🆔 ID / Aadhaar": d.aadhaar || 'N/A',
          "📧 Email": d.email || 'N/A',
          "📡 Circle": d.circle || 'N/A',
          "🏠 Address": address
        }
      });
    }

    return res.status(404).json({
      status: "error",
      message: "No data found",
      developer: "Jamal"
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "upstream fetch failed",
      developer: "Jamal"
    });
  }
}
