export async function fetchClient(endpoint: string, options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  try {
    const res = await fetch(url, {
      ...options,
      // client fetch mặc định không cache
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Client Fetch Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("fetchClient Error:", error);
    throw error;
  }
}
