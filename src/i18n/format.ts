import type { Locale } from "./types";
import { uiDict } from "./ui";

function bcp47(locale: Locale): string {
  return locale === "id" ? "id-ID" : "en-US";
}

function u(locale: Locale) {
  return uiDict[locale];
}

/** Format a number with locale-aware decimal separators */
export function formatNumber(
  value: number,
  locale: Locale,
  fractionDigits: number,
): string {
  return value.toLocaleString(bcp47(locale), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Orbital distance: km for very small AU, else AU */
export function formatDistance(
  au: number | undefined,
  locale: Locale = "en",
): string {
  const dict = u(locale);
  if (au === undefined || au === 0) return "—";
  if (au < 0.01) {
    const km = au * 149_597_870.7;
    return `${formatNumber(km, locale, 0)} ${dict.unitKm}`;
  }
  return `${formatNumber(au, locale, 3)} ${dict.unitAu}`;
}

/** Mean radius display (e.g. "6.371 thousand km" / "6.371 ribu km") */
export function formatRadius(km: number, locale: Locale = "en"): string {
  const dict = u(locale);
  if (km >= 1_000) {
    return `${formatNumber(km / 1_000, locale, 1)} ${dict.thousandKm}`;
  }
  // Spacecraft / tiny bodies: show meters
  if (km > 0 && km < 1) {
    return `${formatNumber(km * 1_000, locale, km < 0.01 ? 1 : 0)} m`;
  }
  return `${formatNumber(km, locale, 1)} ${dict.unitKm}`;
}

/** Absolute km with locale grouping, e.g. "6.371 km" */
export function formatKmExact(km: number, locale: Locale = "en"): string {
  const dict = u(locale);
  return `${formatNumber(km, locale, km >= 100 ? 0 : 1)} ${dict.unitKm}`;
}

/** Simulation epoch date (UTC). Pass `withTime` for live/realtime display. */
export function formatSimDate(
  simDays: number,
  locale: Locale = "en",
  opts?: { withTime?: boolean },
): string {
  // Keep in sync with J2000_MS in lib/simClock
  const epoch = Date.UTC(2000, 0, 1, 12, 0, 0);
  const d = new Date(epoch + simDays * 86_400_000);
  if (opts?.withTime) {
    const s = d.toLocaleString(bcp47(locale), {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
    return `${s} UTC`;
  }
  const s = d.toLocaleDateString(bcp47(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${s} UTC`;
}

/** Short distance unit for moon orbits: "384 k km" / "384 rb km" */
export function formatThousandKm(km: number, locale: Locale = "en"): string {
  const dict = u(locale);
  return `${formatNumber(km / 1000, locale, 0)} ${dict.thousandKmShort}`;
}
