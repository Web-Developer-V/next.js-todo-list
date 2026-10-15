import Header from "@/app/components/layout/header";
import { ReactNode } from "react";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
