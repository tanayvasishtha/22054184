import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../services/api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const usersResponse = await getUsers();
        const userIds = Object.keys(usersResponse.users);
        
        let userPostCounts = [];
        for (const userId of userIds) {
          try {
            const postsResponse = await getUserPosts(userId);
            userPostCounts.push({
              id: userId,
              name: usersResponse.users[userId],
              postCount: postsResponse.posts?.length || 0,
              avatar: `https://picsum.photos/seed/${userId}/150/150`
            });
          } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
          }
        }

        // Sort by post count and get top 5
        const sortedUsers = userPostCounts
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);
          
        setTopUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users data');
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="top-users">
      <h2 className="mb-4">Top 5 Users by Post Count</h2>
      <div className="row">
        {topUsers.map((user) => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={user.avatar} className="card-img-top" alt={user.name} />
              <div className="card-body text-center">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">Total Posts: {user.postCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
