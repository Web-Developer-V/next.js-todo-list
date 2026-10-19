import React, { useState } from "react";
import { useTodoStore } from "@/app/store/todo-store";
import { useModalStore } from "@/app/store/modal-store";

import ListModal from "./list-modal";

import TodoInputFields from "../board/todo-input-fields";

interface Props {
  listId: string | number;
}

export default function ListEdit({ listId }: Props) {
  const matchedList = useTodoStore((state) => state.lists.find((list) => list.id === listId));
  const updateTodo = useTodoStore((state) => state.updateList);
  const close = useModalStore((state) => state.setIsClose);

  const [content, setContent] = useState(matchedList?.content ?? "");
  const [priority, setPriority] = useState(matchedList?.priority ?? "");
  const [date, setDate] = useState<Date | undefined>(matchedList?.date ?? new Date());
  const [startTime, setStartTime] = useState(matchedList?.start_time ?? "");
  const [endTime, setEndTime] = useState(matchedList?.end_time ?? "");
  const [allDay, setAllDay] = useState(matchedList?.all_day ?? false);
  const [open, setOpen] = useState(false);

  const [validate, setValidate] = useState({
    content_validate: false,
    priority_validate: false,
    date_validate: false,
  });
  const [validateSentence, setValidateSentence] = useState(false);

  if (!matchedList) return null;

  const updateListHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidateSentence(true);

    const trimmedContent = content?.trim();

    if (!trimmedContent) return;

    close();

    await updateTodo({
      ...matchedList,
      content: trimmedContent,
      priority,
      date: date ?? new Date(),
      start_time: startTime,
      end_time: endTime,
      all_day: allDay,
    });
  };

  const allDayCheckedHandler = (checked: boolean) => {
    setAllDay(checked);
    setStartTime("");
    setEndTime("");
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
    <ListModal>
      <form onSubmit={updateListHandler} className="flex flex-col gap-y-3">
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
            allDayChange: allDayCheckedHandler,
            datePickerOpenChange: setOpen,
          }}
        />
        <div className="flex justify-end gap-x-2.5">
          <button type="submit" className="w-full max-w-18 h-8.75 bg-primary text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#4573e9]">
            수정
          </button>
          <button onClick={close} type="button" className="w-full max-w-18 h-8.75 bg-white border border-gray-200 rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#f4f4f4]">
            취소
          </button>
        </div>
      </form>
    </ListModal>
  );
}
