const BASE_URL = "https://api.rentcast.io/v1";

type RentCastListing = {
  id?: string;
  formattedAddress?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  yearBuilt?: number;
  propertyType?: string;
  latitude?: number;
  longitude?: number;
  listingType?: string;
  photos?: string[];
};

export async function getSaleListingsByCity(city: string, state: string) {
  const params = new URLSearchParams({
    city,
    state,
    status: "Active",
    limit: "10",
  });

  const res = await fetch(`${BASE_URL}/listings/sale?${params.toString()}`, {
    headers: {
      "X-Api-Key": process.env.RENTCAST_API_KEY!,
      Accept: "application/json",
    },
    next: { revalidate: 86400 }, // cache for 24 hours
  });

  if (!res.ok) {
    throw new Error("RentCast fetch failed");
  }

  return res.json();
}

export async function getRentEstimateByAddress(address: string, city: string, state: string, zipCode?: string) {
  const params = new URLSearchParams({
    address,
    city,
    state,
  });

  if (zipCode) params.set("zipCode", zipCode);

  const res = await fetch(`${BASE_URL}/avm/rent/long-term?${params.toString()}`, {
    headers: {
      "X-Api-Key": process.env.RENTCAST_API_KEY!,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
}