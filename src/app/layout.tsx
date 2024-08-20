import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "./QueryClientProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

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
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              // Default options for specific types
              success: {
                duration: 3000,
              },
            }}
          />
          <ReactQueryProvider>
            <SessionProvider>{children}</SessionProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
