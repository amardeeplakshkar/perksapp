"use client"
import { Toaster } from "react-hot-toast";
import Footer from "../../components/Footer";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`bg-black flex w-full flex-col h-dvh`}
    >
      <ScrollArea className="flex-1">
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {children}
      </ScrollArea>
      <Footer />
    </div>
  );
}
