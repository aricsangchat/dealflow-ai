import { Property } from "./types";
import { estimateRent } from "./rentEstimator";


export function normalizeListingToProperty(listing: any, rentEstimate?: any): Property {
  return {
    id: String(listing.id ?? crypto.randomUUID()),
    address: listing.formattedAddress || listing.addressLine1 || "Unknown Address",
    city: listing.city || "",
    state: listing.state || "",
    price: listing.price || 0,
    beds: listing.bedrooms || 0,
    baths: listing.bathrooms || 0,
    sqft: listing.squareFootage || 0,
    estimatedRent: rentEstimate?.rent || rentEstimate?.price || 1800,
    taxesMonthly: Math.round((listing.price || 0) * 0.012 / 12),
    insuranceMonthly: Math.round((listing.price || 0) * 0.004 / 12),
    hoaMonthly: 0,
    rehabCost: 10000,
    yearBuilt: listing.yearBuilt || 1995,
    propertyType: mapPropertyType(listing.propertyType),
    image: listing.photos?.[0] || "/placeholder-house.jpg",
    neighborhoodScore: 7.5,
    appreciationScore: 7.2,
    riskScore: 4.5,
  };
}

export function normalizeListing(listing: any) {
  const price = listing.price || 0;

  return {
    id: String(listing.id),
    address: listing.formattedAddress,
    city: listing.city,
    state: listing.state,
    price,
    beds: listing.bedrooms,
    baths: listing.bathrooms,
    sqft: listing.squareFootage,

    estimatedRent: estimateRent(price),

    taxesMonthly: Math.round(price * 0.012 / 12),
    insuranceMonthly: Math.round(price * 0.004 / 12),
    hoaMonthly: 0,

    image: listing.photos?.[0] || "/placeholder-house.jpg",
  };
}

function mapPropertyType(type?: string): Property["propertyType"] {
  if (!type) return "Single Family";
  if (type.toLowerCase().includes("condo")) return "Condo";
  if (type.toLowerCase().includes("town")) return "Townhome";
  if (type.toLowerCase().includes("duplex")) return "Duplex";
  return "Single Family";
}