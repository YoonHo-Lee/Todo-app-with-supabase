import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function TodoCalendar({
  selectedDate,
  onDateChange,
  dailyStats,
  getSelectedDateStats,
  onMonthChange,
}) {
  console.log("dailyStats", dailyStats);
  const tileContent = ({ date }) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const dateStr = localDate.toISOString().split("T")[0];
    const stats = dailyStats[dateStr];

    return (
      <div className="flex flex-col items-center mt-1 p-1 min-h-[4.5rem]">
        {stats ? (
          <>
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-gray-500">전체</span>
              <span className="font-medium text-blue-600">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-gray-500">완료</span>
              <span className="font-medium text-green-600">
                {stats.completed}
              </span>
            </div>
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-gray-500">진행</span>
              <span className="font-medium text-red-600">{stats.active}</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full"></div>
        )}
      </div>
    );
  };

  const tileClassName = ({ date }) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const dateStr = localDate.toISOString().split("T")[0];
    const stats = dailyStats[dateStr];

    if (!stats) return "";

    if (stats.completed === stats.total && stats.total > 0) {
      return "bg-green-50";
    } else if (stats.active > 0) {
      return "bg-red-50";
    }
    return "";
  };

  const handleMonthChange = (activeStartDate) => {
    if (onMonthChange) {
      onMonthChange(activeStartDate);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border [&_.react-calendar__tile]:cursor-default [&_.react-calendar__tile--active]:!bg-blue-100 [&_.react-calendar__tile--active]:!text-blue-300 [&_.react-calendar__tile--now]:!bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">일별 통계</h2>
      <div className="w-full">
        <Calendar
          value={selectedDate}
          tileContent={tileContent}
          className="!w-full mx-auto border-0"
          calendarClassName="w-full"
          tileClassName={({ date }) =>
            `${tileClassName({ date })} w-full flex-1 max-w-none`
          }
          onClickDay={() => {}}
          onChange={() => {}}
          onActiveStartDateChange={({ activeStartDate }) =>
            handleMonthChange(activeStartDate)
          }
        />
      </div>
      <div className="mt-4 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-50 border border-green-200"></div>
          <span>완료</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-50 border border-red-200"></div>
          <span>진행중</span>
        </div>
      </div>
    </div>
  );
}
