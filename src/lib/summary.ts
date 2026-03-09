import { Property } from "./types";
import {
  getCapRate,
  getCashOnCashReturn,
  getMonthlyCashFlow,
} from "./calculations";

export function getDealSummary(property: Property) {
  const cashFlow = getMonthlyCashFlow(property);
  const capRate = getCapRate(property);
  const coc = getCashOnCashReturn(property);

  const strengths: string[] = [];
  const risks: string[] = [];

  if (cashFlow > 300) strengths.push("Strong projected monthly cash flow");
  if (capRate > 6.5) strengths.push("Healthy cap rate for a long-term rental");
  if (property.neighborhoodScore >= 8)
    strengths.push("Located in a high-demand neighborhood");
  if (property.appreciationScore >= 8)
    strengths.push("Solid appreciation potential");

  if (property.yearBuilt < 1985)
    risks.push("Older home may require ongoing maintenance");
  if (property.riskScore > 5)
    risks.push("Higher overall risk score than top-ranked deals");
  if (property.rehabCost > 15000)
    risks.push("Upfront rehab budget could impact near-term returns");
  if (cashFlow < 150)
    risks.push("Monthly cash flow is thinner than ideal");

  const strategy =
    coc > 10 ? "Best suited for long-term rental investing" : "Best suited for appreciation-focused investors";

  return {
    summary:
      "This property appears to offer a balanced investment profile based on projected rent, operating costs, and neighborhood fundamentals.",
    strengths: strengths.slice(0, 3),
    risks: risks.slice(0, 3),
    strategy,
  };
}