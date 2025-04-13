import React from 'react';
import { Doughnut } from 'react-chartjs-2';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DoughnutChart = ({ facture }) => {
    const chartData = {
        labels: [' facture Payée ' + new Date().getFullYear(), 'facture Non payée ' + new Date().getFullYear()],
        datasets: [
            {
                data: facture,
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <div>
          
             
            
            <Doughnut data={chartData} />
        </div>
    );
};

export default DoughnutChart;
