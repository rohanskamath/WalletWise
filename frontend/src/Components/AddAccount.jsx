import React, { useRef, useState } from 'react'
import { useAuth } from '../Context/AuthContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const AddAccount = () => {
    const { authUser } = useAuth();
    const [userBankDetails, setUserBankDetails] = useState({
        accountNo: "",
        bankName: "",
        branchName: "",
        balance: 0,
        emailID: authUser.emailID
    })
    const [errors, setErrors] = useState({})

    const closeButtonRef = useRef(null);

    const autoCloseClick = () => {
        closeButtonRef.current.click();
    }

    const validateBankName = () => {
        const bankNameError = {};
        if (userBankDetails.bankName.trim() === "") {
            bankNameError.bankErrMsg = "* Bank name field is required";
            setErrors(bankNameError)
            return false;
        }
        setErrors({});
        return true;
    };

    const validateBranchName = () => {
        const branchNameError = {};
        if (userBankDetails.branchName.trim() === "") {
            branchNameError.branchErrMsg = "* Branch name field is required";
            setErrors(branchNameError)
            return false;
        }
        setErrors({});
        return true;
    };

    const HandleCloseAccount = () => {
        setErrors({});
        setUserBankDetails({
            accountNo: "",
            bankName: "",
            branchName: "",
            balance: 0,
        })
    }

    const validateAccNo = () => {
        const accoNoError = {};
        const accountNoRegex = /^\d{11,16}$/;

        if (userBankDetails.accountNo.trim() === "") {
            accoNoError.accnoErrMsg = "* Account number field is required";
            setErrors(accoNoError);
            return false;
        } else if (!accountNoRegex.test(userBankDetails.accountNo)) {
            accoNoError.accnoErrMsg = "* Account number must be between 11 to 16 digits";
            setErrors(accoNoError);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleAccountBtn = () => {
        if (!validateBankName() || !validateAccNo() || !validateBranchName()) {
            return;
        }
        axios.post("http://localhost:7026/api/Account/", userBankDetails)
            .then((result) => {
                if (result.status === 200) {
                    toast.success("Account added successfully", {
                        theme: "dark",
                        autoClose: 1000,
                    });
                    setUserBankDetails({
                        accountNo: "",
                        bankName: "",
                        branchName: "",
                        balance: 0,
                    })
                    autoCloseClick();
                } else {
                    toast.error(result.data, {
                        theme: "dark",
                        autoClose: 1000,
                    });
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <div className="modal fade" id="addAccounts" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Account</h1>
                            <button ref={closeButtonRef} type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" onClick={HandleCloseAccount}></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <span className="input-group-text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}><i className="bi bi-bank2"></i></span>
                                <input type="text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" placeholder="Enter bank name" value={userBankDetails.bankName} onChange={(e) => { setUserBankDetails({ ...userBankDetails, bankName: e.target.value }) }} />
                            </div>
                            {errors.bankErrMsg && <div className="validations" style={{ color: 'red' }}>{errors.bankErrMsg}</div>}

                            <div className="input-group mt-2">
                                <span className="input-group-text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}><i className="bi bi-person-vcard"></i></span>
                                <input type="text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" placeholder="Enter account number" value={userBankDetails.accountNo} onChange={(e) => { setUserBankDetails({ ...userBankDetails, accountNo: e.target.value }) }} />
                            </div>
                            {errors.accnoErrMsg && <div className="validations" style={{ color: 'red' }}>{errors.accnoErrMsg}</div>}

                            <div className="input-group mt-2">
                                <span className="input-group-text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}><i className="bi bi-safe2"></i></span>
                                <input type="text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" placeholder="Enter branch name" value={userBankDetails.branchName} onChange={(e) => { setUserBankDetails({ ...userBankDetails, branchName: e.target.value }) }} />
                            </div>
                            {errors.branchErrMsg && <div className="validations" style={{ color: 'red' }}>{errors.branchErrMsg}</div>}

                            <div className="input-group mt-2">
                                <span className="input-group-text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}><i className="bi bi-cash-coin"></i></span>
                                <input type="text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" placeholder="Enter balance amount" value={userBankDetails.balance} onChange={(e) => { setUserBankDetails({ ...userBankDetails, balance: e.target.value }) }} />
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                                <button type="button" style={{ backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={handleAccountBtn}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddAccount
