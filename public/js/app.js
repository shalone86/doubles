// Main entry & router for Doubles, Halves, Multiplication & Division.

import {
  S,
  el,
  sfx,
  speak,
  stopSpeak,
  route,
  startRouter,
  initDock,
  setDock,
  starsBar,
  renderGrownups,
  WORLDS,
  STAGES,
  BEAD_COLORS,
  beadBarSvg,
} from "./kit/index.js";
import { Game } from "./game.js";
import * as Store from "./kit/store.js";
import { jingleOnce } from "./kit/jingle.js";
import { renderWatch } from "./watch.js";
import { renderCopyBoard } from "./copy.js";
import { renderMat } from "./mat.js";
import { renderSense } from "./senseview.js";

const appEl = document.getElementById("app");
const dockEl = document.getElementById("dock");
initDock(dockEl);

/** The level the big Play button starts: first unfinished, then the first without 3 stars. */
function nextStage() {
  const stars = S.progress.stars || {};
  return STAGES.find((s) => !stars[s.id]) ?? STAGES.find((s) => (stars[s.id] || 0) < 3) ?? STAGES[0];
}

function renderHome() {
  document.body.classList.remove("in-game");
  stopSpeak();
  setDock([]); // no floating bar on the home page
  appEl.innerHTML = "";
  const stars = S.progress.stars || {};
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);
  const next = nextStage();
  const go = (id) => { sfx.go(); location.hash = `#/play/${id}`; };

  // Hero: one tap to start playing.
  const hero = el("section", { class: "home-hero" }, [
    el("h1", { class: "home-title", html: "Doubles<span>!</span>" }),
    el("p", { class: "home-lede", text: "Doubles and halves, then groups, arrays, × and ÷, with Montessori bead bars." }),
    el("button", { class: "btn big primary play-btn pulse", html: `▶ Play`, onclick: () => go(next.id) }),
    el("p", { class: "home-next", html: `${next.emoji} ${next.title} · ⭐ ${totalStars}` }),
    el("nav", { class: "grade-jump", "aria-label": "Jump to a grade" },
      WORLDS.map((w) => el("a", { href: `#grade-${w.n}`, class: "grade-chip", html: `${w.emoji} Grade ${w.n}`,
        onclick: (e) => { e.preventDefault(); document.getElementById(`grade-${w.n}`)?.scrollIntoView({ behavior: "smooth" }); } }))),
  ]);
  appEl.append(hero);

  // Grades: tap a level card to play it.
  WORLDS.forEach((w) => {
    const sec = el("section", { class: "world-section", id: `grade-${w.n}` }, [
      el("div", { class: "world-header", style: `--world-hue:${w.hue}` }, [
        el("h2", { class: "world-title", text: w.title }),
        el("p", { class: "world-sub", text: w.subtitle }),
      ]),
      el("div", { class: "stage-grid" }, STAGES.filter((st) => st.world === w.id).map((st) =>
        el("div", { class: `stage-card${st.id === next.id ? " is-next" : ""}` }, [
          el("button", { class: "stage-main", onclick: () => go(st.id), "aria-label": `Play ${st.title}`, html: `
            <span class="stage-emoji">${st.emoji}</span>
            <span class="stage-title">${st.title}</span>
            <span class="stage-stars">${starsBar(stars[st.id] || 0).outerHTML ?? ""}</span>` }),
          el("button", { class: "stage-watch", text: "🎬 Watch how", onclick: () => { sfx.pop(); location.hash = `#/watch/${st.id}`; } }),
        ]))),
    ]);
    appEl.append(sec);
  });

  // Extras below the levels: bead stair and tools for grown-ups.
  const beadStairStrip = el("div", { class: "card bead-stair-banner" }, [
    el("div", { class: "bead-stair-title", html: "📿 <b>Montessori Bead Stair (1–10):</b> tap a bar to hear its number!" }),
    el("div", { class: "bead-stair-row" }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => el("button", {
      class: "bead-stair-chip", title: `${n} (${BEAD_COLORS[n].name})`,
      html: `<span class="stair-num">${n}</span><span class="stair-svg">${beadBarSvg(n, 6)}</span>`,
      onclick: () => { sfx.pop(); speak(`${n}. Double ${n} is ${n * 2}.`); },
    }))),
  ]);
  const tool = (icon, title, desc, hash) => el("button", { class: "tool-card", onclick: () => { sfx.pop(); location.hash = hash; },
    html: `<span class="tool-icon">${icon}</span><div><div class="tool-title">${title}</div><div class="tool-desc">${desc}</div></div>` });
  const toolsGrid = el("div", { class: "tools-grid" }, [
    tool("🧠", "Number Sense Quiz", "8 quick questions about doubles, arrays and division.", "#/sense"),
    tool("🧮", "Array & Doubler Mat", "Build bead arrays and share into baskets.", "#/mat"),
    tool("✏️", "Show & Copy Board", "For grown-ups: type a number or × / ÷ to show it big.", "#/copy"),
  ]);
  appEl.append(el("h2", { class: "extras-title", text: "More to explore" }), toolsGrid, beadStairStrip);

  const stickers = S.stickers();
  if (stickers.length > 0) {
    appEl.append(el("section", { class: "card sticker-book", style: "margin-top:18px" }, [
      el("h3", { style: "margin:0 0 10px", text: "🏆 Your Sticker Collection" }),
      el("div", { class: "stickers" }, stickers.map((s) =>
        el("span", { class: s.big ? "big" : "mini", title: s.big ? "giant sticker" : "mini sticker: no mistakes makes it giant", text: s.e }))),
      el("a", { class: "btn world-link", href: "https://angelio.org/stickers/", text: "🌍 Play in Sticker World" }),
    ]));
  }

}

jingleOnce("doubles", () => Store.settings().sounds !== false); // the app's little logo sound, on the first tap

route("/", () => renderHome());

route("/play/:id", ({ id }) => {
  const stage = STAGES.find((s) => s.id === id) || STAGES[0];
  new Game(stage, appEl, () => {
    location.hash = "#/";
  });
});

route("/watch/:id", ({ id }) => {
  renderWatch(appEl, id);
});

route("/copy", () => {
  renderCopyBoard(appEl);
});

route("/mat", () => {
  renderMat(appEl);
});

route("/sense", () => {
  renderSense(appEl);
});

route("/grownups", () => {
  stopSpeak();
  renderGrownups(appEl, () => (location.hash = "#/"), {
    title: "Doubles, Halves, Multiplication & Division",
    subtitle: "Montessori Bead Bars, Mirror Doubles, Fair-Share Halves, Arrays & Fact Families (Grades 1–3)",
  });
  setDock([]);
});

startRouter();

// Offline support. A new version only reloads the page when it's safe: never on the very first
// visit (that "change" is just the offline files installing), and never in the middle of a game.
// If an update arrives during a game, it's applied the next time the child is back home.
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  const hadController = !!navigator.serviceWorker.controller;
  let updateReady = false;
  const reloadIfSafe = () => {
    const inGame = document.body.classList.contains("in-game") || /^#\/(play|watch|sense)\//.test(location.hash);
    if (updateReady && !inGame) location.reload();
  };
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) return;
    updateReady = true;
    reloadIfSafe();
  });
  window.addEventListener("hashchange", reloadIfSafe);
  navigator.serviceWorker.register("sw.js").then((reg) => reg.update()).catch(() => {});
}
