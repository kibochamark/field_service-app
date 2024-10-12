import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter, Montserrat } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "./QueryClientProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import { AutoLogoutProvider } from "@/utils/AutoLogout";
import NextAuthProvider from "./NexAuthProvider";
import ReactReduxProvider from "./ReactReduxProvider";

const inter = Inter({ subsets: ["latin"], variable:'--font-inter' });

export const metadata: Metadata = {
  title: "Field Service Management",
  description: "Field Service Management",
};

const ibmPlexSerif = IBM_Plex_Serif({
  subsets:["latin"],
  weight:['400', '700'],
  variable:'--font-ibm-plex-serif'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexSerif.variable} antialiased`} suppressHydrationWarning>
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
            <NextAuthProvider>
              <ReactReduxProvider>

                <AutoLogoutProvider>
                {children}
                </AutoLogoutProvider>
              </ReactReduxProvider>
            </NextAuthProvider>
          </ReactQueryProvider>

        </main>
      </body>
    </html >
  );
}
