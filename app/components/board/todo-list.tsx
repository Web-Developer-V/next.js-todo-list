"use client";

import { useTabStore } from "../../store/tab-store";
import { useEffect, useRef, useState } from "react";
import { X, ShieldAlert, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldTitle, FieldDescription } from "@/components/ui/field";
import { getLocalTimeZone, today, type CalendarDate } from "@internationalized/date";

import { Calendar } from "@/components/ui/react-aria-calendar";
import { Todo, useTodoStore } from "../../store/todo-store";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion } from "motion/react";
import { TodoCalendarSkeleton, TodoListSkeletonItems } from "./skeleton/todo-list-skeleton";
import { useModalStore } from "@/app/store/modal-store";
import ListEdit from "../modal/list-edit";

export default function TodoList() {
  const lists = useTodoStore((state) => state.lists);
  const error = useTodoStore((state) => state.error);
  const loaded = useTodoStore((state) => state.loaded);
  const loadTodos = useTodoStore((state) => state.loadTodos);
  const removeList = useTodoStore((state) => state.removeList);
  const { activeTab } = useTabStore();
  const completeList = useTodoStore((state) => state.toggleComplete);
  const openModal = useModalStore((state) => state.openModal);
  const setIsOpen = useModalStore((state) => state.setIsOpen);
  const [animatingTodo, setAnimatingTodo] = useState<{
    id: string | number;
    complete: boolean;
  } | null>(null);
  const [date, setDate] = useState<CalendarDate | null>(today(getLocalTimeZone()));
  const [editListId, setEditListId] = useState<Todo["id"] | null>(null);

  const loadingRef = useRef(false);

  useEffect(() => {
    const reloadTodos = async () => {
      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;

      try {
        await loadTodos();
      } finally {
        loadingRef.current = false;
      }
    };

    const loadListHandler = (e: StorageEvent) => {
      if (e.key !== "login-event" || !e.newValue) {
        return;
      }

      try {
        const data = JSON.parse(e.newValue);

        if (data.type === "SIGNED_IN" || data.type === "SIGNED_OUT") {
          reloadTodos();
        }
      } catch {
        return;
      }
    };

    window.addEventListener("storage", loadListHandler);

    reloadTodos();

    return () => {
      window.removeEventListener("storage", loadListHandler);
    };
  }, [loadTodos]);

  const filteredLists = lists.filter((list) => (activeTab === "complete" ? list.complete : activeTab === "process" ? !list.complete : true));

  const timeToSeconds = (time?: string | null) => {
    if (!time) return Infinity;

    const [hours, minutes, seconds = 0] = time.split(":").map(Number);

    return hours * 3600 + minutes * 60 + seconds;
  };

  const sortedLists = [...filteredLists].sort((a, b) => {
    const dateCompare = format(a.date, "yyyy-MM-dd").localeCompare(format(b.date, "yyyy-MM-dd"));

    if (a.complete !== b.complete) {
      return a.complete ? 1 : -1;
    }

    if (dateCompare !== 0) {
      return dateCompare;
    }

    if (!a.date) return 1;
    if (!b.date) return -1;

    return timeToSeconds(a.start_time) - timeToSeconds(b.start_time);
  });

  const dateFilteredLists = date ? sortedLists.filter((list) => isSameDay(list.date, date.toDate(getLocalTimeZone()))) : [];

  const completeHandler = (id: string | number) => {
    const filteredlist = lists.find((list) => list.id === id);

    if (!filteredlist) return;

    setAnimatingTodo({
      id,
      complete: !filteredlist.complete,
    });

    setTimeout(async () => {
      await completeList(id);
      setAnimatingTodo(null);
    }, 300);
  };

  return (
    <>
      {openModal["list-edit"] && editListId !== null && <ListEdit listId={editListId} />}
      {!loaded ? (
        <TodoCalendarSkeleton />
      ) : (
        <article className="p-5 pb-2 max-[481px]:p-3">
          <Calendar value={date} onChange={setDate} className="w-full rounded-lg border [--cell-size:--spacing(12)]" captionLayout="dropdown" onVisibleDateChange={() => setDate(null)} TodoLists={lists} />
        </article>
      )}
      {error.state ? (
        <motion.p key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center w-full min-h-37.5 text-red-500">
          <ShieldAlert />
          <span className="pl-1">
            리스트를 불러올 수 없습니다. <br />[{error.message}]
          </span>
        </motion.p>
      ) : !loaded ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5">
            <TodoListSkeletonItems count={1} />
          </motion.ul>
        </AnimatePresence>
      ) : dateFilteredLists.length === 0 ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center w-full min-h-37.5 text-slate-400 max-[769px]:text-[14px]">
            {activeTab === "process" ? "진행중인 할 일이 없습니다." : activeTab === "complete" ? "완료된 할 일이 없습니다." : "할 일 리스트가 없습니다."}
          </motion.p>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5">
            {dateFilteredLists.map((list) => {
              const priorityCss = list.priority === "높음" ? "before:bg-red-600" : list.priority === "보통" ? "before:bg-yellow-300" : list.priority === "낮음" ? "before:bg-(--primary)" : "";
              const formatedDate = list.date ? format(list.date, "yyyy.MM.dd", { locale: ko }) : "";

              const isAnimating = animatingTodo?.id === list.id;
              const isCompleted = isAnimating ? animatingTodo.complete : list.complete;

              return (
                <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} key={list.id} className="relative py-4 border-b border-gray-100 last:border-b-0">
                  <Field orientation="horizontal">
                    <Checkbox id={`todo-${list.id}`} name={`todo-${list.id}`} checked={isCompleted} onCheckedChange={() => completeHandler(list.id)} />
                    <FieldContent className="items-start">
                      <FieldTitle
                        className={`relative max-w-[calc(100%-30px)] mb-1.5 pl-4 text-[14px] transition-colors duration-300 before:absolute before:top-1 before:left-0 before:w-2.5 before:h-2.5 before:rounded-[100%] after:absolute after:left:0 after:h-px after:bg-slate-400 after:transition-[width] after:duration-300 ${isCompleted ? "after:w-[calc(100%-14px)] text-slate-300" : "after:w-0"} ${priorityCss}`}
                      >
                        {list.content}
                      </FieldTitle>
                      <FieldDescription
                        className={`relative pl-4 text-[13px] text-slate-400 transition-colors duration-300 before:absolute before:left:0 before:top-1/2 before:translate-y-[-50%] before:h-px before:bg-slate-400 before:transition-[width] before:duration-300 ${isCompleted ? "before:w-[calc(100%-14px)] text-slate-300" : "before:w-0"}`}
                      >
                        {formatedDate}
                      </FieldDescription>
                      {!list.all_day && list.start_time && list.end_time && (
                        <FieldDescription
                          className={`relative pl-4 text-[12px] text-slate-400 transition-colors duration-300 before:absolute before:left:0 before:top-1/2 before:translate-y-[-50%] before:h-px before:bg-slate-400 before:transition-[width] before:duration-300 ${isCompleted ? "before:w-[calc(100%-14px)] text-slate-300" : "before:w-0"}`}
                        >
                          {list.start_time?.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1") ?? ""} ~ {list.end_time?.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1") ?? ""}
                        </FieldDescription>
                      )}
                      {list.all_day && (
                        <FieldDescription
                          className={`relative pl-4 text-[12px] text-slate-400 transition-colors duration-300 before:absolute before:left:0 before:top-1/2 before:translate-y-[-50%] before:h-px before:bg-slate-400 before:transition-[width] before:duration-300 ${isCompleted ? "before:w-[calc(100%-14px)] text-slate-300" : "before:w-0"}`}
                        >
                          종일
                        </FieldDescription>
                      )}
                    </FieldContent>
                  </Field>
                  <div className="absolute top-1/2 right-0 translate-y-[-50%] ">
                    {!list.complete && (
                      <button
                        onClick={() => {
                          setEditListId(list.id);
                          setIsOpen("list-edit");
                        }}
                        className="mr-2 cursor-pointer"
                      >
                        <Pencil strokeWidth={3} size={14} className="text-slate-400 hover:text-foreground transition-colors" />
                      </button>
                    )}
                    <button onClick={() => removeList(list.id)} className="cursor-pointer">
                      <X strokeWidth={3} size={16} className="text-slate-400 hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      )}
    </>
  );
}
