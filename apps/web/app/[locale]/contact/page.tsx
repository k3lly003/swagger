import React from "react";
import { getDictionary } from "@/lib/get-dictionary";
import ContactUsContent from "@/components/ContactUsContent";


// This function will run server-side because it's inside a Server Component
type Params = Promise<{ locale: string }>;

// This is a Server Component
export default async function ContactUsPage({ params }: { params: Params }) {
  // Await the params to get the actual locale
  const { locale } = await params;

  // Fetch the dictionary based on the locale
  const dict = await getDictionary(locale);

  // Return the ContactUsContent component with the dictionary as a prop
  return <ContactUsContent dict={dict} />;
}
