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

const DoughnutChart = ({ facture, fetchAllFactures }) => {
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
            <button 
                onClick={fetchAllFactures} 
                style={{ 
                    backgroundColor: '#36A2EB', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FF6384'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#36A2EB'}
            >
                archive de toute les factures
            </button>
            <Doughnut data={chartData} />
        </div>
    );
};

export default DoughnutChart;
