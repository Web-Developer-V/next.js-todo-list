import RedirectNotice from "@/app/components/auth/redirect-notice";
import TodoContainer from "@/app/components/board/todo-container";
import { Suspense } from "react";

export default function TodoPage() {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectNotice />
      </Suspense>
      <section className="py-15 max-[769px]:py-10">
        <TodoContainer />
      </section>
    </>
  );
}
