import Navbar from "@/components/shared/Navbar";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "@/context/AuthProvider";
import ProgressBarProvider from "@/components/shared/ProgressBarProvider";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "GamersDB",
    description:
        "Games Database to discover, collect and share games with friends.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                        storageKey="gamersdb-theme"
                    >
                        <ProgressBarProvider>
                            <Navbar />
                            {children}
                            <Toaster richColors />
                        </ProgressBarProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
