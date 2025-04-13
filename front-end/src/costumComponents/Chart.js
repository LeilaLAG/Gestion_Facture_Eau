import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale, // For category (x-axis) scaling
  LinearScale, // For linear (y-axis) scaling
  BarElement, // For bar charts
  ArcElement, // For pie/doughnut charts (arcs)
  Title, // For chart titles
  Tooltip, // For tooltips
  Legend // For legends
);

export const BarChart = ({
  lastClientBillsConsomation,
  lastClientBillsDate,
  page,
  caisse,
  height,
}) => {
  let data = {};
  let options = {};

  if (page === "printBill") {
    data = {
      labels: lastClientBillsDate,
      datasets: [
        {
          label: "Consomation monsuelle en m³",
          data: lastClientBillsConsomation,
          backgroundColor: "rgba(26, 141, 218, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
    };
  } else if (page === "caisse") {
    data = {
      labels: ["revenus", "charges", "facture payées", "facture non payées"],
      datasets: [
        {
          data: caisse,
          backgroundColor: [
            "rgba(150, 195, 44, 0.8)",
            "rgba(249, 173, 143, 0.8)",
            "rgba(107, 110, 243, 0.8)",
            "rgba(227, 64, 64, 0.8)",
          ],
          borderColor: "rgb(81, 112, 112)",
          borderWidth: 1,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: page === "caisse" ? { display: false } : { position: "top" },
      },
    };
  }

  return <Bar height={height} data={data} options={options} />;
};

export const PieChart = ({ page, allRevenu }) => {
  let data = {};
  let options = {};

  if (page === "caisse") {
    data = {
      labels: ["revenus", "facture payées"],
      datasets: [
        {
          data: allRevenu,
          backgroundColor: [
            "rgba(150, 195, 44, 0.8)",
            "rgba(107, 110, 243, 0.8)",
          ],
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
    };
  }

  return <Pie data={data} options={options} />;
};
