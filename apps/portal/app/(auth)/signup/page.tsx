"use client";

import { SignupForm } from "@/components/auth";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <SignupForm />
    </div>
  );
}
