import { redirect } from "next/navigation";
import ResetForm from "@/app/(auth)/reset-password/reset-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const token = searchParams.token;

  if (!token) {
    redirect("/login");
  }

  // Check token từ server
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/password/new?reset_password_token=${token}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <ResetForm token={token} />
    </div>
  );
}
