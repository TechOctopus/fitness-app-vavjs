import React from "react";
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

ChartJS.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Function to calculate linear regression (y = mx + b)
const calculateLinearRegression = (dates, values) => {
  const n = dates.length;
  const xValues = dates.map((_, i) => i); // Convert dates to sequential x-coordinates

  const xSum = xValues.reduce((sum, x) => sum + x, 0);
  const ySum = values.reduce((sum, y) => sum + y, 0);
  const xySum = xValues.reduce((sum, x, i) => sum + x * values[i], 0);
  const xSquaredSum = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;

  const regressionLine = xValues.map((x) => slope * x + intercept);
  return regressionLine;
};

const Graph = ({ rawData }) => {
  const data = rawData.map((point) => ({
    date: point.date,
    value: Number(point.value),
  }));

  const dates = data.map((point) => point.date);
  const values = data.map((point) => point.value);

  const regressionLine = calculateLinearRegression(dates, values);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Original Data",
        data: values,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        fill: false,
      },
      {
        label: "Linear Regression",
        data: regressionLine,
        borderColor: "red",
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Linear Regression Chart",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Graph;
