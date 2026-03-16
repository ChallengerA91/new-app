import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentalCOMPS // HQ",
  description: "Rental comp analysis — game mode activated",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scanline-overlay min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
