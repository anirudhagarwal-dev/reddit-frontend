import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReddit } from "../context/RedditStore";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Authenticating...");
  const navigate = useNavigate();
  const { saveToken } = useReddit();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setMsg("No code returned.");
      return;
    }

    const backend = import.meta.env.VITE_BACKEND || "http://localhost:4000";
    fetch(`${backend}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        code,
        redirect_uri: window.location.origin + '/auth/callback'
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.access_token) {
          saveToken(data.access_token);
          
          if (window.opener) {
            // Send token to main window and close popup
            window.opener.postMessage({ type: "LOGIN_SUCCESS", token: data.access_token }, window.location.origin);
            window.close();
          } else {
            // Fallback for non-popup flow
            setMsg("Login successful — redirecting to profile...");
            setTimeout(() => navigate("/profile"), 800);
          }
        } else {
          console.error("Token response:", data);
          setMsg("Token exchange failed. Check backend logs.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMsg("Network error during token exchange.");
      });
  }, [navigate, saveToken]);

  return <h3>{msg}</h3>;
}
