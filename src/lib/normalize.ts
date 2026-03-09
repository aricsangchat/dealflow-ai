import { estimateRent } from "@/lib/rentEstimator";
import type { Property } from "@/lib/types";
import { slugify } from "@/lib/slugify";

function toNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function mapPropertyType(type?: string): Property["propertyType"] {
  if (!type) return "Single Family";

  const lower = type.toLowerCase();

  if (lower.includes("condo")) return "Condo";
  if (lower.includes("town")) return "Townhome";
  if (lower.includes("duplex")) return "Duplex";

  return "Single Family";
}

export function normalizeListing(listing: any): Property {
  const price = toNumber(listing.price, 0);
  const beds = toNumber(listing.bedrooms, 0);
  const baths = toNumber(listing.bathrooms, 0);
  const sqft = toNumber(listing.squareFootage, 0);
  const yearBuilt = toNumber(listing.yearBuilt, 1995);

  const estimatedRent =
    toNumber(listing.estimatedRent, 0) > 0
      ? toNumber(listing.estimatedRent, 0)
      : estimateRent(price);

  const address =
  listing.formattedAddress ||
  listing.addressLine1 ||
  "Unknown Address";

  const image =
  typeof listing.photos?.[0] === "string"
    ? listing.photos[0]
    : listing.photos?.[0]?.href ||
      listing.photos?.[0]?.url ||
      "/placeholder-house.svg";

  return {
  id: String(listing.id ?? crypto.randomUUID()),
  slug: slugify(address),
  address,
  city: listing.city || "",
  state: listing.state || "",
  price,
  beds,
  baths,
  sqft,
  estimatedRent,
  taxesMonthly: Math.round((price * 0.012) / 12) || 0,
  insuranceMonthly: Math.round((price * 0.004) / 12) || 0,
  hoaMonthly: 0,
  rehabCost: 10000,
  yearBuilt,
  propertyType: mapPropertyType(listing.propertyType),
  image,
  neighborhoodScore: 7.5,
  appreciationScore: 7.2,
  riskScore: 4.5,
};
}