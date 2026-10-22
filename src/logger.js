const fs = require("node:fs");
const path = require("node:path");

const logDirectory = process.env.LOG_DIR || path.join(process.cwd(), "logs");
fs.mkdirSync(logDirectory, { recursive: true });
const logFile = path.join(logDirectory, "application.log");

function log(level, message, fields = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields
  });

  process.stdout.write(`${entry}\n`);
  fs.appendFile(logFile, `${entry}\n`, (error) => {
    if (error) {
      process.stderr.write(`Unable to write application log: ${error.message}\n`);
    }
  });
}

module.exports = { log };
