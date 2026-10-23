import type { SchemeRow } from "../types";
export interface BreakPeriod {
  start: string;
  end: string;
  label: string;
  lessonFrom?: number;
  lessonTo?: number;
}
const dayMs = 86400000;
function date(value: string) {
  const time = Date.parse(value + "T00:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(time) ||
    new Date(time).toISOString().slice(0, 10) !== value
  )
    throw new Error("Use YYYY-MM-DD dates.");
  return time;
}
export function buildSchedule(
  templates: SchemeRow[],
  start: string,
  end: string,
  lessons: number,
  breaks: BreakPeriod[],
  single = false,
): SchemeRow[] {
  const first = date(start),
    last = date(end);
  if (last <= first || last - first > 366 * dayMs)
    throw new Error("Closing date must follow the start date within one year.");
  if (!Number.isInteger(lessons) || lessons < 1 || lessons > 10)
    throw new Error("Choose 1 to 10 lessons per week.");
  if (!templates.length) throw new Error("No lesson content was generated.");
  const periods = breaks.map((b) => ({
    ...b,
    from: date(b.start),
    until: date(b.end),
  }));
  if (periods.some((b) => b.until < b.from))
    throw new Error("A break must end on or after its start date.");
  if (
    periods.some(
      (b) =>
        (b.lessonFrom !== undefined || b.lessonTo !== undefined) &&
        (!Number.isInteger(b.lessonFrom) ||
          !Number.isInteger(b.lessonTo) ||
          b.lessonFrom! < 1 ||
          b.lessonTo! > lessons ||
          b.lessonTo! < b.lessonFrom!),
    )
  )
    throw new Error(
      "Break lesson numbers must run from 1 to your lessons per week, with the last lesson at or after the first.",
    );
  if (periods.some((b) => b.from < first || b.until > last))
    throw new Error("Break dates must be within the term.");
  const result: SchemeRow[] = [];
  let index = 0;
  for (let cursor = first; cursor <= last; cursor += dayMs) {
    const iso = new Date(cursor).toISOString().slice(0, 10),
      week = Math.floor((cursor - first) / (7 * dayMs)) + 1;
    const pause = periods.find(
      (b) =>
        cursor >= b.from && cursor <= b.until && b.lessonFrom === undefined,
    );
    if (pause || cursor === last) {
      result.push({
        id: `break-${iso}`,
        week,
        lesson: 0,
        strand: `${pause?.label || "END OF TERM — CLOSED"} · ${iso}`,
        subStrand: "",
        specificOutcomes: "",
        inquiryQuestions: "",
        learningExperiences: "",
        coreCompetencies: "",
        resources: "",
        assessment: "",
      });
      continue;
    }
    const weekday = new Date(cursor).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const slots =
      Math.floor((weekday * lessons) / 5) -
      Math.floor(((weekday - 1) * lessons) / 5);
    for (let slot = 0; slot < slots; slot++) {
      const weeklyLesson = Math.floor(((weekday - 1) * lessons) / 5) + slot + 1;
      const lessonBreak = periods.find(
        (b) =>
          cursor >= b.from &&
          cursor <= b.until &&
          b.lessonFrom !== undefined &&
          weeklyLesson >= b.lessonFrom &&
          weeklyLesson <= b.lessonTo!,
      );
      if (lessonBreak) {
        result.push({
          id: `break-${iso}-${slot}`,
          week,
          lesson: 0,
          strand: `${lessonBreak.label} · ${iso} · Weekly lesson ${weeklyLesson}`,
          subStrand: "",
          specificOutcomes: "",
          inquiryQuestions: "",
          learningExperiences: "",
          coreCompetencies: "",
          resources: "",
          assessment: "",
        });
        continue;
      }
      const template = templates[index % templates.length];
      result.push({
        ...template,
        id: `lesson-${iso}-${slot}`,
        week,
        lesson: index + 1,
        subStrand: `${iso} · ${template.subStrand}`,
      });
      index++;
      if (single) return result;
    }
  }
  return result;
}
