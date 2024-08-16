import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [showOtp, setShowOtp] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [otp, setOtp] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('')
    const [newCPassword, setNewCPassword] = useState('')
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewCPassword, setShowNewCPassword] = useState(false);

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendCodeBtn = () => {
        const newOtp = generateOtp();
        setGeneratedOtp(newOtp);

        axios.post('http://localhost:5000/send_recovery_email', {
            userEmail: email,
            OTP: newOtp,
        })
            .then(response => {
                setShowOtp(true);
                setSeconds(60);
                setIsOtpSent(true);
                setShowPasswordFields(false);
                setMessage({ text: 'OTP has been sent to your email!', type: 'success' });
            })
            .catch(error => {
                console.log('Error sending OTP', error);
                setMessage({ text: 'Error sending OTP. Please try again.', type: 'error' });
            });
    };

    const verifyOtpBtn = () => {
        if (otp === generatedOtp) {
            setIsOtpVerified(true);
            setShowPasswordFields(true);
            setMessage({ text: 'Valid OTP...Reset your password', type: 'success' });
        } else {
            setMessage({ text: 'Invalid OTP!..Resend the code again', type: 'error' });
        }
    };

    const handleChangePassword = () => {
        if (newPassword !== newCPassword) {
            setMessage({ text: 'Passwords do not match!', type: 'error' });
            return;
        }

        if (!newPassword || !newCPassword) {
            setMessage({ text: 'Password fields cannot be empty!', type: 'error' });
            return;
        }
        const updatedPassword = {
            emailId: email,
            password: newPassword
        }
        axios.put("http://localhost:7026/api/UserAuth/ChangePassword",updatedPassword)
            .then((result) => {
                if (result.status === 202) {
                    toast.success("password updated Successfully", {
                        theme: "dark",
                        autoClose: 1000,
                    });
                    setTimeout(()=>{
                        window.location.href = "/";
                    },2000)

                }
            })
            .catch((err) => console.log(err))
    };

    useEffect(() => {
        let timer;
        if (showOtp && seconds > 0) {
            timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [showOtp, seconds]);

    return (
        <>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Account Recovery</h1>
                            <button type="button" className="btn-close visually-hidden shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {message.text && (
                                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert" style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }}>
                                    {message.text}
                                </div>
                            )}
                            {!showPasswordFields && (
                                <>
                                    <label style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px", marginLeft: "2px" }} htmlFor="emailChange" className="form-label">Enter your email to change your password</label>
                                    <input style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} type="email" className="form-control shadow-none mb-3" id="emailChange" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <div className="form-group">
                                        <button type="button" style={{ marginBottom: "20px", width: "100%", backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={sendCodeBtn}>{isOtpSent && seconds === 0 ? 'Resend Code' : 'Send Code'}</button>
                                    </div>
                                    {showOtp && (
                                        <div className="form-group">
                                            <div className='d-flex justify-content-between'>
                                                <label style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px", marginLeft: "2px" }} htmlFor="otpInput" className="form-label">Enter OTP</label>
                                                <div style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }}>Time remaining: {seconds} seconds</div>
                                            </div>
                                            <input style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} type="number" className="form-control shadow-none mb-3" id="otpInput" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                            <button type="button" style={{ width: "100%", backgroundColor: '#28a745', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={verifyOtpBtn} disabled={seconds === 0 || isOtpVerified}>Verify OTP</button>
                                        </div>
                                    )}
                                </>
                            )}
                            {showPasswordFields && (
                                <div className="form-group">
                                    <label style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px", marginLeft: "2px" }} htmlFor="newPassword" className="form-label">New Password</label>
                                    <div className="input-group mb-3">
                                        <input style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} type={showNewPassword ? "text" : "password"} className="form-control shadow-none" id="newPassword" placeholder='Enter new password' autoComplete='off' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                        <span className="input-group-text" style={{ cursor: "pointer", fontSize: "13px" }} onClick={() => setShowNewPassword(!showNewPassword)}>
                                            {showNewPassword ? (
                                                <i className="bi bi-eye-slash-fill"></i>
                                            ) : (
                                                <i className="bi bi-eye-fill"></i>
                                            )}
                                        </span>
                                    </div>
                                    <label style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px", marginLeft: "2px" }} htmlFor="confirmPassword" className="form-label">Confirm Password</label>

                                    <div className="input-group mb-3">
                                        <input style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} type={showNewCPassword ? "text" : "password"} className="form-control shadow-none" id="confirmPassword" placeholder='Confirm your new password' autoComplete='off' value={newCPassword} onChange={(e) => setNewCPassword(e.target.value)} required />
                                        <span className="input-group-text" style={{ cursor: "pointer", fontSize: "13px" }} onClick={() => setShowNewCPassword(!showNewCPassword)}>
                                            {showNewCPassword ? (
                                                <i className="bi bi-eye-slash-fill"></i>
                                            ) : (
                                                <i className="bi bi-eye-fill"></i>
                                            )}
                                        </span>
                                    </div>

                                    <button type="button" style={{ width: "100%", backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={handleChangePassword}>Change password</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
