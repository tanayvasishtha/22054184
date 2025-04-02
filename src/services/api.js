import axios from 'axios';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAwODgwLCJpYXQiOjE3NDM2MDA1ODAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI0MTMyNzhlLTJiY2YtNGU5Ni1hMDU4LTlkYjU3ZDkxNTE0ZCIsInN1YiI6InRhbmF5dmFzaXNodGhhQGdtYWlsLmNvbSJ9LCJlbWFpbCI6InRhbmF5dmFzaXNodGhhQGdtYWlsLmNvbSIsIm5hbWUiOiJ0YW5heSB2YXNpc2h0aGEiLCJyb2xsTm8iOiIyMjA1NDE4NCIsImFjY2Vzc0NvZGUiOiJud3B3cloiLCJjbGllbnRJRCI6ImI0MTMyNzhlLTJiY2YtNGU5Ni1hMDU4LTlkYjU3ZDkxNTE0ZCIsImNsaWVudFNlY3JldCI6InlxZWNRanFxcEF3S3NCaGQifQ.2K1OZDNQA09PgJgU33UxeqcnbtJG3243hfmXxV8V2dk';

const api = axios.create({
  baseURL: 'http://20.244.56.144/evaluation-service',
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};

export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};
