import { redirect } from "next/navigation";
import ResetForm from "@/app/(auth)/reset-password/reset-form";
import { fetchServer } from "@/lib/api/fetchServer";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const token = params.token || "";

  const res = await fetchServer(`/auth/password/new?reset_password_token=${token}`)
  if(!res || res.status !== "success"){
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <ResetForm token={token} />
    </div>
  );
}
