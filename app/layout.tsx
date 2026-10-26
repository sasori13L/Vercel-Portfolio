import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lemuel De Castro — Full-stack developer",
  description: "Full-stack developer building dependable systems across Laravel, Next.js, Flutter, and AI integrations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
