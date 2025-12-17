import { buildSearchQuery } from "../ransack/buildSearchQuery";
import { fetchClient } from "./fetchClient";

export function getUsers(search: {
    fullname_or_email_cont?: string;
    role_eq?: string;
}, page?: number) {
    const query = buildSearchQuery(search)
    return fetchClient(`/users?page=${page}&${query}`)
}
