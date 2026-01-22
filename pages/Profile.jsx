import React, { useEffect, useState } from "react";
import { useReddit } from "../context/RedditStore";

export default function Profile() {
  const { accessToken, saveToken } = useReddit();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `bearer ${accessToken}`,
        "User-Agent": "PostStream/1.0 by yourusername",
      },
    })
      .then((r) => r.json())
      .then(setUser)
      .catch((err) => {
        console.error(err);
      });
  }, [accessToken]);

  if (!accessToken) return <p>Please login first (use Login page).</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Link karma: {user.link_karma} — Comment karma: {user.comment_karma}</p>
      <img src={user.icon_img?.split("?")[0]} alt="avatar" width={80} />
      <div style={{ marginTop: 12 }}>
        <button onClick={() => { saveToken(null); window.location.href = "/"; }}>Logout</button>
      </div>
    </div>
  );
}
