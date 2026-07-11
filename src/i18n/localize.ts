import type { CelestialBody } from "@/data/celestialBodies";
import type { TourStep } from "@/data/tours";
import { bodiesEn } from "./bodies-en";
import { toursEn } from "./tours-en";
import type { Locale } from "./types";
import { t } from "@/store/useLocaleStore";

export function localizeBody(body: CelestialBody, locale: Locale): CelestialBody {
  if (locale === "id") return body;
  const en = bodiesEn[body.id];
  if (!en) return body;
  return {
    ...body,
    name: en.name,
    description: en.description,
    composition: en.composition,
    funFact: en.funFact,
  };
}

export function localizeTourStep(step: TourStep, locale: Locale): TourStep {
  if (locale === "id") return step;
  const en = toursEn[step.id];
  if (!en) return step;
  return { ...step, title: en.title, narration: en.narration };
}

export function bodyTypeLabel(
  type: CelestialBody["type"],
  locale: Locale,
): string {
  switch (type) {
    case "star":
      return t("typeStar", locale);
    case "planet":
      return t("typePlanet", locale);
    case "moon":
      return t("typeMoon", locale);
    case "asteroid":
      return t("typeAsteroid", locale);
    default:
      return type;
  }
}
