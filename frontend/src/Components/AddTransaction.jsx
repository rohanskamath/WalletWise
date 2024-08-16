import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const AddTransaction = () => {
    const [transactionDetails, setTransactionDetails] = useState({
        transactionType: "",
        transactionDate: new Date().toISOString().split('T')[0],
        tCategory: "",
        bAccount: "",
        remarks: "",
        amount: 0
    })
    const { authUser } = useAuth();
    const [errors, setErrors] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (authUser && authUser.emailID) {
            axios.get(`http://localhost:7026/api/CatMapUsers/${authUser.emailID}`)
                .then((result) => {
                    if (result.status === 200) {
                        setCategories(result.data);
                    } else if (result.status === 202) {
                        setCategories([])
                    }
                })
                .catch(err => console.log(err));

            axios.get(`http://localhost:7026/api/Account/AllAccounts?EmailId=${encodeURIComponent(authUser.emailID)}`)
                .then((result) => {
                    setAccounts(result.data)
                })
                .catch(err => console.log(err))
        }

    }, [authUser,]);

    const validateForm = () => {
        const newErrors = {};
        if (!transactionDetails.transactionType) {
            newErrors.transactionType = "* Transaction type is required";
        }
        if (!transactionDetails.transactionDate) {
            newErrors.transactionDate = "* Transaction Date is required";
        }
        if (transactionDetails.transactionType === "Expense" && !transactionDetails.tCategory) {
            newErrors.tCategory = "* Category is required for expense mode";
        }
        if (!transactionDetails.bAccount) {
            newErrors.bAccount = "* Bank account is required";
        }
        if (!transactionDetails.amount) {
            newErrors.amount = "* Amount are required";
        }
        if (!transactionDetails.remarks) {
            newErrors.remarks = "* Remarks are required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const autoCloseClick = () => {
        closeButtonRef.current.click();
    }

    const HandleCloseTransaction = () => {
        setErrors({});
        setTransactionDetails({
            transactionType: "",
            transacionDate: "",
            tCategory: "",
            bAccount: "",
            remarks: "",
            amount: 0
        })
    }

    const handleSubmitBtn = () => {
        if (validateForm()) {
            if (transactionDetails.transactionType === "Income") {
                const incomeTransaction = {
                    incomeDate: transactionDetails.transactionDate,
                    amount: transactionDetails.amount,
                    remarks: transactionDetails.remarks,
                    accountNo: transactionDetails.bAccount,
                    emailId: authUser.emailID
                }
                axios.post("http://localhost:7026/api/Income", incomeTransaction)
                    .then((result) => {
                        if (result.status === 201) {
                            toast.success("Income Transaction Added Successfully", {
                                theme: "dark",
                                autoClose: 1000,
                            });
                            setTransactionDetails({
                                transactionType: "",
                                transacionDate: "",
                                tCategory: "",
                                bAccount: "",
                                remarks: "",
                                amount: 0
                            })
                        } else if (result.status === 200) {
                            toast.error(result.data, {
                                theme: "dark",
                                autoClose: 1000,
                            });
                        }
                    })
                    .catch((err) => console.log(err))
            } else {
                const expenseTransaction = {
                    expenseDate: transactionDetails.transactionDate,
                    categoryId: transactionDetails.tCategory,
                    amount: transactionDetails.amount,
                    remarks: transactionDetails.remarks,
                    accountNo: transactionDetails.bAccount,
                    emailId: authUser.emailID
                }

                axios.post("http://localhost:7026/api/Expense", expenseTransaction)
                    .then((result) => {
                        if (result.status === 201) {
                            toast.success("Expense Transaction Added Successfully", {
                                theme: "dark",
                                autoClose: 1000,
                            });
                            setTransactionDetails({
                                transactionType: "",
                                transacionDate: "",
                                tCategory: "",
                                bAccount: "",
                                remarks: "",
                                amount: 0
                            })
                            autoCloseClick();
                        } else {
                            toast.error(result.data, {
                                theme: "dark",
                                autoClose: 1000,
                            });
                        }
                    })
                    .catch((err) => console.log(err))
            }
        }
    }
    return (
        <>
            <div className="modal fade" id="addTransactionsModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="addTransactionsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addTransactionsModalLabel">Add Transactions</h1>
                            <button ref={closeButtonRef} type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" onClick={HandleCloseTransaction}></button>
                        </div>
                        <div className="modal-body">

                            <div className="input-group mb-2">
                                <label className="input-group-text" htmlFor="transactionMode"><i className="bi bi-list-stars"></i></label>
                                <select className="form-select shadow-none" id="transactionMode" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} value={transactionDetails.transactionType} onChange={(e) => setTransactionDetails({ ...transactionDetails, transactionType: e.target.value })}>
                                    <option value="">Choose your transaction mode</option>
                                    <option value="Income">Income Mode</option>
                                    <option value="Expense">Expense Mode</option>
                                </select>
                            </div>
                            {errors.transactionType && <div className="validations mb-2">{errors.transactionType}</div>}

                            <div className="input-group mb-2">
                                <span className="input-group-text" id="tDate"><i className="bi bi-calendar2-check"></i></span>
                                <input type="date" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" aria-describedby="tDate" value={transactionDetails.transactionDate} onChange={(e) => setTransactionDetails({ ...transactionDetails, transactionDate: e.target.value })} />
                            </div>
                            {errors.transactionDate && <div className="validations mb-2">{errors.transactionDate}</div>}

                            {transactionDetails.transactionType === "Expense" && (
                                <>
                                    <div className="input-group mb-2">
                                        <label className="input-group-text" htmlhtmlFor="category"><i className="bi bi-bookmark-star"></i></label>
                                        <select className="form-select shadow-none" id="category" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} value={transactionDetails.tCategory} onChange={(e) => setTransactionDetails({ ...transactionDetails, tCategory: e.target.value })}>
                                            <option value="">Choose your category</option>
                                            {
                                                categories.map((items, index) => {
                                                    return (
                                                        <option key={index} value={items.categoryId}>{items.catName}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    {errors.category && <div className="validations mb-2">{errors.category}</div>}
                                </>

                            )}

                            <div className="input-group mb-2">
                                <label className="input-group-text" htmlFor="accounts"><i className="bi bi-bank"></i></label>
                                <select className="form-select shadow-none" id="accounts" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} value={transactionDetails.bAccount} onChange={(e) => setTransactionDetails({ ...transactionDetails, bAccount: e.target.value })}>
                                    <option value="">Choose your bank account</option>
                                    {
                                        accounts.map((items, index) => {
                                            return (
                                                <option key={index} value={items.accountNo}>{items.bankName}-{items.accountNo}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            {errors.bAccount && <div className="validations mb-2">{errors.bAccount}</div>}

                            <div className="input-group mb-2">
                                <span className="input-group-text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}><i className="bi bi-cash-coin"></i></span>
                                <input type="text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" placeholder="Enter amount" value={transactionDetails.amount} onChange={(e) => { setTransactionDetails({ ...transactionDetails, amount: e.target.value }) }} />
                            </div>
                            {errors.amount && <div className="validations mb-2">{errors.amount}</div>}

                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1"><i className="bi bi-info-circle-fill"></i></span>
                                <textarea className="form-control shadow-none" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} placeholder="Leave your remarks here" id="floatingTextarea" value={transactionDetails.remarks} onChange={(e) => setTransactionDetails({ ...transactionDetails, remarks: e.target.value })}></textarea>
                            </div>
                            {errors.remarks && <div className="validations mb-2">{errors.remarks}</div>}

                            <div className="form-group">
                                <button type="button" style={{ marginBottom: "20px", width: "100%", backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={handleSubmitBtn}>Save Changes</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTransaction
