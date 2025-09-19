const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { httpLogger } = require("./middleware/logger");
const { buildShortLink, goToOriginal, readLinkStats } = require("./controllers/linkController");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // allow all origins for simplicity
app.use(httpLogger);

// Routes
app.post("/shorturls", buildShortLink);
app.get("/shorturls/:code", readLinkStats);
app.get("/:code", goToOriginal);

// Health check
app.get("/ping", (req, res) => res.json({ ok: true }));

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
