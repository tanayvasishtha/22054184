import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Get all users
      const usersResponse = await getUsers();
      
      if (!usersResponse || !usersResponse.users) {
        setError('Invalid response from users API');
        setLoading(false);
        return;
      }
      
      const userIds = Object.keys(usersResponse.users);
      console.log('User IDs found:', userIds);
      
      // Get all posts
      let allPosts = [];
      for (const userId of userIds) {
        try {
          const postsResponse = await getUserPosts(userId);
          if (postsResponse.posts && postsResponse.posts.length > 0) {
            const postsWithDetails = postsResponse.posts.map(post => ({
              ...post,
              userName: usersResponse.users[userId],
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
              imageUrl: `https://picsum.photos/seed/${post.id}/400/300`
            }));
            allPosts = [...allPosts, ...postsWithDetails];
          }
        } catch (error) {
          console.error(`Error fetching posts for user ${userId}:`, error);
        }
      }
      
      // Sort posts by timestamp (newest first)
      const sortedPosts = allPosts.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(sortedPosts);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      setError(`Failed to fetch feed: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPosts();
    
    // Refresh feed every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && posts.length === 0) 
    return <div className="text-center"><div className="spinner-border"></div></div>;
  
  if (error) return (
    <div>
      <div className="alert alert-danger">{error}</div>
      <button 
        className="btn btn-primary mt-3"
        onClick={fetchPosts}
        disabled={loading}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="feed">
      <h2 className="mb-4">Latest Posts</h2>
      {loading && <div className="alert alert-info">Refreshing feed...</div>}
      {posts.length === 0 ? (
        <div className="alert alert-warning">No posts found</div>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-6 mb-4">
              <div className="card">
                <img src={post.imageUrl} className="card-img-top" alt="Post" />
                <div className="card-body">
                  <h5 className="card-title">By {post.userName}</h5>
                  <p className="card-text">{post.content}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Posted {post.timestamp.toLocaleString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
