import "./styles/globals.css";
import { generateMetadata as generateBaseMetadata, siteConfig } from "@/lib/metadata";
import { Viewport } from "next";
import Header from "@/components/layout/Header";

export const metadata = generateBaseMetadata({});

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Header />
        <div className="py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
