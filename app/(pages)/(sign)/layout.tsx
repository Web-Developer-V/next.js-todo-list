import RedirectNotice from "@/app/components/auth/redirect-notice";
import { ReactNode, Suspense } from "react";

export default function BoardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectNotice />
      </Suspense>
      {children}
    </>
  );
}
