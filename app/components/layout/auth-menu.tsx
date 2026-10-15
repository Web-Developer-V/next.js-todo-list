"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import SignInButton from "./sign-in-button";
import SignUpButton from "../layout/sign-up-button";
import MyPageButton from "./my-page-button";
import SignOutButton from "../layout/sign-out-button";
import HomeButton from "./home-button";
import { useTodoStore } from "@/app/store/todo-store";
import AuthMenuSkeleton from "../auth/skeleton/auth-menu-skeleton";
import { usePathname, useRouter } from "next/navigation";
import UserInfo from "./user-info";

interface Todo {
  id: string | number;
  content: string;
  priority: string;
  date: Date;
  complete: boolean;
}

export default function AuthMenu() {
  const router = useRouter();
  const path = usePathname();
  const { setLists } = useTodoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const isRecoveryMode = () => document.cookie.split("; ").some((cookie) => cookie === "recovery-mode-ui=1");

    const getUser = async () => {
      if (isRecoveryMode()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isRecoveryMode()) {
        setUser(null);
        return;
      }

      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(`로그아웃에 실패했습니다. : ${error}`);
      return;
    }

    const savedTodos = localStorage.getItem("todo-list");

    if (savedTodos) {
      const todos = JSON.parse(savedTodos).map((todo: Todo) => ({
        ...todo,
        date: new Date(todo.date),
      }));

      setLists(todos);
    } else {
      setLists([]);
    }

    localStorage.setItem(
      "login-event",
      JSON.stringify({
        type: "SIGNED_OUT",
        timestamp: Date.now(),
      }),
    );
    router.replace("/sign-in");
  };

  return (
    <div className="flex items-center justify-end w-full h-20 max-w-300 mx-auto">
      {isLoading ? (
        <AuthMenuSkeleton />
      ) : user ? (
        <div className="flex gap-x-3 items-center">
          <UserInfo />
          {path.startsWith("/my-page") ? <HomeButton /> : <MyPageButton />}
          <SignOutButton signOut={signOut} />
        </div>
      ) : (
        <div className="flex gap-x-3">
          <SignInButton />
          <SignUpButton />
        </div>
      )}
    </div>
  );
}
