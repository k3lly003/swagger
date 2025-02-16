"use client";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ClientLayout({
                                         children,
                                         locale,
                                         dict,
                                     }: {
    children: React.ReactNode;
    locale: string;
    dict: any;
}) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <div className="relative flex min-h-screen flex-col">
                <Header locale={locale} dict={dict} />
                <div className="flex-1">
                    {children}
                </div>
                <Footer locale={locale} dict={dict} />
            </div>
        </NextThemesProvider>
    );
}