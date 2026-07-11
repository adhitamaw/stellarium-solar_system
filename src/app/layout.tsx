import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellarium Cinematic — Simulator Tata Surya",
  description:
    "Simulator tata surya 3D interaktif dan sinematik. Jelajahi planet, bulan, dan orbit dengan visual setara dokumenter luar angkasa.",
  keywords: [
    "solar system",
    "tata surya",
    "astronomy",
    "3D",
    "simulator",
    "Three.js",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stellarium",
  },
};

/** Mobile viewport — critical for WebGL + touch on phones */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Critical for iPhone notch / home bar layout
  viewportFit: "cover",
  themeColor: "#02040a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh overflow-hidden overscroll-none bg-[#02040a] text-white">
        {children}
      </body>
    </html>
  );
}
