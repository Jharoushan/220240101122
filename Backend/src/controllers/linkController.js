const { createLink, findLinkByKey, incrementVisits, addVisit, getVisits } = require("../utils/memoryStore");
const { generateUniqueKey } = require("../utils/keyGen");
const validator = require("validator");
const { geoLookup } = require("../services/geoServices.js");
const { appLogger } = require("../middleware/logger");

const baseUrl = process.env.BASE_URL || "http://localhost:4000";

async function buildShortLink(req, res) {
  try {
    const { url, validity = 30, shortcode } = req.body;

    // ensure valid url
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ error: "bad url format" });
    }

    if (shortcode && !validator.isAlphanumeric(shortcode)) {
      return res.status(400).json({ error: "shortcode must be alphanumeric" });
    }

    
    let key = shortcode || await generateUniqueKey({ isTaken: async k => !!findLinkByKey(k) });

    const existing = findLinkByKey(key);
    if (existing) return res.status(409).json({ error: "key taken" });

    const expiresAt = new Date(Date.now() + Number(validity) * 60000);

    const link = createLink({ original: url, key, expiresAt });
    appLogger.info({ action: "shortlink:new", key, requestId: req.requestId });

    res.status(201).json({ shortLink: `${baseUrl}/${key}` , expiry: expiresAt.toISOString() });
  } catch (err) {
    appLogger.error({ error: err.message, requestId: req.requestId });
    res.status(500).json({ error: "server issue" });
  }
}

async function goToOriginal(req, res) {
  try {
    const { code } = req.params;
    const link = findLinkByKey(code);

    if (!link) return res.status(404).json({ error: "not found" });
    if (new Date() > link.expiresAt) return res.status(410).json({ error: "expired" });

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    const ref = req.get("Referer") || null;
    const agent = req.get("User-Agent") || null;
    const region = await geoLookup(ip);

    addVisit(link._id, {
      referer: ref,
      ip,
      agent,
      region,
      channel: ref ? "referral" : "direct"
    });

    incrementVisits(link);

    appLogger.info({ action: "shortlink:hit", key: code, requestId: req.requestId });
    res.redirect(link.original);
  } catch (err) {
    res.status(500).json({ error: "unexpected" });
  }
}

async function readLinkStats(req, res) {
  try {
    const { code } = req.params;
    const link = findLinkByKey(code);

    if (!link) return res.status(404).json({ error: "not found" });

    const visits = getVisits(link._id).slice(0, 500);

    res.json({
      originalUrl: link.original,
      createdAt: link.createdAt,
      expiry: link.expiresAt,
      totalClicks: link.visits,
      clicks: visits.map(v => ({
        timestamp: v.at,
        source: v.referer,
        region: v.region
      }))
    });
  } catch {
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { buildShortLink, goToOriginal, readLinkStats };
