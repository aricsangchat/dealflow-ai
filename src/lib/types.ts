export type Strategy = "rental" | "flip" | "airbnb" | "brrrr";

export type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  estimatedRent: number;
  taxesMonthly: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  rehabCost: number;
  yearBuilt: number;
  propertyType: "Single Family" | "Condo" | "Townhome" | "Duplex";
  image: string;
  neighborhoodScore: number; // 1-10
  appreciationScore: number; // 1-10
  riskScore: number; // 1-10, higher = riskier
};