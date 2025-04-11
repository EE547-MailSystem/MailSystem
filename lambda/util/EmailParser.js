const getHeader = (headers, name) => {
  return (
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ||
    ""
  );
};

const decodeBase64 = (data) => {
  // Gmail uses URL-safe base64
  const decoded = Buffer.from(data, "base64").toString("utf8");
  return decoded;
};

const getBody = (payload) => {
  // Try to get body from multipart or plain text
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  if (payload.parts) {
    // Try to find plain text part
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
    // fallback: use html if no plain text found
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
  }

  return "(no body)";
};

module.exports = {
  getHeader,
  getBody,
};
