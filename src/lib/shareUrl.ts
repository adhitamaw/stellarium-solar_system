import { bodyById } from "@/data/celestialBodies";

/** Resolve focus id from URL search params (?focus=saturn) */
export function focusIdFromSearch(search: string): string | null {
  try {
    const q = new URLSearchParams(
      search.startsWith("?") ? search : `?${search}`,
    );
    const raw = (q.get("focus") || q.get("body") || "").toLowerCase().trim();
    if (!raw) return null;
    if (bodyById[raw]) return raw;
    // Allow Indonesian / alternate names
    const aliases: Record<string, string> = {
      matahari: "sun",
      sun: "sun",
      merkurius: "mercury",
      mercury: "mercury",
      venus: "venus",
      bumi: "earth",
      earth: "earth",
      bulan: "moon",
      moon: "moon",
      mars: "mars",
      jupiter: "jupiter",
      saturnus: "saturn",
      saturn: "saturn",
      uranus: "uranus",
      neptunus: "neptune",
      neptune: "neptune",
    };
    return aliases[raw] ?? null;
  } catch {
    return null;
  }
}

/** Build shareable URL for a body (current origin) */
export function buildFocusUrl(bodyId: string): string {
  if (typeof window === "undefined") return `?focus=${bodyId}`;
  const url = new URL(window.location.href);
  url.searchParams.set("focus", bodyId);
  // Drop unused params noise
  url.hash = "";
  return url.toString();
}

export async function copyFocusLink(bodyId: string): Promise<boolean> {
  const link = buildFocusUrl(bodyId);
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Stellarium Cinematic",
        text: `Jelajahi ${bodyById[bodyId]?.name ?? bodyId}`,
        url: link,
      });
      return true;
    }
  } catch {
    // fall through to clipboard
  }
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    return false;
  }
}
