import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { completeTodo, createTodo, deleteTodo, getTodos, updateTodo } from "../actions/todos-action";
import { parseISO } from "date-fns";

export interface Todo {
  id: string | number;
  content: string;
  priority: string;
  date: Date;
  complete: boolean;
  start_time?: string | null;
  end_time?: string | null;
  all_day?: boolean | undefined;
}

interface State {
  lists: Todo[];
  loaded: boolean;
  error: {
    state: boolean;
    message: string | null;
  };
  setLists: (lists: Todo[]) => void;
  setList: (item: Todo) => Promise<void>;
  updateList: (updatedTodo: Todo) => Promise<void>;
  removeList: (id: Todo["id"]) => Promise<void>;
  toggleComplete: (id: Todo["id"]) => Promise<void>;
  loadTodos: () => Promise<void>;
}

export const useTodoStore = create<State>((set, get) => {
  const saveLocalTodos = (lists: Todo[]) => {
    localStorage.setItem("todo-list", JSON.stringify(lists));
  };

  const runOptimisticUpdate = async ({ previousLists, nextLists, saveForUser, errorMessage }: { previousLists: Todo[]; nextLists: Todo[]; saveForUser: () => Promise<unknown>; errorMessage: string }) => {
    set({ lists: nextLists });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await saveForUser();
      } else {
        saveLocalTodos(nextLists);
      }
    } catch (error) {
      set({ lists: previousLists });
      console.error(`${errorMessage} : ${error}`);
    }
  };

  return {
    lists: [],
    loaded: false,
    error: {
      state: false,
      message: null,
    },
    setLists: (lists) => set({ lists }),
    setList: async (item) => {
      const previousLists = get().lists;
      const nextLists = [...previousLists, item];

      await runOptimisticUpdate({ previousLists, nextLists, saveForUser: () => createTodo(item), errorMessage: "할 일 추가 실패" });
    },
    updateList: async (updatedTodo) => {
      const previousLists = get().lists;
      const nextLists = previousLists.map((list) => (list.id === updatedTodo.id ? updatedTodo : list));

      await runOptimisticUpdate({
        previousLists,
        nextLists,
        saveForUser: () => updateTodo(updatedTodo.id, updatedTodo.content, updatedTodo.priority, updatedTodo.date, updatedTodo.start_time, updatedTodo.end_time, updatedTodo.all_day),
        errorMessage: "할 일 수정 실패",
      });
    },
    removeList: async (id) => {
      const previousLists = get().lists;
      const nextLists = previousLists.filter((list) => list.id !== id);

      await runOptimisticUpdate({
        previousLists,
        nextLists,
        saveForUser: () => deleteTodo(id),
        errorMessage: "할 일 삭제 실패",
      });
    },
    toggleComplete: async (id) => {
      const previousLists = get().lists;
      const target = previousLists.find((list) => list.id === id);

      if (!target) return;

      const complete = !target.complete;
      const nextLists = previousLists.map((list) => (list.id === id ? { ...list, complete } : list));

      await runOptimisticUpdate({ previousLists, nextLists, saveForUser: () => completeTodo(id, complete), errorMessage: "완료 체크 실패" });
    },
    loadTodos: async () => {
      set({
        error: {
          state: false,
          message: null,
        },
      });

      try {
        const savedLists = localStorage.getItem("todo-list");
        const localTodos: Todo[] = savedLists
          ? JSON.parse(savedLists).map((list: Todo) => ({
              ...list,
              date: new Date(list.date),
            }))
          : [];

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          set({
            lists: localTodos,
            loaded: true,
          });
          return;
        }

        const todos = await getTodos();

        set({
          lists: todos.map((todo) => ({
            ...todo,
            date: parseISO(todo.date),
          })),
          loaded: true,
        });
      } catch (error) {
        set({
          loaded: true,
          error: {
            state: true,
            message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
          },
        });
      }
    },
  };
});
