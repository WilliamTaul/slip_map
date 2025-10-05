import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "../styles.css"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();

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

    const navItems = [
        { name: "Home", path: "/", roles: [] },
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
        { name: "New Slip", path: "/new-slip" },
    ]

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
              </ul>
            </div>
        </nav>
    );
}