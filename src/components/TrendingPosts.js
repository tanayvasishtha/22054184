import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts, getPostComments } from '../services/api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        // Get all users
        const usersResponse = await getUsers();
        const userIds = Object.keys(usersResponse.users);
        
        // Get all posts
        let allPosts = [];
        for (const userId of userIds) {
          try {
            const postsResponse = await getUserPosts(userId);
            if (postsResponse.posts && postsResponse.posts.length > 0) {
              // Add user info to posts
              const postsWithUserInfo = postsResponse.posts.map(post => ({
                ...post,
                userName: usersResponse.users[userId],
                imageUrl: `https://picsum.photos/seed/${post.id}/400/300`
              }));
              allPosts = [...allPosts, ...postsWithUserInfo];
            }
          } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
          }
        }
        
        // Get comment counts for each post
        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            try {
              const commentsResponse = await getPostComments(post.id);
              return {
                ...post,
                commentCount: commentsResponse.comments?.length || 0
              };
            } catch (error) {
              console.error(`Error fetching comments for post ${post.id}:`, error);
              return { ...post, commentCount: 0 };
            }
          })
        );
        
        // Find maximum comment count
        const maxCommentCount = Math.max(
          ...postsWithComments.map(post => post.commentCount),
          0
        );
        
        // Filter posts with maximum comments
        const trending = postsWithComments.filter(
          post => post.commentCount === maxCommentCount
        );
        
        setTrendingPosts(trending);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch trending posts');
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="trending-posts">
      <h2 className="mb-4">Trending Posts (Most Commented)</h2>
      <div className="row">
        {trendingPosts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card">
              <img src={post.imageUrl} className="card-img-top" alt="Post" />
              <div className="card-body">
                <h5 className="card-title">By {post.userName}</h5>
                <p className="card-text">{post.content}</p>
                <p className="card-text">
                  <small className="text-muted">Comments: {post.commentCount}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
