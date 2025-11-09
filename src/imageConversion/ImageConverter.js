/**
 * ImageConverter utilities
 *
 * Exports functions to parse a base64 input (with or without data: prefix)
 * and convert it back to a usable binary form:
 * - base64ToDataUrl(base64, mime) => data:<mime>;base64,<data>
 * - base64ToBlob(base64, mime) => Blob (browser) OR Buffer (Node)
 * - saveBase64ToFile(base64, filePath, mime) => writes file on Node
 *
 * These helpers are intentionally small and defensive: they accept either
 * a raw base64 string or a data URL that already includes the prefix.
 */

function parseBase64(input) {
  if (!input) return { mime: null, base64: "" };

  // If object-like input, try common fields and binary shapes
  if (typeof input === "object") {
    if (typeof input.base64 === "string") return { mime: input.mime || null, base64: input.base64 };
    if (typeof input.imageBase64 === "string") return { mime: input.mime || null, base64: input.imageBase64 };
    if (typeof input.data === "string") return { mime: input.mime || null, base64: input.data };
    if (typeof input.dataUrl === "string") {
      const s = input.dataUrl;
      const match = s.match(/^data:([^;]+);base64,(.+)$/);
      return match ? { mime: match[1], base64: match[2] } : { mime: null, base64: s };
    }

    // Node Buffer or Buffer-like fields
    try {
      if (typeof globalThis.Buffer !== "undefined" && globalThis.Buffer.isBuffer && globalThis.Buffer.isBuffer(input)) {
        return { mime: null, base64: input.toString("base64") };
      }
      if (input.buffer && typeof globalThis.Buffer !== "undefined" && globalThis.Buffer.isBuffer(input.buffer)) {
        return { mime: input.mime || null, base64: input.buffer.toString("base64") };
      }
    } catch {
      // fallthrough
    }

    // Uint8Array / ArrayBuffer
    if (typeof Uint8Array !== "undefined" && input instanceof Uint8Array) {
      try {
        if (typeof globalThis.Buffer !== "undefined") {
          return { mime: null, base64: globalThis.Buffer.from(input).toString("base64") };
        }
        let binary = "";
        for (let i = 0; i < input.length; i++) binary += String.fromCharCode(input[i]);
        if (typeof globalThis.btoa === "function") return { mime: null, base64: globalThis.btoa(binary) };
      } catch {
        // ignore
      }
    }

    // Unknown object shape -> treat as empty (safe)
    return { mime: null, base64: "" };
  }

  // Ensure we have a string before calling .match
  if (typeof input !== "string") {
    try {
      input = String(input);
    } catch {
      return { mime: null, base64: "" };
    }
  }

  // If input already contains the data URL prefix, extract mime and payload
  const match = input.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mime: match[1], base64: match[2] };
  }
  // Otherwise assume input is raw base64 without prefix
  return { mime: null, base64: input };
}

/**
 * Ensure we return a proper data URL string. If the input is already a data URL
 * it will be returned unchanged (except when a mime param is provided which
 * will be used only when the input lacks a mime).
 */
export function base64ToDataUrl(base64OrDataUrl, mime = 'image/jpeg') {
  const { mime: parsedMime, base64 } = parseBase64(base64OrDataUrl);
  const mimeType = parsedMime || mime;
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Extract the raw base64 payload from a data URL (or return the input if
 * it's already raw base64). Useful when clients send a full data URL and
 * you only want the base64 portion to store or forward to an API.
 */
export function dataUrlToBase64(dataUrlOrBase64) {
  const { base64 } = parseBase64(dataUrlOrBase64);
  return base64;
}

/** Return the mime type embedded in a data URL, or null if not present */
export function dataUrlToMime(dataUrlOrBase64) {
  const { mime } = parseBase64(dataUrlOrBase64);
  return mime;
}

/**
 * Convert base64 (or data URL) into a browser Blob or Node Buffer.
 * - In a browser environment this returns a Blob (type set to mime).
 * - In Node.js this returns a Buffer containing the binary data.
 */
export function base64ToBlob(base64OrDataUrl, mime = 'image/jpeg') {
  const { mime: parsedMime, base64 } = parseBase64(base64OrDataUrl);
  const mimeType = parsedMime || mime;

  // Browser environment: use atob + Uint8Array + Blob
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    const byteString = atob(base64);
    const byteLen = byteString.length;
    const byteArray = new Uint8Array(byteLen);
    for (let i = 0; i < byteLen; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
  }

  // Node.js environment: return Buffer (use global Buffer if available)
  if (typeof globalThis.Buffer !== 'undefined') {
    return globalThis.Buffer.from(base64, 'base64');
  }

  // If neither available, throw a helpful error
  throw new Error('base64ToBlob: running in an unsupported environment (no atob and no Buffer)');
}

/**
 * Node-only helper: save base64 content to a file. The function will accept a
 * data URL or raw base64. If running in a non-Node environment this will throw.
 *
 * Example:
 *   await saveBase64ToFile(dataUrlOrBase64, './public/uploads/1.jpg');
 */
export async function saveBase64ToFile(base64OrDataUrl, filePath, mimeFallback = 'image/jpeg') {
  const { mime: parsedMime, base64 } = parseBase64(base64OrDataUrl);
  // Ensure Node environment
  if (typeof window !== 'undefined') {
    throw new Error('saveBase64ToFile can only be used in a Node environment');
  }

  // Use dynamic import for fs/path in Node to avoid bundlers pulling them into browser builds
  const fsModule = await import('fs');
  const pathModule = await import('path');

  const fs = fsModule.default || fsModule;
  const path = pathModule.default || pathModule;

  const buffer = (typeof globalThis.Buffer !== 'undefined') ? globalThis.Buffer.from(base64, 'base64') : null;
  if (!buffer) throw new Error('saveBase64ToFile: Buffer not available in this environment');

  // Ensure destination directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await fs.promises.writeFile(filePath, buffer);
  return { filePath, mime: parsedMime || mimeFallback, size: buffer.length };
}

// Default export is a convenience object
export default {
  parseBase64,
  base64ToDataUrl,
  base64ToBlob,
  saveBase64ToFile,
};

