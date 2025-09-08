import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

const merriweather = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Trackboxd",
  description: "Your music, your words.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.className} bg-[#FFFFF0] text-[#1F2C24]`}>
        {children}
      </body>
    </html>
  );
}
