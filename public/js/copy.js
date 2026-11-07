// Parent "Show & Copy" Board (#/copy) for Doubles, Halves, Multiplication & Division.
// Parents or kids can type any number (e.g. 12) or equation (e.g. 6+6, 4*5, 24/6)
// and see Giant Standard Form, Written Words, Double/Half/Double-Double,
// Montessori Bead Array, and Fact Family Triangle with 🔊 Speak buttons.

import {
  el,
  sfx,
  speak,
  stopSpeak,
  spoken,
  setDock,
  beadBarSvg,
  analyzeMathInput,
} from "./kit/index.js";

const PRESETS = [
  "6 + 6",
  "8 + 8",
  "15 + 15",
  "3 × 4",
  "4 × 6",
  "5 × 7",
  "20 ÷ 4",
  "18 ÷ 3",
  "12",
  "24",
];

export function renderCopyBoard(mount) {
  mount.innerHTML = "";

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
      el("h2", { style: "margin:0", text: "✏️ Parent Show & Copy Board" }),
      el("div", {
        style: "color:var(--ink-soft);font-size:14px",
        text: "Type any number (0–100) or equation (6+6, 4×5, 20÷4) to display & copy",
      }),
    ]),
  ]);

  const inputEl = el("input", {
    class: "copy-math-input",
    type: "text",
    value: "6 + 6",
    placeholder: "Type e.g. 6+6, 4*5, 20/4, or 12...",
  });

  const goBtn = el("button", {
    class: "btn primary pill",
    html: "✨ Show It!",
    onclick: () => {
      sfx.pop();
      updateBoard(inputEl.value);
    },
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sfx.pop();
      updateBoard(inputEl.value);
    }
  });

  const presetsRow = el("div", { class: "copy-presets-row" });
  PRESETS.forEach((p) => {
    presetsRow.append(
      el("button", {
        class: "btn small pill",
        text: p,
        onclick: () => {
          sfx.pop();
          inputEl.value = p;
          updateBoard(p);
        },
      })
    );
  });

  const inputCard = el("div", { class: "card", style: "margin-bottom:14px" }, [
    el("div", { class: "copy-input-row" }, [inputEl, goBtn]),
    presetsRow,
  ]);

  const displayWrap = el("div", { class: "copy-display-grid" });

  function updateBoard(raw) {
    const info = analyzeMathInput(raw);
    displayWrap.innerHTML = "";

    // 1. Giant Standard Equation / Number Card + Written Form
    const mainCard = el("div", { class: "card copy-hero-card" }, [
      el("div", { class: "copy-card-head" }, [
        el("span", { class: "copy-tag", text: "📌 Standard & Written Form" }),
        el("button", {
          class: "btn small pill",
          html: "🔊 Speak",
          onclick: () => speak(`${spoken(info.equationText)}. ${info.written} is ${info.value}.`),
        }),
      ]),
      el("div", { class: "copy-giant-eq", text: info.equationText }),
      el("div", {
        class: "copy-written-line",
        html: `Number Name: <b>${info.written}</b> (${info.value})`,
      }),
    ]);

    // 2. Doubles & Halves Breakdown Card
    const dhCard = el("div", { class: "card copy-sub-card" }, [
      el("div", { class: "copy-card-head" }, [
        el("span", { class: "copy-tag", text: "🪞 Doubles & Halves" }),
        el("button", {
          class: "btn small pill",
          html: "🔊 Speak",
          onclick: () =>
            speak(
              `Double ${info.value} is ${info.doubleVal}. ${
                info.isEven
                  ? `Half of ${info.value} is ${info.halfVal}.`
                  : `${info.value} is an odd number.`
              } Double-double is ${info.quadVal}.`
            ),
        }),
      ]),
      el("div", { class: "copy-facts-list" }, [
        el("div", {
          class: "copy-fact-row",
          html: `<span>🪞 <b>Double (${info.value} + ${info.value}):</b></span> <b class="fact-val">${info.doubleVal}</b>`,
        }),
        el("div", {
          class: "copy-fact-row",
          html: `<span>✂️ <b>Half of ${info.value}:</b></span> <b class="fact-val">${
            info.isEven ? `${info.halfVal} + ${info.halfVal}` : "Odd (not a whole half)"
          }</b>`,
        }),
        el("div", {
          class: "copy-fact-row",
          html: `<span>🚀 <b>Double-Double (4 × ${info.value}):</b></span> <b class="fact-val">${info.quadVal}</b>`,
        }),
      ]),
    ]);

    // 3. Visual Montessori Array Card
    const arrRows = Math.max(1, Math.min(10, info.rows || 2));
    const arrCols = Math.max(1, Math.min(10, info.cols || 6));
    let arrayHtml = `<div class="copy-array-bars">`;
    for (let r = 0; r < arrRows; r++) {
      arrayHtml += `<div class="copy-array-row"><span>Row ${r + 1}:</span> ${beadBarSvg(arrCols, 10)} <b>${(r + 1) * arrCols}</b></div>`;
    }
    arrayHtml += `</div>`;

    const arrayCard = el("div", { class: "card copy-sub-card" }, [
      el("div", { class: "copy-card-head" }, [
        el("span", {
          class: "copy-tag",
          text: `🍫 Montessori Bead Array (${arrRows} × ${arrCols} = ${arrRows * arrCols})`,
        }),
        el("button", {
          class: "btn small pill",
          html: "🔊 Speak",
          onclick: () =>
            speak(`${arrRows} rows of ${arrCols} make ${arrRows * arrCols}.`),
        }),
      ]),
      el("div", { html: arrayHtml }),
    ]);

    // 4. Fact Family Triangle Card
    const ff = info.factFamily;
    const ffCard = el("div", { class: "card copy-sub-card" }, [
      el("div", { class: "copy-card-head" }, [
        el("span", { class: "copy-tag", text: "🔺 Fact Family Triangle (× & ÷)" }),
        el("button", {
          class: "btn small pill",
          html: "🔊 Speak",
          onclick: () => speak(ff.equations.map((e) => spoken(e)).join(". ")),
        }),
      ]),
      el("div", {
        class: "copy-triangle-mini",
        html: `
          <div class="ct-top">${ff.product}</div>
          <div class="ct-mid">× &nbsp; ÷</div>
          <div class="ct-bot"><span>${ff.a}</span><span>${ff.b}</span></div>
        `,
      }),
      el(
        "div",
        { class: "copy-ff-eqs" },
        ff.equations.map((eqStr) =>
          el("div", { class: "copy-ff-pill", text: eqStr })
        )
      ),
    ]);

    displayWrap.append(mainCard, dhCard, arrayCard, ffCard);
  }

  mount.append(topbar, inputCard, displayWrap);
  updateBoard(inputEl.value);

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
      label: "Speak All",
      primary: true,
      onClick: () => {
        const info = analyzeMathInput(inputEl.value);
        speak(
          `${spoken(info.equationText)}. Double ${info.value} is ${info.doubleVal}.`
        );
      },
    },
  ]);
}
