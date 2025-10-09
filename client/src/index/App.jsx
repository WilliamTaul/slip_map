import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom"

import { Navbar } from '../navbar/Navbar';
import { Login } from '../auth/Login';
import { NewSlipForm } from '../slips/NewSlipForm';
import { Register } from '../auth/Register';
import { Home } from './Home';
import { Message } from '../messages/Message'
import { MessageBoard } from '../messages/MessageBoard';
import { EditProfile } from '../profile/EditProfile';

import { AuthProvider, useAuth} from '../helpers/AuthContext';
import SocketProvider  from '../helpers/SocketContext';

import "../styles.css";

function App() {

  return (
    <>
      
      <BrowserRouter>
        <AuthProvider>
        <SocketProvider>
          <Layout></Layout>
          </SocketProvider>
          </AuthProvider>
      </BrowserRouter>
    </>
  )
}

function Layout() {
  const { userRole, accessToken } = useAuth();
  const location = useLocation();

  if (userRole === 'onboarding' && location.pathname !== '/edit-profile') {
    return <Navigate to="/edit-profile" replace/>
  }
  return (
  <>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/edit-profile" element={<EditProfile/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/new-slip" element={<NewSlipForm/>}/>
        <Route path="/message" element={<Message/>}/>
        <Route path="/message-board/:boardId" element={<MessageBoard/>}/>
      </Routes>
  </>
  )
}

export default App
