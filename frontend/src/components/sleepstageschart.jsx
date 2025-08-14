import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  animation: { animateRotate: true, duration: 1200 },
};

const SleepStagesChart = ({ stages, asleepHours }) => {
  const calcTimeFromPercent = (percent) => {
    const timeInHours = (percent / 100) * asleepHours;
    const h = Math.floor(timeInHours);
    const m = Math.round((timeInHours - h) * 60);
    return `${h}h ${m}min`;
  };

  const chartData = [
    { label: "Awake",       value: stages.awake, time: calcTimeFromPercent(stages.awake), color: "#FAD85D" },
    { label: "Light sleep", value: stages.light, time: calcTimeFromPercent(stages.light), color: "#4A90E2" },
    { label: "Deep sleep",  value: stages.deep,  time: calcTimeFromPercent(stages.deep),  color: "#C66AC0" },
  ];

  return (
    <div className="sleep-stages-chart">
      {chartData.map((stage, i) => {
        const data = {
          labels: [stage.label],
          datasets: [
            {
              data: [stage.value, 100 - stage.value],
              backgroundColor: [stage.color, "#A2A0A0"],
              borderWidth: 0,
            },
          ],
        };

        return (
          <div key={i} className="chart-block">
            <div className="label">{stage.label}</div>
            <div className="chart-wrapper">
              <Pie data={data} options={options} />
            </div>
            <div className="metrics">
              <div className="percent">{stage.value}%</div>
              <div className="time">{stage.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SleepStagesChart;
