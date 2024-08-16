import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PieChartReport = (props) => {
    const data = [
        { name: 'Expense', value: props.expenseValue },
        { name: 'Income', value: props.incomeValue },
        { name: 'Balance', value: props.balanceValue }
    ];

    const COLORS = ['#00C49F','#012970', '#FFBB28'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                <Legend layout="horizontal" verticalAlign="top"  wrapperStyle={{ fontFamily: '"Merriweather", sans-serif' }} />
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: '"Merriweather", sans-serif' }}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PieChartReport;
