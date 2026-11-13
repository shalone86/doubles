// Interactive Montessori visual boards for Doubles, Halves, Multiplication & Division.
// Every board is genuinely interactive (tapping the mirror reflects the twin beads,
// tapping baskets/plates deals items, tapping array rows counts them) and NEVER leaks
// the final answer before the child either interacts or answers.
// Every board also attaches `stageEl.revealSolution = () => ...` for correct answers & 2nd-mistake reveals.

import { el, sfx, speak, beadBarSvg, beadColorFor } from "./kit/index.js";

function tenAndUnitSvg(n) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  let parts = `<div class="place-block-row">`;
  for (let t = 0; t < tens; t++) {
    parts += `<div class="ten-bar-wrap" title="Golden 10-Bar">${beadBarSvg(10, 8)}<span class="bar-tag">10</span></div>`;
  }
  if (ones > 0) {
    parts += `<div class="unit-bar-wrap" title="${ones} ones">${beadBarSvg(ones, 8)}<span class="bar-tag">${ones}</span></div>`;
  }
  parts += `</div>`;
  return parts;
}

export function renderExerciseBoard(q, stageEl, onPick) {
  stageEl.innerHTML = "";
  const wrap = el("div", { class: "doubles-board-wrap" });

  const visualCard = el("div", { class: "visual-stage-card" });
  const eqBar = el("div", { class: "equation-banner" });
  const choicesWrap = el("div", { class: "choices-grid" });

  const choiceBtns = [];
  let revealed = false;

  const fillEquationSlots = () => {
    if (revealed) return;
    revealed = true;
    eqBar.querySelectorAll(".empty-box").forEach((box) => {
      box.textContent = String(q.answer);
      box.classList.add("filled", "pop-in");
    });
  };

  // ── 1. MIRROR DOUBLES (1+1 to 10+10) ──
  if (q.kind === "mirror-double") {
    let mirrored = false;
    const mirrorBoard = el("div", { class: "mirror-board" });

    const leftWing = el("button", {
      class: "mirror-wing left clickable-wing",
      title: "Tap to hear the left side",
      html: `
        <div class="wing-label">Left Side (${q.n})</div>
        <div class="wing-beads">${beadBarSvg(q.n, 13)}</div>
        <div class="wing-num">${q.n}</div>
      `,
      onclick: () => {
        sfx.tap();
        speak(`${q.n} beads on the left.`);
      },
    });

    const rightWing = el("button", {
      class: "mirror-wing right unmirrored clickable-wing",
      title: "Tap the mirror to reflect!",
      html: `
        <div class="wing-label">Mirror Twin</div>
        <div class="wing-beads mirror-placeholder">🪞 Tap Mirror to Reflect ${q.n}!</div>
        <div class="wing-num">?</div>
      `,
    });

    const mirrorLine = el("button", {
      class: "mirror-divider clickable-mirror pulse",
      title: "Tap the mirror to shine both sides!",
      html: `<span class="mirror-icon">🪞</span><span>TAP MIRROR</span>`,
    });

    const mirrorBtn = el("button", {
      class: "btn small pill action-helper-btn",
      html: `🪞 Tap Mirror to Reflect ${q.n} + ${q.n}!`,
    });

    const triggerMirror = (speakIt = true) => {
      sfx.pop();
      mirrored = true;
      mirrorLine.classList.remove("pulse");
      mirrorLine.classList.add("mirror-lit");
      rightWing.classList.remove("unmirrored");
      rightWing.classList.add("shimmer-in");
      rightWing.innerHTML = `
        <div class="wing-label">Mirror Twin (+${q.n})</div>
        <div class="wing-beads">${beadBarSvg(q.n, 13)}</div>
        <div class="wing-num">+ ${q.n}</div>
      `;
      mirrorBtn.innerHTML = `✨ Mirrored! ${q.n} on the left + ${q.n} on the right!`;
      if (speakIt) {
        speak(`${q.n} on the left, and ${q.n} in the mirror! How many in all?`);
      }
    };

    rightWing.onclick = () => triggerMirror(true);
    mirrorLine.onclick = () => triggerMirror(true);
    mirrorBtn.onclick = () => triggerMirror(true);

    mirrorBoard.append(leftWing, mirrorLine, rightWing);
    visualCard.append(mirrorBoard, mirrorBtn);

    eqBar.innerHTML = `
      <span class="eq-token">${q.n}</span>
      <span class="eq-op">+</span>
      <span class="eq-token">${q.n}</span>
      <span class="eq-op">=</span>
      <span class="empty-box" data-slot="ans">?</span>
    `;

    stageEl.animateVisualStep = () => {
      if (!mirrored) triggerMirror(false);
    };

    stageEl.revealSolution = () => {
      if (!mirrored) triggerMirror(false);
      fillEquationSlots();
    };
  }

  // ── 2. FAIR-SHARE HALVES (Even numbers up to 24) ──
  else if (q.kind === "fair-half") {
    let splitDone = false;
    const halfStage = el("div", { class: "half-stage" });
    const topPile = el("div", {
      class: "half-top-pile",
      html: `
        <div class="pile-title">${q.emoji || "🍓"} Start with <b>${q.total}</b> in all</div>
        <div class="pile-beads">${
          q.total <= 10
            ? beadBarSvg(q.total, 11)
            : `${beadBarSvg(10, 10)} ${beadBarSvg(q.total - 10, 10)}`
        }</div>
      `,
    });

    const basketsRow = el("div", { class: "baskets-row" });
    const basketA = el("button", {
      class: "fair-basket clickable-wing",
      html: `
        <div class="basket-header">🧺 Basket A</div>
        <div class="basket-body basket-placeholder">Tap to deal half!</div>
        <div class="basket-count empty-box" data-slot="a">?</div>
      `,
    });
    const basketB = el("button", {
      class: "fair-basket clickable-wing",
      html: `
        <div class="basket-header">🧺 Basket B</div>
        <div class="basket-body basket-placeholder">Tap to deal half!</div>
        <div class="basket-count empty-box" data-slot="b">?</div>
      `,
    });
    basketsRow.append(basketA, basketB);

    const splitBtn = el("button", {
      class: "btn small pill action-helper-btn pulse",
      html: `✂️ Split ${q.total} into 2 Equal Baskets`,
    });

    const doSplit = (speakIt = true) => {
      if (!splitDone) {
        splitDone = true;
        sfx.pop();
        basketsRow.classList.add("split-active");
        basketA.querySelector(".basket-body").innerHTML = beadBarSvg(q.answer, 11);
        basketB.querySelector(".basket-body").innerHTML = beadBarSvg(q.answer, 11);
        splitBtn.classList.remove("pulse");
        splitBtn.innerHTML = `✨ Dealt equally into 2 baskets! Count one basket!`;
      } else {
        sfx.tap();
      }
      if (speakIt) {
        speak(`${q.total} split equally into 2 baskets! Count the beads in one basket.`);
      }
    };

    basketA.onclick = () => doSplit(true);
    basketB.onclick = () => doSplit(true);
    splitBtn.onclick = () => doSplit(true);

    halfStage.append(topPile, basketsRow, splitBtn);
    visualCard.append(halfStage);

    eqBar.innerHTML = `
      <span class="eq-word">Half of ${q.total}</span>
      <span class="eq-op">=</span>
      <span class="empty-box" data-slot="ans">?</span>
    `;

    stageEl.animateVisualStep = () => {
      if (!splitDone) doSplit(false);
    };

    stageEl.revealSolution = () => {
      if (!splitDone) doSplit(false);
      halfStage.querySelectorAll(".empty-box").forEach((b) => {
        b.textContent = String(q.answer);
        b.classList.add("filled", "pop-in");
      });
      fillEquationSlots();
    };
  }

  // ── 3. NEAR DOUBLES (Double + 1) ──
  else if (q.kind === "near-double") {
    const ndStage = el("div", { class: "near-double-stage" });
    ndStage.innerHTML = `
      <div class="nd-columns">
        <div class="nd-col">
          <div class="nd-label">First Bar (${q.base})</div>
          ${beadBarSvg(q.base, 12)}
        </div>
        <div class="nd-plus">+</div>
        <div class="nd-col">
          <div class="nd-label">Twin (${q.base}) + <span class="bonus-pill">1 Bonus</span></div>
          <div class="nd-bars-inline">
            ${beadBarSvg(q.base, 12)}
            <span class="bonus-one-wrap" title="+1 Bonus Bead">${beadBarSvg(1, 12)}</span>
          </div>
        </div>
      </div>
      <div class="nd-helper-callout">
        💡 Start with <b>Double ${q.base}</b>, then add <b>1 more</b>!
      </div>
    `;
    visualCard.append(ndStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.base}</span>
      <span class="eq-op">+</span>
      <span class="eq-token">${q.next}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.revealSolution = () => {
      fillEquationSlots();
    };
  }

  // ── 4. MISSING DOUBLES & HALVES (□ + □ = Total): Double Detective ──
  // Kids can test a guess: tapping either twin adds a bead to BOTH (twins always match). Nothing is
  // counted or said for them (they count the beads themselves). Going over the total is allowed:
  // they hear "Oops, too many, take one away" and the ➖ button wiggles. Nothing locks; the beads
  // never turn a dot yellow (only a wrong answer does).
  else if (q.kind === "missing-double") {
    const mdStage = el("div", { class: "missing-double-stage" });
    let beads = 0, overs = 0;
    const MAX = q.total; // a sensible ceiling: each twin can't hold more than the whole total
    const twinCard = (n) => el("button", {
      type: "button",
      class: "mystery-twin-card",
      "aria-label": `Twin ${n}: tap to add a bead to both twins`,
      html: `
        <div class="twin-title">Twin #${n}</div>
        <div class="twin-beads" data-twin-beads></div>`,
      onclick: () => addBead(),
    });
    const left = twinCard(1), right = twinCard(2);
    const totalBadge = el("div", { class: "twin-total-badge", html: `🔍 Together the two twins make <b>${q.total}</b>!` });
    const less = el("button", { type: "button", class: "btn small twin-less", text: "➖ Take one away", onclick: () => removeBead() });
    const tools = el("div", { class: "twin-tools" }, [less]);
    const twinRow = el("div", { class: "mystery-twin-row" }, [left, right]);
    mdStage.append(totalBadge, twinRow, tools);
    visualCard.append(mdStage);

    const paint = () => {
      mdStage.querySelectorAll("[data-twin-beads]").forEach((b) => {
        // More than 10: a ten-bar plus the rest, like the Montessori bead bars (one bar holds at most 12).
        b.innerHTML = !beads ? `<span class="twin-empty">👆 Tap to add beads</span>`
          : beads <= 10 ? beadBarSvg(beads, 11)
          : `<span class="twin-bars">${Array.from({ length: Math.floor(beads / 10) }, () => beadBarSvg(10, 11)).join("")}${beads % 10 ? beadBarSvg(beads % 10, 11) : ""}</span>`;
      });
      less.disabled = !beads;
    };
    const wiggle = (node) => { node.classList.remove("wiggle"); void node.offsetWidth; node.classList.add("wiggle"); };
    const addBead = () => {
      if (beads >= MAX) { sfx.bonk?.(); wiggle(less); return; }
      beads++;
      sfx.pop();
      paint();
      if (beads * 2 > q.total) {
        overs++;
        const msg = overs === 1
          ? "Oops, that's too many! Take one away, then count again."
          : "Oops, too many again! Take one away and count both twins together.";
        speak(msg);
        stageEl.onBeadHint?.(msg);
        wiggle(less);
      }
    };
    const removeBead = () => {
      if (!beads) return;
      beads--;
      sfx.pop();
      paint();
    };
    paint();

    eqBar.innerHTML = `
      <span class="empty-box">?</span>
      <span class="eq-op">+</span>
      <span class="empty-box">?</span>
      <span class="eq-op">=</span>
      <span class="eq-token">${q.total}</span>
    `;

    // After the answer (right, or shown after two misses): both twins show the right beads.
    stageEl.revealSolution = () => {
      beads = q.answer;
      paint();
      left.disabled = right.disabled = less.disabled = true;
      fillEquationSlots();
    };
  }

  // ── 5. BIG DOUBLES (Tens & Ones) ──
  else if (q.kind === "big-double") {
    const tens = Math.floor(q.n / 10) * 10;
    const ones = q.n % 10;
    const bdStage = el("div", { class: "big-double-stage" });
    bdStage.innerHTML = `
      <div class="bd-grid">
        <div class="bd-box">
          <div class="bd-head">${q.n} (${tens}${ones ? ` + ${ones}` : ""})</div>
          ${tenAndUnitSvg(q.n)}
        </div>
        <div class="bd-plus">+</div>
        <div class="bd-box">
          <div class="bd-head">${q.n} (${tens}${ones ? ` + ${ones}` : ""})</div>
          ${tenAndUnitSvg(q.n)}
        </div>
      </div>
      <div class="nd-helper-callout">
        💡 Double the Tens (<b>${tens} + ${tens}</b>)${
      ones ? ` and double the Ones (<b>${ones} + ${ones}</b>)!` : "!"
    }
      </div>
    `;
    visualCard.append(bdStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.n}</span>
      <span class="eq-op">+</span>
      <span class="eq-token">${q.n}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.revealSolution = () => {
      fillEquationSlots();
    };
  }

  // ── 6. EQUAL GROUPS (Groups × Each) ──
  else if (q.kind === "equal-groups") {
    const groupsGrid = el("div", { class: "equal-groups-grid" });
    let running = 0;
    for (let g = 0; g < q.groups; g++) {
      running += q.each;
      const stepTotal = running;
      const nest = el("button", {
        class: "group-nest-card",
        title: "Tap to count this group!",
        html: `
          <div class="nest-header">${q.emoji || "🪺"} Group ${g + 1}</div>
          <div class="nest-beads">${beadBarSvg(q.each, 11)}</div>
          <div class="nest-count" data-step-lbl>Tap to count (+${q.each})</div>
        `,
        onclick: () => {
          sfx.pop();
          nest.classList.add("counted");
          const lbl = nest.querySelector("[data-step-lbl]");
          if (lbl) lbl.innerHTML = `+${q.each} → <b>${stepTotal}</b>`;
          speak(`${stepTotal}`);
        },
      });
      groupsGrid.append(nest);
    }
    const helperNote = el("div", {
      class: "board-sub-caption",
      text: `👆 Tap each group of ${q.each} to skip-count up!`,
    });
    visualCard.append(groupsGrid, helperNote);

    eqBar.innerHTML = `
      <span class="eq-token">${q.groups}</span>
      <span class="eq-op">×</span>
      <span class="eq-token">${q.each}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.animateVisualStep = () => {
      groupsGrid.querySelectorAll(".group-nest-card").forEach((c, idx) => {
        c.classList.add("counted");
        const lbl = c.querySelector("[data-step-lbl]");
        if (lbl) lbl.innerHTML = `+${q.each} → <b>${(idx + 1) * q.each}</b>`;
      });
    };

    stageEl.revealSolution = () => {
      groupsGrid.querySelectorAll(".group-nest-card").forEach((c, idx) => {
        c.classList.add("counted");
        const lbl = c.querySelector("[data-step-lbl]");
        if (lbl) lbl.innerHTML = `+${q.each} → <b>${(idx + 1) * q.each}</b>`;
      });
      fillEquationSlots();
    };
  }

  // ── 7. SKIP-COUNTING STEPPING STONES ──
  else if (q.kind === "skip-count") {
    const stonesRow = el("div", { class: "stepping-stones-row" });
    q.seq.forEach((val, idx) => {
      if (val === null) {
        const mysteryStone = el("div", {
          class: "stepping-stone mystery empty-box",
          text: "?",
        });
        stonesRow.append(mysteryStone);
      } else {
        const stone = el("button", {
          class: "stepping-stone",
          html: `<span class="stone-step">Jump ${idx + 1}</span><span class="stone-num">${val}</span>`,
          onclick: () => {
            sfx.pop();
            speak(String(val));
          },
        });
        stonesRow.append(stone);
      }
    });
    const jumpBanner = el("div", {
      class: "nd-helper-callout",
      html: `🐸 Jumping by <b>+${q.step}</b> each time! (${beadBarSvg(q.step, 9)})`,
    });
    visualCard.append(stonesRow, jumpBanner);

    eqBar.innerHTML = `
      <span class="eq-word">Missing Stone (+${q.step}):</span>
      <span class="empty-box">?</span>
    `;

    stageEl.revealSolution = () => {
      stonesRow.querySelectorAll(".empty-box").forEach((b) => {
        b.textContent = String(q.answer);
        b.classList.add("filled", "pop-in");
      });
      fillEquationSlots();
    };
  }

  // ── 8. ARRAY BUILDER (Rows × Columns) ──
  else if (q.kind === "array") {
    const arrayStage = el("div", { class: "array-stage" });
    const rowsContainer = el("div", { class: "array-rows-container" });
    for (let r = 0; r < q.rows; r++) {
      const cum = (r + 1) * q.cols;
      const rowEl = el("button", {
        class: "array-row-btn",
        html: `
          <span class="row-tag">Row ${r + 1}</span>
          <span class="row-beads">${beadBarSvg(q.cols, 12)}</span>
          <span class="row-sum" data-row-sum>+${q.cols}</span>
        `,
        onclick: () => {
          sfx.pop();
          rowEl.classList.add("row-lit");
          const sumTag = rowEl.querySelector("[data-row-sum]");
          if (sumTag) sumTag.textContent = String(cum);
          speak(`${cum}`);
        },
      });
      rowsContainer.append(rowEl);
    }
    const caption = el("div", {
      class: "board-sub-caption",
      html: `👆 <b>${q.rows} rows</b> of <b>${q.cols}</b> — tap each row to count by ${q.cols}s!`,
    });
    arrayStage.append(rowsContainer, caption);
    visualCard.append(arrayStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.rows}</span>
      <span class="eq-op">×</span>
      <span class="eq-token">${q.cols}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.animateVisualStep = () => {
      rowsContainer.querySelectorAll(".array-row-btn").forEach((r, idx) => {
        r.classList.add("row-lit");
        const sumTag = r.querySelector("[data-row-sum]");
        if (sumTag) sumTag.textContent = String((idx + 1) * q.cols);
      });
    };

    stageEl.revealSolution = () => {
      rowsContainer.querySelectorAll(".array-row-btn").forEach((r, idx) => {
        r.classList.add("row-lit");
        const sumTag = r.querySelector("[data-row-sum]");
        if (sumTag) sumTag.textContent = String((idx + 1) * q.cols);
      });
      fillEquationSlots();
    };
  }

  // ── 9. DOUBLE & DOUBLE-AGAIN (×2 and ×4) ──
  else if (q.kind === "double-double") {
    const tree = el("div", { class: "double-tree-stage" });
    if (q.mult === 2) {
      tree.innerHTML = `
        <div class="dtree-step">
          <div class="dtree-label">Start Number</div>
          <div class="dtree-bars">${beadBarSvg(q.n, 11)}</div>
          <div class="dtree-val">${q.n}</div>
        </div>
        <div class="dtree-arrow">⬇️ <span>Double It (×2)</span></div>
        <div class="dtree-step highlight">
          <div class="dtree-label">2 × ${q.n} = ${q.n} + ${q.n}</div>
          <div class="dtree-bars">${beadBarSvg(q.n, 11)} ${beadBarSvg(q.n, 11)}</div>
          <div class="dtree-val empty-box">?</div>
        </div>
      `;
    } else {
      tree.innerHTML = `
        <div class="dtree-row-three">
          <div class="dtree-step">
            <div class="dtree-label">1. Start</div>
            <div class="dtree-bars">${beadBarSvg(q.n, 10)}</div>
            <div class="dtree-val">${q.n}</div>
          </div>
          <div class="dtree-arrow-right">➡️ <span>Double (×2)</span></div>
          <div class="dtree-step">
            <div class="dtree-label">2. Double Once</div>
            <div class="dtree-bars">${beadBarSvg(q.n, 10)} ${beadBarSvg(q.n, 10)}</div>
            <div class="dtree-val">${q.d1}</div>
          </div>
          <div class="dtree-arrow-right">➡️ <span>Double Again (×4)</span></div>
          <div class="dtree-step highlight">
            <div class="dtree-label">3. Double ${q.d1}</div>
            <div class="dtree-val empty-box">?</div>
          </div>
        </div>
      `;
    }
    visualCard.append(tree);

    eqBar.innerHTML = `
      <span class="eq-token">${q.mult}</span>
      <span class="eq-op">×</span>
      <span class="eq-token">${q.n}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.revealSolution = () => {
      tree.querySelectorAll(".empty-box").forEach((b) => {
        b.textContent = String(q.answer);
        b.classList.add("filled", "pop-in");
      });
      fillEquationSlots();
    };
  }

  // ── 10. TENS & FIVES (×10 and Half-of-10 = ×5) ──
  else if (q.kind === "ten-five") {
    const tfStage = el("div", { class: "ten-five-stage" });
    let barsHtml = `<div class="ten-bars-collection">`;
    for (let i = 0; i < q.n; i++) {
      barsHtml += `<div class="gold-ten-col">${beadBarSvg(10, 8)}<span class="gold-ten-lbl">10</span></div>`;
    }
    barsHtml += `</div>`;

    if (q.mult === 10) {
      tfStage.innerHTML = `
        <div class="tf-heading">✨ Count <b>${q.n}</b> Golden Ten-Bars by 10s!</div>
        ${barsHtml}
      `;
    } else {
      tfStage.innerHTML = `
        <div class="tf-heading">✨ <b>10 × ${q.n} = ${q.tenVal}</b> — Now take <b>HALF</b> of ${q.tenVal} for <b>5 × ${q.n}</b>!</div>
        ${barsHtml}
        <div class="nd-helper-callout">
          ✂️ Half of <b>${q.tenVal}</b> is <span class="empty-box inline-slot">?</span>
        </div>
      `;
    }
    visualCard.append(tfStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.mult}</span>
      <span class="eq-op">×</span>
      <span class="eq-token">${q.n}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.revealSolution = () => {
      tfStage.querySelectorAll(".empty-box").forEach((b) => {
        b.textContent = String(q.answer);
        b.classList.add("filled", "pop-in");
      });
      fillEquationSlots();
    };
  }

  // ── 11. FAIR-SHARE DIVISION (Deal onto Plates) ──
  else if (q.kind === "fair-share") {
    let dealt = false;
    const fsStage = el("div", { class: "fair-share-stage" });
    const header = el("div", {
      class: "pile-title",
      html: `${q.emoji || "🍪"} Share <b>${q.total}</b> equally onto <b>${q.plates} plates</b>`,
    });
    const platesGrid = el("div", { class: "plates-grid" });
    const plateEls = [];
    for (let p = 0; p < q.plates; p++) {
      const plate = el("button", {
        class: "share-plate",
        html: `
          <div class="plate-title">🍽️ Plate ${p + 1}</div>
          <div class="plate-beads" data-plate-beads>Tap to deal!</div>
          <div class="plate-count" data-plate-count>? on plate</div>
        `,
      });
      plateEls.push(plate);
      platesGrid.append(plate);
    }

    const dealBtn = el("button", {
      class: "btn small pill action-helper-btn pulse",
      html: `🍽️ Deal ${q.total} Equally onto ${q.plates} Plates!`,
    });

    const dealPlates = (speakIt = true) => {
      sfx.pop();
      dealt = true;
      dealBtn.classList.remove("pulse");
      dealBtn.innerHTML = `✨ Dealt equally! Count the beads on 1 plate!`;
      plateEls.forEach((p) => {
        p.classList.add("dealt");
        const b = p.querySelector("[data-plate-beads]");
        if (b) b.innerHTML = beadBarSvg(q.answer, 11);
        const c = p.querySelector("[data-plate-count]");
        if (c) c.textContent = "Count me!";
      });
      if (speakIt) {
        speak(`${q.total} shared equally onto ${q.plates} plates! Count how many are on one plate.`);
      }
    };

    plateEls.forEach((p) => (p.onclick = () => dealPlates(true)));
    dealBtn.onclick = () => dealPlates(true);

    fsStage.append(header, platesGrid, dealBtn);
    visualCard.append(fsStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.total}</span>
      <span class="eq-op">÷</span>
      <span class="eq-token">${q.plates}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.animateVisualStep = () => {
      if (!dealt) dealPlates(false);
    };

    stageEl.revealSolution = () => {
      if (!dealt) dealPlates(false);
      plateEls.forEach((p) => {
        const c = p.querySelector("[data-plate-count]");
        if (c) c.textContent = `${q.answer} each`;
      });
      fillEquationSlots();
    };
  }

  // ── 12. GROUPING DIVISION (Pack into Boxes) ──
  else if (q.kind === "group-div") {
    let packed = false;
    const gdStage = el("div", { class: "group-div-stage" });
    const header = el("div", {
      class: "pile-title",
      html: `${q.emoji || "📦"} Pack <b>${q.total}</b> beads into boxes of <b>${q.size}</b>`,
    });
    const boxesGrid = el("div", { class: "boxes-grid" });

    const packBtn = el("button", {
      class: "btn small pill action-helper-btn pulse",
      html: `📦 Tap to Pack ${q.total} into Boxes of ${q.size}!`,
    });

    const showPackedBoxes = (speakIt = true) => {
      if (!packed) {
        packed = true;
        sfx.pop();
        boxesGrid.innerHTML = "";
        for (let b = 0; b < q.answer; b++) {
          const box = el("button", {
            class: "pack-box packed",
            html: `
              <div class="pack-box-head">📦 Box #${b + 1}</div>
              <div class="pack-box-beads">${beadBarSvg(q.size, 11)}</div>
              <div class="pack-box-sub">${q.size} inside</div>
            `,
            onclick: () => {
              sfx.tap();
              speak(`Box ${b + 1}`);
            },
          });
          boxesGrid.append(box);
        }
        packBtn.classList.remove("pulse");
        packBtn.innerHTML = `✨ Packed! Count how many boxes of ${q.size} we filled!`;
      }
      if (speakIt) {
        speak(`Packed into boxes of ${q.size}! Count how many boxes there are.`);
      }
    };

    // Start with 1 sample box of size q.size so the child sees the box size without giving away the box count
    const sampleBox = el("div", {
      class: "pack-box",
      html: `
        <div class="pack-box-head">📦 Each Box Holds ${q.size}</div>
        <div class="pack-box-beads">${beadBarSvg(q.size, 11)}</div>
        <div class="pack-box-sub">How many boxes for ${q.total}?</div>
      `,
    });
    boxesGrid.append(sampleBox);
    packBtn.onclick = () => showPackedBoxes(true);

    gdStage.append(header, boxesGrid, packBtn);
    visualCard.append(gdStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.total}</span>
      <span class="eq-op">÷</span>
      <span class="eq-token">${q.size}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
      <span class="eq-word">boxes</span>
    `;

    stageEl.animateVisualStep = () => {
      showPackedBoxes(false);
    };

    stageEl.revealSolution = () => {
      showPackedBoxes(false);
      fillEquationSlots();
    };
  }

  // ── 13. FACT FAMILY TRIANGLES (× and ÷) ──
  else if (q.kind === "fact-family") {
    const ffStage = el("div", { class: "fact-family-stage" });
    ffStage.innerHTML = `
      <div class="fact-triangle-card">
        <div class="tri-top">
          <span class="tri-tag">Product (Total)</span>
          <div class="tri-node top">${q.product}</div>
        </div>
        <div class="tri-ops-mid"><span>×</span> <span>÷</span></div>
        <div class="tri-base">
          <div class="tri-node left">${q.a}</div>
          <div class="tri-node right empty-box">?</div>
        </div>
      </div>
      <div class="fact-partner-pill">
        🔗 Partner Fact: <b>${q.a} × <span class="empty-box inline-slot">?</span> = ${q.product}</b>
      </div>
    `;
    visualCard.append(ffStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.product}</span>
      <span class="eq-op">÷</span>
      <span class="eq-token">${q.a}</span>
      <span class="eq-op">=</span>
      <span class="empty-box">?</span>
    `;

    stageEl.revealSolution = () => {
      ffStage.querySelectorAll(".empty-box").forEach((b) => {
        b.textContent = String(q.answer);
        b.classList.add("filled", "pop-in");
      });
      fillEquationSlots();
    };
  }

  // ── 14. MISSING FACTOR MYSTERY (Known × □ = Product) ──
  else if (q.kind === "missing-factor") {
    const mfStage = el("div", { class: "missing-factor-stage" });
    const barsRow = el("div", { class: "mf-bars-row" });
    let countAdded = 1;

    const renderBars = (nBars) => {
      barsRow.innerHTML = "";
      for (let i = 0; i < nBars; i++) {
        barsRow.append(
          el("div", {
            class: "mf-bar-chip",
            html: `${beadBarSvg(q.known, 10)}<span>Bar #${i + 1} → <b>${(i + 1) * q.known}</b></span>`,
          })
        );
      }
    };
    renderBars(1);

    const addBarBtn = el("button", {
      class: "btn small pill action-helper-btn",
      html: `➕ Tap to Add Another Bar of ${q.known} (Total: ${q.known} / ${q.product})`,
      onclick: () => {
        if (countAdded < q.answer) {
          countAdded++;
          sfx.pop();
          renderBars(countAdded);
          const curTotal = countAdded * q.known;
          addBarBtn.innerHTML =
            curTotal >= q.product
              ? `✨ Reached ${q.product}! Count how many bars of ${q.known}!`
              : `➕ Tap to Add Another Bar of ${q.known} (Total: ${curTotal} / ${q.product})`;
          speak(`${curTotal}`);
        } else {
          sfx.tap();
          speak(`${countAdded} bars make ${q.product}!`);
        }
      },
    });

    const callout = el("div", {
      class: "nd-helper-callout",
      html: `🧩 How many bars of <b>${q.known}</b> does it take to reach <b>${q.product}</b>?`,
    });
    mfStage.append(callout, barsRow, addBarBtn);
    visualCard.append(mfStage);

    eqBar.innerHTML = `
      <span class="eq-token">${q.known}</span>
      <span class="eq-op">×</span>
      <span class="empty-box">?</span>
      <span class="eq-op">=</span>
      <span class="eq-token">${q.product}</span>
    `;

    stageEl.animateVisualStep = () => {
      countAdded = q.answer;
      renderBars(q.answer);
    };

    stageEl.revealSolution = () => {
      countAdded = q.answer;
      renderBars(q.answer);
      fillEquationSlots();
    };
  }

  // ── CHOICE BUTTONS (Colorful tactile Montessori answer tiles) ──
  (q.options || []).forEach((opt) => {
    const color = beadColorFor(opt <= 10 ? opt : (opt % 10) || 10);
    const btn = el("button", {
      class: "choice-tile-btn",
      style: `--tile-accent:${color.fill}`,
      html: `
        <span class="choice-num">${opt}</span>
        ${opt >= 1 && opt <= 10 ? `<span class="choice-mini-bar">${beadBarSvg(opt, 7)}</span>` : ""}
      `,
      onclick: () => {
        onPick(opt, btn, choiceBtns);
      },
    });
    choiceBtns.push(btn);
    choicesWrap.append(btn);
  });

  wrap.append(visualCard, eqBar, choicesWrap);
  stageEl.append(wrap);
  enableBeadCounting(visualCard);
}

/**
 * "Tap the beads to count them" works on every board: tapping a ten-bar (or a ones bar) counts on
 * by its beads ("10… 20… 30…"), and tapping any other bead bar lights its beads one at a time, with
 * a note for each, then says how many. Buttons on the board keep their own taps.
 */
function enableBeadCounting(root) {
  let running = 0, busy = false;
  root.addEventListener("click", (e) => {
    if (e.target.closest("button, .choice-tile-btn")) return;
    const group = e.target.closest(".gold-ten-col, .ten-bar-wrap, .unit-bar-wrap");
    if (group) {
      const n = group.querySelectorAll("circle[stroke]").length;
      if (!group.classList.contains("counted")) {
        running += n;
        group.classList.add("counted");
        let badge = group.querySelector(".count-badge");
        if (!badge) { badge = document.createElement("span"); badge.className = "count-badge"; group.append(badge); }
        badge.textContent = String(running);
        sfx.pop();
      }
      speak(String(running));
      return;
    }
    const bar = e.target.closest(".bead-bar-svg");
    if (!bar || busy) return;
    const beads = [...bar.querySelectorAll("circle[stroke]")];
    if (!beads.length) return;
    busy = true;
    beads.forEach((b) => b.classList.remove("lit"));
    beads.forEach((b, i) => setTimeout(() => {
      b.classList.add("lit");
      sfx.key ? sfx.key(i + 1) : sfx.pop();
      if (i === beads.length - 1) { speak(String(beads.length)); busy = false; }
    }, i * 260));
  });
}
