"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { celestialBodies } from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const focusBody = useSimulationStore((s) => s.focusBody);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return celestialBodies.slice(0, 8);
    return celestialBodies
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.id.includes(q) ||
          b.type.includes(q),
      )
      .slice(0, 10);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white/60 shadow-lg backdrop-blur-xl transition hover:border-white/20 hover:text-white/90"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Cari objek…</span>
        <kbd className="ml-2 hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 z-40 w-[min(100vw-2rem,300px)] overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Planet, bulan, matahari…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                aria-label="Cari objek langit"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
              {results.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-white/10"
                    onClick={() => {
                      focusBody(b.id, "search");
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: b.color }}
                    />
                    <span className="text-white/90">{b.name}</span>
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-white/35">
                      {b.type}
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-4 text-center text-sm text-white/40">
                  Tidak ditemukan
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-white/50"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}
