/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenStore } from "@/lib/api/tokenStore";
import { isAuthPage } from "@/lib/utils/isAuthPage";

let isRefreshing = false
let refreshQueue: ((token: string)=>void)[] = []

export async function refreshAccessToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refreshs`, {
    method: 'POST',
    credentials: 'include', // gửi cookie refresh
  })

  if (!res.ok) {
    tokenStore.clear()
    // reject tất cả request đang chờ
    refreshQueue.forEach(cb => cb('')) // dùng empty string để báo fail
    refreshQueue = []

    if(!isAuthPage()){
      window.location.href = '/login'
    }
    return Promise.reject(new Error('Refresh failed'))
  }

  const response = await res.json()
  const accessToken = response.data
  tokenStore.set(accessToken)

  refreshQueue.forEach(cb => cb(accessToken))
  refreshQueue = []

  return accessToken
}

export async function fetchClient(
  endpoint: string, 
  method = "GET", 
  options: RequestInit = {}
): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  const token = tokenStore.get()
  const res = await fetch(url, {
    method: method,
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (res.status !== 401) return await res.json()

  if(!isRefreshing){
    isRefreshing = true
    try{
      const newToken = await refreshAccessToken()
      tokenStore.set(newToken)
      isRefreshing = false
      return fetchClient(endpoint, method, options)
    }catch{
      isRefreshing = false
      tokenStore.clear()
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }
    // đang refresh → chờ
  return new Promise((resolve, reject) => {
    refreshQueue.push((newToken?: string) => {
      if (!newToken) return reject(new Error('Refresh failed'))
      resolve(fetchClient(endpoint, method, options))
    })
  })
}
