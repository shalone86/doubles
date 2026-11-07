// Turn bubble HTML ("6 + 6 = <b>?</b>") into clean text for the voice ("6 plus 6 is what?").
// Pure function, no DOM, so it's easy to test in Node.

const NUM_WORDS_0_20 = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
];
const TENS_WORDS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

export function numberToWords(n) {
  const num = Number(n);
  if (!Number.isInteger(num) || num < 0 || num > 100) return String(n);
  if (num <= 20) return NUM_WORDS_0_20[num];
  if (num === 100) return "One hundred";
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  return ones === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]}-${NUM_WORDS_0_20[ones].toLowerCase()}`;
}

export function spoken(html) {
  const s = String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&times;/g, " times ")
    .replace(/&divide;/g, " divided by ")
    .replace(/&minus;|&#8722;/g, " minus ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, " and ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/(\d+)\s*[×✕*]\s*(\d+)/g, "$1 times $2")
    .replace(/(\d+)\s*[÷/]\s*(\d+)/g, "$1 divided by $2")
    .replace(/(\d+)\s*\+\s*(\d+)/g, "$1 plus $2")
    .replace(/(\d+)\s*[-−–]\s*(\d+)/g, "$1 minus $2")
    .replace(/=\s*\?/g, "equals what?")
    .replace(/=\s*[□_]+/g, "equals blank")
    .replace(/=/g, " equals ")
    .replace(/[□_]{1,}/g, " blank ")
    .replace(/[×✕]/g, " times ")
    .replace(/÷/g, " divided by ")
    // Strip decorative symbols and emojis so TTS doesn't read symbol names
    .replace(/[▲●◡▬♠⎵★☆✓✕🎉🎊✨💡🔊🔁🏠⚙️🎬📐⚡📝🐣🦊🦉🐞🦋🍪🧺🍽️✂️🔺]/gu, " ")
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (/^\d+$/.test(s)) {
    return `${numberToWords(Number(s))}.`;
  }
  return s;
}
