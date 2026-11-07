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
import { renderWatch } from "./watch.js";
import { renderCopyBoard } from "./copy.js";
import { renderMat } from "./mat.js";
import { renderSense } from "./senseview.js";

const appEl = document.getElementById("app");
const dockEl = document.getElementById("dock");
initDock(dockEl);

function renderHome() {
  stopSpeak();
  appEl.innerHTML = "";

  // Top Header
  const totalStars = Object.values(S.progress.stars || {}).reduce(
    (a, b) => a + b,
    0
  );
  const topbar = el("div", { class: "topbar" }, [
    el("div", { class: "brand" }, [
      el("span", { class: "brand-icon", text: "🪞" }),
      el("div", {}, [
        el("h1", { class: "brand-title", text: "Doubles!" }),
        el("div", {
          class: "brand-sub",
          text: "Doubles, Halves, Multiplication & Division (Grades 1–3)",
        }),
      ]),
    ]),
    el("div", { class: "topbar-actions" }, [
      el("span", {
        class: "star-pill",
        html: `⭐ <b>${totalStars}</b>`,
      }),
      el("button", {
        class: "btn small pill",
        text: "⚙️ Grown-ups",
        onclick: () => (location.hash = "#/grownups"),
      }),
    ]),
  ]);

  // Interactive Montessori Bead Stair Legend Bar (1 to 10)
  const beadStairStrip = el("div", { class: "card bead-stair-banner" }, [
    el("div", {
      class: "bead-stair-title",
      html: "📿 <b>Montessori Bead Stair (1–10):</b> Tap any bar to hear its number & color!",
    }),
    el(
      "div",
      { class: "bead-stair-row" },
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
        const c = BEAD_COLORS[n];
        return el("button", {
          class: "bead-stair-chip",
          title: `${n} (${c.name})`,
          html: `
            <span class="stair-num">${n}</span>
            <span class="stair-svg">${beadBarSvg(n, 6)}</span>
          `,
          onclick: () => {
            sfx.pop();
            speak(`${n}. Double ${n} is ${n * 2}.`);
          },
        });
      })
    ),
  ]);

  // Quick Tools Row: Show & Copy Board, Montessori Array Mat, Number Sense Quiz
  const toolsGrid = el("div", { class: "tools-grid" }, [
    el("button", {
      class: "tool-card copy-tool",
      onclick: () => {
        sfx.pop();
        location.hash = "#/copy";
      },
      html: `
        <span class="tool-icon">✏️</span>
        <div>
          <div class="tool-title">Parent Show & Copy Board</div>
          <div class="tool-desc">Type any number or × / ÷ equation to see its double, half, array & fact family!</div>
        </div>
      `,
    }),
    el("button", {
      class: "tool-card mat-tool",
      onclick: () => {
        sfx.pop();
        location.hash = "#/mat";
      },
      html: `
        <span class="tool-icon">🧮</span>
        <div>
          <div class="tool-title">Montessori Array & Doubler Mat</div>
          <div class="tool-desc">Build bead arrays, test mirror doubles, and share into baskets hands-on!</div>
        </div>
      `,
    }),
    el("button", {
      class: "tool-card sense-tool",
      onclick: () => {
        sfx.pop();
        location.hash = "#/sense";
      },
      html: `
        <span class="tool-icon">🧠</span>
        <div>
          <div class="tool-title">Number Sense Quiz</div>
          <div class="tool-desc">8-question Grade 1, 2 & 3 conceptual puzzles for doubles, arrays & division!</div>
        </div>
      `,
    }),
  ]);

  appEl.append(topbar, beadStairStrip, toolsGrid);

  // Worlds (Grades 1, 2, 3)
  WORLDS.forEach((w) => {
    const worldStages = STAGES.filter((s) => s.world === w.id);
    const sec = el("section", { class: "world-section" }, [
      el("div", { class: "world-header", style: `--world-hue:${w.hue}` }, [
        el("h2", { class: "world-title", text: w.title }),
        el("p", { class: "world-sub", text: w.subtitle }),
      ]),
      el(
        "div",
        { class: "stage-grid" },
        worldStages.map((st) => {
          const earned = S.progress.stars[st.id] || 0;
          return el("div", { class: "stage-card" }, [
            el("div", { class: "stage-card-top" }, [
              el("span", { class: "stage-emoji", text: st.emoji }),
              starsBar(earned),
            ]),
            el("h3", { class: "stage-title", text: st.title }),
            el("p", { class: "stage-blurb", text: st.blurb }),
            el("div", { class: "stage-actions" }, [
              el("button", {
                class: "btn primary small pill",
                text: "▶ Play",
                onclick: () => {
                  sfx.go();
                  location.hash = `#/play/${st.id}`;
                },
              }),
              el("button", {
                class: "btn small pill",
                text: "🎬 Watch",
                onclick: () => {
                  sfx.pop();
                  location.hash = `#/watch/${st.id}`;
                },
              }),
            ]),
          ]);
        })
      ),
    ]);
    appEl.append(sec);
  });

  // Sticker Book
  const stickers = Object.entries(S.progress.stickers || {});
  if (stickers.length > 0) {
    const stickerSec = el("section", { class: "card", style: "margin-top:18px" }, [
      el("h3", { style: "margin:0 0 10px", text: "🏆 Your Sticker Collection" }),
      el(
        "div",
        { style: "display:flex;gap:10px;flex-wrap:wrap;font-size:28px" },
        stickers.map(([id, emo]) =>
          el("span", {
            title: id,
            style:
              "background:var(--surface-2);border:2px solid var(--border);border-radius:14px;padding:6px 12px",
            text: emo,
          })
        )
      ),
    ]);
    appEl.append(stickerSec);
  }

  setDock([
    {
      icon: "✏️",
      label: "Show & Copy",
      onClick: () => (location.hash = "#/copy"),
    },
    {
      icon: "🧮",
      label: "Array Mat",
      onClick: () => (location.hash = "#/mat"),
    },
    {
      icon: "🧠",
      label: "Quiz",
      onClick: () => (location.hash = "#/sense"),
    },
  ]);
}

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
