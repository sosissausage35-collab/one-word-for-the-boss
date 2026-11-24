// One Word for the Boss — make.fun bounty
// u-swift-badger-44-one-word-for-the-boss-6b48c735
//
// The program picks exactly ONE word that describes "the boss" and writes it
// to /output/entry.txt. Selection is deterministic: every candidate is scored
// against the judge's criteria (most important first) and the highest scorer
// wins. No randomness, no network, no AI call — the choice is reproducible.
//
// Judge criteria (in priority order):
//   1. Realness   — a word people genuinely use about their boss.
//   2. Humour     — funny standing alone, the kind co-workers repeat at lunch.
//   3. Truth      — captures a real, recognisable boss habit.
//   4. Freshness  — not the first word that comes to mind; surprise invites a laugh.
//   5. Cross-industry — works in a kitchen, a warehouse, or an office, no explanation needed.
//
// Weights mirror that priority: 30 / 25 / 20 / 15 / 10. Each sub-score is 0-10.
// Ties are broken deterministically: higher total first, then the shorter
// word, then alphabetical — so the same candidates always pick the same winner.

import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";

interface Candidate {
  word: string;
  realness: number; // 0-10: genuinely used about bosses
  humour: number; // 0-10: funny standing alone
  truth: number; // 0-10: captures a real boss habit
  freshness: number; // 0-10: not the first word that comes to mind
  crossIndustry: number; // 0-10: needs no explanation anywhere
  note: string;
}

const CANDIDATES: Candidate[] = [
  {
    word: "micromanager",
    realness: 10,
    humour: 4,
    truth: 9,
    freshness: 1, // the single most clichéd boss word there is
    crossIndustry: 9,
    note: "True and real, but the first word everyone reaches for — zero surprise.",
  },
  {
    word: "perfectionist",
    realness: 8,
    humour: 3,
    truth: 7,
    freshness: 3,
    crossIndustry: 8,
    note: "Accurate, but reads like a CV line, not a lunch-table joke.",
  },
  {
    word: "workaholic",
    realness: 8,
    humour: 4,
    truth: 7,
    freshness: 4,
    crossIndustry: 8,
    note: "Common and true, but flat — it describes hours, not a person.",
  },
  {
    word: "nitpicker",
    realness: 8,
    humour: 6,
    truth: 8,
    freshness: 5,
    crossIndustry: 7,
    note: "Solid and funny-ish, but the joke is a little small and a little mean.",
  },
  {
    word: "ghost",
    realness: 8,
    humour: 8,
    truth: 8,
    freshness: 7,
    crossIndustry: 9,
    note: "The boss who is never there. Funny, true, instantly understood — but the joke is mostly absence.",
  },
  {
    word: "delegator",
    realness: 7,
    humour: 7,
    truth: 8,
    freshness: 7,
    crossIndustry: 7,
    note: "Ironic: the boss whose whole job is giving you their job. Lands best in offices.",
  },
  {
    word: "vampire",
    realness: 6,
    humour: 8,
    truth: 7,
    freshness: 7,
    crossIndustry: 8,
    note: "Sucks the energy out of the room. Vivid and funny, but slightly more insult than description.",
  },
  {
    word: "weathervane",
    realness: 4,
    humour: 7,
    truth: 8,
    freshness: 9,
    crossIndustry: 6,
    note: "Changes direction with every breeze — fresh and true, but nobody actually calls their boss this.",
  },
  {
    word: "magician",
    realness: 6,
    humour: 8,
    truth: 7,
    freshness: 8,
    crossIndustry: 8,
    note: "Makes work appear out of thin air and deadlines vanish. Funny, but needs a beat to land.",
  },
  {
    word: "firefighter",
    realness: 9,
    humour: 8,
    truth: 10,
    freshness: 8,
    crossIndustry: 10,
    note: "Every workplace has one: the boss permanently in crisis mode, sprinting from one fire to the next, creating most of them. Co-workers say it at lunch and everyone nods — funny, true, fresh enough, and it works in a kitchen, a warehouse, and an office with zero explanation.",
  },
];

const WEIGHTS = {
  realness: 30,
  humour: 25,
  truth: 20,
  freshness: 15,
  crossIndustry: 10,
} as const;

function score(c: Candidate): number {
  return (
    (c.realness * WEIGHTS.realness +
      c.humour * WEIGHTS.humour +
      c.truth * WEIGHTS.truth +
      c.freshness * WEIGHTS.freshness +
      c.crossIndustry * WEIGHTS.crossIndustry) /
    10
  );
}

function validate(word: string): void {
  if (!/^[A-Za-z]{1,30}$/.test(word)) {
    throw new Error(
      `Invalid entry word ${JSON.stringify(word)}: must be 1-30 letters, no spaces or punctuation.`,
    );
  }
}

function main(): void {
  const ranked = CANDIDATES.map((c) => ({ ...c, total: score(c) })).sort(
    (a, b) =>
      b.total - a.total ||
      a.word.length - b.word.length ||
      a.word.localeCompare(b.word),
  );

  for (const c of ranked) {
    console.log(`${c.total.toFixed(1).padStart(5)}  ${c.word.padEnd(14)} ${c.note}`);
  }

  const winner = ranked[0];
  console.log(`\nWinner: ${winner.word} (${winner.total.toFixed(1)})`);
  validate(winner.word);

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, winner.word, "utf8");
  console.log(`Wrote ${JSON.stringify(winner.word)} to ${OUTPUT_PATH}`);
}

main();
