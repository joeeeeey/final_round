"use client";

import { useEffect, useRef, useState } from "react";
import { QAItem } from "@/types/interview";

type RoleLabel = "Interviewer" | "Candidate";

function roleToMeta(role: QAItem["role"]): { icon: string; label: RoleLabel; className: string } {
  if (role === "interviewer") {
    return { icon: "🧑‍💼", label: "Interviewer", className: "text-blue-700 dark:text-blue-300" };
  }
  return { icon: "🧑‍💻", label: "Candidate", className: "text-purple-700 dark:text-purple-300" };
}

function typeToVerb(type: QAItem["type"]): string {
  return type === "question" ? "asked" : "answered";
}

export interface ReferencePopoverProps {
  timestamps: string[];
  lookup: Record<string, QAItem> | undefined;
}

export default function ReferencePopover({ timestamps, lookup }: ReferencePopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const items: { ts: string; qa?: QAItem }[] = (timestamps || []).map((ts) => ({ ts, qa: lookup?.[ts] }));

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        className="text-xs text-blue-700 dark:text-blue-300 hover:underline focus:outline-none"
        aria-haspopup="dialog"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        🔗 References: [{timestamps.join(", ")}] 
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute z-50 mt-2 min-w-[280px] max-w-[420px] w-max p-3 rounded-lg border shadow-lg bg-white dark:bg-slate-800 dark:border-slate-700"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">No references found.</div>
            )}
            {items.map(({ ts, qa }) => (
              <div key={ts} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono">
                    {ts}
                  </span>
                </div>
                {qa ? (
                  <div className="leading-relaxed">
                    {(() => {
                      const meta = roleToMeta(qa.role);
                      const verb = typeToVerb(qa.type);
                      return (
                        <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-100">
                          <span className={meta.className}>{meta.icon} {meta.label}</span>{" "}
                          {verb} ({qa.type}): {qa.content}
                        </p>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Not found in transcript.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


