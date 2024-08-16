import React, { useEffect, useState } from 'react';
import BudgetChart from '../Components/Charts/BudgetChart';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import PieChartReport from '../Components/Charts/PieChartReport';

const Main = () => {
    const [myCategory, setMyCategory] = useState([]);
    const [myRecentTransactions, setMyRecentTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [expense, setExpense] = useState(0);
    const [income, setIncome] = useState(0);
    const { authUser } = useAuth();
    const [categoryData, setCategoryData] = useState({})

    useEffect(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        if (authUser && authUser.emailID) {
            axios.get(`http://localhost:7026/api/CatMapUsers/${authUser.emailID}`)
                .then((result) => {
                    if (result.status === 200) {
                        setMyCategory(result.data);
                    } else if (result.status === 202) {
                        setMyCategory([])
                    }
                })
                .catch(err => console.log(err));

            axios.get(`http://localhost:7026/api/Transaction/${authUser.emailID}`)
                .then((result) => {
                    if (result.status === 200) {
                        setMyRecentTransactions(result.data);
                    } else if (result.status === 202) {
                        setMyRecentTransactions([])
                    }
                })
                .catch(err => console.log(err))

            axios.get(`http://localhost:7026/api/Account/balance/${authUser.emailID}`)
                .then((result) => {
                    if (result.status === 200) {
                        setBalance(result.data);
                    } else if (result.status === 202) {
                        setBalance(0)
                    }
                })
                .catch((err) => console.log(err))

            axios.get(`http://localhost:7026/api/Analytics/total-expense-by-month?email=${encodeURIComponent(authUser.emailID)}&year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`)
                .then((result) => {
                    if (result.status === 200) {
                        setExpense(result.data);
                    } else if (result.status === 202) {
                        setExpense(0);
                    }
                })
                .catch((err) => console.log(err))

            axios.get(`http://localhost:7026/api/Analytics/total-income-by-month?email=${encodeURIComponent(authUser.emailID)}&year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`)
                .then((result) => {
                    if (result.status === 200) {
                        setIncome(result.data);
                    } else if (result.status === 202) {
                        setIncome(0);
                    }
                })
                .catch((err) => console.log(err))

            axios.get(`http://localhost:7026/api/Analytics/total-expense-by-category-this-month?email=${encodeURIComponent(authUser.emailID)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`)
                .then((result) => {
                    if (result.status === 200) {
                        setCategoryData(result.data);
                    } else if (result.status === 202) {
                        setCategoryData({});
                    }
                })
                .catch((err) => console.log(err))
        }

    }, [authUser]);

    return (
        <>
            <ToastContainer />
            <main id="main" className='main'>
                <div className='pagetitle'>
                    <h1>Dashboard</h1>
                </div>
                <section className='dashboard section'>
                    <div className='row'>
                        {/* Left Side Starts */}
                        <div className="col-lg-8">
                            <div className="row">
                                {/* Overall Card Amounts Starts */}
                                <div className='col-xxl-4 col-md-4'>
                                    <div className='card info-card sales-card'>
                                        <div className='card-body'>
                                            <h5 className='card-title'>Balance</h5>

                                            <div className='d-flex align-items-center'>
                                                <div className='card-icon rounded-circle d-flex align-items-center justify-content-center'>
                                                    <i className='bi bi-wallet2' />
                                                </div>
                                                <div className='ps-2'>
                                                    <h5 style={{ fontFamily: "Roboto, sans-serif" }}>&#8377; {balance}.0</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-xxl-4 col-md-4'>
                                    <div className='card info-card sales-card'>
                                        <div className='card-body'>
                                            <h5 className='card-title'>Income</h5>

                                            <div className='d-flex align-items-center'>
                                                <div className='card-icon rounded-circle d-flex align-items-center justify-content-center'>
                                                    <i className='bi bi-cash-stack' />
                                                </div>
                                                <div className='ps-2'>
                                                    <h5 style={{ fontFamily: "Roboto, sans-serif" }}>&#8377;<span style={{ color: "green" }}> {income}.0</span></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-xxl-4 col-md-4'>
                                    <div className='card info-card sales-card'>
                                        <div className='card-body'>
                                            <h5 className='card-title'>Expense</h5>

                                            <div className='d-flex align-items-center'>
                                                <div className='card-icon rounded-circle d-flex align-items-center justify-content-center'>
                                                    <i className='bi bi-cash' />
                                                </div>
                                                <div className='ps-2'>
                                                    <h5 style={{ fontFamily: "Roboto, sans-serif" }}>&#8377;<span style={{ color: "red" }}> {expense}.0</span></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Overall Card Amounts Ends */}

                                {/* Bar Chart Starts */}
                                <div className='col-12'>
                                    <div className='card'>
                                        <div className="card-body pb-0">
                                            <h5 className='card-title mb-4'>This Month's Expenses</h5>
                                            {
                                                categoryData && categoryData.length > 0 ? (
                                                    <BudgetChart data={categoryData} />
                                                ) : (
                                                    <p className='text-center' style={{ color: "grey", fontSize: "14px" }}>No Records Found</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* Bar Chart Ends */}
                            </div>
                        </div>
                        {/* Left Side Ends */}

                        {/* Right Side Starts */}
                        <div className="col-lg-4">

                            {/* My Category Starts */}
                            <div className="card recent-sales">
                                <div className='card-body'>
                                    <h5 className='card-title mb-4'>My Expense Categories</h5>
                                    {myCategory.length === 0 ? (
                                        <p className='text-center' style={{ color: "grey", fontSize: "14px" }}>No Records Found</p>
                                    ) : (
                                        <div className="row">
                                            <div className="col">
                                                {myCategory.map((category, index) => (
                                                    <span key={index} className="badge background-badge text-badge me-2">{category.catName}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* My Category Ends */}

                            {/* Recent Transaction Starts */}
                            <div className="card recent-sales">
                                <div className='card-body'>
                                    <h5 className='card-title mb-4'>Recent Transactions</h5>
                                    <div className='activity'>
                                        {
                                            myRecentTransactions.length === 0 ? (
                                                <p className='text-center' style={{ color: "grey" }}>No Records Found</p>
                                            ) : (
                                                myRecentTransactions.slice(0, 5).map((transaction, index) => (
                                                    <div className="activity-item d-flex">
                                                        <div className='activite-label'>{transaction.type}</div>
                                                        <i className='bi bi-circle-fill activity-badge align-self-start' ></i>
                                                        <div className='activity-content'><span style={{ color: transaction.type === "Expense" ? "red" : "green" }}>&#8377; {transaction.amount}</span> - {transaction.type === "Income" ? <span style={{ color: "grey", fontSize: "12px" }}>{transaction.remarks}</span> : <span style={{ color: "grey", fontSize: "12px" }}>{transaction.categoryName}</span>}</div>
                                                    </div>
                                                ))
                                            )}
                                    </div>
                                </div>
                            </div>
                            {/* Recent Transaction Ends */}

                            <div className='card'>
                                <div className="card-body pb-0">
                                    <h5 className='card-title mb-4'>This Month's Overall Report</h5>
                                    {
                                        expense === 0 && income === 0 ? (
                                            <p className='text-center' style={{ color: "grey", fontSize: "14px" }}>No Records Found</p>
                                        ) : (
                                            <PieChartReport balanceValue={balance} expenseValue={expense} incomeValue={income} />
                                        )
                                    }
                                </div>
                            </div>

                        </div>
                        {/* Right Side Ends */}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Main;
