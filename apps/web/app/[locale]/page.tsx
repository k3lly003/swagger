import { getDictionary } from "@/lib/get-dictionary";
import FellowsSection from "@/components/sections/homepage/fellows-section";
import WhyGanzAfricaSection from "@/components/sections/homepage/why-ganzafrica-section";
import FlagshipProgramsSection from "@/components/sections/homepage/flagship-programs-section";
import ProjectsSection from "@/components/sections/homepage/projects-section";
import TestimonialsSection from "@/components/sections/homepage/testimonials-section";
import PartnersSection from "@/components/sections/homepage/partners-section";
import { Metadata } from "next";
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";
import LatestNewsSection from "@/components/sections/homepage/latest-news-section";
import NewsletterSection from "@/components/sections/newsletter-section";
import GanzAfricaUniqueSection from "@/components/sections/homepage/ganzafrica-unique-section";

// Generate metadata for SEO
export async function generateMetadata({
                                           params,
                                       }: {
    params: { locale: string };
}): Promise<Metadata> {
    const locale = params.locale;
    const dict = await getDictionary(locale);

    return baseGenerateMetadata({
        params: { locale },
        title: dict.site.name,
        description: dict.site.description,
        locale,
        imagePath: "/images/og/home.jpg",
    });
}


export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);

  return (
    <main>
      <FellowsSection locale={locale} dict={dict} />
      <WhyGanzAfricaSection locale={locale} dict={dict} />
      <GanzAfricaUniqueSection locale={locale} dict={dict} />
      <FlagshipProgramsSection locale={locale} dict={dict} />
      <ProjectsSection locale={locale} dict={dict} />
      <PartnersSection locale={locale} dict={dict} />
      <TestimonialsSection locale={locale} dict={dict} />
      <LatestNewsSection locale={locale} dict={dict} />
      <NewsletterSection locale={locale} dict={dict} />
    </main>
  );
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}
