import "./App.css";
import React from "react";
import SolarSystem from "./components/SolarSystem/SolarSystem";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />{" "}
          {/* Change component prop to element */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<SolarSystem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
