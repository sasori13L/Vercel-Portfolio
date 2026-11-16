import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lemuel De Castro — Senior Full-Stack Developer",
  description: "Senior full-stack developer in Cebu City with 10+ years building dependable systems across PHP, Laravel, Next.js, Flutter, and AI integrations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
