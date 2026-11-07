import * as Store from "./store.js";
import { sfx } from "./sound.js";
import { spoken, numberToWords } from "./speech.js";
import { speak, stop as stopSpeak, browserVoices } from "./tts.js";
import { confetti, clearFx } from "./fx.js";
import { keepDockVisible } from "./dock.js";
import { starsHtml, viewGrownups, installClickSounds } from "./ui.js";

Store.init("doubles:v1", {});

export { sfx, spoken, numberToWords, speak, stopSpeak, browserVoices, confetti, clearFx };
export * from "../doubles.js";
export * from "../sense.js";

/** Lightweight DOM element builder used across Doubles views. */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  if (attrs && typeof attrs === "object") {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = String(v);
      else if (k === "html") node.innerHTML = String(v);
      else if (k === "style") node.setAttribute("style", String(v));
      else if (k.startsWith("on") && typeof v === "function") {
        node[k.toLowerCase()] = v;
      } else if (k in node && k !== "list" && k !== "form") {
        try {
          node[k] = v;
        } catch {
          node.setAttribute(k, String(v));
        }
      } else {
        node.setAttribute(k, String(v));
      }
    }
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const child of kids) {
    if (child === null || child === undefined || child === false) continue;
    if (typeof child === "string" || typeof child === "number") {
      node.appendChild(document.createTextNode(String(child)));
    } else {
      node.appendChild(child);
    }
  }
  return node;
}

/** Unified store facade (`S`) supporting both function calls and `.progress.stars` / `.progress.stickers`. */
const stageStickersMap = {};
export const S = {
  seenQuestions: (id) => Store.seenQuestions(id),
  rememberQuestions: (id, keys, maxKeep = 15) => Store.rememberQuestions(id, keys, maxKeep),
  recordStage: (id, stars, sticker) => {
    stageStickersMap[id] = sticker;
    Store.finishLevel(id, stars, sticker);
  },
  get progress() {
    let raw = {};
    try {
      raw = JSON.parse(localStorage.getItem("doubles:v1") ?? "null") || {};
    } catch {
      raw = {};
    }
    const levels = raw.levels || {};
    const stars = {};
    for (const [k, v] of Object.entries(levels)) {
      stars[k] = v?.stars || 0;
    }
    const stickers = { ...stageStickersMap };
    if (Array.isArray(raw.stickers)) {
      raw.stickers.forEach((st, idx) => {
        const emo = typeof st === "object" ? st.emoji : st;
        if (emo) stickers[`s_${idx}`] = emo;
      });
    }
    return { stars, stickers };
  },
};

export function burst() {
  confetti(45);
}

export function starsBar(n = 0) {
  const wrap = document.createElement("span");
  wrap.innerHTML = starsHtml(Math.max(0, Math.min(3, Number(n) || 0)));
  return wrap.firstElementChild || wrap;
}

export function finishCard({
  title,
  stars = 3,
  sticker = "🌟",
  perfect = true,
  subtitle = "",
  spokenOverride = null,
  onReplay,
  onNext,
}) {
  confetti(perfect ? 90 : 35);
  const sec = el("section", { class: "finish card", style: "text-align:center;padding:24px" });
  const starsEl = el("div", { class: "big-stars", html: starsHtml(stars) });
  const h1 = el("h1", { text: title });
  const stickerEl = el("p", {
    class: `new-sticker ${perfect ? "big-sticker" : "mini-sticker"}`,
    html: `<span>${sticker}</span><br>${perfect ? "🌟 Giant Perfect Sticker!" : "⭐ Mini Sticker Earned!"}`,
  });
  const subEl = el("p", { class: "muted", text: subtitle });
  const actions = el("div", {
    class: "row center",
    style: "display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px",
  }, [
    el("button", {
      class: `btn big ${perfect ? "" : "primary pulse"}`,
      text: perfect ? "🔁 Play Again" : "🔁 Try Again for Perfect!",
      onclick: () => {
        sfx.go();
        if (onReplay) onReplay();
      },
    }),
    el("button", {
      class: `btn big ${perfect ? "primary" : ""}`,
      text: "🏠 Home",
      onclick: () => {
        sfx.pop();
        if (onNext) onNext();
      },
    }),
  ]);
  sec.append(starsEl, h1, stickerEl, subEl, actions);

  const voiceMsg =
    spokenOverride ||
    (perfect
      ? "Amazing job! You got a perfect score and earned a giant sticker!"
      : "Good practice! You got a mini sticker. Try the lesson again to get a perfect score and win the giant sticker!");
  speak(voiceMsg);
  return sec;
}

export function renderGrownups(mount, onBack, { title = "", subtitle = "" } = {}) {
  mount.innerHTML = "";
  const backRow = el("div", { class: "topbar", style: "margin-bottom:12px" }, [
    el("button", {
      class: "btn small pill",
      text: "← Home",
      onclick: () => {
        stopSpeak();
        if (onBack) onBack();
      },
    }),
    el("div", { class: "grow" }, [
      el("h2", { style: "margin:0", text: title || "For Grown-ups" }),
      subtitle ? el("div", { class: "muted small", text: subtitle }) : null,
    ]),
  ]);
  const contentDiv = el("div");
  mount.append(backRow, contentDiv);
  viewGrownups(contentDiv, {
    about: `
      <p><b>Doubles!</b> teaches foundational Montessori doubles, halves, equal groups, arrays, multiplication, and fair-share division for Grades 1, 2, and 3:</p>
      <ul>
        <li><b>Grade 1 (Doubles & Halves):</b> Mirror doubles (1+1 to 10+10), fair-share halves into 2 equal baskets, near doubles (double + 1), missing twin doubles, and big doubles (tens & ones).</li>
        <li><b>Grade 2 (Groups, Arrays & Doubling Chains):</b> Equal groups, skip-counting stepping stones, rows × columns bead arrays, Double & Double-Again (×2 and ×4), and Golden Ten-Bars (×10 and half-of-10 = ×5).</li>
        <li><b>Grade 3 (Division & Fact Families):</b> Fair-share division onto plates, grouping division into boxes, Fact Family Triangles connecting × and ÷, and missing factor mysteries.</li>
      </ul>
    `,
  });
}

// Dock manager
let dockContainer = null;
export function initDock(node) {
  dockContainer = node;
  if (typeof window !== "undefined") {
    keepDockVisible();
  }
}

export function setDock(items = []) {
  if (!dockContainer) {
    dockContainer = document.getElementById("dock");
  }
  if (!dockContainer) return;
  dockContainer.innerHTML = "";
  if (!items || !items.length) {
    dockContainer.style.display = "none";
    return;
  }
  dockContainer.style.display = "flex";
  items.forEach((item) => {
    const btn = el("button", {
      class: `btn pill ${item.primary ? "primary" : ""} ${item.pulse ? "pulse" : ""}`.trim(),
      html: `${item.icon ? `<span>${item.icon}</span> ` : ""}<span>${item.label || ""}</span>`,
      onclick: () => {
        if (item.onClick) item.onClick();
      },
    });
    dockContainer.append(btn);
  });
}

// Declarative pattern router (`route("/play/:id", ({ id }) => ...)` + `startRouter()`)
const registeredRoutes = [];
export function route(pattern, handler) {
  const paramNames = [];
  const regexStr =
    "^" +
    pattern
      .replace(/^\/+/, "")
      .replace(/:([\w]+)/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      }) +
    "$";
  registeredRoutes.push({
    re: new RegExp(regexStr),
    paramNames,
    handler,
  });
}

export function startRouter() {
  if (typeof window !== "undefined") {
    installClickSounds();
  }
  const dispatch = () => {
    stopSpeak();
    clearFx();
    if (typeof document !== "undefined") {
      document.body.classList.remove("in-game");
    }
    const rawHash = (typeof location !== "undefined" ? location.hash : "") || "#/";
    const cleanPath = rawHash.replace(/^#\/?/, "");
    const navKey = cleanPath.split("/")[0] || "home";
    if (typeof document !== "undefined") {
      document
        .querySelectorAll("[data-nav]")
        .forEach((a) => a.classList.toggle("active", a.dataset.nav === navKey));
    }
    for (const r of registeredRoutes) {
      const m = cleanPath.match(r.re);
      if (m) {
        const params = {};
        r.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(m[i + 1] || "");
        });
        r.handler(params);
        if (typeof window !== "undefined") window.scrollTo(0, 0);
        return;
      }
    }
    if (registeredRoutes.length > 0) {
      registeredRoutes[0].handler({});
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("hashchange", dispatch);
  }
  dispatch();
}
