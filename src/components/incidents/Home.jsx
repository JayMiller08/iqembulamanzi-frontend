import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../Home.css';

const Home = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        // Fetch incidents
        const incidentsRes = await fetch('/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incidentsData = await incidentsRes.json();
        if (!incidentsRes.ok) throw new Error(incidentsData.message || "Failed to fetch incidents");

        // Fetch users
        const usersRes = await fetch('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        if (!usersRes.ok) throw new Error(usersData.message || "Failed to fetch users");

        // Compute stats
        const activeReports = incidentsData.filter(inc => inc.status !== 'closed').length;
        const totalUsers = usersData.length;
        const managers = usersData.filter(u => u.role === 'Manager').length;

        setStats([
          { title: "Active Reports", value: activeReports },
          { title: "Total Users", value: totalUsers },
          { title: "Managers", value: managers },
        ]);

        // Recent activity: last 5 incidents
        const recentIncidents = incidentsData.slice(-5).map(inc => ({
          id: inc._id,
          type: "Incident",
          description: `${inc.category} reported - ${inc.status}`,
        }));
        setRecentActivity(recentIncidents);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Show login/signup prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <div className="welcome-section">
          <h2>Welcome to iqembulamanzi</h2>
          <p>Your central hub for monitoring, reporting, and managing water pollution incidents.</p>
        </div>

        <div className="auth-prompt-section">
          <div className="auth-prompt-card">
            <h3>🔐 Authentication Required</h3>
            <p>To access the dashboard and manage incidents, please sign up or log in to your account.</p>
            
            <div className="auth-buttons">
              <Link to="/register" className="auth-button primary">
                <span className="button-icon">📝</span>
                Sign Up
              </Link>
              <Link to="/login" className="auth-button secondary">
                <span className="button-icon">🔑</span>
                Login
              </Link>
            </div>

            <div className="auth-features">
              <h4>What you can do after signing up:</h4>
              <ul>
                <li>📊 View incident statistics and reports</li>
                <li>📍 Report new water pollution incidents</li>
                <li>👥 Manage user accounts (Admin/Manager roles)</li>
                <li>📱 Receive WhatsApp notifications</li>
                <li>🗺️ Track incidents on interactive maps</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>About iqembulamanzi</h3>
          <p>
            iqembulamanzi (meaning "team water" in isiZulu) is a community-powered platform 
            designed to monitor and address sewer manhole failures and overflows in South African municipalities. 
            It empowers citizens to report incidents easily and ensures municipal accountability 
            with transparent tracking.
          </p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Welcome back, {user.first_name || user.email}!</h2>
        <p>Your central hub for monitoring, reporting, and managing water pollution data.</p>
        <p className="user-role">Role: <span className="role-badge">{user.role}</span></p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-title">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="recent-activity-section">
        <h3>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul className="activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="activity-item">
                <span className={`activity-type ${activity.type.toLowerCase()}`}>
                  {activity.type}
                </span>
                <span className="activity-description">{activity.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;