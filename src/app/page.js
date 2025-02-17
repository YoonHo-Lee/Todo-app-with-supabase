"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AddTodoModal from "../components/AddTodoModal";
import Navigation from "../components/Navigation";
import TodoList from "../components/TodoList";
import FloatingButton from "../components/FloatingButton";

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchTodos();
      }
    });

    // 세션 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchTodos();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("할 일을 불러오는데 실패했습니다:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (inputValue.trim() !== "") {
      try {
        const newTodo = {
          user_id: session.user.id,
          text: inputValue,
          completed: false,
        };

        const { data, error } = await supabase
          .from("todos")
          .insert([newTodo])
          .select()
          .single();

        if (error) throw error;

        setTodos([data, ...todos]);
        setInputValue("");
        setIsModalOpen(false);
      } catch (error) {
        console.error("할 일 추가에 실패했습니다:", error.message);
      }
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const { error } = await supabase
        .from("todos")
        .update({ completed: !todoToUpdate.completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("할 일 상태 변경에 실패했습니다:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("할 일 삭제에 실패했습니다:", error.message);
    }
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <main className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <Navigation />
      <TodoList
        activeTodos={activeTodos}
        completedTodos={completedTodos}
        toggleComplete={toggleComplete}
        onDelete={handleDelete}
      />
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <FloatingButton onClick={() => setIsModalOpen(true)} />
    </main>
  );
}
