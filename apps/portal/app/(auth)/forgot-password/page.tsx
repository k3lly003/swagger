"use client";

import { ForgotPasswordForm } from "@/components/auth";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <ForgotPasswordForm />
    </div>
  );
}
