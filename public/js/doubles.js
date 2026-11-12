// Doubles! Curriculum data, Montessori bead bar colors, problem banks, rotating stage generator,
// and onboarding explanations for Grades 1, 2, and 3.
// Pure ES module with no DOM dependencies so it can be unit-tested in Node.

import { numberToWords } from "./kit/speech.js";

export const QUESTIONS_PER_STAGE = 5;

/**
 * Classic Montessori Short Bead Stair colors (1 through 10).
 */
export const BEAD_COLORS = {
  1: { n: 1, name: "Red (1)", color: "#ef4444", fill: "#ef4444", soft: "#fee2e2", ink: "#991b1b" },
  2: { n: 2, name: "Green (2)", color: "#16a34a", fill: "#16a34a", soft: "#dcfce7", ink: "#14532d" },
  3: { n: 3, name: "Pink (3)", color: "#ec4899", fill: "#ec4899", soft: "#fce7f3", ink: "#9d174d" },
  4: { n: 4, name: "Yellow (4)", color: "#eab308", fill: "#eab308", soft: "#fef9c3", ink: "#713f12" },
  5: { n: 5, name: "Light Blue (5)", color: "#0ea5e9", fill: "#0ea5e9", soft: "#e0f2fe", ink: "#0369a1" },
  6: { n: 6, name: "Purple (6)", color: "#9333ea", fill: "#9333ea", soft: "#f3e8ff", ink: "#6b21a8" },
  7: { n: 7, name: "Silver White (7)", color: "#64748b", fill: "#64748b", soft: "#f1f5f9", ink: "#334155" },
  8: { n: 8, name: "Chestnut Brown (8)", color: "#92400e", fill: "#92400e", soft: "#fef3c7", ink: "#78350f" },
  9: { n: 9, name: "Royal Blue (9)", color: "#1d4ed8", fill: "#1d4ed8", soft: "#dbeafe", ink: "#1e40af" },
  10: { n: 10, name: "Golden Ten (10)", color: "#f59e0b", fill: "#f59e0b", soft: "#fef3c7", ink: "#92400e" },
};

export function beadColorFor(n) {
  const k = Math.max(1, Math.min(10, ((Math.abs(Math.round(n)) - 1) % 10) + 1));
  return BEAD_COLORS[k] || BEAD_COLORS[10];
}

/**
 * Renders an inline SVG of a Montessori bead bar with `count` connected beads (1 to 10).
 */
export function beadBarSvg(count, beadRadius = 10) {
  const n = Math.max(1, Math.min(12, Math.round(count)));
  const meta = BEAD_COLORS[n] || beadColorFor(n);
  const d = beadRadius * 2;
  const gap = 2;
  const step = d + gap;
  const width = n * step + 6;
  const height = d + 6;
  const cy = height / 2;

  const circles = Array.from({ length: n }, (_, i) => {
    const cx = 3 + beadRadius + i * step;
    return `
      <circle cx="${cx}" cy="${cy}" r="${beadRadius}" fill="${meta.color}" stroke="#1c1917" stroke-width="1.5"/>
      <circle cx="${cx - beadRadius * 0.3}" cy="${cy - beadRadius * 0.3}" r="${beadRadius * 0.28}" fill="rgba(255,255,255,0.45)"/>
    `;
  }).join("");

  return `<svg class="bead-bar-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-label="${n} bead bar">
    <line x1="2" y1="${cy}" x2="${width - 2}" y2="${cy}" stroke="#78716c" stroke-width="2.5" stroke-linecap="round"/>
    ${circles}
  </svg>`;
}

export const WORLDS = [
  {
    id: 1,
    n: 1,
    hue: 28,
    title: "Grade 1: Mirror Doubles & Fair Halves",
    emoji: "🐞",
    blurb: "Twin doubles, near-doubles (+1), splitting even numbers into two fair baskets, and big tens doubles!",
    subtitle: "Twin doubles, near-doubles (+1), splitting even numbers into two fair baskets, and big tens doubles!",
  },
  {
    id: 2,
    n: 2,
    hue: 245,
    title: "Grade 2: Equal Groups, Doubling & Arrays (×)",
    emoji: "🦊",
    blurb: "Montessori bead groups, skip-counting stones, rows × columns arrays, and Double-Double (×4)!",
    subtitle: "Montessori bead groups, skip-counting stones, rows × columns arrays, and Double-Double (×4)!",
  },
  {
    id: 3,
    n: 3,
    hue: 158,
    title: "Grade 3: Fair Sharing Division (÷) & Fact Families",
    emoji: "🦉",
    blurb: "Deal items equally onto plates, bundle groups, master × and ÷ fact-family triangles, and find missing factors!",
    subtitle: "Deal items equally onto plates, bundle groups, master × and ÷ fact-family triangles, and find missing factors!",
  },
];

export const STAGES = [
  // ── WORLD 1 (Grade 1) ──
  {
    id: "g1-mirror-doubles",
    world: 1,
    title: "Mirror Doubles (1+1 to 10+10)",
    emoji: "🐞",
    mode: "mirror-double",
    blurb: "Double the beads on the mirror board and see twin numbers add up!",
  },
  {
    id: "g1-fair-halves",
    world: 1,
    title: "Fair Halves (Split in 2!)",
    emoji: "🧺",
    mode: "fair-half",
    blurb: "Share an even number of treats equally into two baskets to find half!",
  },
  {
    id: "g1-near-doubles",
    world: 1,
    title: "Near-Doubles (Double + 1)",
    emoji: "✨",
    mode: "near-double",
    blurb: "Use a double you know plus 1 extra golden bead to solve neighbor facts!",
  },
  {
    id: "g1-double-detective",
    world: 1,
    title: "Double Detective (□ + □)",
    emoji: "🔍",
    mode: "missing-double",
    blurb: "Find which twin number doubled makes the total!",
  },
  {
    id: "g1-big-doubles",
    world: 1,
    title: "Big Doubles (10+10 to 50+50)",
    emoji: "🚀",
    mode: "big-double",
    blurb: "Double tens and two-digit numbers using Golden Ten-Bars!",
  },
  {
    id: "g1-skip-count",
    world: 1,
    title: "Skip Counting (2s, 5s, 10s)",
    emoji: "🐸",
    mode: "skip-count-g1",
    blurb: "Hop along the stepping stones by 2s, 5s, and 10s!",
  },

  // ── WORLD 2 (Grade 2) ──
  {
    id: "g2-equal-groups",
    world: 2,
    title: "Equal Groups (Groups of Beads)",
    emoji: "🪺",
    mode: "equal-groups",
    blurb: "Count equal groups of Montessori bead bars to multiply!",
  },
  {
    id: "g2-skip-count",
    world: 2,
    title: "Skip-Count Stepping Stones",
    emoji: "🐸",
    mode: "skip-count",
    blurb: "Hop along the skip-counting stones by 2s, 3s, 4s, 5s, and 10s!",
  },
  {
    id: "g2-array-builder",
    world: 2,
    title: "Array Rows × Columns",
    emoji: "🟦",
    mode: "array",
    blurb: "Count rows and columns in a neat grid to see multiplication in action!",
  },
  {
    id: "g2-double-double",
    world: 2,
    title: "Double (×2) & Double-Double (×4)",
    emoji: "⚡",
    mode: "double-double",
    blurb: "Multiply by 4 in a snap: just double the number, then double it again!",
  },
  {
    id: "g2-ten-and-five",
    world: 2,
    title: "Times 10 & Half for Times 5",
    emoji: "🔟",
    mode: "ten-five",
    blurb: "Use Golden Ten-Bars for ×10, and take half of ×10 to solve ×5!",
  },

  // ── WORLD 3 (Grade 3) ──
  {
    id: "g3-fair-share",
    world: 3,
    title: "Fair-Share Division (Deal Onto Plates)",
    emoji: "🍽️",
    mode: "fair-share",
    blurb: "Deal treats one by one onto plates so every plate gets an equal share!",
  },
  {
    id: "g3-group-division",
    world: 3,
    title: "How Many Groups? (÷ by Bundling)",
    emoji: "📦",
    mode: "group-div",
    blurb: "Pack items into equal boxes to see how many groups you can make!",
  },
  {
    id: "g3-fact-family",
    world: 3,
    title: "Fact Family Triangles (× & ÷)",
    emoji: "🔺",
    mode: "fact-family",
    blurb: "Connect multiplication and division as inverse partners on a Fact Triangle!",
  },
  {
    id: "g3-missing-factor",
    world: 3,
    title: "Missing Factor Mystery (4 × □ = 20)",
    emoji: "🧩",
    mode: "missing-factor",
    blurb: "Find the missing multiplier that completes the equation!",
  },
  {
    id: "g3-master-mix",
    world: 3,
    title: "Doubles, Halves, × & ÷ Mix",
    emoji: "🏆",
    mode: "mix",
    blurb: "Put all your doubling, halving, multiplication, and division powers together!",
  },
];

export function stageById(id) {
  return STAGES.find((s) => s.id === id);
}

// ─────────────────────────────────────────────────────────────
// QUESTION BANKS (12+ items per stage so questions rotate freshly)
// ─────────────────────────────────────────────────────────────

const BANK_MIRROR_DOUBLES = [
  { n: 1, answer: 2, choices: [2, 3, 4], hint: "1 plus 1 more makes 2!", spoken: "1 plus 1 is 2." },
  { n: 2, answer: 4, choices: [4, 3, 6], hint: "Double 2 is 2 + 2 = 4!", spoken: "2 plus 2 is 4." },
  { n: 3, answer: 6, choices: [6, 5, 8], hint: "3 on the left and 3 on the right makes 6!", spoken: "3 plus 3 is 6." },
  { n: 4, answer: 8, choices: [8, 6, 10], hint: "Spider legs! 4 on each side makes 8!", spoken: "4 plus 4 is 8." },
  { n: 5, answer: 10, choices: [10, 8, 12], hint: "Two hands of 5 fingers make 10!", spoken: "5 plus 5 is 10." },
  { n: 6, answer: 12, choices: [12, 10, 14], hint: "Egg carton! Two rows of 6 make 12!", spoken: "6 plus 6 is 12." },
  { n: 7, answer: 14, choices: [14, 12, 16], hint: "Two weeks of 7 days make 14!", spoken: "7 plus 7 is 14." },
  { n: 8, answer: 16, choices: [16, 14, 18], hint: "Crayon box! 8 plus 8 is 16!", spoken: "8 plus 8 is 16." },
  { n: 9, answer: 18, choices: [18, 16, 20], hint: "9 plus 9 is 18 (almost 20)!", spoken: "9 plus 9 is 18." },
  { n: 10, answer: 20, choices: [20, 18, 100], hint: "Two ten-bars make 20!", spoken: "10 plus 10 is 20." },
  { n: 6, answer: 12, choices: [12, 11, 15], hint: "Double 6 is 12!", spoken: "Double 6 is 12." },
  { n: 8, answer: 16, choices: [16, 15, 18], hint: "Double 8 is 16!", spoken: "Double 8 is 16." },
];

const BANK_FAIR_HALVES = [
  { total: 2, answer: 1, choices: [1, 2, 0], hint: "Share 2 equally into 2 baskets: 1 in each basket!", spoken: "Half of 2 is 1." },
  { total: 4, answer: 2, choices: [2, 1, 3], hint: "2 plus 2 is 4, so half of 4 is 2!", spoken: "Half of 4 is 2." },
  { total: 6, answer: 3, choices: [3, 2, 4], hint: "3 plus 3 is 6, so half of 6 is 3!", spoken: "Half of 6 is 3." },
  { total: 8, answer: 4, choices: [4, 3, 5], hint: "4 plus 4 is 8, so half of 8 is 4!", spoken: "Half of 8 is 4." },
  { total: 10, answer: 5, choices: [5, 4, 6], hint: "5 fingers on each hand make 10, so half of 10 is 5!", spoken: "Half of 10 is 5." },
  { total: 12, answer: 6, choices: [6, 5, 7], hint: "The 12 apostles stood in 2 equal lines: 6 in each line, because 6 + 6 = 12!", spoken: "Half of 12 is 6." },
  { total: 14, answer: 7, choices: [7, 6, 8], hint: "7 plus 7 is 14, so half of 14 is 7!", spoken: "Half of 14 is 7." },
  { total: 16, answer: 8, choices: [8, 7, 9], hint: "8 plus 8 is 16, so half of 16 is 8!", spoken: "Half of 16 is 8." },
  { total: 18, answer: 9, choices: [9, 8, 10], hint: "9 plus 9 is 18, so half of 18 is 9!", spoken: "Half of 18 is 9." },
  { total: 20, answer: 10, choices: [10, 9, 12], hint: "10 plus 10 is 20, so half of 20 is 10!", spoken: "Half of 20 is 10." },
  { total: 22, answer: 11, choices: [11, 10, 12], hint: "11 plus 11 is 22, so half of 22 is 11!", spoken: "Half of 22 is 11." },
  { total: 24, answer: 12, choices: [12, 10, 14], hint: "12 plus 12 is 24, so half of 24 is 12!", spoken: "Half of 24 is 12." },
];

const BANK_NEAR_DOUBLES = [
  { base: 2, next: 3, doubleVal: 4, answer: 5, choices: [5, 4, 6], hint: "2 + 2 is 4, plus 1 more is 5!", spoken: "2 plus 3 is 5." },
  { base: 3, next: 4, doubleVal: 6, answer: 7, choices: [7, 6, 8], hint: "3 + 3 is 6, plus 1 more is 7!", spoken: "3 plus 4 is 7." },
  { base: 4, next: 5, doubleVal: 8, answer: 9, choices: [9, 8, 10], hint: "4 + 4 is 8, plus 1 more is 9!", spoken: "4 plus 5 is 9." },
  { base: 5, next: 6, doubleVal: 10, answer: 11, choices: [11, 10, 12], hint: "5 + 5 is 10, plus 1 more is 11!", spoken: "5 plus 6 is 11." },
  { base: 6, next: 7, doubleVal: 12, answer: 13, choices: [13, 12, 14], hint: "6 + 6 is 12, plus 1 more is 13!", spoken: "6 plus 7 is 13." },
  { base: 7, next: 8, doubleVal: 14, answer: 15, choices: [15, 14, 16], hint: "7 + 7 is 14, plus 1 more is 15!", spoken: "7 plus 8 is 15." },
  { base: 8, next: 9, doubleVal: 16, answer: 17, choices: [17, 16, 18], hint: "8 + 8 is 16, plus 1 more is 17!", spoken: "8 plus 9 is 17." },
  { base: 9, next: 10, doubleVal: 18, answer: 19, choices: [19, 18, 20], hint: "9 + 9 is 18, plus 1 more is 19!", spoken: "9 plus 10 is 19." },
  { base: 10, next: 11, doubleVal: 20, answer: 21, choices: [21, 20, 22], hint: "10 + 10 is 20, plus 1 more is 21!", spoken: "10 plus 11 is 21." },
  { base: 1, next: 2, doubleVal: 2, answer: 3, choices: [3, 2, 4], hint: "1 + 1 is 2, plus 1 more is 3!", spoken: "1 plus 2 is 3." },
  { base: 6, next: 5, doubleVal: 10, answer: 11, choices: [11, 10, 12], hint: "Double 5 is 10, plus 1 more is 11!", spoken: "6 plus 5 is 11." },
  { base: 8, next: 7, doubleVal: 14, answer: 15, choices: [15, 14, 16], hint: "Double 7 is 14, plus 1 more is 15!", spoken: "8 plus 7 is 15." },
];

const BANK_MISSING_DOUBLES = [
  { total: 4, answer: 2, choices: [2, 3, 4], hint: "2 + 2 = 4!", spoken: "2 plus 2 is 4." },
  { total: 6, answer: 3, choices: [3, 2, 4], hint: "3 + 3 = 6!", spoken: "3 plus 3 is 6." },
  { total: 8, answer: 4, choices: [4, 3, 5], hint: "4 + 4 = 8!", spoken: "4 plus 4 is 8." },
  { total: 10, answer: 5, choices: [5, 4, 6], hint: "5 + 5 = 10!", spoken: "5 plus 5 is 10." },
  { total: 12, answer: 6, choices: [6, 5, 7], hint: "6 + 6 = 12!", spoken: "6 plus 6 is 12." },
  { total: 14, answer: 7, choices: [7, 6, 8], hint: "7 + 7 = 14!", spoken: "7 plus 7 is 14." },
  { total: 16, answer: 8, choices: [8, 7, 9], hint: "8 + 8 = 16!", spoken: "8 plus 8 is 16." },
  { total: 18, answer: 9, choices: [9, 8, 10], hint: "9 + 9 = 18!", spoken: "9 plus 9 is 18." },
  { total: 20, answer: 10, choices: [10, 9, 11], hint: "10 + 10 = 20!", spoken: "10 plus 10 is 20." },
  { total: 24, answer: 12, choices: [12, 11, 14], hint: "12 + 12 = 24!", spoken: "12 plus 12 is 24." },
  { total: 2, answer: 1, choices: [1, 2, 0], hint: "1 + 1 = 2!", spoken: "1 plus 1 is 2." },
  { total: 30, answer: 15, choices: [15, 12, 20], hint: "15 + 15 = 30!", spoken: "15 plus 15 is 30." },
];

const BANK_BIG_DOUBLES = [
  { n: 10, answer: 20, choices: [20, 15, 30], hint: "1 ten + 1 ten = 2 tens (20)!", spoken: "10 plus 10 is 20." },
  { n: 11, answer: 22, choices: [22, 20, 24], hint: "Double 10 is 20, and double 1 is 2 → 22!", spoken: "11 plus 11 is 22." },
  { n: 12, answer: 24, choices: [24, 22, 26], hint: "Double 10 is 20, and double 2 is 4 → 24!", spoken: "12 plus 12 is 24." },
  { n: 13, answer: 26, choices: [26, 24, 28], hint: "Double 10 is 20, and double 3 is 6 → 26!", spoken: "13 plus 13 is 26." },
  { n: 14, answer: 28, choices: [28, 26, 30], hint: "Double 10 is 20, and double 4 is 8 → 28!", spoken: "14 plus 14 is 28." },
  { n: 15, answer: 30, choices: [30, 25, 35], hint: "Double 10 is 20, and double 5 is 10 → 20 + 10 = 30!", spoken: "15 plus 15 is 30." },
  { n: 20, answer: 40, choices: [40, 30, 50], hint: "2 tens + 2 tens = 4 tens (40)!", spoken: "20 plus 20 is 40." },
  { n: 25, answer: 50, choices: [50, 40, 60], hint: "Two quarters (25¢ + 25¢) make 50!", spoken: "25 plus 25 is 50." },
  { n: 30, answer: 60, choices: [60, 50, 70], hint: "3 tens + 3 tens = 6 tens (60)!", spoken: "30 plus 30 is 60." },
  { n: 35, answer: 70, choices: [70, 60, 80], hint: "Double 30 is 60, plus double 5 (10) = 70!", spoken: "35 plus 35 is 70." },
  { n: 40, answer: 80, choices: [80, 60, 90], hint: "4 tens + 4 tens = 8 tens (80)!", spoken: "40 plus 40 is 80." },
  { n: 50, answer: 100, choices: [100, 80, 90], hint: "5 tens + 5 tens = 100!", spoken: "50 plus 50 is 100." },
];

const BANK_EQUAL_GROUPS = [
  { groups: 2, each: 3, answer: 6, choices: [6, 5, 8], hint: "2 groups of 3 is 3 + 3 = 6!", spoken: "2 times 3 is 6." },
  { groups: 3, each: 2, answer: 6, choices: [6, 5, 8], hint: "3 groups of 2 is 2 + 2 + 2 = 6!", spoken: "3 times 2 is 6." },
  { groups: 3, each: 4, answer: 12, choices: [12, 7, 15], hint: "Like 3 pews with 4 children in each pew: 4 + 4 + 4 = 12!", spoken: "3 times 4 is 12." },
  { groups: 4, each: 3, answer: 12, choices: [12, 9, 16], hint: "4 groups of 3 is 3 + 3 + 3 + 3 = 12!", spoken: "4 times 3 is 12." },
  { groups: 2, each: 6, answer: 12, choices: [12, 8, 14], hint: "2 groups of 6 is double 6 = 12!", spoken: "2 times 6 is 12." },
  { groups: 3, each: 5, answer: 15, choices: [15, 10, 20], hint: "Count by 5s three times: 5, 10, 15!", spoken: "3 times 5 is 15." },
  { groups: 4, each: 5, answer: 20, choices: [20, 15, 25], hint: "Count by 5s four times: 5, 10, 15, 20!", spoken: "4 times 5 is 20." },
  { groups: 5, each: 2, answer: 10, choices: [10, 7, 12], hint: "5 groups of 2 is 2, 4, 6, 8, 10!", spoken: "5 times 2 is 10." },
  { groups: 3, each: 3, answer: 9, choices: [9, 6, 12], hint: "3 groups of 3 is 3 + 3 + 3 = 9!", spoken: "3 times 3 is 9." },
  { groups: 4, each: 4, answer: 16, choices: [16, 12, 20], hint: "4 groups of 4 is 4 + 4 + 4 + 4 = 16!", spoken: "4 times 4 is 16." },
  { groups: 2, each: 8, answer: 16, choices: [16, 14, 18], hint: "2 groups of 8 is double 8 = 16!", spoken: "2 times 8 is 16." },
  { groups: 5, each: 4, answer: 20, choices: [20, 16, 24], hint: "5 groups of 4 makes 20!", spoken: "5 times 4 is 20." },
];

const BANK_SKIP_COUNT_G1 = [
  { step: 2, seq: [2, 4, 6, null, 10], blankIdx: 3, answer: 8, choices: [8, 7, 9], hint: "Hop 2 more from 6!", spoken: "2, 4, 6, 8, 10." },
  { step: 2, seq: [4, 6, null, 10, 12], blankIdx: 2, answer: 8, choices: [8, 7, 9], hint: "Count by 2s: 2 more after 6!", spoken: "4, 6, 8, 10, 12." },
  { step: 2, seq: [6, 8, 10, null, 14], blankIdx: 3, answer: 12, choices: [12, 11, 13], hint: "Add 2 to 10!", spoken: "6, 8, 10, 12, 14." },
  { step: 2, seq: [10, 12, null, 16, 18], blankIdx: 2, answer: 14, choices: [14, 13, 15], hint: "Hop 2 more from 12!", spoken: "10, 12, 14, 16, 18." },
  { step: 5, seq: [5, 10, null, 20, 25], blankIdx: 2, answer: 15, choices: [15, 12, 18], hint: "Count by 5s: 5 more than 10!", spoken: "5, 10, 15, 20, 25." },
  { step: 5, seq: [10, 15, 20, null, 30], blankIdx: 3, answer: 25, choices: [25, 22, 28], hint: "Add 5 to 20!", spoken: "10, 15, 20, 25, 30." },
  { step: 5, seq: [15, 20, null, 30, 35], blankIdx: 2, answer: 25, choices: [25, 23, 27], hint: "Hop 5 more after 20!", spoken: "15, 20, 25, 30, 35." },
  { step: 10, seq: [10, 20, null, 40, 50], blankIdx: 2, answer: 30, choices: [30, 25, 35], hint: "Count by 10s: 10 more than 20!", spoken: "10, 20, 30, 40, 50." },
  { step: 10, seq: [20, 30, 40, null, 60], blankIdx: 3, answer: 50, choices: [50, 45, 55], hint: "Add 10 more to 40!", spoken: "20, 30, 40, 50, 60." },
  { step: 10, seq: [40, 50, null, 70, 80], blankIdx: 2, answer: 60, choices: [60, 55, 65], hint: "10 more than 50!", spoken: "40, 50, 60, 70, 80." },
];

const BANK_SKIP_COUNT = [
  { step: 2, seq: [2, 4, 6, null, 10], blankIdx: 3, answer: 8, choices: [8, 7, 9], hint: "Counting by 2s: 2, 4, 6, 8, 10!", spoken: "2, 4, 6, 8, 10." },
  { step: 2, seq: [10, 12, 14, null, 18], blankIdx: 3, answer: 16, choices: [16, 15, 17], hint: "Add 2 each hop: 14 + 2 = 16!", spoken: "10, 12, 14, 16, 18." },
  { step: 5, seq: [5, 10, 15, null, 25], blankIdx: 3, answer: 20, choices: [20, 18, 22], hint: "Counting by 5s: 5, 10, 15, 20, 25!", spoken: "5, 10, 15, 20, 25." },
  { step: 5, seq: [20, 25, null, 35, 40], blankIdx: 2, answer: 30, choices: [30, 28, 32], hint: "Add 5 after 25: 30!", spoken: "20, 25, 30, 35, 40." },
  { step: 10, seq: [10, 20, 30, null, 50], blankIdx: 3, answer: 40, choices: [40, 35, 45], hint: "Counting by 10s: 10, 20, 30, 40, 50!", spoken: "10, 20, 30, 40, 50." },
  { step: 10, seq: [50, 60, null, 80, 90], blankIdx: 2, answer: 70, choices: [70, 65, 75], hint: "10 more than 60 is 70!", spoken: "50, 60, 70, 80, 90." },
  { step: 3, seq: [3, 6, 9, null, 15], blankIdx: 3, answer: 12, choices: [12, 11, 13], hint: "Counting by 3s: 3, 6, 9, 12, 15!", spoken: "3, 6, 9, 12, 15." },
  { step: 3, seq: [12, 15, 18, null, 24], blankIdx: 3, answer: 21, choices: [21, 20, 22], hint: "Add 3 to 18: 21!", spoken: "12, 15, 18, 21, 24." },
  { step: 4, seq: [4, 8, 12, null, 20], blankIdx: 3, answer: 16, choices: [16, 14, 18], hint: "Counting by 4s: 4, 8, 12, 16, 20!", spoken: "4, 8, 12, 16, 20." },
  { step: 4, seq: [16, 20, null, 28, 32], blankIdx: 2, answer: 24, choices: [24, 22, 26], hint: "Add 4 to 20: 24!", spoken: "16, 20, 24, 28, 32." },
  { step: 6, seq: [6, 12, 18, null, 30], blankIdx: 3, answer: 24, choices: [24, 22, 26], hint: "Counting by 6s: 6, 12, 18, 24, 30!", spoken: "6, 12, 18, 24, 30." },
  { step: 5, seq: [30, 35, 40, null, 50], blankIdx: 3, answer: 45, choices: [45, 42, 48], hint: "Add 5 to 40: 45!", spoken: "30, 35, 40, 45, 50." },
];

const BANK_ARRAYS = [
  { rows: 2, cols: 4, answer: 8, choices: [8, 6, 10], hint: "2 rows of 4 makes 8!", spoken: "2 times 4 is 8." },
  { rows: 3, cols: 5, answer: 15, choices: [15, 12, 18], hint: "3 rows of 5 is 5, 10, 15!", spoken: "3 times 5 is 15." },
  { rows: 4, cols: 3, answer: 12, choices: [12, 7, 16], hint: "4 rows of 3 is 3, 6, 9, 12!", spoken: "4 times 3 is 12." },
  { rows: 3, cols: 6, answer: 18, choices: [18, 15, 21], hint: "3 rows of 6 is 6 + 6 + 6 = 18!", spoken: "3 times 6 is 18." },
  { rows: 5, cols: 4, answer: 20, choices: [20, 16, 25], hint: "5 rows of 4 makes 20!", spoken: "5 times 4 is 20." },
  { rows: 4, cols: 4, answer: 16, choices: [16, 12, 20], hint: "A 4 by 4 square has 16 beads!", spoken: "4 times 4 is 16." },
  { rows: 2, cols: 7, answer: 14, choices: [14, 12, 16], hint: "2 rows of 7 is double 7 = 14!", spoken: "2 times 7 is 14." },
  { rows: 5, cols: 5, answer: 25, choices: [25, 20, 30], hint: "5 rows of 5 is 25!", spoken: "5 times 5 is 25." },
  { rows: 3, cols: 4, answer: 12, choices: [12, 10, 15], hint: "3 rows of 4 is 12!", spoken: "3 times 4 is 12." },
  { rows: 4, cols: 6, answer: 24, choices: [24, 20, 28], hint: "4 rows of 6 makes 24!", spoken: "4 times 6 is 24." },
  { rows: 6, cols: 3, answer: 18, choices: [18, 15, 21], hint: "6 rows of 3 makes 18!", spoken: "6 times 3 is 18." },
  { rows: 5, cols: 6, answer: 30, choices: [30, 25, 35], hint: "5 rows of 6 makes 30!", spoken: "5 times 6 is 30." },
];

const BANK_DOUBLE_DOUBLE = [
  { mult: 4, n: 3, d1: 6, answer: 12, choices: [12, 9, 15], hint: "Double 3 is 6, and double 6 is 12!", spoken: "4 times 3 is 12." },
  { mult: 4, n: 4, d1: 8, answer: 16, choices: [16, 12, 20], hint: "Double 4 is 8, and double 8 is 16!", spoken: "4 times 4 is 16." },
  { mult: 4, n: 5, d1: 10, answer: 20, choices: [20, 15, 25], hint: "Double 5 is 10, and double 10 is 20!", spoken: "4 times 5 is 20." },
  { mult: 4, n: 6, d1: 12, answer: 24, choices: [24, 18, 28], hint: "Double 6 is 12, and double 12 is 24!", spoken: "4 times 6 is 24." },
  { mult: 4, n: 7, d1: 14, answer: 28, choices: [28, 24, 32], hint: "Double 7 is 14, and double 14 is 28!", spoken: "4 times 7 is 28." },
  { mult: 4, n: 8, d1: 16, answer: 32, choices: [32, 28, 36], hint: "Double 8 is 16, and double 16 is 32!", spoken: "4 times 8 is 32." },
  { mult: 4, n: 9, d1: 18, answer: 36, choices: [36, 32, 40], hint: "Double 9 is 18, and double 18 is 36!", spoken: "4 times 9 is 36." },
  { mult: 4, n: 10, d1: 20, answer: 40, choices: [40, 30, 50], hint: "Double 10 is 20, and double 20 is 40!", spoken: "4 times 10 is 40." },
  { mult: 2, n: 9, d1: 18, answer: 18, choices: [18, 16, 20], hint: "2 times 9 is double 9 = 18!", spoken: "2 times 9 is 18." },
  { mult: 2, n: 7, d1: 14, answer: 14, choices: [14, 12, 16], hint: "2 times 7 is double 7 = 14!", spoken: "2 times 7 is 14." },
  { mult: 4, n: 2, d1: 4, answer: 8, choices: [8, 6, 10], hint: "Double 2 is 4, and double 4 is 8!", spoken: "4 times 2 is 8." },
  { mult: 4, n: 11, d1: 22, answer: 44, choices: [44, 40, 48], hint: "Double 11 is 22, and double 22 is 44!", spoken: "4 times 11 is 44." },
];

const BANK_TEN_FIVE = [
  { mult: 10, n: 5, tenVal: 50, answer: 50, choices: [50, 40, 60], hint: "A rosary has 5 decades with 10 beads in each: 5 Golden Ten-Bars make 50!", spoken: "10 times 5 is 50." },
  { mult: 10, n: 3, tenVal: 30, answer: 30, choices: [30, 20, 40], hint: "3 Golden Ten-Bars make 30!", spoken: "10 times 3 is 30." },
  { mult: 5, n: 4, tenVal: 40, answer: 20, choices: [20, 25, 40], hint: "10 × 4 is 40, and half of 40 is 20!", spoken: "5 times 4 is 20." },
  { mult: 10, n: 6, tenVal: 60, answer: 60, choices: [60, 50, 70], hint: "6 Golden Ten-Bars make 60!", spoken: "10 times 6 is 60." },
  { mult: 5, n: 6, tenVal: 60, answer: 30, choices: [30, 25, 35], hint: "10 × 6 is 60, and half of 60 is 30!", spoken: "5 times 6 is 30." },
  { mult: 10, n: 8, tenVal: 80, answer: 80, choices: [80, 70, 90], hint: "8 Golden Ten-Bars make 80!", spoken: "10 times 8 is 80." },
  { mult: 5, n: 8, tenVal: 80, answer: 40, choices: [40, 35, 45], hint: "10 × 8 is 80, and half of 80 is 40!", spoken: "5 times 8 is 40." },
  { mult: 10, n: 7, tenVal: 70, answer: 70, choices: [70, 60, 80], hint: "7 Golden Ten-Bars make 70!", spoken: "10 times 7 is 70." },
  { mult: 5, n: 7, tenVal: 70, answer: 35, choices: [35, 30, 40], hint: "5, 10, 15, 20, 25, 30, 35!", spoken: "5 times 7 is 35." },
  { mult: 5, n: 5, tenVal: 50, answer: 25, choices: [25, 20, 30], hint: "5 groups of 5 is 25!", spoken: "5 times 5 is 25." },
  { mult: 5, n: 9, tenVal: 90, answer: 45, choices: [45, 40, 50], hint: "10 × 9 is 90, and half of 90 is 45!", spoken: "5 times 9 is 45." },
  { mult: 10, n: 9, tenVal: 90, answer: 90, choices: [90, 80, 100], hint: "9 Golden Ten-Bars make 90!", spoken: "10 times 9 is 90." },
  { mult: 10, n: 10, tenVal: 100, answer: 100, choices: [100, 90, 50], hint: "10 Golden Ten-Bars make 100!", spoken: "10 times 10 is 100." },
];

const BANK_FAIR_SHARE = [
  { total: 6, plates: 2, answer: 3, choices: [3, 2, 4], hint: "Share 6 equally onto 2 plates: 3 on each plate!", spoken: "6 divided by 2 is 3." },
  { total: 8, plates: 4, answer: 2, choices: [2, 3, 4], hint: "Share 8 equally onto 4 plates: 2 on each plate!", spoken: "8 divided by 4 is 2." },
  { total: 9, plates: 3, answer: 3, choices: [3, 2, 4], hint: "3 plates with 3 on each makes 9!", spoken: "9 divided by 3 is 3." },
  { total: 10, plates: 2, answer: 5, choices: [5, 4, 6], hint: "Half of 10 is 5 on each plate!", spoken: "10 divided by 2 is 5." },
  { total: 12, plates: 3, answer: 4, choices: [4, 3, 6], hint: "3 × 4 = 12, so 12 shared onto 3 plates is 4!", spoken: "12 divided by 3 is 4." },
  { total: 12, plates: 4, answer: 3, choices: [3, 4, 2], hint: "4 × 3 = 12, so 12 shared onto 4 plates is 3!", spoken: "12 divided by 4 is 3." },
  { total: 15, plates: 3, answer: 5, choices: [5, 4, 6], hint: "3 plates of 5 make 15!", spoken: "15 divided by 3 is 5." },
  { total: 16, plates: 4, answer: 4, choices: [4, 3, 5], hint: "4 plates with 4 on each make 16!", spoken: "16 divided by 4 is 4." },
  { total: 18, plates: 3, answer: 6, choices: [6, 5, 7], hint: "3 × 6 = 18, so each plate gets 6!", spoken: "18 divided by 3 is 6." },
  { total: 20, plates: 4, answer: 5, choices: [5, 4, 6], hint: "4 plates of 5 make 20!", spoken: "20 divided by 4 is 5." },
  { total: 20, plates: 5, answer: 4, choices: [4, 5, 6], hint: "5 plates of 4 make 20!", spoken: "20 divided by 5 is 4." },
  { total: 24, plates: 4, answer: 6, choices: [6, 5, 8], hint: "4 × 6 = 24, so each plate gets 6!", spoken: "24 divided by 4 is 6." },
];

const BANK_GROUP_DIV = [
  { total: 10, size: 5, answer: 2, choices: [2, 3, 5], hint: "Two groups of 5 make 10!", spoken: "10 divided by 5 is 2." },
  { total: 12, size: 2, answer: 6, choices: [6, 5, 7], hint: "Jesus sent the 12 apostles out two by two: that makes 6 pairs!", spoken: "12 divided by 2 is 6." },
  { total: 15, size: 5, answer: 3, choices: [3, 4, 5], hint: "5, 10, 15 — that is 3 groups of 5!", spoken: "15 divided by 5 is 3." },
  { total: 16, size: 2, answer: 8, choices: [8, 6, 9], hint: "8 pairs of 2 make 16!", spoken: "16 divided by 2 is 8." },
  { total: 18, size: 6, answer: 3, choices: [3, 2, 4], hint: "6, 12, 18 — 3 groups of 6!", spoken: "18 divided by 6 is 3." },
  { total: 20, size: 5, answer: 4, choices: [4, 3, 5], hint: "5, 10, 15, 20 — 4 groups of 5!", spoken: "20 divided by 5 is 4." },
  { total: 21, size: 7, answer: 3, choices: [3, 4, 2], hint: "3 groups of 7 make 21!", spoken: "21 divided by 7 is 3." },
  { total: 24, size: 6, answer: 4, choices: [4, 3, 6], hint: "4 groups of 6 make 24!", spoken: "24 divided by 6 is 4." },
  { total: 25, size: 5, answer: 5, choices: [5, 4, 6], hint: "5 groups of 5 make 25!", spoken: "25 divided by 5 is 5." },
  { total: 30, size: 10, answer: 3, choices: [3, 4, 5], hint: "10, 20, 30 — 3 ten-packs!", spoken: "30 divided by 10 is 3." },
  { total: 28, size: 4, answer: 7, choices: [7, 6, 8], hint: "7 groups of 4 make 28!", spoken: "28 divided by 4 is 7." },
  { total: 36, size: 6, answer: 6, choices: [6, 5, 7], hint: "6 groups of 6 make 36!", spoken: "36 divided by 6 is 6." },
];

const BANK_FACT_FAMILY = [
  { product: 12, a: 3, b: 4, answer: 4, choices: [4, 3, 6], hint: "Since 3 × 4 = 12, 12 ÷ 3 = 4!", spoken: "12 divided by 3 is 4." },
  { product: 15, a: 3, b: 5, answer: 5, choices: [5, 3, 6], hint: "Since 3 × 5 = 15, 15 ÷ 3 = 5!", spoken: "15 divided by 3 is 5." },
  { product: 18, a: 2, b: 9, answer: 9, choices: [9, 8, 7], hint: "Since 2 × 9 = 18, 18 ÷ 2 = 9!", spoken: "18 divided by 2 is 9." },
  { product: 20, a: 4, b: 5, answer: 5, choices: [5, 4, 6], hint: "Since 4 × 5 = 20, 20 ÷ 4 = 5!", spoken: "20 divided by 4 is 5." },
  { product: 24, a: 4, b: 6, answer: 6, choices: [6, 4, 8], hint: "Since 4 × 6 = 24, 24 ÷ 4 = 6!", spoken: "24 divided by 4 is 6." },
  { product: 24, a: 3, b: 8, answer: 8, choices: [8, 6, 7], hint: "Since 3 × 8 = 24, 24 ÷ 3 = 8!", spoken: "24 divided by 3 is 8." },
  { product: 28, a: 4, b: 7, answer: 7, choices: [7, 6, 8], hint: "Since 4 × 7 = 28, 28 ÷ 4 = 7!", spoken: "28 divided by 4 is 7." },
  { product: 30, a: 5, b: 6, answer: 6, choices: [6, 5, 7], hint: "Since 5 × 6 = 30, 30 ÷ 5 = 6!", spoken: "30 divided by 5 is 6." },
  { product: 32, a: 4, b: 8, answer: 8, choices: [8, 7, 9], hint: "Since 4 × 8 = 32, 32 ÷ 4 = 8!", spoken: "32 divided by 4 is 8." },
  { product: 36, a: 4, b: 9, answer: 9, choices: [9, 8, 6], hint: "Since 4 × 9 = 36, 36 ÷ 4 = 9!", spoken: "36 divided by 4 is 9." },
  { product: 40, a: 5, b: 8, answer: 8, choices: [8, 7, 9], hint: "Since 5 × 8 = 40, 40 ÷ 5 = 8!", spoken: "40 divided by 5 is 8." },
  { product: 16, a: 2, b: 8, answer: 8, choices: [8, 6, 9], hint: "Since 2 × 8 = 16, 16 ÷ 2 = 8!", spoken: "16 divided by 2 is 8." },
];

const BANK_MISSING_FACTOR = [
  { known: 2, answer: 6, product: 12, choices: [6, 5, 7], hint: "2 times 6 makes 12!", spoken: "2 times 6 is 12." },
  { known: 3, answer: 4, product: 12, choices: [4, 3, 5], hint: "3 times 4 makes 12!", spoken: "3 times 4 is 12." },
  { known: 4, answer: 5, product: 20, choices: [5, 4, 6], hint: "4 times 5 makes 20!", spoken: "4 times 5 is 20." },
  { known: 5, answer: 3, product: 15, choices: [3, 4, 5], hint: "5 times 3 makes 15!", spoken: "5 times 3 is 15." },
  { known: 2, answer: 9, product: 18, choices: [9, 8, 7], hint: "Double 9 makes 18!", spoken: "2 times 9 is 18." },
  { known: 3, answer: 6, product: 18, choices: [6, 5, 7], hint: "3 times 6 makes 18!", spoken: "3 times 6 is 18." },
  { known: 4, answer: 4, product: 16, choices: [4, 3, 5], hint: "4 times 4 makes 16!", spoken: "4 times 4 is 16." },
  { known: 5, answer: 6, product: 30, choices: [6, 5, 7], hint: "5 times 6 makes 30!", spoken: "5 times 6 is 30." },
  { known: 10, answer: 4, product: 40, choices: [4, 3, 5], hint: "10 times 4 makes 40!", spoken: "10 times 4 is 40." },
  { known: 4, answer: 7, product: 28, choices: [7, 6, 8], hint: "4 times 7 makes 28!", spoken: "4 times 7 is 28." },
  { known: 3, answer: 7, product: 21, choices: [7, 6, 8], hint: "3 times 7 makes 21!", spoken: "3 times 7 is 21." },
  { known: 6, answer: 4, product: 24, choices: [4, 3, 5], hint: "6 times 4 makes 24!", spoken: "6 times 4 is 24." },
];

function pseudoRandom(seed) {
  const s = Math.sin(seed) * 10000;
  return s - Math.floor(s);
}

function shuffle(arr, seed = 1) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom(seed + i * 31) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function itemKey(item) {
  return String(item.spoken || `${item.n}-${item.total}-${item.answer}`);
}

function pickRotating(bank, seed = 1, avoidKeys = []) {
  const avoidSet = new Set(Array.isArray(avoidKeys) ? avoidKeys : []);
  const sh = shuffle(bank, seed);
  if (!avoidSet.size) return sh.slice(0, QUESTIONS_PER_STAGE);
  const fresh = sh.filter((item) => !avoidSet.has(itemKey(item)));
  const seen = sh.filter((item) => avoidSet.has(itemKey(item)));
  return [...fresh, ...seen].slice(0, QUESTIONS_PER_STAGE);
}

function buildQuestionVoice(q) {
  switch (q.mode || q.kind) {
    case "mirror-double":
      return `What is ${q.n} plus ${q.n}?`;
    case "fair-half":
      return `What is half of ${q.total}?`;
    case "near-double":
      return `What is ${q.base} plus ${q.next}?`;
    case "missing-double":
      return `Which twin number doubled makes ${q.total}?`;
    case "big-double":
      return `What is ${q.n} plus ${q.n}?`;
    case "equal-groups":
      return `${q.groups} equal groups of ${q.each}. What is ${q.groups} times ${q.each}?`;
    case "skip-count-g1":
    case "skip-count": {
      const seqWords = (q.seq || []).map((v) => (v === null ? "blank" : v)).join(", ");
      return `Skip-count by ${q.step}s: ${seqWords}. Which number goes on the orange stone?`;
    }
    case "array":
      return `${q.rows} rows of ${q.cols}. What is ${q.rows} times ${q.cols}?`;
    case "double-double":
      return q.mult === 4
        ? `Double ${q.n} is ${q.d1}. Now double ${q.d1}! What is 4 times ${q.n}?`
        : `What is 2 times ${q.n}?`;
    case "ten-five":
      return q.mult === 10
        ? `What is 10 times ${q.n}?`
        : `10 times ${q.n} is ${q.tenVal}. Take half to find 5 times ${q.n}!`;
    case "fair-share":
      return `Share ${q.total} equally onto ${q.plates} plates. What is ${q.total} divided by ${q.plates}?`;
    case "group-div":
      return `Pack ${q.total} beads into boxes of ${q.size}. What is ${q.total} divided by ${q.size}?`;
    case "fact-family":
      return `Since ${q.a} times ${q.b} equals ${q.product}, what is ${q.product} divided by ${q.a}?`;
    case "missing-factor":
      return `Find the missing factor: ${q.known} times blank equals ${q.product}.`;
    default:
      return q.instruction || "";
  }
}

function normalizeQ(q) {
  const questionVoice = q.questionVoice || buildQuestionVoice(q);
  return {
    ...q,
    _key: q._key || q.key,
    key: q.key || q._key,
    kind: q.kind || q.mode,
    mode: q.mode || q.kind,
    options: q.options || q.choices,
    choices: q.choices || q.options,
    questionVoice,
    speakTarget: questionVoice,
    spokenSolution: q.spoken,
  };
}

/**
 * Generates 5 problems for any stage, rotating away from recently seen keys.
 */
export function makeStage(stage, seed = 1, avoidKeys = []) {
  const s = typeof stage === "string" ? stageById(stage) : stage;
  if (!s) return [];
  const rawList = makeStageRaw(s, seed, avoidKeys);
  return rawList.map(normalizeQ);
}

function makeStageRaw(s, seed = 1, avoidKeys = []) {

  switch (s.mode) {
    case "mirror-double": {
      const sh = pickRotating(BANK_MIRROR_DOUBLES, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "mirror-double",
        index: idx,
        n: q.n,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `double ${q.n}`,
        instruction: `Double ${q.n}! Tap the mirror board or pick ${q.n} + ${q.n}:`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "fair-half": {
      const sh = pickRotating(BANK_FAIR_HALVES, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "fair-half",
        index: idx,
        total: q.total,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `half of ${q.total}`,
        instruction: `Split ${q.total} into 2 equal baskets! What is half of ${q.total}?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "near-double": {
      const sh = pickRotating(BANK_NEAR_DOUBLES, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "near-double",
        index: idx,
        base: q.base,
        next: q.next,
        doubleVal: q.doubleVal,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.base} plus ${q.next}`,
        // The double is always the smaller number (6 + 5 → 5 + 5 = 10), whichever comes first.
        instruction: `${q.base} + ${q.next}: use the double ${Math.min(q.base, q.next)} + ${Math.min(q.base, q.next)} = ${q.doubleVal}, then add 1 more!`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "missing-double": {
      const sh = pickRotating(BANK_MISSING_DOUBLES, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "missing-double",
        index: idx,
        total: q.total,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `which number doubled makes ${q.total}`,
        instruction: `Which twin number doubled makes ${q.total}?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "big-double": {
      const sh = pickRotating(BANK_BIG_DOUBLES, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "big-double",
        index: idx,
        n: q.n,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `double ${q.n}`,
        instruction: `Double the tens and ones! What is ${q.n} + ${q.n}?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "equal-groups": {
      const sh = pickRotating(BANK_EQUAL_GROUPS, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "equal-groups",
        index: idx,
        groups: q.groups,
        each: q.each,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.groups} groups of ${q.each}`,
        instruction: `Count ${q.groups} equal groups of ${q.each}! What is ${q.groups} × ${q.each}?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "skip-count-g1":
    case "skip-count": {
      const bank = s.mode === "skip-count-g1" ? BANK_SKIP_COUNT_G1 : BANK_SKIP_COUNT;
      const sh = pickRotating(bank, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "skip-count",
        index: idx,
        step: q.step,
        seq: q.seq,
        blankIdx: q.blankIdx,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `counting by ${q.step}s`,
        instruction: `Skip-count by ${q.step}s! Which number goes on the orange stone?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "array": {
      const sh = pickRotating(BANK_ARRAYS, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "array",
        index: idx,
        rows: q.rows,
        cols: q.cols,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.rows} rows of ${q.cols}`,
        instruction: `${q.rows} rows of ${q.cols}! What is ${q.rows} × ${q.cols}?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "double-double": {
      const sh = pickRotating(BANK_DOUBLE_DOUBLE, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "double-double",
        index: idx,
        mult: q.mult,
        n: q.n,
        d1: q.d1,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.mult} times ${q.n}`,
        instruction: q.mult === 4
          ? `Double-Double! Double ${q.n} is ${q.d1}. Now double ${q.d1} to find 4 × ${q.n}:`
          : `Double ${q.n} to find 2 × ${q.n}:`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "ten-five": {
      const sh = pickRotating(BANK_TEN_FIVE, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "ten-five",
        index: idx,
        mult: q.mult,
        n: q.n,
        tenVal: q.tenVal,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.mult} times ${q.n}`,
        instruction: q.mult === 10
          ? `Count ${q.n} Golden Ten-Bars! What is 10 × ${q.n}?`
          : `10 × ${q.n} is ${q.tenVal}. Take half to find 5 × ${q.n}:`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "fair-share": {
      const sh = pickRotating(BANK_FAIR_SHARE, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "fair-share",
        index: idx,
        total: q.total,
        plates: q.plates,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.total} divided by ${q.plates}`,
        instruction: `Share ${q.total} equally onto ${q.plates} plates! How many on each plate?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "group-div": {
      const sh = pickRotating(BANK_GROUP_DIV, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "group-div",
        index: idx,
        total: q.total,
        size: q.size,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.total} divided by ${q.size}`,
        instruction: `Pack ${q.total} beads into boxes of ${q.size}! How many boxes do you fill?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "fact-family": {
      const sh = pickRotating(BANK_FACT_FAMILY, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "fact-family",
        index: idx,
        product: q.product,
        a: q.a,
        b: q.b,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.product} divided by ${q.a}`,
        instruction: `Look at the Fact Family Triangle! Since ${q.a} × ${q.b} = ${q.product}, what is ${q.product} ÷ ${q.a}?`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "missing-factor": {
      const sh = pickRotating(BANK_MISSING_FACTOR, seed, avoidKeys);
      return sh.map((q, idx) => ({
        stageId: s.id,
        key: itemKey(q),
        mode: "missing-factor",
        index: idx,
        known: q.known,
        product: q.product,
        answer: q.answer,
        choices: shuffle(q.choices, seed + idx),
        clue: `${q.known} times what is ${q.product}`,
        instruction: `Find the missing factor! ${q.known} × □ = ${q.product}:`,
        hint: q.hint,
        spoken: q.spoken,
      }));
    }

    case "mix": {
      const worldStages = STAGES.filter((st) => st.mode !== "mix");
      const chosenStages = shuffle(worldStages, seed).slice(0, QUESTIONS_PER_STAGE);
      return chosenStages.map((sub, i) => {
        const subProblems = makeStage(sub, seed + i * 19, avoidKeys);
        return {
          ...subProblems[0],
          stageId: s.id,
          index: i,
        };
      });
    }

    default:
      return [];
  }
}

/**
 * Returns the Lesson Onboarding card + voice explanation + 1 worked example
 * shown before Question 1 of any stage.
 */
export function lessonIntroFor(stage) {
  const s = typeof stage === "string" ? stageById(stage) : stage;
  if (!s) return null;
  const raw = lessonIntroRaw(s);
  const plainRule = String(raw.rule || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    ...raw,
    exampleHtml: raw.exampleHtml || `<div class="onb-eq-pill">6 + 6 = 12 &nbsp;•&nbsp; 3 × 4 = 12 &nbsp;•&nbsp; 12 ÷ 3 = 4</div>`,
    exampleExplain: raw.exampleExplain || plainRule || s.blurb,
  };
}

function lessonIntroRaw(s) {
  switch (s.mode) {
    case "mirror-double":
      return {
        title: s.title,
        badgeHtml: "🐞",
        voice: "Welcome to Mirror Doubles! Doubling means adding the exact same number twice, like two wings on a ladybug. Look at the example: 4 beads on the left plus 4 beads on the right makes 8 beads in all!",
        rule: "<b>Doubling</b> means adding two equal twin groups together (<i>4 + 4 = 8</i>).",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block">${beadBarSvg(4, 9)}<span>4</span></div>
            <span class="math-op">+</span>
            <div class="math-block">${beadBarSvg(4, 9)}<span>4</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>8</span></div>
          </div>
          <div class="onboarding-caption"><b>4 + 4 = 8</b>! Two equal groups of 4 make 8.</div>`,
      };

    case "fair-half":
      return {
        title: s.title,
        badgeHtml: "🧺",
        voice: "Welcome to Fair Halves! Finding half is the opposite of doubling. We split an even number equally into two baskets so both baskets get the exact same amount. Half of 10 is 5, because 5 plus 5 makes 10!",
        rule: "<b>Half</b> means splitting a total into <b>2 equal shares</b>.",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>Total: 10</span></div>
            <span class="onboarding-arrow">➜</span>
            <div class="math-block onboarding-focus">${beadBarSvg(5, 8)}<span>5</span></div>
            <span class="math-op">+</span>
            <div class="math-block onboarding-focus">${beadBarSvg(5, 8)}<span>5</span></div>
          </div>
          <div class="onboarding-caption">10 shared into 2 equal baskets puts <b>5</b> in each basket!</div>`,
      };

    case "near-double":
      return {
        title: s.title,
        badgeHtml: "✨",
        voice: "Welcome to Near-Doubles! When two numbers are neighbors on the number line, like 5 plus 6, just double the smaller number and add 1 more! Double 5 is 10, plus 1 more is 11!",
        rule: "For neighbor numbers, <b>double the first number</b> and <b>add 1 more</b>!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block">${beadBarSvg(5, 8)}<span>5</span></div>
            <span class="math-op">+</span>
            <div class="math-block">${beadBarSvg(5, 8)}<span>5 + 1</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>11</span></div>
          </div>
          <div class="onboarding-caption"><b>5 + 6</b> is the same as <b>5 + 5 + 1 = 11</b>!</div>`,
      };

    case "missing-double":
      return {
        title: s.title,
        badgeHtml: "🔍",
        voice: "Welcome to Double Detective! Here you see the total, and you have to find which twin number was doubled to make it. For 12, the twin number is 6, because 6 plus 6 equals 12!",
        rule: "Find the <b>twin number</b> that goes in both boxes so <b>□ + □ = Total</b>!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block onboarding-focus"><span>6</span></div>
            <span class="math-op">+</span>
            <div class="math-block onboarding-focus"><span>6</span></div>
            <span class="math-op">=</span>
            <div class="math-block"><span>12</span></div>
          </div>
          <div class="onboarding-caption"><b>6 + 6 = 12</b>! Both mystery boxes get <b>6</b>.</div>`,
      };

    case "big-double":
      return {
        title: s.title,
        badgeHtml: "🚀",
        voice: "Welcome to Big Doubles! To double a two-digit number like 12, double the tens first, and then double the ones! Double 10 is 20, and double 2 is 4, which makes 24!",
        rule: "Double the <b>Tens</b> and double the <b>Ones</b>, then put them together!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>12 + 12</span></div>
            <span class="onboarding-arrow">➜</span>
            <div class="math-block"><span>20 + 4</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>24</span></div>
          </div>
          <div class="onboarding-caption">Double 10 is <b>20</b>, double 2 is <b>4</b> → <b>24</b>!</div>`,
      };

    case "equal-groups":
      return {
        title: s.title,
        badgeHtml: "🪺",
        voice: "Welcome to Equal Groups! Multiplication is a fast way to add equal groups. The multiplication sign means groups of. So 3 times 4 means 3 groups of 4, which is 4 plus 4 plus 4 equals 12!",
        rule: "<b>3 × 4</b> means <b>3 equal groups of 4</b> (<i>4 + 4 + 4 = 12</i>).",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block">${beadBarSvg(4, 8)}<span>4</span></div>
            <div class="math-block">${beadBarSvg(4, 8)}<span>4</span></div>
            <div class="math-block">${beadBarSvg(4, 8)}<span>4</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>12</span></div>
          </div>
          <div class="onboarding-caption">3 groups of 4 beads = <b>3 × 4 = 12</b>!</div>`,
      };

    case "skip-count-g1":
    case "skip-count":
      return {
        title: s.title,
        badgeHtml: "🐸",
        voice: "Welcome to Skip-Counting Stones! When we skip-count, we add the same number on every hop. Counting by 5s goes 5, 10, 15, 20, 25! Find the number that belongs on the orange stone.",
        rule: "Add the <b>same step</b> on every stone along the path!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>5</span></div>
            <div class="math-block"><span>10</span></div>
            <div class="math-block"><span>15</span></div>
            <div class="math-block onboarding-focus"><span>20</span></div>
            <div class="math-block"><span>25</span></div>
          </div>
          <div class="onboarding-caption">Hopping by 5s: 15 + 5 lands on <b>20</b>!</div>`,
      };

    case "array":
      return {
        title: s.title,
        badgeHtml: "🟦",
        voice: "Welcome to Multiplication Arrays! An array lines up beads in neat rows and columns. For 3 times 5, we have 3 rows with 5 beads in each row: 5, 10, 15 beads in all!",
        rule: "<b>Rows × Columns</b> tells the total beads in the grid!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>3 rows of 5</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>3 × 5 = 15</span></div>
          </div>
          <div class="onboarding-caption">Tap the rows to count them up!</div>`,
      };

    case "double-double":
      return {
        title: s.title,
        badgeHtml: "⚡",
        voice: "Welcome to Double and Double-Double! Multiplying by 2 is just doubling once. Multiplying by 4 is doubling twice! To solve 4 times 6, double 6 to get 12, then double 12 to get 24!",
        rule: "<b>× 2</b> = Double once! &nbsp;•&nbsp; <b>× 4</b> = Double, then Double again!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>Start: 6</span></div>
            <span class="onboarding-arrow">×2➜</span>
            <div class="math-block"><span>12</span></div>
            <span class="onboarding-arrow">×2➜</span>
            <div class="math-block onboarding-focus"><span>24</span></div>
          </div>
          <div class="onboarding-caption"><b>4 × 6</b>: Double 6 is 12, Double 12 is <b>24</b>!</div>`,
      };

    case "ten-five":
      return {
        title: s.title,
        badgeHtml: "🔟",
        voice: "Welcome to Times 10 and Times 5! Multiplying by 10 is easy with Golden Ten-Bars: 10 times 6 is 6 tens, which is 60. And since 5 is half of 10, 5 times 6 is half of 60, which is 30!",
        rule: "<b>10 × n</b> = n tens! &nbsp;•&nbsp; <b>5 × n</b> = Half of 10 × n!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>10 × 6 = 60</span></div>
            <span class="onboarding-arrow">Half➜</span>
            <div class="math-block onboarding-focus"><span>5 × 6 = 30</span></div>
          </div>
          <div class="onboarding-caption">Half of 60 is <b>30</b>, so <b>5 × 6 = 30</b>!</div>`,
      };

    case "fair-share":
      return {
        title: s.title,
        badgeHtml: "🍽️",
        voice: "Welcome to Fair-Share Division! Division means sharing a total equally. For 12 divided by 3, we deal 12 treats equally onto 3 plates, and each plate gets 4 treats!",
        rule: "<b>Total ÷ Plates = How many on each plate!</b>",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>12 treats ÷ 3 plates</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>4 on each plate</span></div>
          </div>
          <div class="onboarding-caption"><b>12 ÷ 3 = 4</b> because 3 plates of 4 make 12!</div>`,
      };

    case "group-div":
      return {
        title: s.title,
        badgeHtml: "📦",
        voice: "Welcome to Grouping Division! We can also divide by packing items into boxes of the same size. If we have 15 beads and pack 5 beads in each box, we fill 3 boxes!",
        rule: "<b>Total ÷ Box Size = Number of Boxes Filled!</b>",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block">${beadBarSvg(5, 8)}<span>5</span></div>
            <div class="math-block">${beadBarSvg(5, 8)}<span>5</span></div>
            <div class="math-block">${beadBarSvg(5, 8)}<span>5</span></div>
            <span class="math-op">=</span>
            <div class="math-block onboarding-focus"><span>3 boxes</span></div>
          </div>
          <div class="onboarding-caption"><b>15 ÷ 5 = 3</b> because three 5s make 15!</div>`,
      };

    case "fact-family":
      return {
        title: s.title,
        badgeHtml: "🔺",
        voice: "Welcome to Fact Family Triangles! Multiplication and division are partners that use the exact same three numbers. If 3 times 4 equals 12, then 12 divided by 3 equals 4!",
        rule: "The top number is the <b>Product</b>, and the bottom corners are its <b>Factors</b>!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>3 × 4 = 12</span></div>
            <span class="onboarding-arrow">↔</span>
            <div class="math-block onboarding-focus"><span>12 ÷ 3 = 4</span></div>
          </div>
          <div class="onboarding-caption">Use the multiplication fact you know to solve the division fact!</div>`,
      };

    case "missing-factor":
      return {
        title: s.title,
        badgeHtml: "🧩",
        voice: "Welcome to Missing Factor Mystery! When a multiplication equation has a missing number, like 4 times blank equals 20, count by 4s until you reach 20: 4, 8, 12, 16, 20 — that is 5 fours!",
        rule: "Skip-count by the known factor until you reach the product!",
        exampleHtml: `
          <div class="onboarding-example-row">
            <div class="math-block"><span>4</span></div>
            <span class="math-op">×</span>
            <div class="math-block onboarding-focus"><span>5</span></div>
            <span class="math-op">=</span>
            <div class="math-block"><span>20</span></div>
          </div>
          <div class="onboarding-caption"><b>4 × 5 = 20</b>!</div>`,
      };

    default:
      return {
        title: s.title,
        badgeHtml: s.emoji || "🏆",
        voice: `Welcome to ${s.title}! ${s.blurb} Let's solve 5 fun challenges together!`,
        rule: s.blurb,
        exampleHtml: "",
      };
  }
}

/**
 * Parses a number or math expression for the Parent Show & Copy Board (#/copy).
 */
export function analyzeMathInput(raw) {
  const str = String(raw ?? "").trim();
  const mulMatch = str.match(/^(\d+)\s*[×✕*xX]\s*(\d+)$/);
  if (mulMatch) {
    const a = Math.max(1, Math.min(20, Number(mulMatch[1])));
    const b = Math.max(1, Math.min(20, Number(mulMatch[2])));
    const product = a * b;
    const isEven = product % 2 === 0;
    return {
      kind: "multiply",
      a,
      b,
      rows: a,
      cols: b,
      value: product,
      product,
      equationText: `${a} × ${b} = ${product}`,
      doubleVal: product * 2,
      quadVal: product * 4,
      isEven,
      halfVal: isEven ? product / 2 : null,
      factFamily: {
        a,
        b,
        product,
        equations: [
          `${a} × ${b} = ${product}`,
          `${b} × ${a} = ${product}`,
          `${product} ÷ ${a} = ${b}`,
          `${product} ÷ ${b} = ${a}`,
        ],
      },
      standardMul: `${a} × ${b} = ${product}`,
      standardDiv: `${product} ÷ ${a} = ${b}`,
      repeatedAdd: Array.from({ length: Math.min(a, 10) }, () => b).join(" + ") + (a > 10 ? " + …" : "") + ` = ${product}`,
      written: `${numberToWords(a)} groups of ${numberToWords(b).toLowerCase()} is ${numberToWords(product).toLowerCase()}`,
    };
  }

  const divMatch = str.match(/^(\d+)\s*[÷/]\s*(\d+)$/);
  if (divMatch) {
    const total = Math.max(1, Math.min(200, Number(divMatch[1])));
    const divisor = Math.max(1, Math.min(20, Number(divMatch[2])));
    const quotient = Math.max(1, Math.floor(total / divisor));
    const rem = total % divisor;
    const isEven = quotient % 2 === 0;
    const prod = divisor * quotient;
    return {
      kind: "divide",
      a: divisor,
      b: quotient,
      rows: divisor,
      cols: quotient,
      value: quotient,
      product: prod,
      rem,
      equationText: rem === 0 ? `${total} ÷ ${divisor} = ${quotient}` : `${total} ÷ ${divisor} = ${quotient} R${rem}`,
      doubleVal: quotient * 2,
      quadVal: quotient * 4,
      isEven,
      halfVal: isEven ? quotient / 2 : null,
      factFamily: {
        a: divisor,
        b: quotient,
        product: prod,
        equations: [
          `${divisor} × ${quotient} = ${prod}`,
          `${quotient} × ${divisor} = ${prod}`,
          `${prod} ÷ ${divisor} = ${quotient}`,
          `${prod} ÷ ${quotient} = ${divisor}`,
        ],
      },
      standardMul: `${divisor} × ${quotient} = ${prod}`,
      standardDiv: rem === 0 ? `${total} ÷ ${divisor} = ${quotient}` : `${total} ÷ ${divisor} = ${quotient} R${rem}`,
      repeatedAdd: `${total} shared equally into ${divisor} groups gives ${quotient} in each group`,
      written: `${numberToWords(total)} divided by ${numberToWords(divisor).toLowerCase()} is ${numberToWords(quotient).toLowerCase()}`,
    };
  }

  const addMatch = str.match(/^(\d+)\s*\+\s*(\d+)$/);
  if (addMatch) {
    const left = Math.max(1, Math.min(50, Number(addMatch[1])));
    const right = Math.max(1, Math.min(50, Number(addMatch[2])));
    const sum = left + right;
    const isEven = sum % 2 === 0;
    return {
      kind: "add",
      a: 2,
      b: left,
      rows: 2,
      cols: left,
      value: sum,
      product: sum,
      equationText: `${left} + ${right} = ${sum}`,
      doubleVal: sum * 2,
      quadVal: sum * 4,
      isEven,
      halfVal: isEven ? sum / 2 : null,
      factFamily: {
        a: 2,
        b: left,
        product: left * 2,
        equations: [
          `${left} + ${left} = ${left * 2}`,
          `2 × ${left} = ${left * 2}`,
          `${left * 2} ÷ 2 = ${left}`,
          `${left * 2} ÷ ${left} = 2`,
        ],
      },
      written: numberToWords(sum),
    };
  }

  const baseNum = Number(str.replace(/[^0-9]/g, "")) || 6;
  const n = Math.max(1, Math.min(100, baseNum));
  const dbl = n * 2;
  const dblDbl = n * 4;
  const isEven = n % 2 === 0;
  const half = isEven ? n / 2 : null;

  return {
    kind: "number",
    n,
    a: 2,
    b: n,
    rows: isEven ? 2 : 1,
    cols: isEven ? n / 2 : Math.min(10, n),
    value: n,
    product: dbl,
    equationText: `${n} + ${n} = ${dbl}`,
    doubleVal: dbl,
    quadVal: dblDbl,
    doubleDoubleVal: dblDbl,
    isEven,
    halfVal: half,
    factFamily: {
      a: 2,
      b: n,
      product: dbl,
      equations: [
        `2 × ${n} = ${dbl}`,
        `${n} × 2 = ${dbl}`,
        `${dbl} ÷ 2 = ${n}`,
        `${dbl} ÷ ${n} = 2`,
      ],
    },
    standardDouble: `${n} + ${n} = ${dbl}`,
    standardMul: `2 × ${n} = ${dbl}`,
    standardDiv: `${dbl} ÷ 2 = ${n}`,
    standardHalf: isEven ? `${n} ÷ 2 = ${n / 2}` : `${n} = ${Math.floor(n / 2)} + ${Math.floor(n / 2)} + 1`,
    written: numberToWords(n),
  };
}
