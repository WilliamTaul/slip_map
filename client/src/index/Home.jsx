import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/AuthContext";
import { useState } from 'react';

import "../styles.css"

export function Home() {
  const { userRole, userId } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <h1>Home</h1>
      <Link to="/login" className="btn">Login</Link>
      <button className="btn">Button</button>
      <button className="btn btn-danger">Button</button>
      <Link to="/message" className="btn">Message</Link>
      <button className="btn" onClick={() => navigate('/message-board')}>MessageBoard</button>
      {userRole === 'admin' && <button className="btn" onClick={() => navigate('/admin/message-boards')}>admin</button>}
      <button className="btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
      <button className="btn" onClick={() => navigate('/message-boards')}>Boards</button>
    </>
    )
}