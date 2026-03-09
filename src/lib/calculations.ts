import { Property } from "./types";

const DOWN_PAYMENT_RATE = 0.2;
const INTEREST_RATE = 0.07 / 12;
const LOAN_TERM_MONTHS = 30 * 12;
const VACANCY_RATE = 0.05;
const MAINTENANCE_RATE = 0.08;

export function getLoanAmount(price: number) {
  return price * (1 - DOWN_PAYMENT_RATE);
}

export function getMonthlyMortgage(price: number) {
  const principal = getLoanAmount(price);
  const r = INTEREST_RATE;
  const n = LOAN_TERM_MONTHS;

  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function getMonthlyExpenses(property: Property) {
  const mortgage = getMonthlyMortgage(property.price);
  const vacancy = property.estimatedRent * VACANCY_RATE;
  const maintenance = property.estimatedRent * MAINTENANCE_RATE;

  return {
    mortgage,
    taxes: property.taxesMonthly,
    insurance: property.insuranceMonthly,
    hoa: property.hoaMonthly,
    vacancy,
    maintenance,
    total:
      mortgage +
      property.taxesMonthly +
      property.insuranceMonthly +
      property.hoaMonthly +
      vacancy +
      maintenance,
  };
}

export function getMonthlyCashFlow(property: Property) {
  return property.estimatedRent - getMonthlyExpenses(property).total;
}

export function getAnnualNOI(property: Property) {
  const annualRent = property.estimatedRent * 12;
  const operatingExpenses =
    (property.taxesMonthly +
      property.insuranceMonthly +
      property.hoaMonthly +
      property.estimatedRent * VACANCY_RATE +
      property.estimatedRent * MAINTENANCE_RATE) *
    12;

  return annualRent - operatingExpenses;
}

export function getCapRate(property: Property) {
  return (getAnnualNOI(property) / property.price) * 100;
}

export function getCashInvested(property: Property) {
  return property.price * DOWN_PAYMENT_RATE + property.rehabCost;
}

export function getCashOnCashReturn(property: Property) {
  const annualCashFlow = getMonthlyCashFlow(property) * 12;
  return (annualCashFlow / getCashInvested(property)) * 100;
}