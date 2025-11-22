import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "City Pulse - Local Events Explorer",
  description: "Discover and explore local events in your city. Find concerts, workshops, meetups, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
