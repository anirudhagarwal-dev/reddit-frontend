import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useReddit } from "../context/RedditStore";
import Login from "../pages/Login";
import AuthCallback from "../pages/AuthCallback.jsx";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import Subreddit from "../pages/Subreddit";
import "./App.css";

export default function App() {
  const { subreddit } = useReddit();
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/r/${search}`);
      setSearch("");
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img src="/reddit.png" alt="Logo" className="logo-img" />
            <span className="logo-text">reddit</span>
          </Link>
        </div>
        
        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            placeholder="Search Reddit" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <nav className="nav-links">
          <button onClick={toggleDarkMode} className="nav-btn" style={{ fontSize: "1.2rem", cursor: "pointer", border: "none", background: "none" }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/login" className="nav-btn login-btn">Log In</Link>
          <Link to="/profile" className="nav-btn profile-btn">Profile</Link>
        </nav>
      </header>

      <div className="main-layout">
        <aside className="left-sidebar">
          <div className="sidebar-section">
            <h3>FEEDS</h3>
            <Link to="/" className="sidebar-link">🏠 Home</Link>
            <Link to="/r/popular" className="sidebar-link">🔥 Popular</Link>
            <Link to="/r/all" className="sidebar-link">🚀 All</Link>
          </div>
          
          <div className="sidebar-section">
            <h3>RECENT</h3>
            <Link to={`/r/${subreddit || 'popular'}`} className="sidebar-link">
              r/{subreddit || 'popular'}
            </Link>
          </div>

          <div className="sidebar-section">
            <h3>COMMUNITIES</h3>
            <Link to="/r/reactjs" className="sidebar-link">r/reactjs</Link>
            <Link to="/r/javascript" className="sidebar-link">r/javascript</Link>
            <Link to="/r/webdev" className="sidebar-link">r/webdev</Link>
            <Link to="/r/programming" className="sidebar-link">r/programming</Link>
          </div>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/r/:name" element={<Subreddit />} />
          </Routes>
        </main>

        <aside className="right-sidebar">
          <div className="sidebar-section">
            <h3>ABOUT COMMUNITY</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5", marginBottom: "12px", color: "var(--text-color)" }}>
              Welcome to Reddit! Come for the cats, stay for the empathy.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-color)" }}>1.2m Members</div>
              <div style={{ fontSize: "14px", color: "#46D160" }}>🟢 4.5k Online</div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>REDDIT RULES</h3>
            <ol style={{ paddingLeft: "20px", fontSize: "12px", color: "var(--text-color)" }}>
              <li style={{ marginBottom: "8px" }}>Remember the human</li>
              <li style={{ marginBottom: "8px" }}>Behave like you would in real life</li>
              <li style={{ marginBottom: "8px" }}>Look for the original source of content</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
