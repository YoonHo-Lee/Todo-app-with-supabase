"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import "react-calendar/dist/Calendar.css";
import TodoCalendar from "@/components/TodoCalendar";
import StatsDonutChart from "@/components/StatsDonutChart";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    activeTodos: 0,
  });
  const [user, setUser] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [dailyStats, setDailyStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("useEffect", session);
        setUser(session.user);
        fetchStats(session.user.id);
        fetchMonthlyStats(session.user.id);
        fetchDailyStatsByMonth(session.user.id);
      }
    };
    getUser();
  }, []);

  const fetchStats = async (user_id) => {
    console.log("fetchStats", user_id);
    try {
      const { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user_id);

      if (error) throw error;

      const totalTodos = todos.length;
      const completedTodos = todos.filter((todo) => todo.completed).length;
      const activeTodos = totalTodos - completedTodos;

      setStats({
        totalTodos,
        completedTodos,
        activeTodos,
      });
    } catch (error) {
      console.error("통계를 불러오는데 실패했습니다:", error.message);
    }
  };

  const fetchMonthlyStats = async (user_id) => {
    console.log("fetchMonthlyStats", user_id);
    const { data, error } = await supabase
      .from("monthly_todo_stats")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      console.error("월별 통계를 불러오는데 실패했습니다:", error.message);
      return;
    }
    setMonthlyStats(data || []);
  };

  const fetchDailyStatsByMonth = async (user_id) => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const { data, error } = await supabase.rpc("get_daily_stats_by_month", {
        user_id_input: user_id,
        year_input: year,
        month_input: month,
      });

      if (error) throw error;

      const stats = data.reduce((acc, stat) => {
        const dateStr = new Date(stat.date).toISOString().split("T")[0];
        acc[dateStr] = {
          total: stat.total_todos,
          completed: stat.completed_todos,
          active: stat.active_todos,
        };
        return acc;
      }, {});

      setDailyStats(stats);
    } catch (error) {
      console.error("일별 통계를 불러오는데 실패했습니다:", error.message);
    }
  };

  const getSelectedDateStats = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return dailyStats[dateStr] || { total: 0, completed: 0, active: 0 };
  };

  const tileContent = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const stats = dailyStats[dateStr];

    if (!stats) return null;

    return (
      <div className="text-xs mt-1">
        <div className="text-blue-600">{stats.total}</div>
      </div>
    );
  };

  const handleMonthChange = async (activeStartDate) => {
    if (user) {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;

      try {
        const { data, error } = await supabase.rpc("get_daily_stats_by_month", {
          user_id_input: user.id,
          year_input: year,
          month_input: month,
        });

        if (error) throw error;

        const stats = data.reduce((acc, stat) => {
          const dateStr = new Date(stat.date).toISOString().split("T")[0];
          acc[dateStr] = {
            total: stat.total_todos,
            completed: stat.completed_todos,
            active: stat.active_todos,
          };
          return acc;
        }, {});

        setDailyStats(stats);
      } catch (error) {
        console.error("일별 통계를 불러오는데 실패했습니다:", error.message);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">사용자 정보</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">이메일:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">마지막 로그인:</span>{" "}
              {new Date(user.last_sign_in_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900">전체 할 일</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-900">
            {stats.totalTodos}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-900">완료된 할 일</h3>
          <p className="mt-2 text-3xl font-semibold text-green-900">
            {stats.completedTodos}
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-900">
            진행중인 할 일
          </h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-900">
            {stats.activeTodos}
          </p>
        </div>
      </div>

      <StatsDonutChart stats={stats} />

      <TodoCalendar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        dailyStats={dailyStats}
        getSelectedDateStats={getSelectedDateStats}
        onMonthChange={handleMonthChange}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">월별 통계</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  월
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전체
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  완료
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  진행중
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyStats.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(stat.month).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stat.total_todos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stat.completed_todos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stat.active_todos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
