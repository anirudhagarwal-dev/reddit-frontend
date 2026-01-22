import React, { useEffect, useState } from "react";
import { useReddit } from "../context/RedditStore";
import PostCard from "../components/PostCard";
import { dummyPosts } from "../src/data/dummyData";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSubreddit } = useReddit();
  const [filter, setFilter] = useState("hot"); // hot, new, top

  // Create Post State
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setSubreddit("popular"); 
    setLoading(true);

    fetch(`https://www.reddit.com/r/popular/${filter}.json?limit=20`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.children) {
          const realPosts = data.data.children;
          setPosts([...dummyPosts, ...realPosts]);
        } else {
          setPosts(dummyPosts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch posts, using dummy data:", err);
        setPosts(dummyPosts);
      })
      .finally(() => setLoading(false));
  }, [setSubreddit, filter]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost = {
      data: {
        id: "loc_" + Date.now(),
        title: newPostTitle,
        author: "me",
        subreddit: "u/me",
        ups: 1,
        num_comments: 0,
        created_utc: Date.now() / 1000,
        thumbnail: "self",
        selftext: newPostContent,
        permalink: "#"
      }
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setIsCreating(false);
  };

  return (
    <div className="home-container">
      {/* Create Post Input */}
      <div style={{ 
        background: "var(--card-bg, white)", 
        padding: 10, 
        marginBottom: 16, 
        borderRadius: 4,
        border: "1px solid var(--border-color, #ccc)",
        display: "flex",
        gap: 10,
        alignItems: "center"
      }}>
        <img 
          src="/reddit.png" 
          alt="Reddit"
          style={{ 
            width: 38, 
            height: 38, 
            borderRadius: "50%", 
            objectFit: "cover", 
            background: "#edeff1" 
          }} 
        />
        <input 
          type="text" 
          placeholder="Create Post" 
          style={{ 
            flex: 1, 
            padding: "10px", 
            background: "var(--bg-color, #f6f7f8)", 
            border: "1px solid var(--border-color, #edeff1)", 
            borderRadius: 4 
          }}
          onFocus={() => setIsCreating(true)}
        />
        <button style={{ padding: 8 }}>🖼️</button>
        <button style={{ padding: 8 }}>🔗</button>
      </div>

      {isCreating && (
        <div style={{
          background: "var(--card-bg, white)",
          padding: 16,
          marginBottom: 16,
          borderRadius: 4,
          border: "1px solid var(--border-color, #ccc)"
        }}>
          <h3 style={{ marginTop: 0 }}>Create a Post</h3>
          <form onSubmit={handleCreatePost}>
            <input 
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Title"
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Text (optional)"
              style={{ width: "100%", padding: 8, marginBottom: 8, minHeight: 80 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={() => setIsCreating(false)}>Cancel</button>
              <button 
                type="submit" 
                style={{ background: "#0079D3", color: "white", border: "none", padding: "6px 16px", borderRadius: 99 }}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {["hot", "new", "top"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 12px",
              borderRadius: 99,
              border: "none",
              background: filter === f ? "#f6f7f8" : "transparent",
              color: filter === f ? "#0079D3" : "#878a8c",
              fontWeight: 700,
              textTransform: "capitalize",
              cursor: "pointer"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 20, textAlign: "center", color: "#666" }}>Loading popular posts...</div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.data.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
