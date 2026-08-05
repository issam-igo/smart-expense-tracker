import { describe, expect, it } from "vitest";
import { computeBudgetStatus } from "@/lib/expenses/budget";

describe("computeBudgetStatus", () => {
  it("calcule un budget restant positif quand le budget dépasse les dépenses", () => {
    const status = computeBudgetStatus(500, 200);

    expect(status.remaining).toBe(300);
    expect(status.percentageUsed).toBe(40);
  });

  it("calcule un pourcentage exact de 100 quand le budget égale les dépenses", () => {
    const status = computeBudgetStatus(200, 200);

    expect(status.remaining).toBe(0);
    expect(status.percentageUsed).toBe(100);
  });

  it("signale un dépassement quand les dépenses excèdent le budget", () => {
    const status = computeBudgetStatus(100, 130);

    expect(status.remaining).toBe(-30);
    expect(status.percentageUsed).toBe(130);
  });

  it("autorise percentageUsed au-delà de 100 sans le plafonner", () => {
    const status = computeBudgetStatus(100, 150);

    expect(status.percentageUsed).toBe(150);
  });

  it("protège contre la division par zéro quand le budget est nul", () => {
    const status = computeBudgetStatus(0, 50);

    expect(status.percentageUsed).toBe(0);
    expect(Number.isFinite(status.percentageUsed)).toBe(true);
    expect(Number.isNaN(status.percentageUsed)).toBe(false);
  });

  it("calcule un remaining négatif exact en cas de dépassement", () => {
    const status = computeBudgetStatus(250, 310);

    expect(status.remaining).toBe(-60);
  });
});
