"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function DashboardLayout({ children }) {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/signin");
        return;
      }
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/signin");
        return;
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!session) {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
