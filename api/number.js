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
      developer: "jamalhacks",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }

  if (!key || !key.toLowerCase().startsWith('jamal')) {
    return res.status(401).json({
      status: "error",
      message: "invalid or missing key",
      developer: "jamalhacks",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }

  try {
    const upstream = await fetch(
      `https://numberinfo-api-adibhai.vercel.app/api/number?number=${encodeURIComponent(number)}`
    );
    const data = await upstream.json();

    let cleanDataObject = {};
    
    if (data.data) {
      let d = data.data;
      let name = d.name || d.NAME || '';
      let address = d.address || d.ADDRESS || '';
      let father = d.fatherName || d.father_name || d.FATHER_NAME || '';

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

      cleanDataObject = {};

      if (name) {
        cleanDataObject["👤 Name"] = name;
      }
      if (father && father !== 'N/A') {
        cleanDataObject["👨‍👦 Father's Name"] = father;
      }
      
      cleanDataObject["📱 Mobile"] = number;

      if (alt && alt !== 'N/A') {
        cleanDataObject["📞 Alt. Number"] = alt;
      }
      if (idDoc && idDoc !== 'N/A') {
        cleanDataObject["🆔 ID / Document"] = idDoc;
      }
      if (email && email !== 'N/A') {
        cleanDataObject["📧 Email"] = email;
      }
      if (circle && circle !== 'N/A') {
        cleanDataObject["📡 Circle"] = circle;
      }
      if (address) {
        cleanDataObject["🏠 Address"] = address;
      }
    }

    return res.status(200).json({
      status: data.status || "success",
      data: cleanDataObject,
      developer: "jamalhacks",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
    
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "upstream fetch failed",
      developer: "jamalhacks",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }
}
