import { test, expect } from "bun:test";
import { buildSchedule } from "../src/services/schedule";
import type { SchemeRow } from "../src/types";
const template: SchemeRow = {
  id: "template",
  week: 1,
  lesson: 1,
  strand: "Numbers",
  subStrand: "Fractions",
  specificOutcomes: "Compare fractions",
  inquiryQuestions: "Which fraction is larger?",
  learningExperiences: "Use fraction strips",
  coreCompetencies: "Critical thinking",
  resources: "Fraction strips",
  assessment: "Compare three pairs",
};
test("partial-week half-term dates contain no lesson content", () => {
  const rows = buildSchedule([template], "2026-01-05", "2026-01-16", 5, [
    { start: "2026-01-07", end: "2026-01-09", label: "HALF TERM" },
  ]);
  const breaks = rows.filter((r) => r.strand.includes("HALF TERM"));
  expect(breaks).toHaveLength(3);
  for (const row of breaks) {
    expect(row.lesson).toBe(0);
    expect(row.learningExperiences).toBe("");
    expect(row.specificOutcomes).toBe("");
    expect(row.assessment).toBe("");
  }
  expect(rows.filter((r) => r.lesson > 0)).toHaveLength(6);
});
test("closing date is blank and nothing is scheduled later", () => {
  const rows = buildSchedule([template], "2026-01-05", "2026-01-07", 10, []);
  expect(rows.filter((r) => r.lesson > 0)).toHaveLength(4);
  expect(rows.at(-1)?.strand).toContain("END OF TERM");
  expect(rows.at(-1)?.learningExperiences).toBe("");
});
test("multiple school breaks remain blank", () => {
  const rows = buildSchedule([template], "2026-01-05", "2026-01-16", 5, [
    { start: "2026-01-06", end: "2026-01-06", label: "Staff training" },
    { start: "2026-01-13", end: "2026-01-14", label: "School break" },
  ]);
  expect(rows.filter((r) => r.lesson === 0)).toHaveLength(4);
});
test("one lesson plan contains one detailed teaching entry", () => {
  expect(
    buildSchedule([template], "2026-01-05", "2026-01-16", 5, [], true).filter(
      (r) => r.lesson > 0,
    ),
  ).toHaveLength(1);
});
test("invalid dates, lesson counts and reversed intervals are rejected", () => {
  expect(() =>
    buildSchedule([template], "2026-02-31", "2026-04-01", 5, []),
  ).toThrow();
  expect(() =>
    buildSchedule([template], "2026-01-05", "2026-01-01", 5, []),
  ).toThrow();
  expect(() =>
    buildSchedule([template], "2026-01-05", "2026-01-16", 0, []),
  ).toThrow();
  expect(() =>
    buildSchedule([template], "2026-01-05", "2026-01-16", 5, [
      { start: "2026-01-09", end: "2026-01-07", label: "Invalid" },
    ]),
  ).toThrow();
});

test("a weekly lesson range blanks only matching slots within its dates", () => {
  const rows = buildSchedule([template], "2026-01-05", "2026-01-16", 10, [
    {
      start: "2026-01-05",
      end: "2026-01-09",
      label: "School event",
      lessonFrom: 2,
      lessonTo: 3,
    },
  ]);
  const breaks = rows.filter((r) => r.strand.includes("School event"));
  expect(breaks).toHaveLength(2);
  expect(breaks[0].strand).toContain("2026-01-05 · Weekly lesson 2");
  expect(breaks[1].strand).toContain("2026-01-06 · Weekly lesson 3");
  expect(
    breaks.every((row) => row.lesson === 0 && row.learningExperiences === ""),
  ).toBe(true);
  expect(rows.filter((row) => row.lesson > 0)).toHaveLength(16);
});
test("weekly lesson breaks repeat on each affected week and preserve content sequence", () => {
  const rows = buildSchedule([template], "2026-01-05", "2026-01-16", 5, [
    {
      start: "2026-01-05",
      end: "2026-01-15",
      label: "Event",
      lessonFrom: 2,
      lessonTo: 2,
    },
  ]);
  expect(rows.filter((row) => row.strand.includes("Event"))).toHaveLength(2);
  expect(rows.filter((row) => row.lesson > 0).map((row) => row.lesson)).toEqual(
    [1, 2, 3, 4, 5, 6, 7],
  );
});
test("invalid lesson ranges and breaks outside the term are rejected", () => {
  for (const range of [
    { lessonFrom: 4, lessonTo: 2 },
    { lessonFrom: 0, lessonTo: 2 },
    { lessonFrom: 1, lessonTo: 6 },
    { lessonFrom: 1, lessonTo: undefined },
  ]) {
    expect(() =>
      buildSchedule([template], "2026-01-05", "2026-01-16", 5, [
        { start: "2026-01-06", end: "2026-01-07", label: "Event", ...range },
      ]),
    ).toThrow();
  }
  expect(() =>
    buildSchedule([template], "2026-01-05", "2026-01-16", 5, [
      { start: "2026-02-06", end: "2026-02-07", label: "Event" },
    ]),
  ).toThrow();
});
