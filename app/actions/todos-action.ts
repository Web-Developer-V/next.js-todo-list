"use server";

import { getAppUser } from "@/lib/supabase/app-user";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

interface Todo {
  id: string | number;
  content: string;
  priority: string;
  date: Date;
  complete: boolean;
  start_time?: string | null;
  end_time?: string | null;
  all_day?: boolean | undefined;
}

export async function migrateTodos(todos: Todo[]) {
  const supabase = await createClient();
  const user = await getAppUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  const { error } = await supabase.from("Todos").insert(
    todos.map((todo) => ({
      user_id: user.id,
      id: todo.id,
      content: todo.content,
      priority: todo.priority,
      date: format(todo.date, "yyyy-MM-dd"),
      start_time: todo.start_time || null,
      end_time: todo.end_time || null,
      complete: todo.complete,
      all_day: todo.all_day,
    })),
  );

  if (error) {
    throw new Error(`${error.code} : ${error.message}`);
  }

  return { isLoggedIn: true };
}

export async function createTodo(todo: Todo) {
  const supabase = await createClient();
  const user = await getAppUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  const { error } = await supabase.from("Todos").insert({
    user_id: user.id,
    id: todo.id,
    content: todo.content,
    priority: todo.priority,
    date: format(todo.date, "yyyy-MM-dd"),
    start_time: todo.start_time || null,
    end_time: todo.end_time || null,
    complete: todo.complete,
    all_day: todo.all_day,
  });

  if (error) {
    throw new Error(`${error.code} : ${error.message}`);
  }

  return { isLoggedIn: true };
}

export async function updateTodo(id: Todo["id"], content: string, priority: string, date: Date, start_time?: string | null, end_time?: string | null, all_day?: boolean) {
  const supabase = await createClient();
  const user = await getAppUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  const { error } = await supabase
    .from("Todos")
    .update({
      content,
      priority,
      date: format(date, "yyyy-MM-dd"),
      start_time: start_time || null,
      end_time: end_time || null,
      all_day,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`${error.code} : ${error.message}`);
  }

  return { isLoggedIn: true, success: true };
}

export async function deleteTodo(id: Todo["id"]) {
  const supabase = await createClient();
  const user = await getAppUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  const { error } = await supabase.from("Todos").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    throw new Error(`${error.code} : ${error.message}`);
  }

  return { isLoggedIn: true };
}

export async function completeTodo(id: Todo["id"], complete: Todo["complete"]) {
  const supabase = await createClient();
  const user = await getAppUser();

  if (!user) {
    return { isLoggedIn: false };
  }

  const { error } = await supabase
    .from("Todos")
    .update({
      complete,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`${error.code} : ${error.message}`);
  }

  return { isLoggedIn: true, success: true };
}

export async function getTodos() {
  const supabase = await createClient();
  const user = await getAppUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("Todos")
    .select("id, content, priority, date, start_time, end_time, complete, all_day")
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`${error.code} : ${error.message}`);
  }

  return data;
}
