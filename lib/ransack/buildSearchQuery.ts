export function buildSearchQuery(params: Record<string, string | number>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value])=>{
        if(value !== undefined && value !== "" && value !== "all"){
            query.append(`q[${key}]`, String(value));
        }
    })
    return query.toString();
}
