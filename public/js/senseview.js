// Interactive Number Sense Quiz view (#/sense) for Grades 1, 2, and 3.

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
  makeSenseRound,
} from "./kit/index.js";

const FOLLOWUP_LEADS = [
  "Let's try this one!",
  "Now, try this question!",
  "Here comes the next one!",
  "Your turn on this question!",
];

export function renderSense(mount) {
  let grade = 1;

  function startGrade(g) {
    grade = g;
    mount.innerHTML = "";
    const stageKey = `sense-g${grade}`;
    const seen = S.seenQuestions(stageKey);
    const questions = makeSenseRound(grade, Date.now() & 0xffff, seen);
    S.rememberQuestions(
      stageKey,
      questions.map((q) => q._key).filter(Boolean)
    );

    let idx = 0;
    let mistakes = 0;
    let qMistakes = 0;

    const dots = questions.map(() => el("i"));
    const topbar = el("div", { class: "topbar" }, [
      el("button", {
        class: "btn small pill",
        text: "← Home",
        onclick: () => {
          stopSpeak();
          location.hash = "#/";
        },
      }),
      el(
        "div",
        { style: "display:flex;gap:6px" },
        [1, 2, 3].map((gr) =>
          el("button", {
            class: `btn small pill ${grade === gr ? "primary" : ""}`,
            text: `Grade ${gr}`,
            onclick: () => {
              sfx.pop();
              stopSpeak();
              startGrade(gr);
            },
          })
        )
      ),
      el("div", { class: "dots" }, dots),
    ]);

    const promptCard = el("div", { class: "prompt-banner" });
    const feedbackBanner = el("div", { class: "feedback-banner hidden" });
    const optionsWrap = el("div", { class: "sense-options-list" });

    mount.append(topbar, promptCard, feedbackBanner, optionsWrap);

    function loadQ(k) {
      idx = k;
      qMistakes = 0;
      dots.forEach((d, i) => d.classList.toggle("cur", i === k));
      feedbackBanner.className = "feedback-banner hidden";
      optionsWrap.innerHTML = "";

      const q = questions[k];
      promptCard.innerHTML = `
        <div class="prompt-mode">🧠 Grade ${grade} Number Sense — Question ${k + 1} of ${questions.length}</div>
        <div class="prompt-instruction">${q.prompt}</div>
      `;

      const btns = [];
      q.options.forEach((opt) => {
        const btn = el("button", {
          class: "sense-option-btn",
          text: opt,
          onclick: () => onPick(opt, btn, btns),
        });
        btns.push(btn);
        optionsWrap.append(btn);
      });

      const lead = k === 0 ? "" : `${FOLLOWUP_LEADS[(k - 1) % FOLLOWUP_LEADS.length]} `;
      speak(`${lead}${q.speak || spoken(q.prompt)}`);

      setDock([
        {
          icon: "🔊",
          label: "Read Question",
          onClick: () => speak(q.speak || spoken(q.prompt)),
        },
        {
          icon: "💡",
          label: "Hint",
          onClick: () => {
            sfx.pop();
            feedbackBanner.className = "feedback-banner info";
            feedbackBanner.innerHTML = `<span>💡 ${q.explain}</span>`;
            speak(spoken(q.explain));
          },
        },
      ]);
    }

    function onPick(picked, btn, allBtns) {
      const q = questions[idx];
      if (picked === q.answer) {
        allBtns.forEach((b) => (b.disabled = true));
        btn.classList.add("correct");
        sfx.chime();
        const r = btn.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2);

        feedbackBanner.className = "feedback-banner good";
        feedbackBanner.innerHTML = `<span>🌟 Correct! ${q.explain}</span>`;
        speak(`Yes! ${spoken(q.explain)}`);
        setTimeout(() => advance(qMistakes > 0), 1200); // yellow dot if it took a mistake
      } else {
        mistakes++;
        qMistakes++;
        sfx.bonk();
        btn.classList.add("wrong");
        btn.disabled = true;

        if (qMistakes === 1) {
          feedbackBanner.className = "feedback-banner warn";
          feedbackBanner.innerHTML = `<span>🤔 Not quite! ${q.explain}</span>`;
          speak(`Not quite! ${spoken(q.explain)}`);
        } else {
          allBtns.forEach((b) => {
            b.disabled = true;
            if (b.textContent.trim() === q.answer) {
              b.classList.add("correct");
            }
          });
          const nextBtn = el("button", {
            class: "btn primary small pill",
            style: "margin-left:auto",
            text: "Next ▶",
            onclick: () => {
              sfx.pop();
              stopSpeak();
              advance(true);
            },
          });
          feedbackBanner.className = "feedback-banner info";
          feedbackBanner.innerHTML = `<span>💡 I'll give you the answer! ${q.explain}</span>`;
          feedbackBanner.append(nextBtn);
          speak(`I'll give you the answer! ${spoken(q.explain)}`);
        }
      }
    }

    function advance(wasAssisted) {
      const dot = dots[idx];
      if (dot) {
        dot.classList.remove("cur");
        dot.classList.add(wasAssisted ? "assisted" : "done");
      }
      if (idx + 1 < questions.length) {
        loadQ(idx + 1);
      } else {
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        const isPerfect = mistakes === 0;
        S.recordStage(stageKey, stars, "🧠", isPerfect);
        mount.innerHTML = "";
        mount.append(
          finishCard({
            title: isPerfect
              ? `Perfect Grade ${grade} Number Sense!`
              : `Grade ${grade} Number Sense Complete!`,
            stars,
            sticker: "🧠",
            perfect: isPerfect,
            subtitle: isPerfect
              ? "You mastered every single Number Sense question!"
              : "You got a mini sticker! Replay to get all green dots and earn the giant sticker!",
            onReplay: () => startGrade(grade),
            onNext: () => (location.hash = "#/"),
          })
        );
        setDock([]);
      }
    }

    loadQ(0);
  }

  startGrade(1);
}
