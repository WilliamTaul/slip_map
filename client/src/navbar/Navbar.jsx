import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from '../helpers/AuthContext';

import "../styles.css"

export function Navbar() {
    const { logout, isLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    function handleClickOutsideDropdown(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdown);
        }
    }, []);

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
            <a href="/" className="site-title">Slip Map</a>

            <div className="nav-toggle-wrapper">
              <button
                className="hamburger"
                onClick={() => setIsOpen(!isOpen)}
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