import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ticko.se",
  description: "Leads, offerter och uppföljning för svenska småföretag",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
