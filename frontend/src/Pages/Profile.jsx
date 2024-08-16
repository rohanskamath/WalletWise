import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import profileImg from "../Assets/PP.png";

const Profile = () => {
  const { authUser, setAuthUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [userDetails, setUserDetails] = useState({
    emailID: "rkamath391@gmail.com",
    fullName: "Rohan S Kamath",
    password: "$2a$11$EAQGDhq8sCE3SJ6jPC9ddeGztlbfU7UJGrmA0K6xIsqzWdXMZct0u",
    occupation: "IT",
    monthlyIncome: 25000,
    imageName: "",
    balance: balance,
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:7026/api/UserAuth/${authUser.emailID}`)
      .then((result) => {
        setUserDetails(result.data);
        setImagePreview(result.data.imageName || profileImg);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`http://localhost:7026/api/Account/balance/${authUser.emailID}`)
      .then((result) => {
        if (result.status === 200) {
          setBalance(result.data);
        } else if (result.status === 202) {
          setBalance(0);
        }
      })
      .catch((err) => console.log(err));
  }, [authUser.emailID]);

  const handleEditBtn = () => {
    const formData = new FormData();
    formData.append("emailID", userDetails.emailID);
    formData.append("fullName", userDetails.fullName);
    formData.append("password", userDetails.password);
    formData.append("occupation", userDetails.occupation);
    formData.append("monthlyIncome", userDetails.monthlyIncome);
    if (userDetails.imageFile) {
      formData.append("imageFile", userDetails.imageFile); // Append the image file only if it exists
    }

    axios
      .put(`http://localhost:7026/api/UserAuth/${authUser.emailID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if (result.status === 200) {
          toast.success("Profile Updated Successfully", {
            theme: "dark",
            autoClose: 1000,
          });
          setAuthUser(userDetails);
          // Refresh the image preview
          setImagePreview(result.data.imageName || profileImg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails({ ...userDetails, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <ToastContainer />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Profile Settings</h1>
        </div>
        <div className="profilesetting container col-12 mt-4 mx-0 p-4 rounded shadow-sm border">
          <div className="row">
            <div className="col-md-4 d-flex flex-column align-items-center">
              <div className="profile-img-container">
                <img
                  src={imagePreview || userDetails.imageName}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
              <label
                htmlFor="fileUpload"
                className="plus-icon-badge rounded-circle d-flex justify-content-center align-items-center text-white"
              >
                <i className="bi bi-plus"></i>
              </label>
              <input
                type="file"
                className="visually-hidden"
                id="fileUpload"
                onChange={handleFileChange}
              />
              <div className="profiledetails">
                <span className="d-block fw-bolder">
                  {userDetails.fullName}
                </span>
                <span className="d-block text-muted">
                  {userDetails.emailID}
                </span>
              </div>
            </div>
            <div className="col-md-8">
              <div className="p-3 formInput">
                <div className="form-group d-flex align-items-center mb-3">
                  <label className="col-4">Full Name:</label>
                  <input
                    type="text"
                    style={{
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "13px",
                    }}
                    className="form-control shadow-none"
                    placeholder="Enter your full name"
                    autoComplete="off"
                    value={userDetails.fullName}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group d-flex align-items-center mb-3">
                  <label className="col-4">Email-Id:</label>
                  <input
                    type="text"
                    style={{
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "13px",
                    }}
                    disabled
                    className="form-control shadow-none"
                    placeholder="Enter your email-id"
                    autoComplete="off"
                    value={userDetails.emailID}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        emailID: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group d-flex align-items-center mb-3">
                  <label className="col-4">Occupation:</label>
                  <input
                    type="text"
                    style={{
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "13px",
                    }}
                    className="form-control shadow-none"
                    placeholder="Enter your occupation"
                    autoComplete="off"
                    value={userDetails.occupation}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        occupation: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group d-flex align-items-center mb-3">
                  <label className="col-4">Monthly Income:</label>
                  <input
                    type="text"
                    style={{
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "13px",
                    }}
                    className="form-control shadow-none"
                    placeholder="Enter your monthly income"
                    autoComplete="off"
                    value={userDetails.monthlyIncome}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        monthlyIncome: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group d-flex align-items-center mb-3">
                  <label className="col-4">Balance:</label>
                  <input
                    type="text"
                    style={{
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "13px",
                    }}
                    disabled
                    className="form-control shadow-none"
                    placeholder="Enter your balance"
                    autoComplete="off"
                    value={balance}
                  />
                </div>
                <div className="form-group mb-3">
                  <button
                    type="button"
                    style={{
                      marginBottom: "20px",
                      width: "100%",
                      backgroundColor: "#012970",
                      color: "white",
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "12px",
                    }}
                    className="btn"
                    onClick={handleEditBtn}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
