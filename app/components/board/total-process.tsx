"use client";

import { useTodoStore } from "../../store/todo-store";
import { AnimatePresence, motion } from "motion/react";
import { TotalProcessSkeleton } from "./skeleton/todo-list-skeleton";

export default function TotalProcess() {
  const { lists, loaded } = useTodoStore();

  const totalLength = lists.length;
  const completeLength = lists.filter((list) => list.complete).length;
  const progress = totalLength === 0 ? 0 : (completeLength / totalLength) * 100;
  const backgroundColor = progress === 100 ? "#42d242" : "var(--primary)";

  return (
    <>
      {!loaded ? (
        <TotalProcessSkeleton />
      ) : (
        <div className="p-5 border-t border-gray-100">
          <AnimatePresence>
            <p className="mb-2 text-sm text-slate-400">
              {progress === 100 ? (
                <motion.span key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  전체 할 일을 완료했습니다!
                </motion.span>
              ) : (
                <motion.span key="process" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  전체 {totalLength}개 중 {completeLength}개 완료
                </motion.span>
              )}
            </p>
          </AnimatePresence>
          <div className="relative w-full h-2 max-w-100 bg-slate-200">
            <span style={{ width: `${progress}%`, transition: "width 0.3s, background 0.3s", backgroundColor: backgroundColor }} className={`absolute top-0 left-0 h-full bg-primary`}></span>
          </div>
        </div>
      )}
    </>
  );
}
