export async function fetchServer(
  endpoint: string,
  method: string = "GET",
  options: RequestInit = {}
) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  try{
    const res = await fetch(url, {
      method,
      cache: "no-store",
      next: { revalidate: 0 },
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw {
        httpStatus: res.status,
        data,
      };
    }
    return data;
  }catch{
  }
}
