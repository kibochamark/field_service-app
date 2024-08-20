import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "./QueryClientProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Field Service Management",
  description: "Field Service Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className={cn("min-h-screen")}>
        <main className="text-bodyLarge">
          <ReactQueryProvider>
            <SessionProvider>{children}</SessionProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
