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
import { fetchClient } from "@/lib/fetchClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchClient("/auth/password", "POST", {
      body: JSON.stringify({ email }),
    }); 
    console.log({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Quên Mật Khẩu</CardTitle>
          <CardDescription>
            Nhập email để nhận link đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Email
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
            <Button type="submit" className="w-full">
              Gửi Link
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="underline">
              Quay lại Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
