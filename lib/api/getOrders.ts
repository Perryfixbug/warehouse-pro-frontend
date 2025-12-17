import { fetchClient } from "@/lib/api/fetchClient";
import { buildSearchQuery } from "@/lib/ransack/buildSearchQuery";

export function getOrders(search: {
    id_or_agency_name_cont?: string;
    type_eq?: string;
}) {
  const query = buildSearchQuery(search);
  return fetchClient(`/orders?${query}`);
}
