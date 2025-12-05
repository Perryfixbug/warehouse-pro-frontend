"use client"

import { fetchClient } from "@/lib/fetchClient";
import { User } from "@/type/type";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

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
  const { replace } = useRouter()

  const login = async (email: string, password: string, captchaToken: string)=>{
    try{
      // Goị api để trả token và info
      const res = await fetchClient("/users/sign_in", "POST", {
        body: JSON.stringify({user: {email, password, captchaToken}})
      })
      // Gán token vào localStorage
      console.log(res);
      const data = res.data
      const token = res?.token
      localStorage.setItem("token", token)
      // Cập nhật giao diện
      setInfo(data)
      setIsAuth(true)
      replace('/')
    }catch(e){
      console.log(e)
      setInfo(null)
      setIsAuth(false)
    }
  }

  const logout = ()=>{
    try{
      fetchClient("/users/sign_out", "DELETE")
    }catch(e){
      console.log(e)
    }finally{
      localStorage.removeItem("token")
      setInfo(null)
      setIsAuth(false)
      replace('/login')
    }
  }

  const fetchMe = async () => {
    try{
      const res = await fetchClient('/me')
      const data = res.data;
      setInfo(data);
      setIsAuth(false)
    } catch(e) {
      console.log(e);
      setInfo(null);
      setIsAuth(false)
    }
  };

  useEffect(()=>{
    fetchMe()
  }, [])

  return(
    <AuthContext.Provider value={{ info, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
