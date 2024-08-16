import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const BudgetChart = (props) => {
    return (
        <>
            <div className='p-4'>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={props.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="key" tick={{ fontFamily: '"Merriweather", sans-serif' }} />
                        <YAxis tick={{ fontFamily: '"Merriweather", sans-serif' }} label={{ value: "Amount (₹)", angle: -90, position: 'insideLeft',style: { fontFamily: '"Merriweather", sans-serif'  } }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#00C49F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

export default BudgetChart;
