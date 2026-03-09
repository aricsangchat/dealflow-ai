import { Property } from "./types";
import {
  getCapRate,
  getCashOnCashReturn,
  getMonthlyCashFlow,
} from "./calculations";

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function getInvestmentScore(property: Property) {
  const cashFlowScore = clamp(getMonthlyCashFlow(property) / 75, 0, 10);
  const capRateScore = clamp(getCapRate(property), 0, 10);
  const cocScore = clamp(getCashOnCashReturn(property) / 1.2, 0, 10);
  const neighborhoodScore = clamp(property.neighborhoodScore ?? 0, 0, 10);
  const appreciationScore = clamp(property.appreciationScore ?? 0, 0, 10);
  const riskPenalty = clamp((property.riskScore ?? 0) * 0.7, 0, 10);

  const weighted =
    cashFlowScore * 0.3 +
    capRateScore * 0.25 +
    cocScore * 0.2 +
    neighborhoodScore * 0.15 +
    appreciationScore * 0.1 -
    riskPenalty * 0.1;

  return clamp(Number(weighted.toFixed(1)), 1, 10);
}

export function getScoreLabel(score: number) {
  if (score >= 8.5) return "Excellent";
  if (score >= 7) return "Strong";
  if (score >= 5.5) return "Average";
  return "Weak";
}