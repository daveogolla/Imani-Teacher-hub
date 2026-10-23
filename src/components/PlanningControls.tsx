import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import type { BreakPeriod } from "../services/schedule";
import type { SubjectCurriculum } from "../types";

export function SubjectPicker({
  subjects,
  value,
  onChange,
}: {
  subjects: SubjectCurriculum[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const matches = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-3">
      <label className="planner-field">
        <span>Find a subject or learning area</span>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-3.5 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learning areas…"
            className="!pl-10"
          />
        </div>
      </label>
      <div
        role="group"
        aria-label="Learning areas"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1"
      >
        {matches.map((subject) => (
          <button
            key={subject.name}
            type="button"
            aria-pressed={subject.name === value}
            onClick={() => onChange(subject.name)}
            className={`text-left rounded-xl border p-3 transition-colors ${subject.name === value ? "bg-emerald-900 text-white border-emerald-900" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-emerald-600"}`}
          >
            <span className="block text-xs font-semibold">{subject.name}</span>
            <span
              className={`text-[10px] ${subject.name === value ? "text-emerald-200" : "text-slate-500"}`}
            >
              {subject.category}
            </span>
          </button>
        ))}
      </div>
      {!matches.length && (
        <p className="text-xs text-slate-500">
          No matching learning areas. Enter your subject below.
        </p>
      )}
      <label className="planner-field">
        <span>Selected subject / another learning area</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a subject if it is not listed"
        />
      </label>
    </div>
  );
}

export function BookPicker({
  value,
  onChange,
  saved,
}: {
  value: string;
  onChange: (value: string) => void;
  saved: string[];
}) {
  const [publisher, setPublisher] = useState(""),
    [title, setTitle] = useState(""),
    [edition, setEdition] = useState("");
  const update = (next: {
    publisher?: string;
    title?: string;
    edition?: string;
  }) => {
    const p = next.publisher ?? publisher,
      t = next.title ?? title,
      e = next.edition ?? edition;
    setPublisher(p);
    setTitle(t);
    setEdition(e);
    onChange([t, p, e].filter(Boolean).join(" · "));
  };
  return (
    <section className="planner-card space-y-4">
      <div className="flex gap-3 items-center">
        <div className="planner-icon">
          <BookOpen size={20} />
        </div>
        <div>
          <h2 className="font-bold text-sm">Choose your book reference</h2>
          <p className="text-xs text-slate-500">
            Optional · use the edition in your classroom
          </p>
        </div>
      </div>
      <a
        href="https://kicd.ac.ke/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-200"
      >
        Check approved learning materials at KICD
        <ExternalLink size={15} />
      </a>
      <p className="text-xs text-slate-500 leading-relaxed">
        Confirm the exact title, grade and edition with KICD. Publisher choices
        and saved references below are not verified approval listings.
      </p>
      {saved.length > 0 && (
        <label className="planner-field">
          <span>Your saved references for this learning area</span>
          <select
            value={saved.includes(value) ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Choose a saved book…</option>
            {saved.map((book) => (
              <option key={book}>{book}</option>
            ))}
          </select>
        </label>
      )}
      <label className="planner-field">
        <span>Publisher</span>
        <select
          value={publisher}
          onChange={(e) => update({ publisher: e.target.value })}
        >
          <option value="">Choose publisher (optional)</option>
          {[
            "Kenya Literature Bureau (KLB)",
            "Oxford University Press",
            "Longhorn Publishers",
            "Moran Publishers",
            "Spotlight Publishers",
            "Storymoja",
            "Other publisher",
          ].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="planner-field">
        <span>Book title</span>
        <input
          value={title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Type the title from your book cover"
        />
      </label>
      <label className="planner-field">
        <span>Edition, year and pages</span>
        <input
          value={edition}
          onChange={(e) => update({ edition: e.target.value })}
          placeholder="e.g. 2025 edition, pages 12–30"
        />
      </label>
      {value && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 p-3 text-xs">
          <span className="text-slate-500 block mb-1">
            Reference included in your draft
          </span>
          {value}
          <button
            onClick={() => {
              setTitle("");
              setPublisher("");
              setEdition("");
              onChange("");
            }}
            className="block mt-2 underline"
          >
            Clear reference
          </button>
        </div>
      )}
    </section>
  );
}

export function BreakEditor({
  value,
  onChange,
  lessons,
  start,
  end,
}: {
  value: BreakPeriod[];
  onChange: (value: BreakPeriod[]) => void;
  lessons: number;
  start: string;
  end: string;
}) {
  const update = (index: number, patch: Partial<BreakPeriod>) =>
    onChange(value.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 items-center">
          <CalendarDays size={18} className="text-emerald-700" />
          <h3 className="text-sm font-bold">Breaks & missed lessons</h3>
        </div>
        <span className="text-[10px] text-slate-500">{value.length} added</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Choose the dates, then leave all lessons blank or choose lesson numbers
        within each affected week. Numbering runs from 1 to {lessons} each week.
      </p>
      {value.map((b, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 space-y-3"
        >
          <div className="flex gap-2 items-end">
            <label className="planner-field flex-1">
              <span>Break {index + 1}</span>
              <select
                value={
                  [
                    "Half-term break",
                    "Public holiday",
                    "School event",
                    "Other break",
                  ].includes(b.label)
                    ? b.label
                    : "Other break"
                }
                onChange={(e) => update(index, { label: e.target.value })}
              >
                {[
                  "Half-term break",
                  "Public holiday",
                  "School event",
                  "Other break",
                ].map((label) => (
                  <option key={label}>{label}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              aria-label={`Remove break ${index + 1}`}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="p-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="planner-field">
              <span>From date</span>
              <input
                type="date"
                min={start}
                max={end}
                value={b.start}
                onChange={(e) => update(index, { start: e.target.value })}
              />
            </label>
            <label className="planner-field">
              <span>Through date</span>
              <input
                type="date"
                min={b.start || start}
                max={end}
                value={b.end}
                onChange={(e) => update(index, { end: e.target.value })}
              />
            </label>
          </div>
          <label className="planner-field">
            <span>Which lessons are affected?</span>
            <select
              value={b.lessonFrom === undefined ? "all" : "range"}
              onChange={(e) =>
                update(
                  index,
                  e.target.value === "all"
                    ? { lessonFrom: undefined, lessonTo: undefined }
                    : { lessonFrom: 1, lessonTo: lessons },
                )
              }
            >
              <option value="all">All lessons on these dates</option>
              <option value="range">Choose weekly lesson numbers</option>
            </select>
          </label>
          {b.lessonFrom !== undefined && (
            <div className="grid grid-cols-2 gap-2">
              <label className="planner-field">
                <span>From lesson</span>
                <select
                  value={b.lessonFrom}
                  onChange={(e) =>
                    update(index, { lessonFrom: Number(e.target.value) })
                  }
                >
                  {Array.from({ length: lessons }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label className="planner-field">
                <span>Through lesson</span>
                <select
                  value={b.lessonTo}
                  onChange={(e) =>
                    update(index, { lessonTo: Number(e.target.value) })
                  }
                >
                  {Array.from({ length: lessons }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
            {b.lessonFrom === undefined
              ? "All teaching fields stay blank during this break."
              : `Only weekly lessons ${b.lessonFrom}–${b.lessonTo} on the selected dates stay blank.`}
          </p>
        </div>
      ))}
      {!value.length && (
        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500">
          No breaks yet. Add a half-term break, holiday or school event.
        </p>
      )}
      <button
        type="button"
        onClick={() =>
          onChange([...value, { start: "", end: "", label: "Other break" }])
        }
        className="flex w-full justify-center gap-2 items-center p-3 rounded-xl border border-dashed border-emerald-500 text-emerald-800 dark:text-emerald-200 text-xs font-semibold"
      >
        <Plus size={16} />
        Add a break
      </button>
    </div>
  );
}
