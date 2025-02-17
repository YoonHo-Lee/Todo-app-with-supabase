import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Navigation() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 세션 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="border rounded-lg p-2 shadow-md">
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="px-4 py-2 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100"
        >
          <h1 className="text-xl font-bold">Todo App</h1>
        </Link>
        <div className="flex gap-4">
          {!session ? (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100"
              >
                회원가입
              </Link>
              <Link
                href="/signin"
                className="px-4 py-2 text-sm hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100"
              >
                로그인
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100"
            >
              로그아웃
            </button>
          )}
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100"
          >
            대시보드
          </Link>
        </div>
      </div>
    </nav>
  );
}
