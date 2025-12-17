import { buildSearchQuery } from '@/lib/ransack/buildSearchQuery'
import { fetchClient } from '@/lib/api/fetchClient'

export function getAgencies(search: {
    name_or_phone_or_email_cont?: string
}
) {
    const query = buildSearchQuery(search)
    return fetchClient(`/agencies?${query}`)
}
