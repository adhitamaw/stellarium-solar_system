"use client";

import { create } from "zustand";
import type { Locale } from "@/i18n/types";
import { uiDict, type UiKey } from "@/i18n/ui";

const STORAGE_KEY = "stellarium-locale";

function readStored(): Locale {
  if (typeof window === "undefined") return "id";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "id") return v;
  } catch {
    /* ignore */
  }
  return "id";
}

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: "id",
  setLocale: (locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    set({ locale });
  },
  toggleLocale: () => {
    const next: Locale = get().locale === "id" ? "en" : "id";
    get().setLocale(next);
  },
}));

/** Hydrate from localStorage after mount */
export function hydrateLocale() {
  useLocaleStore.getState().setLocale(readStored());
}

/** Translate UI string */
export function t(key: UiKey, locale?: Locale): string {
  const loc = locale ?? useLocaleStore.getState().locale;
  return uiDict[loc][key] ?? uiDict.en[key] ?? key;
}

/** Hook-friendly translator bound to current locale */
export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: UiKey) => t(key, locale);
}
