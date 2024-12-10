"use client"
import "./globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ScrollArea } from "../components/ui/scroll-area";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black flex w-full flex-col overflow-hidden">
      <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <ScrollArea className="flex-1">
          <TonConnectUIProvider manifestUrl="https://apricot-selected-dog-88.mypinata.cloud/ipfs/QmXvaFWgecTknsxyq4zASJSHMCqKJ3vXz2KgFnejC6oGHu">
            {children}
          </TonConnectUIProvider>
        </ScrollArea>
      </body>
    </html>
  );
}