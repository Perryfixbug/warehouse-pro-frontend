import { buildSearchQuery } from "../ransack/buildSearchQuery";
import { fetchClient } from "./fetchClient";

export function getUsers(search: {
    name_or_email_cont?: string;
    role_eq?: string;
}){
    const query = buildSearchQuery(search)
    return fetchClient(`/users?${query}`)
}
