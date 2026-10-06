export default async function handler(req, res) {
  // CORS Headers (Frontend se connect hone ke liye)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { number } = req.query;
  const key = req.query.key || req.query.slug || null;

  if (!number) {
    return res.status(400).json({
      status: "error",
      message: "Number parameter is required",
      developer: "jamalhacks",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }

  if (!key) {
    return res.status(401).json({
      status: "error",
      message: "API Key is required",
      developer: "jamalhacks",
      contact: "+919708256311",
      telegram: "https://t.me/rginvester"
    });
  }

  const keyLower = key.toLowerCase();

  // ==========================================
  // 1. MASTER KEY & EXPIRY SYSTEM
  // ==========================================
  
  // Agar API key sirf 'jamal' hai, to bina kisi rok-tok ke allow karo (Master Key)
  if (keyLower !== 'jamal') {
    
    // Agar Master Key nahi hai, to format check karo (jamal- se start hona chahiye)
    if (!keyLower.startsWith('jamal-')) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Key Format. Access Denied.",
        developer: "jamalhacks"
      });
    }

    // Key format split karo (e.g., jamal-D2-1730000000000)
    const parts = keyLower.split('-');
    const expiryPart = parts[parts.length - 1]; // Last wala part pakdo (timestamp)

    if (expiryPart !== "permanent") {
      const expiryTime = parseInt(expiryPart, 10);
      
      // Agar time ki jagah kuch aur likha hai
      if (isNaN(expiryTime)) {
        return res.status(401).json({
          status: "error",
          message: "Invalid Expiry Format inside Key.",
          developer: "jamalhacks"
        });
      }

      // ⏳ EXPIRY CHECK: Agar aaj ka time key ke time se aage nikal gaya hai
      if (Date.now() > expiryTime) {
        return res.status(403).json({
          status: "error",
          message: "Key Expired! Please contact Admin to renew.",
          developer: "jamalhacks",
          contact: "+919708256311",
          telegram: "https://t.me/rginvester"
        });
      }
    }
  }

  // ==========================================
  // 2. DATA FETCHING SYSTEM
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

      // Agar father name nahi hai to address se nikalne ka try karo
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

    // Aapke terminal UI ke liye styling format
    let bot_format = "[+] TARGET DATA ACQUIRED [+]\n";
    bot_format += "----------------------------\n";
