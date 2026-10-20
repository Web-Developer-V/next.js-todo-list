"use client";

import type { ChangeEventHandler } from "react";
import { useState } from "react";

import type { TodoFieldsValue } from "../components/board/todo-input-fields";

interface TodoFormValidity {
  content: boolean;
  priority: boolean;
  date: boolean;
}

export function useTodoForm(initialValues: TodoFieldsValue) {
  const [content, setContent] = useState(initialValues.content);
  const [priority, setPriority] = useState(initialValues.priority);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);
  const [date, setDate] = useState<Date | undefined>(initialValues.date);
  const [allDay, setAllDay] = useState(initialValues.allDay);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const values = { content, priority, startTime, endTime, date, allDay };
  const validity: TodoFormValidity = {
    content: content.trim().length > 0,
    priority: priority.length > 0,
    date: date !== undefined,
  };

  const contentChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setContent(event.target.value);
  };

  const priorityChange = (value: string) => {
    setPriority(value);
  };

  const dateChange = (value: Date | undefined) => {
    setDate(value);
    setDatePickerOpen(false);
  };

  const startTimeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setStartTime(event.target.value);
  };

  const endTimeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEndTime(event.target.value);
  };

  const allDayChange = (checked: boolean) => {
    setAllDay(checked);

    if (checked) {
      setStartTime("");
      setEndTime("");
    }
  };

  const submitAttempt = () => {
    setShowErrors(true);
    return validity.content && validity.priority && validity.date;
  };

  const reset = () => {
    setContent(initialValues.content);
    setPriority(initialValues.priority);
    setStartTime(initialValues.startTime);
    setEndTime(initialValues.endTime);
    setDate(initialValues.date);
    setAllDay(initialValues.allDay);
    setDatePickerOpen(false);
    setShowErrors(false);
  };

  return {
    values,
    validity,
    showErrors,
    datePickerOpen,
    contentChange,
    priorityChange,
    dateChange,
    startTimeChange,
    endTimeChange,
    allDayChange,
    setDatePickerOpen,
    submitAttempt,
    reset,
  };
}
