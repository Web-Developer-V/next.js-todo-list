"use client";

import { v4 as uuidv4 } from "uuid";
import ContentTitle from "./content-title";
import { useTodoStore } from "../../store/todo-store";
import TodoInputFields from "./todo-input-fields";
import { useTodoForm } from "../../hooks/use-todo-form";

export default function ListForm() {
  const setList = useTodoStore((state) => state.setList);
  const form = useTodoForm({
    content: "",
    priority: "",
    startTime: "",
    endTime: "",
    date: undefined,
    allDay: false,
  });

  const listAddHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.submitAttempt()) return;

    if (!form.values.date) return;

    setList({
      id: uuidv4(),
      content: form.values.content.trim(),
      priority: form.values.priority,
      date: form.values.date,
      start_time: form.values.startTime,
      end_time: form.values.endTime,
      all_day: form.values.allDay,
      complete: false,
    });

    form.reset();
  };

  return (
    <div className="mb-6">
      <ContentTitle title="할 일 추가하기" />
      <form onSubmit={listAddHandler} className="flex flex-col gap-y-3">
        <TodoInputFields
          value={form.values}
          showErrors={form.showErrors}
          validity={form.validity}
          datePickerOpen={form.datePickerOpen}
          on={{
            contentChange: form.contentChange,
            priorityChange: form.priorityChange,
            dateChange: form.dateChange,
            startTimeChange: form.startTimeChange,
            endTimeChange: form.endTimeChange,
            allDayChange: form.allDayChange,
            datePickerOpenChange: form.setDatePickerOpen,
          }}
        />
        <button type="submit" className="h-8.75 bg-primary text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#4573e9]">
          추가하기
        </button>
      </form>
    </div>
  );
}
