import { redirect } from "next/navigation";

// This ensures that anyone hitting the root path gets redirected to English by default
export default function RootPage() {
  redirect("/en/"); // Added trailing slash for consistency
}
