import { useEffect, useState } from "react";
import Converter from "../imageConversion/ImageConverter.js";

/**
 * Normalize common input shapes into a base64 string or null.
 * Accepts:
 *  - raw string (base64 or data URL)
 *  - object with keys: base64, imageBase64, base64String, data, dataUrl, data_url
 *  - Buffer / { buffer } / Uint8Array
 */
function normalizeBase64Input(input) {
  if (!input) return null;

  if (typeof input === "string") return input;

  if (typeof input === "object") {
    // Common property names returned by different APIs
    const candidates = [
      "base64",
      "imageBase64",
      "base64String",
      "data",
      "dataUrl",
      "data_url",
    ];
    for (const key of candidates) {
      if (typeof input[key] === "string" && input[key].trim()) {
        return input[key];
      }
    }

    // direct URL fields
    if (typeof input.url === "string" && input.url.trim()) return input.url.trim();
    if (typeof input.src === "string" && input.src.trim()) return input.src.trim();

    // Node Buffer or { buffer }
    try {
      if (typeof globalThis.Buffer !== "undefined" && globalThis.Buffer.isBuffer && globalThis.Buffer.isBuffer(input)) {
        return input.toString("base64");
      }
      if (input.buffer && typeof globalThis.Buffer !== "undefined" && globalThis.Buffer.isBuffer(input.buffer)) {
        return input.buffer.toString("base64");
      }
    } catch {
      // ignore
    }

    // Uint8Array / ArrayBuffer
    if (typeof Uint8Array !== "undefined" && input instanceof Uint8Array) {
      try {
        if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(input).toString("base64");
        let binary = "";
        for (let i = 0; i < input.length; i++) binary += String.fromCharCode(input[i]);
        if (typeof globalThis.btoa === "function") return globalThis.btoa(binary);
      } catch {
        // ignore
      }
    }
  }

  return null;
}

/**
 * Base64Image component
 * Props:
 *  - value: string|object (base64, data URL, object with imageBase64, or URL)
 *  - mime (optional) default 'image/png' (used when converting raw base64)
 *  - alt, className, style
 */
export default function Base64Image({ value, mime = "image/png", alt = "", className = "", style = {} }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let url;
    let mounted = true;
    setSrc(null);

    const normalized = normalizeBase64Input(value);
    if (!normalized) return undefined;

    // If normalized looks like an HTTP(S) URL or path, use it directly
    if (typeof normalized === "string" && (/^https?:\/\//i.test(normalized) || normalized.startsWith("/"))) {
      if (mounted) setSrc(normalized);
      return () => { mounted = false; };
    }

    // If normalized already a data URL, use directly
    if (typeof normalized === "string" && normalized.startsWith("data:")) {
      if (mounted) setSrc(normalized);
      return () => { mounted = false; };
    }

    // Otherwise assume raw base64 (or data URL without prefix) and try Blob creation
    try {
      const blob = Converter.base64ToBlob(normalized, mime);
      url = URL.createObjectURL(blob);
      if (mounted) setSrc(url);
    } catch {
      // Fallback to building a data URL (Converter.base64ToDataUrl will also normalize)
      try {
        const dataUrl = Converter.base64ToDataUrl(normalized, mime);
        if (mounted) setSrc(dataUrl);
      } catch {
        // give up — src stays null
      }
    }

    return () => {
      mounted = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [value, mime]);

  // If no image available, render a neutral placeholder box (keeps layout)
  if (!src) {
    return (
      <div
        className={className}
        style={{
          background: "#efefef",
          display: "block",
          width: "100%",
          height: "100%",
          minHeight: 192, // rough equivalent of h-48
          ...style,
        }}
        aria-hidden
      />
    );
  }

  return <img src={src} alt={alt} className={className} style={style} />;
}