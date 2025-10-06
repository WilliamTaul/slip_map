import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"

import { Navbar } from '../navbar/Navbar';
import { Login } from '../auth/Login';
import { NewSlipForm } from '../slips/NewSlipForm';
import { Register } from '../auth/Register';
import { Home } from './Home';

import { AuthProvider } from '../helpers/AuthContext';
import SocketProvider  from '../helpers/SocketContext';

import "../styles.css";

function App() {

  return (
    <>
      
      <BrowserRouter>
        <AuthProvider>
        <SocketProvider>
          <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/new-slip" element={<NewSlipForm/>}/>
            </Routes>
          </SocketProvider>
          </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
