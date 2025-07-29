import type { Metadata } from "next";
import { Inter } from "next/font/google";  // Fallback font
import { GeistSans, GeistMono } from "geist/font";  // Correct Geist import
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import { authOptions } from "@/lib/auth";

// Fallback fonts in case Geist fails
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trackboxd",
  description: "Your music, your words.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#FFFFF0] text-[#1F2C24] font-sans">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}