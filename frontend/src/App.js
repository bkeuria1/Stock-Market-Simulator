import './App.css';

import Home from './components/home'
import Dashboard from './components/dashboard';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Home></Home>
    
    // <Router>   
    //   <Routes>
    //     <Route path = '/' element={< Home />}/>
    //       <Route path = "/dashboard" element={<Dashboard />}/>
    //   </Routes>  
    // </Router>

  )
}


export default App;
