import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const LineChartReport = ({ dataContents }) => {
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Income',
                data: [],
            },
            {
                name: 'Expenses',
                data: [],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false,
                },
            },
            markers: {
                size: 4,
            },
            colors: ['#012970', 'green'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.3,
                    opacityTo: 0.4,
                    stops: [0, 90, 100],
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            xaxis: {
                type: 'datetime',
                categories: [],
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        }
    });

    useEffect(() => {
        setChartData({
            series: [
                {
                    name: 'Income',
                    data: dataContents.incomes || [],
                },
                {
                    name: 'Expenses',
                    data: dataContents.expenses || [],
                },
            ],
            options: {
                ...chartData.options,
                xaxis: {
                    ...chartData.options.xaxis,
                    categories: dataContents.dates || [],
                },
            }
        });
    }, [dataContents]);

    return (
        <Chart
            options={chartData.options}
            series={chartData.series}
            type={chartData.options.chart.type}
            height={chartData.options.chart.height}
        />
    );
}

export default LineChartReport;
