"use client";

import { useLocaleStore } from "@/store/useLocaleStore";
import type { Locale } from "@/i18n/types";

/** Compact ID | EN language switch */
export function LanguageToggle({
  compact = false,
}: {
  compact?: boolean;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const set = (next: Locale) => {
    if (next !== locale) setLocale(next);
  };

  return (
    <div
      className={`x-btn inline-flex h-8 items-center gap-0 p-0.5 ${
        compact ? "" : ""
      }`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => set("id")}
        className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
          locale === "id"
            ? "bg-white text-black"
            : "text-white/45 hover:text-white/80"
        }`}
        aria-pressed={locale === "id"}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => set("en")}
        className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
          locale === "en"
            ? "bg-white text-black"
            : "text-white/45 hover:text-white/80"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
