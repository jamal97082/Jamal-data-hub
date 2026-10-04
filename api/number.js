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
    let cleanDataObject = {};
    
    if (data.data) {
      let d = data.data;
      let name = d.name || d.NAME || '';
      let address = d.address || d.ADDRESS || '';
      let father = d.fatherName || d.father_name || d.FATHER_NAME || '';

      // Address me se father name nikalne ka logic
      if (!father || father === 'N/A' || father === '') {
        const soMatch = address.match(/(?:S\/O|C\/O|W\/O)\s+([^,]+)/i);
        if (soMatch && soMatch[1]) {
          father = soMatch[1].trim();
        }
      }

      let alt = d.alt || d.ALT || '';
      let idDoc = d.aadhaar || d.ID || d.id || d.ADHAAR || '';
      let email = d.email || d.EMAIL || '';
      let circle = d.circle || d.CIRCLE || '';

      // Sirf wahi cheezein add hongi jinki value available hai
      let lines = [];
      cleanDataObject = {};

      if (name) {
        lines.push(`├── Name      : ${name}`);
        cleanDataObject["👤 Name"] = name;
      }
      if (father && father !== 'N/A') {
        lines.push(`├── Father    : ${father}`);
        cleanDataObject["👨‍👦 Father's Name"] = father;
      }
      
      lines.push(`├── Mobile    : ${number}`);
      cleanDataObject["📱 Mobile"] = number;

      if (alt && alt !== 'N/A') {
        lines.push(`├── Alt. Num  : ${alt}`);
        cleanDataObject["📞 Alt. Number"] = alt;
      }
      if (idDoc && idDoc !== 'N/A') {
        lines.push(`├── 🆔 ID/Doc : ${idDoc}`);
        cleanDataObject["🆔 ID / Document"] = idDoc;
      }
      if (email && email !== 'N/A') {
        lines.push(`├── Email     : ${email}`);
        cleanDataObject["📧 Email"] = email;
      }
      if (circle && circle !== 'N/A') {
        lines.push(`├── Circle    : ${circle}`);
        cleanDataObject["📡 Circle"] = circle;
      }
      if (address) {
        lines.push(`└── Address   : ${address}`);
        cleanDataObject["🏠 Address"] = address;
      }

      // Agar last line mein '├──' hai toh usko '└──' kar do formatting theek rakhne ke liye
      if (lines.length > 0) {
        let lastIdx = lines.length - 1;
        lines[lastIdx] = lines[lastIdx].replace('├──', '└──');
      }

      telegramStyleText = `👤 Record #1\n` + lines.join('\n');
    }

    return res.status(200).json({
      status: data.status || "success",
      developer: "Jamal",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester",
      bot_format: telegramStyleText,
      data: cleanDataObject
    });
    
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "upstream fetch failed",
      developer: "Jamal"
    });
  }
}
