export async function fetchClient(endpoint: string, method = "GET", options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  const token = localStorage?.getItem("token")
  try {
    const res = await fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store",
      ...options,
    });
    if (!res.ok) {
      throw new Error(`Client Fetch Error: ${res.status}`);
    }
    if(res.status == 204) return
    return await res.json()
  } catch (error) {
    console.error("fetchClient Error:", error);
  }
}
