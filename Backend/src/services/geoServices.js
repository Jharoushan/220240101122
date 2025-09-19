const axios = require("axios");

async function geoLookup(ip) {
  try {
    const url = `${process.env.GEO_API_URL || "http://ip-api.com/json/"}${ip}?fields=status,country`;
    const { data } = await axios.get(url, { timeout: 2500 });
    return data?.status === "success" ? data.country : null;
  } catch {
    return null;
  }
}

module.exports = { geoLookup };
