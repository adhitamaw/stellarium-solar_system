"use client";

import { useEffect, useState } from "react";
import { useT } from "@/store/useLocaleStore";

/** One-time mobile gesture tip */
export function MobileHints() {
  const [show, setShow] = useState(false);
  const t = useT();

  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const seen = sessionStorage.getItem("stellarium-mobile-tip");
    if (coarse && !seen) {
      setShow(true);
      const timer = window.setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("stellarium-mobile-tip", "1");
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute bottom-[10.5rem] left-1/2 z-20 w-[min(90vw,280px)] -translate-x-1/2 md:hidden">
      <div className="x-panel px-3 py-2.5 text-center text-[11px] text-white/60">
        <p className="x-label !normal-case !tracking-normal text-white/90">
          {t("controlTitle")}
        </p>
        <p className="mt-1 text-white/40">{t("controlBody")}</p>
      </div>
    </div>
  );
}
