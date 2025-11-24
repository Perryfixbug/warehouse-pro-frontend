export async function fetchClient(endpoint: string, method = "GET", options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  try {
    const res = await fetch(url, {
      ...options,
      method: method,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const payload = await res.json()
    if (!res.ok) {
      throw new Error(`Client Fetch Error: ${payload.errors}`);
    }
    return payload.data;
  } catch (error) {
    console.error("fetchClient Error:", error);
    throw error;
  }
}
