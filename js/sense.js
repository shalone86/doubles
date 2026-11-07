// Number Sense Quiz generator for Grades 1, 2, and 3 (8 questions per round).

const SENSE_BANKS = {
  1: [
    {
      prompt: "Which addition fact is a DOUBLE?",
      speak: "Which addition fact is a double?",
      options: ["6 + 6", "5 + 7", "4 + 8"],
      answer: "6 + 6",
      explain: "A double adds the exact same number twice: 6 + 6!",
    },
    {
      prompt: "If you share 14 strawberries fairly between 2 baskets, how many go in each?",
      speak: "If you share 14 strawberries fairly between 2 baskets, how many go in each?",
      options: ["7", "6", "8"],
      answer: "7",
      explain: "Half of 14 is 7 because 7 + 7 = 14!",
    },
    {
      prompt: "Which number is EVEN (can be split into 2 equal whole halves)?",
      speak: "Which number is even and can be split into 2 equal whole halves?",
      options: ["16", "15", "13"],
      answer: "16",
      explain: "16 is even because 8 + 8 = 16!",
    },
    {
      prompt: "To solve 7 + 8 using a Near Double, which double helps you first?",
      speak: "To solve 7 plus 8 using a near double, which double helps you first?",
      options: ["7 + 7 = 14", "5 + 5 = 10", "9 + 9 = 18"],
      answer: "7 + 7 = 14",
      explain: "7 + 8 is just double 7 (14) plus 1 more (15)!",
    },
    {
      prompt: "What is double 20?",
      speak: "What is double 20?",
      options: ["40", "22", "30"],
      answer: "40",
      explain: "2 tens plus 2 tens makes 4 tens, or 40!",
    },
    {
      prompt: "What twin number goes in BOTH boxes: □ + □ = 18?",
      speak: "What twin number goes in both boxes so blank plus blank equals 18?",
      options: ["9", "8", "10"],
      answer: "9",
      explain: "9 + 9 = 18!",
    },
    {
      prompt: "What is half of 20?",
      speak: "What is half of 20?",
      options: ["10", "5", "12"],
      answer: "10",
      explain: "10 + 10 = 20, so half of 20 is 10!",
    },
    {
      prompt: "Double 12 is:",
      speak: "Double 12 is:",
      options: ["24", "22", "14"],
      answer: "24",
      explain: "Double 10 is 20, and double 2 is 4: 20 + 4 = 24!",
    },
    {
      prompt: "Which pair has the same total as 8 + 8?",
      speak: "Which pair has the same total as 8 plus 8?",
      options: ["16", "14", "18"],
      answer: "16",
      explain: "8 + 8 equals 16!",
    },
    {
      prompt: "What is 6 + 7?",
      speak: "What is 6 plus 7?",
      options: ["13", "12", "14"],
      answer: "13",
      explain: "6 + 6 is 12, plus 1 more is 13!",
    },
  ],
  2: [
    {
      prompt: "Which multiplication matches 4 + 4 + 4?",
      speak: "Which multiplication matches 4 plus 4 plus 4?",
      options: ["3 × 4", "4 × 4", "3 + 4"],
      answer: "3 × 4",
      explain: "There are 3 equal groups of 4, which is 3 × 4 = 12!",
    },
    {
      prompt: "How can you use Double-Double to solve 4 × 6?",
      speak: "How can you use Double-Double to solve 4 times 6?",
      options: ["Double 6 to 12, then double 12 to 24", "Add 4 + 6 = 10", "Double 6 to 12 and add 1"],
      answer: "Double 6 to 12, then double 12 to 24",
      explain: "×4 means double twice! Double 6 is 12, and double 12 is 24!",
    },
    {
      prompt: "How can you use ×10 to solve 5 × 8?",
      speak: "How can you use times 10 to solve 5 times 8?",
      options: ["Take half of 80, which is 40", "Add 5 + 8 = 13", "Double 80 to 160"],
      answer: "Take half of 80, which is 40",
      explain: "10 × 8 is 80, and 5 is half of 10, so half of 80 is 40!",
    },
    {
      prompt: "An egg carton has 2 rows of 6 eggs. How many eggs in all?",
      speak: "An egg carton has 2 rows of 6 eggs. How many eggs in all?",
      options: ["12", "8", "14"],
      answer: "12",
      explain: "2 rows of 6 is 2 × 6 = 12!",
    },
    {
      prompt: "What comes next when skip-counting by 5s: 15, 20, 25, ___?",
      speak: "What comes next when skip-counting by 5s: 15, 20, 25, blank?",
      options: ["30", "26", "35"],
      answer: "30",
      explain: "25 plus 5 more is 30!",
    },
    {
      prompt: "Which array has the SAME number of beads as 3 × 5?",
      speak: "Which array has the same number of beads as 3 times 5?",
      options: ["5 × 3", "3 × 3", "5 × 5"],
      answer: "5 × 3",
      explain: "3 rows of 5 (15) and 5 rows of 3 (15) are turnaround partners!",
    },
    {
      prompt: "What is 10 × 7?",
      speak: "What is 10 times 7?",
      options: ["70", "17", "35"],
      answer: "70",
      explain: "7 Golden Ten-Bars make 70!",
    },
    {
      prompt: "What is 4 × 5?",
      speak: "What is 4 times 5?",
      options: ["20", "15", "25"],
      answer: "20",
      explain: "Double 5 is 10, and double 10 is 20!",
    },
    {
      prompt: "What comes next when skip-counting by 3s: 3, 6, 9, ___?",
      speak: "What comes next when skip-counting by 3s: 3, 6, 9, blank?",
      options: ["12", "11", "15"],
      answer: "12",
      explain: "9 plus 3 more is 12!",
    },
    {
      prompt: "5 bags with 4 apples in each bag gives:",
      speak: "5 bags with 4 apples in each bag gives:",
      options: ["20 apples", "9 apples", "16 apples"],
      answer: "20 apples",
      explain: "5 × 4 = 20 apples!",
    },
  ],
  3: [
    {
      prompt: "If 4 × 6 = 24, what is 24 ÷ 4?",
      speak: "If 4 times 6 equals 24, what is 24 divided by 4?",
      options: ["6", "4", "8"],
      answer: "6",
      explain: "Multiplication and division are fact-family partners: 24 ÷ 4 = 6!",
    },
    {
      prompt: "You share 18 cookies equally onto 3 plates. How many on each plate?",
      speak: "You share 18 cookies equally onto 3 plates. How many on each plate?",
      options: ["6", "5", "9"],
      answer: "6",
      explain: "18 ÷ 3 = 6 because 3 × 6 = 18!",
    },
    {
      prompt: "How many boxes of 5 can you pack from 35 toys?",
      speak: "How many boxes of 5 can you pack from 35 toys?",
      options: ["7", "6", "8"],
      answer: "7",
      explain: "35 ÷ 5 = 7 boxes because 7 × 5 = 35!",
    },
    {
      prompt: "Find the missing factor: 6 × □ = 30",
      speak: "Find the missing factor: 6 times blank equals 30.",
      options: ["5", "4", "6"],
      answer: "5",
      explain: "6 × 5 = 30!",
    },
    {
      prompt: "Which equation belongs to the Fact Family for 3, 7, and 21?",
      speak: "Which equation belongs to the Fact Family for 3, 7, and 21?",
      options: ["21 ÷ 7 = 3", "21 - 3 = 7", "7 + 3 = 21"],
      answer: "21 ÷ 7 = 3",
      explain: "3 × 7 = 21, 7 × 3 = 21, 21 ÷ 3 = 7, and 21 ÷ 7 = 3!",
    },
    {
      prompt: "Dividing any even number by 2 is the exact same as:",
      speak: "Dividing any even number by 2 is the exact same as:",
      options: ["Taking HALF of the number", "Doubling the number", "Adding 2"],
      answer: "Taking HALF of the number",
      explain: "Dividing by 2 splits a number into 2 equal halves!",
    },
    {
      prompt: "What is 32 ÷ 4?",
      speak: "What is 32 divided by 4?",
      options: ["8", "7", "9"],
      answer: "8",
      explain: "Half of 32 is 16, and half of 16 is 8 (4 × 8 = 32)!",
    },
    {
      prompt: "Find the missing factor: 9 × □ = 27",
      speak: "Find the missing factor: 9 times blank equals 27.",
      options: ["3", "4", "2"],
      answer: "3",
      explain: "9 × 3 = 27!",
    },
    {
      prompt: "40 stickers shared equally among 10 kids gives:",
      speak: "40 stickers shared equally among 10 kids gives:",
      options: ["4 each", "10 each", "5 each"],
      answer: "4 each",
      explain: "40 ÷ 10 = 4!",
    },
    {
      prompt: "If 7 × 8 = 56, then 56 ÷ 8 equals:",
      speak: "If 7 times 8 equals 56, then 56 divided by 8 equals:",
      options: ["7", "8", "6"],
      answer: "7",
      explain: "56 ÷ 8 = 7!",
    },
  ],
};

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function makeSenseRound(grade = 1, seed = 1, avoidKeys = []) {
  const rng = mulberry32(seed);
  const bank = SENSE_BANKS[grade] || SENSE_BANKS[1];
  const avoidSet = new Set(avoidKeys || []);
  const fresh = bank.filter((q) => !avoidSet.has(q.prompt));
  const seen = bank.filter((q) => avoidSet.has(q.prompt));
  const picked = [...shuffle(fresh, rng), ...shuffle(seen, rng)].slice(0, 8);
  return picked.map((q) => ({
    ...q,
    _key: q.prompt,
    options: shuffle(q.options, rng),
  }));
}
