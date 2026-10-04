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

    let formattedData = null;
    
    if (data.data) {
      let d = data.data;
      formattedData = {};
      
      // Pehle jaisa simple format aur icons/emojis ke sath
      formattedData["👤 Name"] = d.name || d.NAME || 'N/A';
      formattedData["👨‍👦 Father's Name"] = d.fatherName || d.father_name || d.FATHER_NAME || 'N/A';
      formattedData["📱 Mobile"] = number;
      formattedData["📞 Alt. Number"] = d.alt || d.ALT || 'N/A';
      formattedData["🆔 ID / Aadhaar"] = d.aadhaar || d.ID || d.id || d.ADHAAR || 'N/A';
      formattedData["📧 Email"] = d.email || d.EMAIL || 'N/A';
      formattedData["📡 Circle"] = d.circle || d.CIRCLE || 'N/A';
      formattedData["🏠 Address"] = d.address || d.ADDRESS || 'N/A';
    }

    return res.status(200).json({
      status: data.status || "success",
      number: data.number || number,
      data: formattedData || data.data || null,
      developer: "Jamal",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
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
