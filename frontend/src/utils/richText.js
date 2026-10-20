const ALLOWED_TAGS = new Set([
  "A",
  "B",
  "BR",
  "DIV",
  "EM",
  "H1",
  "H2",
  "H3",
  "H4",
  "I",
  "LI",
  "OL",
  "P",
  "S",
  "SMALL",
  "SPAN",
  "STRONG",
  "U",
  "UL",
]);

const ALLOWED_STYLE_PROPERTIES = new Set([
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
]);

function isSafeUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return url.startsWith("/") || url.startsWith("#");
  }
}

function copyAllowedStyles(sourceEl, targetEl) {
  const style = sourceEl.getAttribute("style");
  if (!style) return;

  const styleMap = style
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const [rawName, ...rawValueParts] = entry.split(":");
      if (!rawName || rawValueParts.length === 0) return acc;
      const name = rawName.trim().toLowerCase();
      const value = rawValueParts.join(":").trim();
      if (ALLOWED_STYLE_PROPERTIES.has(name)) {
        acc[name] = value;
      }
      return acc;
    }, {});

  const serialized = Object.entries(styleMap)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");

  if (serialized) {
    targetEl.setAttribute("style", serialized);
  }
}

function sanitizeNode(node, doc) {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return doc.createTextNode("");
  }

  const tagName = node.tagName.toUpperCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    const fragment = doc.createDocumentFragment();
    node.childNodes.forEach((child) => {
      fragment.appendChild(sanitizeNode(child, doc));
    });
    return fragment;
  }

  const tag = tagName.toLowerCase();
  const cleanEl = doc.createElement(tag);

  if (tagName === "A") {
    const href = node.getAttribute("href") || "";
    if (isSafeUrl(href)) {
      cleanEl.setAttribute("href", href);
      cleanEl.setAttribute("target", "_blank");
      cleanEl.setAttribute("rel", "noreferrer noopener");
    }
  }

  if (
    tagName === "SPAN" ||
    tagName === "DIV" ||
    tagName === "P" ||
    tagName === "LI" ||
    tagName === "H1" ||
    tagName === "H2" ||
    tagName === "H3" ||
    tagName === "H4"
  ) {
    copyAllowedStyles(node, cleanEl);
  }

  node.childNodes.forEach((child) => {
    cleanEl.appendChild(sanitizeNode(child, doc));
  });

  return cleanEl;
}

export function sanitizeRichHtml(html) {
  if (!html) return "";

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const doc = document.implementation.createHTMLDocument("");
  const root = doc.createElement("div");

  parsed.body.firstElementChild?.childNodes.forEach((child) => {
    root.appendChild(sanitizeNode(child, doc));
  });

  return root.innerHTML;
}

export function isRichHtmlEmpty(html) {
  if (!html) return true;
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, "text/html");
  return (parsed.body.textContent || "").trim() === "";
}

export function getPlainTextFromRichHtml(html) {
  if (!html) return "";
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, "text/html");
  return (parsed.body.textContent || "").trim();
}

export function linkifyTextToHtml(text) {
  if (!text) return "";

  const urlPattern =
    /(\b(?:https?:\/\/|www\.)[^\s<]+[^\s<.,:;"')\]}]?)/gi;

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const withLinks = escapeHtml(text)
    .replace(urlPattern, (match) => {
      const href = match.startsWith("http") ? match : `https://${match}`;
      return `<a href="${href}" target="_blank" rel="noreferrer noopener">${match}</a>`;
    })
    .replace(/\n/g, "<br>");

  return withLinks;
}

export async function openExternalUrl(url) {
  if (!url) return false;

  if (window.electronAPI?.invoke) {
    try {
      await window.electronAPI.invoke("open-external-url", url);
      return true;
    } catch {
      // fall through to browser fallback
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

export function autoLinkifyRichHtml(html) {
  if (!html) return "";

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = parsed.body.firstElementChild;
  if (!root) return "";

  const urlPattern =
    /(\b(?:https?:\/\/|www\.)[^\s<]+[^\s<.,:;"')\]}]?)/gi;

  const textNodes = [];
  const walker = parsed.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    if (current.parentElement?.tagName !== "A") {
      textNodes.push(current);
    }
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const text = node.textContent || "";
    urlPattern.lastIndex = 0;
    if (!urlPattern.test(text)) return;

    const fragment = parsed.createDocumentFragment();
    let lastIndex = 0;
    urlPattern.lastIndex = 0;

    for (const match of text.matchAll(urlPattern)) {
      const url = match[0];
      const index = match.index || 0;

      if (index > lastIndex) {
        fragment.appendChild(
          parsed.createTextNode(text.slice(lastIndex, index))
        );
      }

      const anchor = parsed.createElement("a");
      const href = url.startsWith("http") ? url : `https://${url}`;
      anchor.setAttribute("href", href);
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noreferrer noopener");
      anchor.textContent = url;
      fragment.appendChild(anchor);

      lastIndex = index + url.length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(parsed.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode?.replaceChild(fragment, node);
  });

  return root.innerHTML;
}
