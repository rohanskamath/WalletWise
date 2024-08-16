
import React from 'react'

const TransactionComponent = (props) => {
    return (
        <>
            <div className="table-responsive mt-5">
                <table className="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th scope="col">Transaction ID</th>
                            <th scope="col">Transaction Date</th>
                            <th scope="col">Account Number</th>
                            <th scope="col">Amount (₹)</th>
                            <th scope="col">Transaction Type</th>
                            <th scope="col">Category</th>
                            <th scope="col">Remarks</th>
                            <th scope="col">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.users.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center" style={{ color: "grey", fontSize: "14px" }}>No Records Found</td>
                                </tr>
                            ) : (
                                props.users.map((transactions, index) => (
                                    <tr key={index}>
                                        <th scope="row">T100{transactions.transactionId}</th>
                                        <td>{transactions.formattedDate}</td>
                                        <td>{transactions.accountNo}</td>
                                        <td>{transactions.amount}</td>
                                        <td>{transactions.type}</td>
                                        <td>
                                            {transactions.type === "Expense" ? transactions.categoryName : "N/A"}
                                        </td>
                                        <td>{transactions.remarks}</td>
                                        <td>{transactions.newBalance}</td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TransactionComponent
