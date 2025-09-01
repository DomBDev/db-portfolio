import "./styles/globals.css";

export const metadata = {
  title: "Dom's Portfolio",
  description: "Portfolio: Dom",
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
