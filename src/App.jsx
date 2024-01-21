import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Routes, Route } from "react-router-dom"
import { AuthProvider } from './components/authContext'

// Importing Auth pages
import SignIn from './components/authentication/signin'
import SignUp from './components/authentication/signup'
import Account from './components/account'

function App() {
 

  return (
    <>
      
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/' exact element={<SignIn/>}></Route>
              <Route path='/signup'  element={<SignUp/>}></Route>
              <Route path='/account'  element={<Account/>}></Route>
            </Routes>
          </AuthProvider>
        </Router>
    </>
  )
}

export default App
