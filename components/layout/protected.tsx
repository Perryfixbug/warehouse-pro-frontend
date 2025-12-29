"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) {
      router.replace("/login")
      return
    }

    setToken(t)

    async function verifyToken() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/me`,
          {
            headers: {
              Authorization: `Bearer ${t}`,
            },
          }
        )

        if (!res.ok) throw new Error("Invalid token")
      } catch {
        router.replace("/login")
      }
    }

    verifyToken()
  }, [router])

  if (!token) return null

  return <>{children}</>
}
