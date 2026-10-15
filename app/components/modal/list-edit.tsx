import React, { useState } from "react";
import { useTodoStore } from "@/app/store/todo-store";
import { useModalStore } from "@/app/store/modal-store";

import ListModal from "./list-modal";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldTitle } from "@/components/ui/field";

interface Props {
  listId: string | number;
}

const items = [
  { label: "높음", value: "높음" },
  { label: "보통", value: "보통" },
  { label: "낮음", value: "낮음" },
];

export default function ListEdit({ listId }: Props) {
  const matchedList = useTodoStore((state) => state.lists.find((list) => list.id === listId));
  const updateTodo = useTodoStore((state) => state.updateList);
  const close = useModalStore((state) => state.setIsClose);

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(matchedList?.content ?? "");
  const [priority, setPriority] = useState(matchedList?.priority ?? "");
  const [date, setDate] = useState<Date>(matchedList?.date ?? new Date());
  const [startTime, setStartTime] = useState(matchedList?.start_time ?? "");
  const [endTime, setEndTime] = useState(matchedList?.end_time ?? "");
  const [allDay, setAllDay] = useState(matchedList?.all_day);

  if (!matchedList) return null;

  const updateListHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedContent = content?.trim();

    if (!trimmedContent) return;

    close();

    await updateTodo({
      ...matchedList,
      content: trimmedContent,
      priority,
      date,
      start_time: startTime,
      end_time: endTime,
      all_day: allDay,
    });
  };

  const allDayCheckedHandler = () => {
    setAllDay((prev) => !prev);
    setStartTime("");
    setEndTime("");
  };

  return (
    <ListModal>
      <form onSubmit={updateListHandler} className="w-full h-full">
        <Input
          id="edit"
          placeholder=""
          className="h-8.75 mb-3 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-x-2 mb-3">
          <div className="w-[calc(50%-4px)]">
            <Select id="priority" value={priority} onValueChange={(value) => setPriority(value ?? "")}>
              <SelectTrigger className="flex! items-center w-full h-8.75! box-border bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] text-muted-foreground">
                <SelectValue placeholder="우선순위" className="inline-block! w-[calc(100%-15px)] truncate whitespace-nowrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>우선순위</SelectLabel>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[calc(50%-4px)]">
            <Popover onOpenChange={setOpen} open={open}>
              <PopoverTrigger
                render={
                  <Button
                    variant={"outline"}
                    data-empty={!date}
                    className="flex! items-center w-full h-8.75 justify-between text-left text-[13px] text-muted-foreground font-medium border-gray-200 rounded-[10px] data-[empty=true]:text-muted-foreground bg-background! hover:text-muted-foreground"
                  >
                    {date ? (
                      <span className="inline-block w-[calc(100%-15px)] truncate whitespace-nowrap">{format(date, "PPP", { locale: ko })}</span>
                    ) : (
                      <span className="inline-block w-[calc(100%-15px)] truncate whitespace-nowrap">날짜를 선택하세요.</span>
                    )}
                    <ChevronDownIcon data-icon="inline-end" className="inline-block" />
                  </Button>
                }
              />
              <PopoverContent className="relaitve w-auto p-0 z-1000" align="start">
                <Calendar
                  id="date"
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    if (date) {
                      setDate(date);
                      setOpen(false);
                    }
                  }}
                  defaultMonth={date}
                  locale={ko}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-x-1 mb-3">
          <div className="w-[calc(50%-9px)]">
            <Input
              id="startTime"
              type="time"
              className="h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 disabled:bg-[#e9eaef]"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={allDay}
            />
          </div>
          <span className="w-2.5 text-[13px]">~</span>
          <div className="w-[calc(50%-9px)]">
            <Input
              id="endTime"
              type="time"
              className="h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 disabled:bg-[#e9eaef]"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={allDay}
            />
          </div>
        </div>
        <Field orientation="horizontal" className="mb-3">
          <Checkbox id="allTime" name="allTime" checked={allDay} onCheckedChange={allDayCheckedHandler} />
          <FieldContent className="gap-y-1 items-start">
            <FieldTitle
              className={`relative max-w-[calc(100%-30px)] text-[14px] transition-colors duration-300 before:absolute before:top-1 before:left-0 before:w-2.5 before:h-2.5 before:rounded-[100%] after:absolute after:left:0 after:h-px after:bg-slate-400 after:transition-[width] after:duration-300`}
            >
              종일
            </FieldTitle>
          </FieldContent>
        </Field>
        <div className="flex justify-end gap-x-2.5">
          <button className="w-full max-w-18 h-8.75 bg-primary text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#4573e9]">수정</button>
          <button onClick={close} type="button" className="w-full max-w-18 h-8.75 bg-white border border-gray-200 rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#f4f4f4]">
            취소
          </button>
        </div>
      </form>
    </ListModal>
  );
}
