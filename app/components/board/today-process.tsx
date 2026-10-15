"use client";

import { isToday } from "date-fns";
import { useTodoStore } from "../../store/todo-store";
import ContentTitle from "./content-title";
import { AnimatePresence, motion } from "motion/react";
import { TodayProcessSkeleton } from "./skeleton/todo-list-skeleton";

export default function TodayProcess() {
  const { lists, loaded } = useTodoStore();

  const todayListLength = lists.filter((list) => isToday(list.date)).length;
  const completeLength = lists.filter((list) => list.complete && isToday(list.date)).length;
  const progress = todayListLength === 0 ? 0 : Math.floor((completeLength / todayListLength) * 100);

  return (
    <article className="">
      <ContentTitle title="오늘의 할 일" />
      {!loaded ? (
        <TodayProcessSkeleton />
      ) : (
        <div className="flex min-h-47.5 w-full items-center justify-between gap-4 rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(71,91,126,0.06)] border border-gray-100 box-border max-[413px]:flex-col">
          <div className="relative flex size-33 items-center justify-center rounded-full max-[1025px]:size-30">
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e8edf5" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={progress === 100 ? "#42d242" : "#4c7ffe"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress} 100`}
                pathLength="100"
                style={{ transition: "stroke-dasharray 0.3s, stroke 0.3s" }}
              />
            </svg>

            <div className="flex size-full flex-col items-center justify-center rounded-full bg-white">
              <div className="flex items-center gap-x-1 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.strong key={completeLength} initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} transition={{ duration: 0.2 }} className="text-[25px] font-bold leading-none tracking-[-0.04em] text-slate-900 sm:text-[21px]">
                    {completeLength}
                  </motion.strong>
                </AnimatePresence>
                <span className="font-bold"> / </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.strong key={todayListLength} initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} transition={{ duration: 0.2 }} className="text-[25px] font-bold leading-none tracking-[-0.04em] text-slate-900 sm:text-[21px]">
                    {todayListLength}
                  </motion.strong>
                </AnimatePresence>
              </div>

              <span className="mt-2 text-[14px] font-medium text-slate-400">완료</span>
            </div>
          </div>

          <div className="w-[calc(100%-148px)] sm:block max-[1025px]:w-[calc(100%-120px)] max-[413px]:w-full max-[413px]:text-center">
            <div className="flex gap-x-0.5 overflow-hidden text-[28px] font-bold leading-none tracking-[-0.04em] text-slate-900 max-[413px]:justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.strong key={progress} initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} transition={{ duration: 0.2 }} className="block">
                  {progress}
                </motion.strong>
              </AnimatePresence>
              <strong>%</strong>
            </div>

            <AnimatePresence>
              <p className="mt-3 text-[13px] font-medium text-slate-400">
                {progress === 100 ? (
                  <motion.span key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    오늘의 할 일을 완료했어요!
                  </motion.span>
                ) : (
                  <motion.span key="process" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    오늘의 할 일을 완료해보세요.
                  </motion.span>
                )}
              </p>
            </AnimatePresence>
          </div>
        </div>
      )}
    </article>
  );
}
