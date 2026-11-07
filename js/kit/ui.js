// Shared screens and bits: escaping, stars, the "Next" button, the finish screen with stickers,
// the grown-ups settings card, and a click sound for every button.

import * as S from "./store.js";
import { speak, stop, browserVoices } from "./tts.js";
import { health } from "./api.js";
import { sfx } from "./sound.js";
import { confetti } from "./fx.js";
import { spoken } from "./speech.js";

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const STICKERS = ["🦄", "🚀", "🦖", "🌈", "🍕", "🐙", "⚽", "🎈", "🦋", "🍩", "🐢", "🌟", "🐝", "🍦", "🦕", "🐼", "🏆", "🎸", "🐬", "🍉"];

export const starsHtml = (n) => `<span class="stars" aria-label="${n} of 3 stars">${"★".repeat(n)}<span class="off">${"★".repeat(3 - n)}</span></span>`;
export const starsFor = (mistakes) => (mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1);

/** A big pulsing button in the dock; resolves when pressed (or Enter). */
export function nextButton(dock, label) {
  dock.innerHTML = `<button class="btn big primary pulse" data-next>${label}</button>`;
  return new Promise((resolve) => {
    const go = () => { document.removeEventListener("keydown", onKey); resolve(); };
    const onKey = (e) => { if (e.key === "Enter") go(); };
    dock.querySelector("[data-next]").onclick = go;
    document.addEventListener("keydown", onKey);
  });
}

/** Show a message in the speech bubble and say it. */
export function say(bubble, text, { speakText = true, spokenOverride = null } = {}) {
  const p = bubble.querySelector(".say");
  p.innerHTML = text;
  bubble.lastSaid = spoken(spokenOverride ?? text);
  bubble.animate?.([{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }], { duration: 300 });
  if (speakText) speak(bubble.lastSaid);
}

/** Stars, a sticker (big for perfect, mini if mistakes), confetti and "play again / next". */
export function showFinish(app, { id, stars, mistakes, title, done, again, next, onAgain }) {
  document.body.classList.remove("in-game");
  const isPerfect = mistakes === 0;
  const chosenEmoji = pick(STICKERS);
  const stickerEntry = isPerfect ? chosenEmoji : { emoji: chosenEmoji, mini: true };
  S.finishLevel(id, stars, stickerEntry);
  sfx.fanfare();
  confetti(isPerfect ? 100 : 40);
  app.innerHTML = `
    <section class="finish">
      <div class="big-stars">${starsHtml(stars)}</div>
      <h1>${isPerfect ? "Perfect Score! 🌟" : title}</h1>
      <p class="new-sticker ${isPerfect ? "big-sticker" : "mini-sticker"}">
        <span>${chosenEmoji}</span><br>
        ${isPerfect ? "🌟 Giant Perfect Sticker!" : "Mini Sticker Earned!"}
      </p>
      <p class="muted">
        ${isPerfect
          ? "You got every single question right on your own! Wow!"
          : "Almost there! Try the lesson again with no mistakes to win a GIANT sticker!"}
      </p>
      <div class="row center">
        <a class="btn big ${isPerfect ? "" : "primary pulse"}" href="${again}" data-again>
          🔁 ${isPerfect ? "Play again" : "Try Again for Perfect!"}
        </a>
        ${next ? `<a class="btn big ${isPerfect ? "primary" : ""}" href="${next.href}">${next.label}</a>` : `<a class="btn big ${isPerfect ? "primary" : ""}" href="#/">🏠 Home</a>`}
      </div>
    </section>`;
  speak(
    isPerfect
      ? "Amazing job! You got a perfect score and earned a giant sticker!"
      : "Good practice! You got a mini sticker. Try the lesson again to get a perfect score and win a giant sticker!"
  );
  if (onAgain) app.querySelector("[data-again]").onclick = (e) => { e.preventDefault(); onAgain(); };
}

export function stickerBook() {
  const st = S.stickers();
  const renderSticker = (s) => {
    if (s && typeof s === "object") {
      return `<span class="sticker-item mini" title="Mini sticker">${s.emoji || "⭐"}</span>`;
    }
    return `<span class="sticker-item big" title="Giant Perfect Sticker">${s}</span>`;
  };
  return `<section class="sticker-book">
      <h2>My stickers <small>${S.solved()} solved</small></h2>
      ${st.length ? `<div class="stickers">${st.map(renderSticker).join("")}</div>` : `<p class="muted small">Finish a level to get your first sticker!</p>`}
    </section>`;
}

/** The grown-ups page: settings shared by every app, plus an app-specific "how it teaches" note. */
export async function viewGrownups(app, { extraToggles = [], about = "" } = {}) {
  const s = S.settings();
  const toggle = (k, label, sub) => `<label class="set"><span><b>${label}</b>${sub ? `<br><span class="muted small">${sub}</span>` : ""}</span><input type="checkbox" data-k="${k}" ${s[k] ? "checked" : ""}></label>`;
  app.innerHTML = `
    <section>
      <h1>For grown-ups</h1>
      <div class="card">
        ${toggle("readAloud", "Read aloud", "Says every step out loud, for kids who are still learning to read.")}
        ${toggle("slow", "Slower voice", "")}
        ${toggle("sounds", "Sound effects", "")}
        ${extraToggles.map(([k, label, sub]) => toggle(k, label, sub)).join("")}
        <label class="set"><span><b>Voice</b><br><span class="muted small" data-voice-status>Checking…</span></span>
          <select data-k="ttsSource"><option value="auto">Best available</option><option value="server">Cloudflare voice</option><option value="browser">This device's voice</option></select></label>
        <label class="set"><span><b>Cloudflare Voice Character</b><br><span class="muted small">Aura-2 Neural Voice (Helena and Thalia are great for kids)</span></span>
          <select data-k="voice">
            <option value="thalia">Thalia (Clear & Bright)</option>
            <option value="helena">Helena (Warm & Natural - SLP favorite)</option>
            <option value="luna">Luna (Gentle & Calm)</option>
            <option value="asteria">Asteria (Lively)</option>
            <option value="aurora">Aurora (Expressive)</option>
            <option value="apollo">Apollo (Friendly)</option>
            <option value="orion">Orion (Deep)</option>
          </select></label>
        <label class="set"><span><b>Passcode</b><br><span class="muted small">Only if APP_PASSCODE is set on the Worker.</span></span><input type="password" data-k="passcode" value="${esc(s.passcode)}" autocomplete="off"></label>
        <div class="row"><button class="btn small" data-test>🔊 Test the voice</button><button class="btn small danger" data-reset>Reset progress</button></div>
      </div>
      ${about ? `<h2>How it teaches</h2><div class="card prose">${about}</div>` : ""}
      <p class="muted small">Progress is saved in this browser only. Nothing is sent anywhere except the sentences read aloud, if the Cloudflare voice is on (they aren't stored).</p>
    </section>`;
  app.querySelector('[data-k="ttsSource"]').value = s.ttsSource;
  const voiceSelect = app.querySelector('[data-k="voice"]');
  if (voiceSelect && s.voice) voiceSelect.value = s.voice;
  app.querySelectorAll("[data-k]").forEach((el) => {
    el.onchange = () => S.setSetting(el.dataset.k, el.type === "checkbox" ? el.checked : el.value);
  });
  app.querySelector("[data-test]").onclick = () => speak("Hello! Let's learn something fun.", { force: true });
  app.querySelector("[data-reset]").onclick = () => {
    if (confirm("Reset all stars and stickers?")) { S.resetProgress(); location.hash = "#/"; }
  };
  const h = await health();
  const st = app.querySelector("[data-voice-status]");
  if (st) st.textContent = h.tts ? "Cloudflare voice is available." : `Using this device's voice${browserVoices().length ? "" : " (if it has one)"}.`;
}

/** Every button and link clicks, except ones that make their own sound (mark them data-own-sound). */
export function installClickSounds(skip = "[data-own-sound], .key, .choice-card, .toggle") {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("button, a");
    if (!el || el.matches(skip) || el.disabled) return;
    sfx.click();
  }, true);
}

/** A voice / read-aloud toggle button. */
export function wireVoiceToggle(btn) {
  btn.setAttribute("aria-pressed", S.settings().readAloud);
  btn.onclick = () => {
    const on = !S.settings().readAloud;
    S.setSetting("readAloud", on);
    btn.setAttribute("aria-pressed", on);
    sfx.toggle();
    if (!on) stop();
  };
}
