import './App.css';
import React,{useEffect,useState} from "react"
import Home from './components/home'
import Dashboard from './components/dashboard';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    
    <Router>   
      <Routes>
        <Route path = '/' element={< Home />}/>
          <Route path = "/dashboard" element={<Dashboard />}/>
      </Routes>  
    </Router>

  )
}


export default App;
