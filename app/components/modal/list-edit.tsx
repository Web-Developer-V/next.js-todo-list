import type { FormEvent } from "react";

import { useTodoStore, type Todo } from "@/app/store/todo-store";
import { useModalStore } from "@/app/store/modal-store";

import TodoInputFields from "../board/todo-input-fields";
import { useTodoForm } from "@/app/hooks/use-todo-form";
import ListModal from "./list-modal";

interface Props {
  listId: string | number;
}

export default function ListEdit({ listId }: Props) {
  const matchedList = useTodoStore((state) => state.lists.find((list) => list.id === listId));

  if (!matchedList) return null;

  return <ListEditForm list={matchedList} />;
}

function ListEditForm({ list }: { list: Todo }) {
  const updateTodo = useTodoStore((state) => state.updateList);
  const close = useModalStore((state) => state.setIsClose);
  const form = useTodoForm({
    content: list.content,
    priority: list.priority,
    startTime: list.start_time ?? "",
    endTime: list.end_time ?? "",
    date: list.date,
    allDay: list.all_day ?? false,
  });

  const updateListHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.submitAttempt()) return;

    close();

    await updateTodo({
      ...list,
      content: form.values.content.trim(),
      priority: form.values.priority,
      date: form.values.date as Date,
      start_time: form.values.startTime,
      end_time: form.values.endTime,
      all_day: form.values.allDay,
    });
  };

  return (
    <ListModal>
      <form onSubmit={updateListHandler} className="flex flex-col gap-y-3">
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
