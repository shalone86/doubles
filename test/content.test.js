// Kids' content must be right: every question has its answer among its choices, no duplicate
// choices, no broken text, and (Doubles) every equation written in a hint or instruction adds up.
import { test } from "node:test";
import assert from "node:assert/strict";
import { STAGES, makeStage } from "../public/js/doubles.js";

const all = () => STAGES.flatMap((s) => Array.from({ length: 120 }, (_, i) => makeStage(s, i + 1, []).map((q) => [s, q])).flat());

test("every stage makes 5 questions with correct, unique choices", () => {
  for (const s of STAGES) assert.equal(makeStage(s, 1, []).length >= 5, true, s.id);
  for (const [s, q] of all()) {
    const tag = `${s.id}: ${q.instruction}`;
    assert.ok(q.instruction, tag);
    for (const f of ["instruction", "hint", "spoken", "prompt"]) assert.doesNotMatch(String(q[f] ?? ""), /undefined|NaN|\[object/, tag);
    if (q.choices?.length) {
      const v = q.choices.map(String);
      assert.ok(v.includes(String(q.answer)), `${tag}: answer ${q.answer} missing`);
      assert.equal(new Set(v).size, v.length, `${tag}: duplicate choices`);
    }
  }
});

test("equations in the text add up", () => {
  for (const [s, q] of all()) {
    for (const f of ["instruction", "hint", "spoken"]) {
      const t = String(q[f] ?? "");
      // Simple "a op b = c" (repeated addition like 4 + 4 + 4 = 12 is skipped).
      for (const m of t.matchAll(/(?<![\d+] )(\d+) ([+×÷−-]) (\d+) = (\d+)/g)) {
        const [, a, op, b, c] = m;
        const r = op === "+" ? +a + +b : op === "×" ? a * b : op === "÷" ? a / b : a - b;
        assert.equal(r, +c, `${s.id}: "${m[0]}" in ${f}: ${t}`);
      }
    }
  }
});
