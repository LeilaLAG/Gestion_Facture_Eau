import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({lastClientBillsConsomation , lastClientBillsDate , page , caisse}) => {

    let data = {}
    let options = {}

    if(page==="printBill"){
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
        
    }

    else if(page==="caisse"){
      data = {
        labels: ['revenus' , "charges" , "facture payées" , "facture non payées"],
        datasets: [
          {
            data: caisse,
            backgroundColor: ["rgba(190, 228, 101, 0.8)" , "rgba(249, 173, 143, 0.8)" , "rgba(94, 204, 100, 0.8)" , "rgba(227, 64, 64, 0.8)"],
            borderColor: "rgb(81, 112, 112)",
            borderWidth: 1,
          },
        ],
      };
    
      options = {
        responsive: true,
        plugins: {
          legend: page==="caisse" ? {display : false} : { position: "top" },
        },
      };
    }

  return <Bar data={data} options={options} />;
};

export default BarChart;
