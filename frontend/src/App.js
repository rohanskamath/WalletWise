import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import Main from "./Pages/Main";
import Footer from "./Components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Transactions from "./Pages/Transactions";
import Analytics from "./Pages/Analytics";
import Login from "./Components/Login";
import Profile from "./Pages/Profile";
import Categories from "./Pages/Categories";
import Accounts from "./Pages/Accounts";
import Joyride, { STATUS } from "react-joyride";
import { useAuth } from "./Context/AuthContext"
import HelpCenter from "./Pages/HelpCenter";

const App = () => {
  const { authUser } = useAuth();
  const [joyrideState, setJoyrideState] = useState({
    run: true,
    steps: [
      {
        content: <h4>Welcome to WalletWise!! </h4>,
        locale: { skip: <strong>SKIP</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Get an overview of all your expenses and financial activities at a
            glance.
          </p>
        ),
        placement: "bottom",
        target: "#step-0",
        title: "Dashboard Section",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Manage and update your personal information and preferences.
          </p>
        ),
        placement: "bottom",
        target: "#step-1",
        title: "My Profile",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Customize and add new categories to organize your expenses
            efficiently.
          </p>
        ),
        placement: "bottom",
        target: "#step-2",
        title: "Expense Categories ",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            View detailed records of all your financial transactions, past and
            present.
          </p>
        ),
        placement: "bottom",
        target: "#step-3",
        title: "Transactions",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Manage and edit your bank accounts seamlessly, all in one place.
          </p>
        ),
        placement: "bottom",
        target: "#step-4",
        title: "My Accounts ",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Visualize your income, expenses, and financial trends with
            interactive charts and graphs.
          </p>
        ),
        placement: "bottom",
        target: "#step-5",
        title: "Analytics",
      },
      {
        content: (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Find assistance and answers to your queries quickly and easily.
          </p>
        ),
        placement: "bottom",
        target: "#step-6",
        title: "Help Center",
      },
    ],
  });

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideState({ ...joyrideState, run: false });
    }
  };

  return (
    <>
      {authUser === null ? (
        ""
      ) : (
        <Joyride
          continuous
          callback={handleJoyrideCallback}
          run={joyrideState.run}
          steps={joyrideState.steps}
          hideCloseButton
          scrollToFirstStep
          showSkipButton
          styles={{
            options: {
              primaryColor: "#012970",
              buttonBorderColor: "#012970",
              textColor: "black",
              zIndex: 10002,
              buttonFontFamily: "'Merriweather', serif",
            },
            overlay: {
              zIndex: 10001,
              height: "220vh"
            },
          }}
        />
      )}
      <BrowserRouter>
        <Header />
        <Login />
        <SideBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
