import "./styles/globals.css";
import { generateMetadata as generateBaseMetadata, siteConfig } from "@/lib/metadata";
import { Viewport } from "next";

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
        <div className="py-12">
          {children}
        </div>
      </body>
    </html>
  );
}
