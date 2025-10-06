import { Link } from "react-router-dom"
import { useAuth } from "../helpers/AuthContext"

import "../styles.css"

export function Home() {
  const { userRole, userId } = useAuth();

  return (
    <>
      <h1>Home</h1>
      <Link to="/login" className="btn">Login</Link>
      <button className="btn">Button</button>
      <button className="btn btn-danger">Button</button>
      {userRole === 'admin' && <button>admin</button>}
    </>
    )
}