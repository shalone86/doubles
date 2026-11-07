// Interactive Montessori Array & Doubler Mat (#/mat)
// Lets kids explore Rows × Columns (1..10), Mirror Doubles, and Fair-Share Baskets hands-on.

import {
  el,
  sfx,
  speak,
  stopSpeak,
  spoken,
  setDock,
  beadBarSvg,
  beadColorFor,
} from "./kit/index.js";

export function renderMat(mount) {
  mount.innerHTML = "";

  let mode = "array"; // 'array' | 'mirror' | 'share'
  let rows = 3;
  let cols = 4;

  const topbar = el("div", { class: "topbar" }, [
    el("button", {
      class: "btn small pill",
      text: "← Home",
      onclick: () => {
        stopSpeak();
        location.hash = "#/";
      },
    }),
    el("div", { class: "grow" }, [
      el("h2", { style: "margin:0", text: "🧮 Montessori Array & Doubler Mat" }),
      el("div", {
        style: "color:var(--ink-soft);font-size:14px",
        text: "Build bead arrays, test mirror doubles, or share equally into baskets!",
      }),
    ]),
  ]);

  const modeTabs = el("div", {
    style: "display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px",
  });

  const controlsCard = el("div", { class: "card", style: "margin-bottom:12px" });
  const stageCard = el("div", { class: "card mat-stage-card" });

  function getSpokenCurrent() {
    if (mode === "mirror") {
      return `Double ${cols}! ${cols} plus ${cols} equals ${cols * 2}.`;
    }
    if (mode === "share") {
      const total = rows * cols;
      return `${total} shared equally into ${rows} baskets gives ${cols} in each basket. ${total} divided by ${rows} equals ${cols}.`;
    }
    return `${rows} rows of ${cols} equals ${rows * cols}. ${rows} times ${cols} equals ${rows * cols}.`;
  }

  function renderAll() {
    modeTabs.innerHTML = "";
    [
      { id: "array", label: "🍫 Bead Array (×)" },
      { id: "mirror", label: "🪞 Mirror Doubler (2×)" },
      { id: "share", label: "🧺 Fair-Share Baskets (÷)" },
    ].forEach((t) => {
      modeTabs.append(
        el("button", {
          class: `btn small pill ${mode === t.id ? "primary" : ""}`,
          text: t.label,
          onclick: () => {
            sfx.pop();
            mode = t.id;
            renderAll();
          },
        })
      );
    });

    // Controls
    controlsCard.innerHTML = "";
    const rowCtrl = el("div", { class: "mat-slider-row" }, [
      el("label", {
        html:
          mode === "mirror"
            ? `<b>Twin Sides:</b> 2 (Mirror)`
            : mode === "share"
            ? `<b>Baskets:</b> ${rows}`
            : `<b>Rows (Multiplier):</b> ${rows}`,
      }),
      ...(mode === "mirror"
        ? []
        : [
            el(
              "div",
              { class: "mat-num-pills" },
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) =>
                el("button", {
                  class: `mat-num-btn ${rows === n ? "active" : ""}`,
                  text: String(n),
                  onclick: () => {
                    sfx.pop();
                    rows = n;
                    renderAll();
                  },
                })
              )
            ),
          ]),
    ]);

    const colColor = beadColorFor(cols);
    const colCtrl = el("div", { class: "mat-slider-row", style: "margin-top:10px" }, [
      el("label", {
        html: `<b>Bead Bar Size (${colColor.name}):</b> ${cols}`,
      }),
      el(
        "div",
        { class: "mat-num-pills" },
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) =>
          el("button", {
            class: `mat-num-btn ${cols === n ? "active" : ""}`,
            text: String(n),
            onclick: () => {
              sfx.pop();
              cols = n;
              renderAll();
            },
          })
        )
      ),
    ]);

    controlsCard.append(rowCtrl, colCtrl);

    // Stage visualization
    stageCard.innerHTML = "";
    if (mode === "mirror") {
      const total = cols * 2;
      stageCard.innerHTML = `
        <div class="mat-eq-header">${cols} + ${cols} = <span>${total}</span> &nbsp;|&nbsp; Half of ${total} = <span>${cols}</span></div>
        <div class="mirror-board">
          <div class="mirror-wing left">
            <div class="wing-label">Left Side (${cols})</div>
            <div class="wing-beads">${beadBarSvg(cols, 13)}</div>
            <div class="wing-num">${cols}</div>
          </div>
          <div class="mirror-divider"><span class="mirror-icon">🪞</span><span>MIRROR</span></div>
          <div class="mirror-wing right">
            <div class="wing-label">Mirror Twin (${cols})</div>
            <div class="wing-beads">${beadBarSvg(cols, 13)}</div>
            <div class="wing-num">${cols}</div>
          </div>
        </div>
      `;
    } else if (mode === "share") {
      const total = rows * cols;
      const grid = el("div", { class: "plates-grid" });
      for (let r = 0; r < rows; r++) {
        grid.append(
          el("button", {
            class: "share-plate dealt",
            html: `
              <div class="plate-title">🧺 Basket ${r + 1}</div>
              <div class="plate-beads">${beadBarSvg(cols, 11)}</div>
              <div class="plate-count">${cols} inside</div>
            `,
            onclick: () => {
              sfx.pop();
              speak(`Basket ${r + 1} has ${cols}`);
            },
          })
        );
      }
      stageCard.append(
        el("div", {
          class: "mat-eq-header",
          html: `${total} ÷ ${rows} = <span>${cols}</span> &nbsp;(and ${rows} × ${cols} = ${total})`,
        }),
        grid
      );
    } else {
      const total = rows * cols;
      const rowsWrap = el("div", { class: "array-rows-container" });
      for (let r = 0; r < rows; r++) {
        const cum = (r + 1) * cols;
        const rowBtn = el("button", {
          class: "array-row-btn row-lit",
          html: `
            <span class="row-tag">Row ${r + 1}</span>
            <span class="row-beads">${beadBarSvg(cols, 12)}</span>
            <span class="row-sum">${cum}</span>
          `,
          onclick: () => {
            sfx.pop();
            speak(`${cum}`);
          },
        });
        rowsWrap.append(rowBtn);
      }
      stageCard.append(
        el("div", {
          class: "mat-eq-header",
          html: `${rows} × ${cols} = <span>${total}</span> &nbsp;|&nbsp; ${total} ÷ ${rows} = <span>${cols}</span>`,
        }),
        rowsWrap
      );
    }
  }

  mount.append(topbar, modeTabs, controlsCard, stageCard);
  renderAll();

  setDock([
    {
      icon: "🏠",
      label: "Home",
      onClick: () => {
        stopSpeak();
        location.hash = "#/";
      },
    },
    {
      icon: "🔊",
      label: "Read Equation",
      primary: true,
      onClick: () => speak(getSpokenCurrent()),
    },
  ]);
}
