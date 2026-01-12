import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Alpha Eat Planner",
    description: "Plan your meals, manage recipes, and generate grocery lists.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-sans antialiased bg-slate-50">
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 container mx-auto p-4 md:p-8">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
