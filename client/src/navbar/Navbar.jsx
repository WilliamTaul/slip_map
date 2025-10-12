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
        const updateName = async () => {
            try {
                if (!isLoggedIn || userRole === 'admin') {
                    setFirstName("");
                    return;
                }
                const res = await api.get("http://localhost:3000/api/user-profile/info");
                setFirstName(res.data.firstName);
            } catch (err) {
                console.error(err);
            }
        }
        updateName();
    }, [isLoggedIn])

    let navItems = [];

    if (!isLoggedIn) {
        navItems = [ 
            { name: "Login", path: "/login" },
            { name: "Register", path: "/register" },
        ];
    } else {
        navItems = [
            { name: "Home", path: "/", roles: [] },
            { name: "New Slip", path: "/new-slip" }, 
        ];
    }


    return (
        <nav className="nav">
            <a href="/" className="site-title">Taulkie</a>
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
                   {firstName.length > 0 && 
                  <li><button className="btn btn-nav">
                    {firstName}
                    </button></li>}
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