import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getCurrentMonthKey,
  getMonthRange,
  getPreviousMonthKey,
  parseMonthParam,
} from "@/lib/expenses/month";

describe("getCurrentMonthKey", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("retourne le mois courant au format YYYY-MM selon l'horloge simulée", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 15)); // 15 août 2026 (mois 0-indexé)

    expect(getCurrentMonthKey()).toBe("2026-08");
  });

  it("gère un mois à un chiffre avec le zéro de tête", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1)); // janvier 2026

    expect(getCurrentMonthKey()).toBe("2026-01");
  });
});

describe("parseMonthParam", () => {
  it("accepte un mois valide", () => {
    expect(parseMonthParam("2026-08")).toBe("2026-08");
  });

  it("retombe sur le mois courant pour un mois invalide", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 15));

    expect(parseMonthParam("2026-13")).toBe("2026-08");
    expect(parseMonthParam("not-a-month")).toBe("2026-08");
    expect(parseMonthParam(undefined)).toBe("2026-08");

    vi.useRealTimers();
  });
});

describe("getMonthRange", () => {
  it("calcule la plage d'un mois en milieu d'année", () => {
    expect(getMonthRange("2026-08")).toEqual({ start: "2026-08-01", end: "2026-09-01" });
  });

  it("gère le passage à l'année suivante en décembre", () => {
    expect(getMonthRange("2026-12")).toEqual({ start: "2026-12-01", end: "2027-01-01" });
  });
});

describe("getPreviousMonthKey", () => {
  it("août 2026 -> juillet 2026", () => {
    expect(getPreviousMonthKey("2026-08")).toBe("2026-07");
  });

  it("janvier 2026 -> décembre 2025", () => {
    expect(getPreviousMonthKey("2026-01")).toBe("2025-12");
  });
});
