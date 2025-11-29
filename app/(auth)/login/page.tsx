"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    await login(email, password);
    console.log("Đăng nhập!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4"> 
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng Nhập</CardTitle>
          <CardDescription>Nhập email và mật khẩu để đăng nhập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Email (*)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="mt-1"
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground">
                Mật Khẩu (*)
              </label>
              <Input
                type="password"
                placeholder="Super strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Đăng Nhập
            </Button>
          </form>
          <div className="flex justify-between text-sm text-muted-foreground">
            <Link href="/forgot-password" className="underline">
              Quên mật khẩu?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
