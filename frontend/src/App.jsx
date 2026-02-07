import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
import Lecturers from "./pages/Lecturers";
import Footer from "./components/Footer";
import Feedback from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admindashboard from "./pages/Admindashboard";
import Dashboard from "./pages/Dashboard";
import RecordingsPage from "./pages/RecordingsPage";






function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/classes" element={<Classes />} />
        <Route path="/lecturers" element={<Lecturers />} />
        <Route path="/about" element={<Feedback />} />
         <Route path="/admin" element ={<Admindashboard/>} />
        <Route path="/dashboard" element = {<Dashboard/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />  
        <Route path="/class/:courseId" element={<RecordingsPage />} />

       
      </Routes>
     
    </Router>
    
  );
}

export default App;
