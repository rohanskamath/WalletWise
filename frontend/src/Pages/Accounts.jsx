import React, { useEffect, useState } from 'react'
import AccountCards from '../Components/AccountCards'
import AddAccount from '../Components/AddAccount'
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Accounts = () => {
    const { authUser } = useAuth();
    const [myAccount, setMyAccount] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:7026/api/Account/AllAccounts?EmailId=${encodeURIComponent(authUser.emailID)}`)
            .then((result) => {
                setMyAccount(result.data)
            })
            .catch(err => console.log(err))
    })
    return (
        <>
            <ToastContainer />
            <main id="main" className='main'>
                <div className='pagetitle'>
                    <h1>My Accounts</h1>
                </div>
                <div style={{ marginLeft: "-2rem" }} className='d-flex flex-wrap justify-content-evenly mt-3'>
                    {myAccount.map((account, index) => (
                        <AccountCards key={index} account={account} />
                    ))}
                    <div data-bs-toggle="modal" data-bs-target="#addAccounts" className="card me-3" style={{ width: "16rem", border: "2px dotted #012970", cursor: "pointer" }}>
                        <div className="card-body d-flex justify-content-center align-items-center" style={{ height: "10rem" }}>
                            <i className="bi bi-plus-lg" style={{ fontSize: "3rem", color: "#012970" }}></i>
                        </div>
                    </div>
                </div>
                <AddAccount />
            </main>
        </>
    )
}

export default Accounts
