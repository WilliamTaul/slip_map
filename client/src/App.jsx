import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"

import { Navbar } from './Navbar';
import { Login } from './Login';
import { NewSlipForm } from './NewSlipForm';
import { Register } from './Register';
import { Home } from './Home';

import "../public/styles.css"

function App() {
  const [activeState, setActiveState] = useState("newSlip");

  return (
    <>
      
      <BrowserRouter>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/new-slip" element={<NewSlipForm/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
