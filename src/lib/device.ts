/** Client-side device heuristics for quality + mobile UX */

export function isClient() {
  return typeof window !== "undefined";
}

export function isMobileDevice(): boolean {
  if (!isClient()) return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const ua = navigator.userAgent || "";
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(ua);
  return mobileUA || (coarse && narrow);
}

export function isLowEndDevice(): boolean {
  if (!isClient()) return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (typeof mem === "number" && mem <= 4) return true;
  if (cores <= 4 && isMobileDevice()) return true;
  return false;
}

export function preferredQuality(): "performance" | "balanced" | "ultra" {
  if (isLowEndDevice() || isMobileDevice()) return "performance";
  return "balanced";
}

export function maxDpr(quality: "performance" | "balanced" | "ultra"): number {
  if (!isClient()) return 1;
  const dpr = window.devicePixelRatio || 1;
  if (quality === "performance" || isMobileDevice()) return Math.min(dpr, 1.25);
  if (quality === "balanced") return Math.min(dpr, 1.5);
  return Math.min(dpr, 2);
}
