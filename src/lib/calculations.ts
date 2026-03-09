import { Property } from "./types";

const DOWN_PAYMENT_RATE = 0.2;
const INTEREST_RATE = 0.07 / 12;
const LOAN_TERM_MONTHS = 30 * 12;
const VACANCY_RATE = 0.05;
const MAINTENANCE_RATE = 0.08;

function safe(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function getLoanAmount(price: number) {
  return safe(price) * (1 - DOWN_PAYMENT_RATE);
}

export function getMonthlyMortgage(price: number) {
  const safePrice = safe(price);
  if (safePrice <= 0) return 0;

  const principal = getLoanAmount(safePrice);
  const r = INTEREST_RATE;
  const n = LOAN_TERM_MONTHS;

  const payment =
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  return safe(payment);
}

export function getMonthlyExpenses(property: Property) {
  const estimatedRent = safe(property.estimatedRent);
  const mortgage = getMonthlyMortgage(property.price);
  const vacancy = estimatedRent * VACANCY_RATE;
  const maintenance = estimatedRent * MAINTENANCE_RATE;

  const taxes = safe(property.taxesMonthly);
  const insurance = safe(property.insuranceMonthly);
  const hoa = safe(property.hoaMonthly);

  const total = mortgage + taxes + insurance + hoa + vacancy + maintenance;

  return {
    mortgage,
    taxes,
    insurance,
    hoa,
    vacancy,
    maintenance,
    total: safe(total),
  };
}

export function getMonthlyCashFlow(property: Property) {
  return safe(property.estimatedRent) - getMonthlyExpenses(property).total;
}

export function getAnnualNOI(property: Property) {
  const estimatedRent = safe(property.estimatedRent);
  const annualRent = estimatedRent * 12;

  const operatingExpenses =
    (safe(property.taxesMonthly) +
      safe(property.insuranceMonthly) +
      safe(property.hoaMonthly) +
      estimatedRent * VACANCY_RATE +
      estimatedRent * MAINTENANCE_RATE) *
    12;

  return safe(annualRent - operatingExpenses);
}

export function getCapRate(property: Property) {
  const price = safe(property.price);
  if (price <= 0) return 0;

  return safe((getAnnualNOI(property) / price) * 100);
}

export function getCashInvested(property: Property) {
  return safe(property.price) * DOWN_PAYMENT_RATE + safe(property.rehabCost);
}

export function getCashOnCashReturn(property: Property) {
  const invested = getCashInvested(property);
  if (invested <= 0) return 0;

  const annualCashFlow = getMonthlyCashFlow(property) * 12;
  return safe((annualCashFlow / invested) * 100);
}