const winston = require("winston");
const path = require("path");
const { randomUUID } = require("crypto");

const logPath = path.join(__dirname, "../../logs");

const appLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logPath, "errors.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logPath, "app.log") })
  ]
});

function httpLogger(req, res, next) {
  const start = Date.now();
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  appLogger.info({ type: "request_in", requestId, method: req.method, url: req.originalUrl });

  res.on("finish", () => {
    const ms = Date.now() - start;
    appLogger.info({ type: "request_out", requestId, url: req.originalUrl, status: res.statusCode, timeMs: ms });
  });

  next();
}

module.exports = { appLogger, httpLogger };
