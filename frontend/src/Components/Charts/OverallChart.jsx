import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const OverallChart = (props) => {
    useEffect(() => {
        echarts.init(document.querySelector('#overallTracker')).setOption({
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontFamily: '"Merriweather", sans-serif'
                },
            },
            legend: {
                top: '5%',
                left: 'center',
                textStyle: {
                    fontFamily: '"Merriweather", sans-serif'
                },
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ["50%", "70%"],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: "center",
                        textStyle: {
                            fontFamily: '"Merriweather", sans-serif'
                        },
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: "10",
                            fontWeight: 'bold',
                            textStyle: {
                                fontFamily: '"Merriweather", sans-serif'
                            },
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: [
                        {
                            value: props.expenseValue,
                            name: 'Expense',
                        },
                        {
                            value: props.incomeValue,
                            name: 'Income',
                        },
                    ],
                },
            ],
        });
    })
    return (
        <>
            <div id="overallTracker" className='echart' style={{ minHeight: '312px' }}></div>
        </>
    );
}

export default OverallChart;
