import type { Metadata } from "next";
import { Roboto, Noto_Sans_KR, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import ScrollProvider from "./components/scroll-provider";
import MainStorage from "./main-storage";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "모두의 할 일 리스트",
  description: "할 일을 기록해보세요.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn("h-full", "antialiased", roboto.variable, notoSansKR.variable, "font-sans", geist.variable)}>
      <MainStorage />
      <body className="min-h-full flex flex-col justify-center max-[1261px]:px-5 max-[1024px]:px-3">
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
