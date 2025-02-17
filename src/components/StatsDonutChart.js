import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsDonutChart({ stats }) {
  const data = {
    labels: ["완료된 할 일", "진행중인 할 일"],
    datasets: [
      {
        data: [stats.completedTodos, stats.activeTodos],
        backgroundColor: [
          "rgba(34, 197, 94, 0.2)", // green-500
          "rgba(234, 179, 8, 0.2)", // yellow-500
        ],
        borderColor: [
          "rgb(34, 197, 94)", // green-500
          "rgb(234, 179, 8)", // yellow-500
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "할 일 현황",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="w-full max-w-md mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
