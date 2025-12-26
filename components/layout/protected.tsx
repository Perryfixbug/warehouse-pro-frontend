"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token")
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login')
    }
    async function verifyToken() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
          }
        });
        if (!res.ok) {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        router.replace('/login')
      }
    }
    if (token) {
      verifyToken();
    }
  }, [token])

  return (
    <>
      {children}
    </>
  )
}
