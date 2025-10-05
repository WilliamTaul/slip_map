import { Link } from "react-router-dom"

import "../styles.css"

export function Home() {
    return (
    <>
      <h1>Home</h1>
      <Link to="/login" className="btn">Login</Link>
      <button className="btn">Button</button>
      <button className="btn btn-danger">Button</button>
    </>
    )
}