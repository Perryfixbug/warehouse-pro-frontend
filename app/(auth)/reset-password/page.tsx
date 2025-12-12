"use client";

import { use, useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { fetchClient } from "@/lib/fetchClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchClient("/auth/password", "PUT", {
      body: JSON.stringify({ 
        reset_password_token: token,
        password: password,
        password_confirmation: passwordConfirmation,
      }),
    });

    router.push("/login");
  };

  useEffect(() => {
    async function checkToken() {
      const res = await fetch(`/auth/password/new?reset_password_token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        router.push("/login");
      }
    }
    checkToken()
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đặt Lại Mật Khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          
          {!token ? (
            <div className="text-red-500 text-center">
              Token không hợp lệ hoặc đã hết hạn.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*******"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Nhập lại mật khẩu
                </label>
                <Input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="*******"
                  required
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full">
                Xác nhận
              </Button>
            </form>
          )}

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
