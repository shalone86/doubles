// Game controller for Doubles, Halves, Multiplication & Division.
// Includes compact mobile-friendly Lesson Onboarding (with animated example + Skip ⏭),
// varied follow-up voice prompts that NEVER leak the answer,
// 1st-mistake hint, 2nd-mistake guided answer reveal + yellow progress dot (.assisted),
// and Mini Sticker vs Giant Perfect Sticker finish screen.

import {
  S,
  el,
  sfx,
  speak,
  stopSpeak,
  spoken,
  burst,
  setDock,
  finishCard,
  makeStage,
  lessonIntroFor,
  STAGES,
} from "./kit/index.js";
import { renderExerciseBoard } from "./board.js";

const FOLLOWUP_PROMPTS = [
  "Let's try this one!",
  "Now, try this question!",
  "Here comes the next one!",
  "Your turn on this one!",
  "Let's see how you do with this one!",
  "Ready for the next puzzle?",
];

const PRAISE = ["Awesome!", "Yes!", "You got it!", "Great job!", "That's right!", "Super!", "Nice work!", "Wonderful!", "Way to go!",
  "Your guardian angel is cheering for you!", "Way to let your light shine!"];
let lastPraise = -1;
function nextPraise() {
  let i;
  do i = Math.floor(Math.random() * PRAISE.length); while (i === lastPraise);
  lastPraise = i;
  return PRAISE[i];
}

export class Game {
  constructor(stage, mount, onExit) {
    this.stage = stage;
    this.mount = mount;
    this.onExit = onExit;
    const seen = S.seenQuestions(stage.id);
    this.questions = makeStage(stage, Date.now() & 0xffff, seen);
    S.rememberQuestions(
      stage.id,
      this.questions.map((q) => q._key).filter(Boolean)
    );
    this.idx = 0;
    this.mistakes = 0;
    this.qMistakes = 0;
    this.startedAt = performance.now();
    this.onboardingShown = false;
    this.onboardingTimers = [];
    this.build();
  }

  clearOnboardingTimers() {
    this.onboardingTimers.forEach((t) => clearTimeout(t));
    this.onboardingTimers = [];
  }

  build() {
    if (typeof document !== "undefined") {
      document.body.classList.add("in-game");
    }
    this.mount.innerHTML = "";

    this.dots = this.questions.map(() => el("i"));
    const topbar = el("div", { class: "play-top" }, [
      el("button", {
        class: "btn small pill",
        text: "← Back",
        onclick: () => {
          this.clearOnboardingTimers();
          stopSpeak();
          this.onExit();
        },
      }),
      el("div", { class: "dots" }, this.dots),
      el("button", {
        class: "btn small pill",
        html: "🎬 Watch",
        title: "Watch a step-by-step animated example",
        onclick: () => {
          this.clearOnboardingTimers();
          stopSpeak();
          location.hash = `#/watch/${this.stage.id}`;
        },
      }),
      el("button", {
        class: "btn small pill",
        html: "🔊",
        title: "Read aloud",
        onclick: () => this.readCurrent(),
      }),
    ]);

    this.promptCard = el("div", { class: "prompt-banner" });
    this.feedbackBanner = el("div", { class: "feedback-banner hidden" });
    this.stageEl = el("div", { class: "exercise-stage" });

    this.mount.append(topbar, this.promptCard, this.feedbackBanner, this.stageEl);

    if (!this.onboardingShown) {
      this.showOnboarding();
    } else {
      this.loadQuestion(0);
    }
  }

  showOnboarding() {
    this.clearOnboardingTimers();
    const intro = lessonIntroFor(this.stage);

    // Hide the prompt banner during onboarding so the screen stays compact on mobile
    this.promptCard.style.display = "none";
    this.feedbackBanner.className = "feedback-banner hidden";
    this.stageEl.innerHTML = "";
    setDock([]);

    const startNow = () => {
      this.clearOnboardingTimers();
      sfx.go();
      stopSpeak();
      this.onboardingShown = true;
      this.loadQuestion(0);
    };

    const exBox = el("div", {
      class: "onboarding-example",
      html: `
        <div class="onboarding-ex-label">✨ Example</div>
        <div class="onboarding-ex-body">${intro.exampleHtml}</div>
      `,
    });

    // Animate the .onboarding-focus elements inside the compact example box
    const animateExample = () => {
      this.clearOnboardingTimers();
      const focusEls = exBox.querySelectorAll(".onboarding-focus");
      const savedHtml = [];
      focusEls.forEach((f, i) => {
        savedHtml[i] = f.dataset.origHtml || f.innerHTML;
        f.dataset.origHtml = savedHtml[i];
        f.classList.remove("pop-in", "onboarding-focus-active");
        f.style.opacity = "0.35";
      });
      const t = setTimeout(() => {
        if (!exBox.isConnected) return;
        focusEls.forEach((f) => {
          f.style.opacity = "1";
          f.classList.add("pop-in", "onboarding-focus-active");
        });
        sfx.pop();
      }, 950);
      this.onboardingTimers.push(t);
    };

    const card = el("div", { class: "onboarding-card" }, [
      el("div", { class: "onboarding-head" }, [
        el("div", { class: "onboarding-title-wrap" }, [
          el("span", { class: "onboarding-emoji", text: this.stage.emoji }),
          el("div", {}, [
            el("div", { class: "onboarding-kicker", text: "How It Works" }),
            el("h2", { class: "onboarding-title-text", text: intro.title }),
          ]),
        ]),
        el("button", {
          class: "btn small ghosty",
          html: "Skip ⏭",
          onclick: startNow,
        }),
      ]),
      el("p", { class: "onboarding-rule", html: intro.rule }),
      exBox,
      el("div", { class: "onboarding-actions" }, [
        el("button", {
          class: "btn pill",
          html: "🔊 Listen",
          onclick: () => {
            animateExample();
            speak(intro.voice);
          },
        }),
        el("button", {
          class: "btn pill ghosty",
          html: "Skip ⏭",
          onclick: startNow,
        }),
        el("button", {
          class: "btn primary big pulse",
          html: "Start ▶",
          onclick: startNow,
        }),
      ]),
    ]);

    this.stageEl.append(card);
    animateExample();
    speak(intro.voice);
  }

  getSpokenText(q, isRepeat = false) {
    if (!q) return "";
    if (this.idx === 0 || isRepeat) {
      return spoken(q.instruction);
    }
    const lead = FOLLOWUP_PROMPTS[(this.idx - 1) % FOLLOWUP_PROMPTS.length];
    return `${lead} ${spoken(q.questionVoice || q.instruction)}`;
  }

  readCurrent() {
    const q = this.questions[this.idx];
    if (!q) return;
    speak(this.getSpokenText(q, true));
  }

  loadQuestion(k) {
    this.clearOnboardingTimers();
    this.promptCard.style.display = "";
    this.idx = k;
    this.qMistakes = 0;
    this.dots.forEach((d, i) => {
      d.classList.toggle("cur", i === k);
    });

    const q = this.questions[k];
    this.feedbackBanner.className = "feedback-banner hidden";
    this.feedbackBanner.innerHTML = "";

    this.promptCard.innerHTML = `
      <div class="prompt-mode">${this.stage.emoji} ${this.stage.title}</div>
      <div class="prompt-instruction">${q.instruction}</div>
    `;

    renderExerciseBoard(q, this.stageEl, (picked, btnEl, allBtns) =>
      this.handlePick(picked, btnEl, allBtns)
    );

    speak(this.getSpokenText(q, false));

    setDock([
      {
        icon: "🔊",
        label: "Repeat",
        onClick: () => this.readCurrent(),
      },
      {
        icon: "💡",
        label: "Hint",
        onClick: () => {
          sfx.pop();
          const gentleClue = q.clue
            ? `Think about ${q.clue}! Tap the board to count the beads.`
            : "Tap the board to count the beads!";
          this.showHint(gentleClue, false);
          speak(spoken(gentleClue));
        },
      },
    ]);
  }

  showHint(text, isError = false, actionBtn = null) {
    this.feedbackBanner.className = `feedback-banner ${isError ? "warn" : "info"}`;
    this.feedbackBanner.innerHTML = `<span>${isError ? "🤔 " : "💡 "}${text}</span>`;
    if (actionBtn) {
      this.feedbackBanner.append(actionBtn);
    }
  }

  handlePick(picked, btnEl, allBtns = []) {
    const q = this.questions[this.idx];
    const isCorrect = String(picked) === String(q.answer);

    if (isCorrect) {
      allBtns.forEach((b) => (b.disabled = true));
      if (btnEl) btnEl.classList.add("correct");
      if (this.stageEl.revealSolution) this.stageEl.revealSolution();

      sfx.chime();
      const r = btnEl
        ? btnEl.getBoundingClientRect()
        : this.stageEl.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);

      this.feedbackBanner.className = "feedback-banner good";
      // Varied praise (never the same twice in a row), with a gentle Angelio touch now and then.
      const praise = nextPraise();
      this.feedbackBanner.innerHTML = `<span>🌟 ${praise} ${q.hint}</span>`;
      speak(`${praise} ${spoken(q.hint)}`);

      setTimeout(() => this.advance(this.qMistakes > 0), 1250); // yellow dot if it took a mistake
    } else {
      this.mistakes++;
      this.qMistakes++;
      sfx.bonk();

      if (btnEl) {
        btnEl.classList.add("wrong");
        btnEl.disabled = true;
      }

      if (this.qMistakes === 1) {
        const tryHint = `Not quite! Tap the visual board above to count the beads and try again!`;
        this.showHint(tryHint, true);
        speak(tryHint);
      } else {
        allBtns.forEach((b) => {
          b.disabled = true;
          const numEl = b.querySelector(".choice-num");
          const val = numEl ? numEl.textContent.trim() : b.textContent.trim();
          if (val === String(q.answer)) {
            b.classList.add("correct");
          }
        });
        if (this.stageEl.revealSolution) {
          this.stageEl.revealSolution();
        }

        const nextBtn = el("button", {
          class: "btn primary small pill",
          style: "margin-left:auto",
          text: "Next Question ▶",
          onclick: () => {
            sfx.pop();
            stopSpeak();
            this.advance(true);
          },
        });
        this.showHint(`I'll give you the answer! ${q.hint}`, false, nextBtn);
        setDock([
          el("button", {
            class: "btn big primary pulse",
            text: "Next Question ▶",
            onclick: () => {
              sfx.pop();
              stopSpeak();
              this.advance(true);
            },
          }),
        ]);
        speak(`I'll give you the answer! ${spoken(q.hint)}`);
      }
    }
  }

  advance(wasAssisted = false) {
    const dot = this.dots[this.idx];
    if (dot) {
      dot.classList.remove("cur");
      dot.classList.add(wasAssisted ? "assisted" : "done");
    }
    if (this.idx + 1 < this.questions.length) {
      this.loadQuestion(this.idx + 1);
    } else {
      this.finish();
    }
  }

  finish() {
    if (typeof document !== "undefined") {
      document.body.classList.remove("in-game");
    }
    const stars = this.mistakes === 0 ? 3 : this.mistakes <= 2 ? 2 : 1;
    const isPerfect = this.mistakes === 0;
    const got = S.recordStage(this.stage.id, stars, this.stage.emoji, isPerfect);

    this.mount.innerHTML = "";
    const seconds = (performance.now() - this.startedAt) / 1000;
    if (seconds < 120 && stars >= 2) sfx.fanfare();

    const voiceSummary = isPerfect
      ? `Amazing job! You got every single question right and earned a giant ${this.stage.title} sticker!`
      : `Good practice! You earned a mini sticker. Try the lesson again to turn every yellow dot green and win the giant sticker!`;

    const curIdx = STAGES.findIndex((s) => s.id === this.stage.id);
    const nextStage = curIdx >= 0 && curIdx + 1 < STAGES.length ? STAGES[curIdx + 1] : null;

    const card = finishCard({
      title: isPerfect ? "Perfect Score!" : `${this.stage.title} Complete!`,
      stars,
      sticker: this.stage.emoji,
      perfect: isPerfect,
      grew: !!got?.grew,
      subtitle: isPerfect
        ? "You solved every problem on your own! Giant sticker unlocked!"
        : "You got a mini sticker! Replay the lesson to get all green dots and unlock the giant sticker!",
      spokenOverride: voiceSummary,
      nextLabel: nextStage ? `Next: ${nextStage.emoji} ${nextStage.title} ▶` : null,
      onNextLesson: nextStage ? () => new Game(nextStage, this.mount, this.onExit) : null,
      onReplay: () => new Game(this.stage, this.mount, this.onExit),
      onNext: () => this.onExit(),
    });
    this.mount.append(card);
    setDock([]);
  }
}
