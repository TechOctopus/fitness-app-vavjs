import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { regressionLine } from "../helpers/regression";

ChartJS.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph({ rawData }) {
  const dates = [];
  const values = [];

  rawData.forEach((record) => {
    dates.push(record.date);
    values.push(Number(record.value));
  });

  return (
    <Line
      data={{
        labels: dates,
        datasets: [
          {
            label: "Values",
            data: values,
            borderColor: "#16a34a",
            fill: false,
          },
          {
            label: "Linear Regression",
            data: regressionLine(dates, values),
            borderColor: "#dc2626",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Statistics",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Dates",
            },
          },
          y: {
            title: {
              display: true,
              text: "Values",
            },
          },
        },
      }}
    />
  );
}
