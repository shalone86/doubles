// Auto-playing "Watch How" animated worked-example viewer (#/watch/:id).

import {
  el,
  sfx,
  speak,
  stopSpeak,
  spoken,
  burst,
  setDock,
  STAGES,
  makeStage,
  lessonIntroFor,
} from "./kit/index.js";
import { renderExerciseBoard } from "./board.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function renderWatch(mount, stageId) {
  mount.innerHTML = "";
  const stage = STAGES.find((s) => s.id === stageId) || STAGES[0];
  const intro = lessonIntroFor(stage);
  const sampleQ = makeStage(stage, 42)[0];

  let runId = 0;

  const topbar = el("div", { class: "topbar" }, [
    el("button", {
      class: "btn small pill",
      text: "← Back",
      onclick: () => {
        runId++;
        stopSpeak();
        location.hash = `#/play/${stage.id}`;
      },
    }),
    el("div", { class: "grow" }, [
      el("h2", {
        style: "margin:0;font-size:20px",
        text: `🎬 Watch How: ${stage.title}`,
      }),
    ]),
    el("button", {
      class: "btn primary small pill",
      text: "▶ Try It Yourself!",
      onclick: () => {
        runId++;
        stopSpeak();
        location.hash = `#/play/${stage.id}`;
      },
    }),
  ]);

  const stepBanner = el("div", { class: "prompt-banner" });
  const boardWrap = el("div", { class: "exercise-stage" });

  async function autoPlayWalkthrough() {
    const myRun = ++runId;
    stopSpeak();

    boardWrap.innerHTML = "";
    renderExerciseBoard(sampleQ, boardWrap, () => {});
    boardWrap.querySelectorAll("button.choice-tile-btn").forEach((b) => {
      b.disabled = true;
    });

    // Step 1: Explain the rule & problem
    stepBanner.innerHTML = `
      <div class="prompt-mode">🎬 Step 1 of 3 — Look at the Problem</div>
      <div class="prompt-instruction">${sampleQ.instruction}</div>
    `;
    await speak(`${intro.title}. ${spoken(sampleQ.instruction)}`);
    if (myRun !== runId || !boardWrap.isConnected) return;
    await sleep(600);
    if (myRun !== runId || !boardWrap.isConnected) return;

    // Step 2: Animate the visual board (mirror, split, array, deal, pack)
    stepBanner.innerHTML = `
      <div class="prompt-mode">✨ Step 2 of 3 — Watch the Visual Board!</div>
      <div class="prompt-instruction">${intro.exampleExplain}</div>
    `;
    if (boardWrap.animateVisualStep) {
      boardWrap.animateVisualStep();
    }
    sfx.pop();
    await speak(spoken(intro.exampleExplain));
    if (myRun !== runId || !boardWrap.isConnected) return;
    await sleep(600);
    if (myRun !== runId || !boardWrap.isConnected) return;

    // Step 3: Reveal the answer in the orange box and highlight the winning tile!
    stepBanner.innerHTML = `
      <div class="prompt-mode">🌟 Step 3 of 3 — Fill the Answer Box!</div>
      <div class="prompt-instruction">${sampleQ.hint} The answer is ${sampleQ.answer}!</div>
    `;
    if (boardWrap.revealSolution) {
      boardWrap.revealSolution();
    }
    boardWrap.querySelectorAll("button.choice-tile-btn").forEach((b) => {
      const numEl = b.querySelector(".choice-num");
      const val = numEl ? numEl.textContent.trim() : b.textContent.trim();
      if (val === String(sampleQ.answer)) {
        b.classList.add("correct");
      }
    });
    sfx.chime();
    burst();
    await speak(`${spoken(sampleQ.hint)} The answer is ${sampleQ.answer}!`);
  }

  const controls = el(
    "div",
    {
      style:
        "display:flex;justify-content:center;gap:12px;margin-top:14px;flex-wrap:wrap",
    },
    [
      el("button", {
        class: "btn pill",
        text: "🔄 Replay Animation",
        onclick: () => {
          sfx.pop();
          autoPlayWalkthrough();
        },
      }),
      el("button", {
        class: "btn primary big pulse",
        text: "🎮 Play This Lesson Now!",
        onclick: () => {
          runId++;
          sfx.go();
          stopSpeak();
          location.hash = `#/play/${stage.id}`;
        },
      }),
    ]
  );

  mount.append(topbar, stepBanner, boardWrap, controls);
  autoPlayWalkthrough();

  setDock([
    {
      icon: "🔄",
      label: "Replay",
      onClick: () => autoPlayWalkthrough(),
    },
    {
      icon: "▶",
      label: "Play Now",
      primary: true,
      pulse: true,
      onClick: () => {
        runId++;
        stopSpeak();
        location.hash = `#/play/${stage.id}`;
      },
    },
  ]);
}
