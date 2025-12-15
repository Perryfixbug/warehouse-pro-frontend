import { buildSearchQuery } from "@/lib/ransack/buildSearchQuery";
import { fetchClient } from "@/lib/api/fetchClient";

export function getProduct(search: {
    name_cont?: string;
    unit_eq?: string;
    price_per_unit_gteq?: number;
    price_per_unit_lteq?: number;
}) {
    const query = buildSearchQuery(search);
    return fetchClient(`/products?${query}`);
}