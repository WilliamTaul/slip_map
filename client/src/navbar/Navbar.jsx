import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from '../helpers/AuthContext';

import "../styles.css"

export function Navbar() {
    const { logout, isLoggedIn, api, userRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const menuRef = useRef();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    function handleClickOutsideDropdown(event) {
            if ((menuRef.current && !menuRef.current.contains(event.target))) {
                setIsOpen(false);
            }
        };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdown);
        }
    }, []);

    useEffect(() => {
        // update user info when logged in state changes
        // or when user is done onboarding (role changes)
        const updateName = async () => {
            try {
                if (!isLoggedIn) {
                    setFirstName("");
                    return;
                }
                const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-profile/info`);
                setFirstName(res.data.firstName);
            } catch (err) {
                console.error(err);
            }
        }
        updateName();
    }, [isLoggedIn, userRole])

    let navItems = [];

    if (!isLoggedIn) {
        navItems = [ 
            { name: "Login", path: "/login" },
            { name: "Register", path: "/register" },
        ];
    } else {
        navItems = [
            { name: "Home", path: "/", roles: [] },
            { name: "Edit Profile", path: "/edit-profile" }, 
            { name: "Message Boards", path: "/message-boards"},
        ];
    }

    if (userRole === 'admin') {
        navItems = [
            { name: "Home", path: "/", roles: [] },
            { name: "Admin Panel", path: "/admin/message-boards"},
            { name: "Message Boards", path: "/message-boards"},
            { name: "Edit Profile", path: "/edit-profile" }, 
        ];
    }


    return (
        <nav className="nav">
            <a href="/" className="site-title">Taulkie</a>
            {firstName.length > 0 && 
            <div className="user-name">Hello, {firstName}!</div>}
            <div className="nav-toggle-wrapper">
              <button
                className="hamburger"
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Toggle menu"
              >
                &#9776;
              </button>

              <ul className={`nav-links ${isOpen ? "open": ""}`} ref={menuRef}>
                  {navItems.map(item => (
                    <li key={item.path}>
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                  ))}
                  {isLoggedIn && 
                    <li key="logout">
                        <button className="btn btn-nav" onClick={() => handleLogout()}>Logout</button>    
                    </li>
                  }
              </ul>
            </div>
        </nav>
    );
}