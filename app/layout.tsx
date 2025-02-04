import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import DesignerContextProvider from "@/components/context/DesignerContext";
import NextTopLoader from "nextjs-toploader";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IUCN TREPA IMS",
  description: "IUCN TREPA IMS | Reporting System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <NextTopLoader />
          <DesignerContextProvider>
            {children}
            <Toaster />
          </DesignerContextProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
