"use client";

import { useEffect, useRef } from "react";
import { bodyById } from "@/data/celestialBodies";
import { focusIdFromSearch } from "@/lib/shareUrl";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLoadingStore } from "@/store/useLoadingStore";

/**
 * - On load: ?focus=saturn → fly to body (after scene ready)
 * - On focus change: keep URL in sync for shareable links
 */
export function DeepLink() {
  const selectedId = useSimulationStore((s) => s.selectedId);
  const focusBody = useSimulationStore((s) => s.focusBody);
  const setShowOnboarding = useSimulationStore((s) => s.setShowOnboarding);
  const ready = useLoadingStore((s) => s.ready);
  const applied = useRef(false);
  const skipUrlWrite = useRef(false);

  // Apply deep link once scene is ready
  useEffect(() => {
    if (!ready || applied.current) return;
    applied.current = true;
    const id = focusIdFromSearch(window.location.search);
    if (id && bodyById[id]) {
      skipUrlWrite.current = true;
      setShowOnboarding(false);
      // Small delay so positions exist
      window.setTimeout(() => {
        focusBody(id, "search");
        skipUrlWrite.current = false;
      }, 400);
    }
  }, [ready, focusBody, setShowOnboarding]);

  // Sync URL when selection changes
  useEffect(() => {
    if (!ready || skipUrlWrite.current) return;
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selectedId && bodyById[selectedId]) {
      if (url.searchParams.get("focus") === selectedId) return;
      url.searchParams.set("focus", selectedId);
      window.history.replaceState({}, "", url.toString());
    }
  }, [selectedId, ready]);

  return null;
}
