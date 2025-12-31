"use client"

import { fetchClient } from "@/lib/api/fetchClient";
import { tokenStore } from "@/lib/api/tokenStore";
import { User } from "@/type/type";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken } from "@/lib/api/fetchClient"
import { useLoading } from "./useLoading";

export interface AuthContextType {
  isAuth: boolean,
  info: User | null,
  login: (email: string, password: string, captchaToken: string)=> Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  info: null,
  login: async () => {},
  logout: () => {},
})
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider ({children}: {children: React.ReactNode}){
  const [info, setInfo] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const {withLoading} = useLoading()
  const { replace } = useRouter()

  const login = async (email: string, password: string, captchaToken: string)=>{
    try{
      // Goị api để trả token và info
      const res = await fetchClient("/auth/sign_in", "POST", {
        body: JSON.stringify({user: {email, password, captchaToken}})
      })
      const data = res.data
      const token = res?.token
      tokenStore.set(token)
      // Cập nhật giao diện
      setInfo(data)
      setIsAuth(true)
      replace('/')
    }catch{
      alert("Đăng nhập thất bại")
      setInfo(null)
      setIsAuth(false)
    }
  }

  const logout = ()=>{
    try{
      fetchClient("/auth/sign_out", "DELETE")
    }catch{
    }finally{
      tokenStore.clear()
      replace('/login')
      setInfo(null)
      setIsAuth(false)
    }
  }

  const fetchMe = async () => {
    try{
      const res = await fetchClient('/me')
      const data = res.data;
      setInfo(data);
      setIsAuth(true)   
    } catch{
      setInfo(null);
      setIsAuth(false)
    }
  };


  useEffect(()=>{
    withLoading(async () => {
      try {
        await refreshAccessToken()
        await fetchMe()
      } catch{
        setInfo(null)
        setIsAuth(false)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return(
    <AuthContext.Provider value={{ info, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
