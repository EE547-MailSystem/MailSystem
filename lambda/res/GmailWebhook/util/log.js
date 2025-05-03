function log(level, message, metadata = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
  };
  const output = JSON.stringify(logEntry);
  if (level === "error") {
    console.error(output);
  } else {
    console.log(output);
  }
}

module.exports = {
  info: (message, metadata) => log("info", message, metadata),
  warn: (message, metadata) => log("warn", message, metadata),
  error: (message, metadata) => log("error", message, metadata),
};
