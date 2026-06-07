import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";

const geist = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MoviesNow",
    description: "Your personal movie streaming platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${geist.variable} antialiased bg-[#141414] text-white`}>
                {/* AuthProvider makes user/login/logout available to every page */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
