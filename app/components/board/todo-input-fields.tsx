import type { ChangeEventHandler } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldTitle } from "@/components/ui/field";

const priorityItems = [
  { label: "높음", value: "높음" },
  { label: "보통", value: "보통" },
  { label: "낮음", value: "낮음" },
];

export interface TodoFieldsValue {
  content: string;
  priority: string;
  startTime: string;
  endTime: string;
  date: Date | undefined;
  allDay: boolean;
}

export interface TodoFieldsErrors {
  content: boolean;
  priority: boolean;
  date: boolean;
}

interface TodoFieldsHandlers {
  contentChange: ChangeEventHandler<HTMLInputElement>;
  priorityChange: (value: string) => void;
  dateChange: (date: Date | undefined) => void;
  startTimeChange: ChangeEventHandler<HTMLInputElement>;
  endTimeChange: ChangeEventHandler<HTMLInputElement>;
  allDayChange: (checked: boolean) => void;
  datePickerOpenChange: (open: boolean) => void;
}

interface TodoInputFieldsProps {
  value: TodoFieldsValue;
  errors?: TodoFieldsErrors;
  showErrors?: boolean;
  datePickerOpen: boolean;
  on: TodoFieldsHandlers;
}

const emptyErrors: TodoFieldsErrors = {
  content: true,
  priority: true,
  date: true,
};

export default function TodoInputFields({ value, errors = emptyErrors, showErrors = false, datePickerOpen, on }: TodoInputFieldsProps) {
  return (
    <>
      <div>
        <Input
          id="content"
          placeholder="할 일을 입력하세요."
          className="h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200"
          value={value.content}
          onChange={on.contentChange}
        />
        {showErrors && !errors.content && !value.content && <p className="mt-1 text-[12px] text-red-400 font-medium">할 일을 입력해주세요.</p>}
      </div>

      <div className="flex gap-x-2">
        <div className="w-[calc(50%-4px)]">
          <Select id="priority" value={value.priority} onValueChange={(priority) => on.priorityChange(priority ?? "")}>
            <SelectTrigger className="flex! items-center w-full h-8.75! box-border bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] text-muted-foreground">
              <SelectValue placeholder="우선순위" className="inline-block! w-[calc(100%-15px)] truncate whitespace-nowrap" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>우선순위</SelectLabel>
                {priorityItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {showErrors && !errors.priority && !value.priority && <p className="mt-1 text-[12px] text-red-400 font-medium overflow-hidden">우선순위를 선택해주세요.</p>}
        </div>

        <div className="w-[calc(50%-4px)]">
          <Popover open={datePickerOpen} onOpenChange={on.datePickerOpenChange}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  data-empty={!value.date}
                  className="flex! items-center w-full h-8.75 justify-between text-left text-[13px] text-muted-foreground font-medium border-gray-200 rounded-[10px] data-[empty=true]:text-muted-foreground bg-background! hover:text-muted-foreground"
                >
                  {value.date ? (
                    <span className="inline-block w-[calc(100%-15px)] truncate whitespace-nowrap">{format(value.date, "PPP", { locale: ko })}</span>
                  ) : (
                    <span className="inline-block w-[calc(100%-15px)] truncate whitespace-nowrap">날짜를 선택하세요.</span>
                  )}
                  <ChevronDownIcon data-icon="inline-end" className="inline-block" />
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar id="date" mode="single" selected={value.date} onSelect={on.dateChange} defaultMonth={value.date} locale={ko} disabled={{ before: new Date() }} />
            </PopoverContent>
          </Popover>
          {showErrors && !errors.date && !value.date && <p className="mt-1 text-[12px] text-red-400 font-medium">날짜를 선택해주세요.</p>}
        </div>
      </div>

      <div className="flex items-center gap-x-1">
        <Input
          id="startTime"
          type="time"
          className="w-[calc(50%-4px)] h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 disabled:bg-[#e9eaef]"
          value={value.startTime}
          onChange={on.startTimeChange}
          disabled={value.allDay}
        />
        <span>~</span>
        <Input
          id="endTime"
          type="time"
          className="w-[calc(50%-4px)] h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 disabled:bg-[#e9eaef]"
          value={value.endTime}
          onChange={on.endTimeChange}
          disabled={value.allDay}
        />
      </div>

      <Field orientation="horizontal">
        <Checkbox id="allTime" name="allTime" checked={value.allDay} onCheckedChange={on.allDayChange} />
        <FieldContent className="gap-y-1 items-start">
          <FieldTitle className="relative max-w-[calc(100%-30px)] text-[14px] transition-colors duration-300 before:absolute before:top-1 before:left-0 before:w-2.5 before:h-2.5 before:rounded-[100%] after:absolute after:left-0 after:h-px after:bg-slate-400 after:transition-[width] after:duration-300">
            종일
          </FieldTitle>
        </FieldContent>
      </Field>
    </>
  );
}
