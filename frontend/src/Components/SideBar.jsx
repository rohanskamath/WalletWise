import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const navLinks = [
    {
        name: "Dashboard",
        icon: "bi bi-grid",
        path: "/"
    },
    {
        name: "My Profile",
        icon: "bi bi-person-badge",
        path: "/profile"
    },
    {
        name: "Expense Categories",
        icon: "bi bi-list-check",
        path: "/category"
    },
    {
        name: "Transactions",
        icon: "bi bi-clock-history",
        path: "/transactions"
    },
    {
        name: "My Accounts",
        icon: "bi bi-bank",
        path: "/accounts"
    },
    {
        name: "Analytics",
        icon: "bi bi-bar-chart",
        path: "/analytics"
    },
    {
        name: "Help Center",
        icon: "bi bi-question-octagon",
        path: "/helpcenter"
    },
    {
        name: "Signout",
        icon: "bi bi-box-arrow-left",
        path: "/"
    }
]
const SideBar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { setIsLoggedIn, setAuthUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const storedActiveIndex = localStorage.getItem('activeIndex');
        if (storedActiveIndex !== null) {
            setActiveIndex(parseInt(storedActiveIndex, 10));
        } else {
            setActiveIndex(0);
        }
    }, []);

    const handleNavItemClick = (index, name) => {
        if (name === 'Signout') {
            setAuthUser(null)
            setIsLoggedIn(false)
            window.sessionStorage.removeItem("authUser");
            setActiveIndex(0);
            localStorage.setItem('activeIndex', 0);
            navigate("/")
        } else {
            setActiveIndex(index);
            localStorage.setItem('activeIndex', index);
        }
    };
    return (
        <>
            <aside id="sidebar" className='sidebar'>
                <ul className='sidebar-nav' id="sidbar-nav">
                    {
                        navLinks.map((items, index) =>
                            <li className='nav-item' id={`step-${index}`} key={index}>
                                <Link to={items.path} onClick={() => handleNavItemClick(index, items.name)} className={`nav-link ${activeIndex === index ? 'active' : ''}`} >
                                    <i className={items.icon}></i>
                                    <span>{items.name}</span>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </aside>
        </>
    );
}

export default SideBar;