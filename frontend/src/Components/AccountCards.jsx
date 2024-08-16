import React from 'react'
// import EditAccount from '../Components/EditAccount';
// import { useAuth } from '../Context/AuthContext';
// import axios from 'axios';

const AccountCards = ({ account }) => {

    // const { authUser } = useAuth();
    // const [accountDetails,setAccountDetails]=useState({})

    const maskAccountNumber = (accountNo) => {
        const lastFourDigits = accountNo.slice(-4);
        const maskedPart = accountNo.slice(0, -4).replace(/./g, 'x');
        return maskedPart + lastFourDigits;
    }

    // const handleAccountData = (accountNumber, userEmail) => {
    //     axios.get(`http://localhost:7026/api/Account/Account?accountNo=${accountNumber}&EmailId=${userEmail}`)
    //         .then((result) => {
    //             setAccountDetails(result.data)
    //         })
    //         .catch((err) => console.log(err))
    // }

    return (
        <>
            <div className="card me-3" style={{ width: "16rem" }}>
                <div className="card-body text-center">
                    <div className='card-logo-i'>
                        <i className="bi bi-bank"></i>
                    </div>
                    <h5 className="card-title">{account.bankName}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{maskAccountNumber(account.accountNo)}</h6>
                    <h6 className="card-subtitle mb-2 text-muted">{account.branchName}</h6>
                    <h5 className="card-subtitle mb-2 text-muted">Balance: ₹ {account.balance}</h5>
                </div>
                {/* <div onClick={()=>handleAccountData(account.accountNo,authUser.emailID)} data-bs-toggle="modal" data-bs-target="#editAccounts" style={{ padding: "0 10px 10px 15px" }} className="d-flex justify-content-end">
                    <i className="bi bi-pencil-square me-2" style={{ cursor: "pointer" }}></i>
                </div> */}
            </div>
            {/* <EditAccount accountData={accountDetails} userEmail={authUser.emailID}/> */}
        </>
    )
}

export default AccountCards
