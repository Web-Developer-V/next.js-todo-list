"use client";

import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import ContentTitle from "./content-title";
import { useTodoStore } from "../../store/todo-store";
import TodoInputFields from "./todo-input-fields";

export default function ListForm() {
  const { setList } = useTodoStore();

  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState<Date>();
  const [allDay, setAllDay] = useState(false);

  const [validate, setValidate] = useState({
    content_validate: false,
    priority_validate: false,
    date_validate: false,
  });
  const [open, setOpen] = useState(false);
  const [validateSentence, setValidateSentence] = useState(false);

  const listAddHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidateSentence(true);

    if (!validate.content_validate || !validate.priority_validate || !validate.date_validate) return;

    if (!date) return;

    setList({
      id: uuidv4(),
      content: content.trim(),
      priority,
      date,
      start_time: startTime,
      end_time: endTime,
      all_day: allDay,
      complete: false,
    });

    setContent("");
    setPriority("");
    setStartTime("");
    setEndTime("");
    setAllDay(false);
    setDate(undefined);
  };

  const contentChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    setValidate((prev) => ({
      ...prev,
      content_validate: e.target.value !== "",
    }));
  };

  const priorityChangeHandler = (value: string) => {
    setPriority(value);
    setValidate((prev) => ({
      ...prev,
      priority_validate: value !== "",
    }));
  };

  const dateChangeHandler = (date: Date | undefined) => {
    setDate(date);
    setOpen(false);
    setValidate((prev) => ({
      ...prev,
      date_validate: date !== undefined,
    }));
  };

  const inputValue = { content, priority, startTime, endTime, date, allDay };
  const inputErrors = {
    content: validate.content_validate,
    priority: validate.priority_validate,
    date: validate.date_validate,
  };

  return (
    <div className="mb-6">
      <ContentTitle title="할 일 추가하기" />
      <form onSubmit={listAddHandler} className="flex flex-col gap-y-3">
        <TodoInputFields
          value={inputValue}
          showErrors={validateSentence}
          errors={inputErrors}
          datePickerOpen={open}
          on={{
            contentChange: contentChangeHandler,
            priorityChange: priorityChangeHandler,
            dateChange: dateChangeHandler,
            startTimeChange: (e) => setStartTime(e.target.value),
            endTimeChange: (e) => setEndTime(e.target.value),
            allDayChange: setAllDay,
            datePickerOpenChange: setOpen,
          }}
        />
        <button type="submit" className="h-8.75 bg-primary text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#4573e9]">추가하기</button>
      </form>
    </div>
  );
}
