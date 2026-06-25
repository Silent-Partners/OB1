import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { SidebarShell } from "@/components/SidebarShell";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Brain",
  description: "Second brain dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex bg-bg-primary text-text-primary">
        <SidebarShell />
        <main className="flex-1 md:ml-56 min-h-screen pt-12 md:pt-0">
          <div className="max-w-6xl mx-auto px-4 py-4 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
