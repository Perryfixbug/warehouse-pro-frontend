export async function fetchServer(endpoint: string, method = "GET", options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`  
  try {
    const res = await fetch(url, {
      ...options,
      method: method,
      headers: { "Content-Type": "application/json" },
      cache: "no-store", 
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Server Fetch Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("fetchServer Error:", error);
    throw error;
  }
}
