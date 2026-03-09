import { getRentEstimateByAddress, getSaleListingsByCity } from "./providers/rentcast";
import { normalizeListingToProperty } from "./normalize";
import { properties as mockProperties } from "./data";

export async function getDeals(city = "Phoenix", state = "AZ") {
  try {
    const listings = await getSaleListingsByCity(city, state);

    const deals = await Promise.all(
      listings.map(async (listing) => {
        const rent = await getRentEstimateByAddress(
          listing.addressLine1 || listing.formattedAddress || "",
          listing.city || city,
          listing.state || state,
          listing.zipCode
        );

        return normalizeListingToProperty(listing, rent);
      })
    );

    return deals.filter((deal) => deal.price > 0 && deal.estimatedRent > 0);
  } catch (error) {
    console.error("Falling back to mock data:", error);
    return mockProperties.filter((p) => p.city === city || city === "All");
  }
}