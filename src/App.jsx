import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// Import all components from the components folder and the Reports page
import Login from './components/auth/login';
import Register from './components/auth/Register';
import Admin from './components/users/Admin';
import Home from './components/incidents/Home';
import Stats from './components/incidents/Stats';
import Chatbot from './components/incidents/Chatbot';
import AssignJob from './components/jobs/AssignJob';

// Navigation component with logout functionality
const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-link">Home</Link>
      {token && (
        <>
          <Link to="/admin" className="nav-link">Admin</Link>
          <Link to="/chatbot" className="nav-link">Chatbot</Link>
          <Link to="/assign-job" className="nav-link">Assign Job</Link>
          <Link to="/stats" className="nav-link">Stats</Link>
        </>
      )}
      {!token ? (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      ) : (
        <div className="nav-user">
          <span>Welcome, {user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      )}
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="main-container">
        <h1>Water Pollution Project</h1>
        
        {/* Navigation */}
        <Navigation />

        {/* Routing setup */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/assign-job" element={<AssignJob />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
