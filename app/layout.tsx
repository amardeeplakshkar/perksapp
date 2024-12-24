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
        <Script src="https://kit.fontawesome.com/5d93eb1089.js" crossOrigin="anonymous"/>
        <Script src="https://raw.githubusercontent.com/stoXmod/FontAwesome-pro/refs/heads/master/assets/js/pro.min.js" crossOrigin="anonymous"/>
         <link rel="stylesheet" href="https://raw.githubusercontent.com/stoXmod/FontAwesome-pro/refs/heads/master/assets/js/pro.min.js"/>
         <link rel="stylesheet" href="https://raw.githubusercontent.com/stoXmod/FontAwesome-pro/refs/heads/master/assets/css/all.min.css"/>
        <ScrollArea className="flex-1">
          <TonConnectUIProvider manifestUrl="https://apricot-selected-dog-88.mypinata.cloud/ipfs/bafkreic6usgjlpgwbel6rhlk53mizinsrstjmclaznas353clu6zarjfua">
            {children}
          </TonConnectUIProvider>
        </ScrollArea>
      </body>
    </html>
  );
}
