import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import RightBanner from "@/components/banners/right-banner";
import LeftBanner from "@/components/banners/left-banner";
import QueryClientProvider from "../providers/query-client-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AdSenseScript from "@/components/adsense/AdSenseScript";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <AdSenseScript adSenseId={process.env.NEXT_PUBLIC_ADSENSE_ID || ''} />
      </head>
      <body className="bg-gray-100 text-foreground">
        <QueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                <Navbar />
                <div className="w-full mt-36 lg:mt-24 flex flex-1 justify-center gap-2">
                  {/* <LeftBanner /> */}
                  <div className="w-full max-w-5xl">
                    {children}
                  </div>
                  {/* <RightBanner /> */}
                </div>
                <Footer />
              </div>
            </main>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
