import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ForgotPassword from './ForgotPassword';

const Login = () => {
    const { setIsLoggedIn, setAuthUser } = useAuth();
    const closeButtonRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const autoCloseClick = () => {
        closeButtonRef.current.click();
    }

    const [userData, setUserData] = useState({
        fullname: "",
        email: "",
        password: "",
        cpassword: "",
        occupation: "",
        showPassword: false,
        showCPassword: false
    });
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        showPassword: false
    })
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData({ ...userData, [id]: value });
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            try {
                window.sessionStorage.setItem('authUser', JSON.stringify(jwtDecode(token)));
                setAuthUser(jwtDecode(token));
                setIsLoggedIn(true);
                navigate('/')
                window.location.reload(true);

            } catch (error) {
                console.error("Invalid token", error);
                toast.error("Invalid token", {
                    theme: "dark",
                    autoClose: 3000,
                });
            }
        }
    }, [location, setAuthUser, setIsLoggedIn, navigate]);

    const validateEmail = (email) => {
        const newEmailErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newEmailErrors.email = 'Email Field is required';
        } else if (email && !emailPattern.test(email)) {
            newEmailErrors.email = 'Invalid format';
        }
        setErrors(newEmailErrors)
        return !newEmailErrors.email;
    }

    const validatePassword = (password) => {
        const newPasswordErrors = {};
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!password) {
            newPasswordErrors.password = 'Password Field is required';
        } else if (password && !passwordPattern.test(password)) {
            newPasswordErrors.password = 'Password must contain alphanumeric characters, at least one special character, and be more than 8 characters long';
        }
        setErrors(newPasswordErrors)
        return !newPasswordErrors.password;
    }

    const validateOccupation = (occupation) => {
        const newOccupationErrors = {}
        if (!occupation) {
            newOccupationErrors.occupation = 'Occupation Field is required';
        }
        setErrors(newOccupationErrors)
        return !newOccupationErrors.occupation;
    }

    const validateFullname = (fullname) => {
        const newFullnameErrors = {}
        if (!fullname) {
            newFullnameErrors.fullname = 'Fullname Field is required';
        }
        setErrors(newFullnameErrors)
        return !newFullnameErrors.fullname;
    }

    const validateLoginEmail = (email) => {
        const newEmailErrors = {};

        if (!email) {
            newEmailErrors.emailLogin = 'Email Field is required';
        }
        setErrors(newEmailErrors)
        return !newEmailErrors.emailLogin;
    }

    const validateLoginPassword = (password) => {
        const passwordErrors = {};

        if (!password) {
            passwordErrors.passwordLogin = 'Password Field is required';
        }
        setErrors(passwordErrors)
        return !passwordErrors.passwordLogin;
    }

    const handleLoginBtn = () => {
        if (validateLoginEmail(loginData.email) && validateLoginPassword(loginData.password)) {
            // const hashedPassword = bcrypt.hashSync(loginData.password, 10)
            const loginUser = {
                emailID: loginData.email,
                password: loginData.password
            }
            axios.post("http://localhost:7026/api/UserAuth/login", loginUser)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Logged In Successfully", {
                            theme: "dark",
                            autoClose: 1000,
                        });
                        // window.sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
                        // setIsLoggedIn(JSON.parse(window.sessionStorage.getItem('isLoggedIn')))
                        setIsLoggedIn(true)

                        //Storing Username and UserID in Session
                        window.sessionStorage.setItem('authUser', JSON.stringify(result.data));
                        setAuthUser(JSON.parse(window.sessionStorage.getItem('authUser')));
                        setLoginData({
                            email: "",
                            password: "",
                            showPassword: false
                        })
                        autoCloseClick();
                    }
                    else if (result.status === 202) {
                        toast.error(result.data, {
                            theme: "dark",
                            autoClose: 1000,
                        });
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data, {
                        theme: "dark",
                        autoClose: 3000,
                    });
                })
        }
    }

    const handleRegisterBtn = () => {
        const newCpasswordErrors = {}
        if (validateFullname(userData.fullname) && validateEmail(userData.email) && validatePassword(userData.password) && validateOccupation(userData.occupation)) {
            if (!userData.cpassword) {
                newCpasswordErrors.cpassword = "Confirm password Field is required"
            } else if (userData.cpassword !== userData.password) {
                newCpasswordErrors.cpassword = "Password and Confirm password does not match"
            } else {
                // const hashedPassword = bcrypt.hashSync(userData.password, 10)
                const userRegisterData = {
                    fullName: userData.fullname,
                    emailID: userData.email,
                    password: userData.password,
                    occupation: userData.occupation
                }
                axios.post("http://localhost:7026/api/UserAuth/register", userRegisterData)
                    .then((result) => {
                        if (result.status === 201) {
                            toast.success("Registered Successfully", {
                                theme: "dark",
                                autoClose: 1000,
                            });
                            setUserData({
                                email: "",
                                password: "",
                                occupation: "",
                                cpassword: "",
                                showPassword: false,
                                showCPassword: false
                            })
                        } else if (result.status === 200) {
                            toast.error(result.data, {
                                theme: "dark",
                                autoClose: 1000,
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        toast.error("An error occurred during registration", {
                            theme: "dark",
                            autoClose: 3000,
                        });
                    })
            }
            setErrors(newCpasswordErrors)
        }
    }

    const toggleLoginPasswordVisibility = () => {
        setLoginData((prevState) => ({
            ...prevState,
            showPassword: !prevState.showPassword
        }));
    }

    const toggleRegisterPasswordVisibility = () => {
        setUserData((prevState) => ({
            ...prevState,
            showPassword: !prevState.showPassword
        }));
    }

    const toggleRegisterCPasswordVisibility = () => {
        setUserData((prevState) => ({
            ...prevState,
            showCPassword: !prevState.showCPassword
        }));
    }

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:7026/api/SocialAuth/google-login";
    }

    const handleMicrosoftLogin=()=>{
        toast.error("Feature Not supported Yet", {
            theme: "dark",
            autoClose: 3000,
        });
    }

    const handleFaceBookLogin = () => {
        window.location.href = "http://localhost:7026/api/SocialAuth/signin-facebook";
    }
    return (
        <>
            <div className="modal fade square-modal" id="loginSignupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loginSignupModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body signin_modal" style={{ padding: 0 }}>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link active" id="signin-tab" data-bs-toggle="tab" href="#login" role="tab" aria-controls="home" aria-selected="true" style={{ borderTopLeftRadius: "7px" }}>Sign In</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="signup-tab" data-bs-toggle="tab" href="#register" role="tab" aria-controls="profile" aria-selected="false" style={{ borderTopRightRadius: "7px" }}>Sign Up</a>
                                </li>
                            </ul>
                            <div className="social_login">
                                <button ref={closeButtonRef} type="button" className="btn btn-secondary visually-hidden" data-bs-dismiss="modal">Close</button>
                                <p>with your social network</p>
                                <ul className="social_log">
                                    <li onClick={handleGoogleLogin}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" className="mb-1 me-2">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                    </svg></li>
                                    <li onClick={handleMicrosoftLogin}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="27" height="27" className="mb-1 me-3">
                                            <path fill="#F25022" d="M0 0h231.77v231.77H0z" />
                                            <path fill="#7FBA00" d="M280.23 0H512v231.77H280.23z" />
                                            <path fill="#00A4EF" d="M0 280.23h231.77V512H0z" />
                                            <path fill="#FFB900" d="M280.23 280.23H512V512H280.23z" />
                                        </svg>
                                    </li>
                                    <li onClick={handleFaceBookLogin}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#1877F2" height="28" viewBox="0 0 24 24" width="27" className="mb-1 me-3">
                                            <path d="M22.675 0H1.325C.593 0 0 .592 0 1.324v21.351C0 23.407.593 24 1.325 24H12.81V14.708h-3.248V11.1h3.248V8.409c0-3.229 1.97-4.988 4.845-4.988 1.376 0 2.558.102 2.902.147v3.362l-1.991.001c-1.564 0-1.867.744-1.867 1.832v2.404h3.731l-.487 3.608h-3.244V24h6.361c.732 0 1.325-.593 1.325-1.325V1.324C24 .592 23.407 0 22.675 0z" />
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                            <p className="loginOR mt-3">OR</p>
                            <div className="tab-content signin_tab">
                                <div className="tab-pane active" id="login" role="tabpanel" aria-labelledby="signin-tab">
                                    <div className="form-group mb-3">
                                        <input type="text" className={`form-control shadow-none ${errors.emailLogin ? 'error' : ''}`} id="userLoginEmail" placeholder='Enter your email-id' autoComplete='off' value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                                        {errors.emailLogin === "Email Field is required" ? "" : <div className="validations">{errors.emailLogin}</div>}
                                    </div>
                                    <div className="form-group mb-2">
                                        <div className="input-group">
                                            <input type={loginData.showPassword ? "text" : "password"} className={`form-control shadow-none ${errors.passwordLogin ? 'error' : ''}`} id="userLoginPassword" placeholder='Enter your password' autoComplete='off' value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                                            <span className="input-group-text" style={{ cursor: "pointer", fontSize: "13px" }} onClick={toggleLoginPasswordVisibility}>
                                                {loginData.showPassword ? (
                                                    <i className="bi bi-eye-slash-fill"></i>
                                                ) : (
                                                    <i className="bi bi-eye-fill"></i>
                                                )}
                                            </span>
                                        </div>
                                        {errors.passwordLogin === "Password Field is required" ? "" : <div className="validations">{errors.passwordLogin}</div>}
                                    </div>
                                    <div className='mb-3 d-flex justify-content-end'>
                                        <a className="forgot-pass" href='#forgotpass' data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <div className="form-group mb-3">
                                        <button type="button" style={{ marginBottom: "20px", width: "100%", backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={handleLoginBtn}>Login</button>
                                    </div>
                                </div>
                                <div className="tab-pane" id="register" role="tabpanel" aria-labelledby="signup-tab">
                                    <div className="form-group mb-3">
                                        <input type="text" className={`form-control shadow-none ${errors.fullname ? 'error' : ''}`} id="fullname" placeholder='Enter your full name' autoComplete='off' value={userData.fullname} onChange={(e) => { handleInputChange(e); validateFullname(e.target.value); }} />
                                        {errors.fullname === "Fullname Field is required" ? "" : <div className="validations">{errors.fullname}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <input type="text" className={`form-control shadow-none ${errors.email ? 'error' : ''}`} id="email" placeholder='Enter your email-id' autoComplete='off' value={userData.email} onChange={(e) => { handleInputChange(e); validateEmail(e.target.value); }} />
                                        {errors.email === "Email Field is required" ? "" : <div className="validations">{errors.email}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <div className="input-group">
                                            <input type={userData.showPassword ? "text" : "password"} className={`form-control shadow-none ${errors.password ? 'error' : ''}`} id="password" placeholder='Enter your password' autoComplete='off' value={userData.password} onChange={(e) => { handleInputChange(e); validatePassword(e.target.value); }} />
                                            <span className="input-group-text" onClick={toggleRegisterPasswordVisibility} style={{ cursor: "pointer", fontSize: "13px" }}>
                                                {userData.showPassword ? (
                                                    <i className="bi bi-eye-slash-fill"></i>
                                                ) : (
                                                    <i className="bi bi-eye-fill"></i>
                                                )}
                                            </span>
                                        </div>
                                        {errors.password === "Password Field is required" ? "" : <div className="validations">{errors.password}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <div className="input-group">
                                            <input type={userData.showCPassword ? "text" : "password"} className={`form-control shadow-none ${errors.cpassword ? 'error' : ''}`} id="cpassword" placeholder='Enter confirm password' autoComplete='off' value={userData.cpassword} onChange={(e) => { handleInputChange(e) }} />
                                            <span className="input-group-text" onClick={toggleRegisterCPasswordVisibility} style={{ cursor: "pointer", fontSize: "13px" }}>
                                                {userData.showCPassword ? (
                                                    <i className="bi bi-eye-slash-fill"></i>
                                                ) : (
                                                    <i className="bi bi-eye-fill"></i>
                                                )}
                                            </span>
                                        </div>
                                        {errors.cpassword === "Confirm password Field is required" ? "" : <div className="validations">{errors.cpassword}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <input type="text" className={`form-control shadow-none ${errors.occupation ? 'error' : ''}`} id="occupation" placeholder='Enter your occupation' autoComplete='off' value={userData.occupation} onChange={(e) => { handleInputChange(e); validateOccupation(e.target.value); }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <button type="button" style={{ marginBottom: "20px", width: "100%", backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={handleRegisterBtn}>Register</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ForgotPassword  />
        </>
    )
}

export default Login
