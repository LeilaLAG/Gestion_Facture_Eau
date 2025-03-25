import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({lastClientBillsConsomation , lastClientBillsDate , page, clients , factures}) => {

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

     else if(page==="home"){
      data = {
        labels: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        ,
        datasets: [
          {
            label: "les clients creer par mois",
            data: clients,
            backgroundColor: "rgba(26, 141, 218, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
     }

     else if(page==="factureHome"){
      data = {
        labels: ["Payé", "Non Payé", ]
        ,
        datasets: [
          {
            label: "les factures payé Non payé",
            data: factures,
            backgroundColor: "rgba(26, 141, 218, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
     }

  return <Bar data={data} options={options} />;
};

export default BarChart;
