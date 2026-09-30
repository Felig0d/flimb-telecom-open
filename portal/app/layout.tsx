import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ODIN Control Center",
  description: "Synthetic public beta dashboard for SIP and charging operations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
