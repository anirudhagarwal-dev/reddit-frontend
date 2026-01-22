import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useReddit } from "../context/RedditStore";

export default function Subreddit() {
  const { name } = useParams();
  const { setSubreddit } = useReddit();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    setSubreddit(name);
    setLoading(true);
    fetch(`https://www.reddit.com/r/${name}/top.json?limit=12`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.data?.children || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [name, setSubreddit]);

  return (
    <div>
      <h2>r/{name}</h2>
      {loading ? <p>Loading...</p> : null}
      {!loading && posts.length === 0 && <p>No posts found.</p>}
      {posts.map((p) => <PostCard key={p.data.id} post={p} />)}
    </div>
  );
}
