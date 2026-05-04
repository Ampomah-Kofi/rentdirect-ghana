import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { ListingsProvider } from "@/components/providers/ListingsProvider";
import { CompareProvider } from "@/components/providers/CompareProvider";
import { ReportsProvider } from "@/components/providers/ReportsProvider";
import { PaymentsProvider } from "@/components/providers/PaymentsProvider";
import CompareBar from "@/components/CompareBar";
import ViewModeIndicator from "@/components/ViewModeIndicator";

export const metadata: Metadata = {
  title: "RentDirect Ghana - Find Rooms Without Agents",
  description: "Browse and list rental rooms directly with landlords across Ghana. No agent fees.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RentDirect",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0F6E56",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0F6E56" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-[#0F172A]">
        <ListingsProvider>
          <ReportsProvider>
            <PaymentsProvider>
              <CompareProvider>
                <FavoritesProvider>
                  <ToastProvider>
                    {children}
                    <CompareBar />
                    <ViewModeIndicator />
                  </ToastProvider>
                </FavoritesProvider>
              </CompareProvider>
            </PaymentsProvider>
          </ReportsProvider>
        </ListingsProvider>
      </body>
    </html>
  );
}
