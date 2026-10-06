export default async function handler(req, res) {
  // CORS Headers (Frontend se bina error connect karne ke liye)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Yahan req.query se dono chizein nikal rahe hain
  const key = req.query.key || req.query.slug || null;
  const number = req.query.number || null;

  // 1. Agar Key nahi di gayi
  if (!key) {
    return res.status(401).json({
      status: "error",
      message: "API Key is required",
      developer: "jamalhacks",
      contact: "+919708256311"
    });
  }

  // 2. Agar Number nahi diya gaya
  if (!number) {
    return res.status(400).json({
      status: "error",
      message: "Number parameter is required",
      developer: "jamalhacks",
      contact: "+919708256311"
    });
  }

  const keyLower = key.toLowerCase();

  // ==========================================
  // MASTER KEY & EXPIRY SYSTEM
  // ==========================================
  
  if (keyLower !== 'jamal') {
    // Agar Master Key nahi hai, toh check karo start mein 'jamal-' hai ya nahi
    if (!keyLower.startsWith('jamal-')) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Key Format. Access Denied.",
        developer: "jamalhacks"
      });
    }

    // Key ko check karo, e.g., jamal-D2-1730000000000
    const parts = keyLower.split('-');
    const expiryPart = parts[parts.length - 1]; // Timestamp nikal rahe hain

    if (expiryPart !== "permanent") {
      const expiryTime = parseInt(expiryPart, 10);
      
      if (isNaN(expiryTime)) {
        return res.status(401).json({
          status: "error",
          message: "Invalid Expiry Format inside Key.",
          developer: "jamalhacks"
        });
      }

      // Agar time expire ho chuka hai
      if (Date.now() > expiryTime) {
        return res.status(403).json({
          status: "error",
          message: "Key Expired! Please contact Admin to renew.",
          developer: "jamalhacks",
          contact: "+919708256311"
        });
      }
    }
  }

  // ==========================================
  // UPSTREAM DATA FETCHING
  // ==========================================
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
      let email = d.email || d.EMAIL || '';
      let circle = d.circle || d.CIRCLE || '';

      if (name) cleanDataObject["👤 Name"] = name;
      if (father && father !== 'N/A') cleanDataObject["👨‍👦 Father's Name"] = father;
      cleanDataObject["📱 Mobile"] = number;
      if (alt && alt !== 'N/A') cleanDataObject["📞 Alt. Number"] = alt;
      if (email && email !== 'N/A') cleanDataObject["📧 Email"] = email;
      if (circle && circle !== 'N/A') cleanDataObject["📡 Circle"] = circle;
      if (address) cleanDataObject["🏠 Address"] = address;
    }

    // Sirf clean data return hoga, bot_format hata diya gaya hai
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
      message: "Upstream API server failed or is down",
      developer: "jamalhacks"
    });
  }
}
