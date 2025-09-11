import client from './client';

export const forgotPassword = async (email) => {
  const res = await client.post('/api/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async ({ token, password }) => {
  const res = await client.post('/api/auth/reset-password', { token, password });
  return res.data;
};
