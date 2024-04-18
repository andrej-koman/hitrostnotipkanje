import "~/styles/globals.css";

import TopNav from "./_components/topnav";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "hitrostnotipkanje",
  description: "App for touch typing practice",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable} flex-col gap-4 flex`}>
          <TopNav />
          {children}
        </body>
        <script rel="preload" src="https://kit.fontawesome.com/4482d0fd90.js" crossOrigin="anonymous" async />
      </html>
    </ClerkProvider>
  );
}
