import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Color³ — Synesthetic Color Calendar",
  description: "A playful exploration of synesthetic color patterns in time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all">
                Color³
              </a>
              <div className="flex items-center gap-6">
                <a
                  href="/personal"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Personal
                </a>
                <a
                  href="/collective"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Collective
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

