// JWT utility functions
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const getUserRole = (token) => {
  const payload = decodeJWT(token);
  if (!payload) return 'user';

  // Check multiple possible role field names
  return payload.role || payload.user_type || payload.type || payload.user_role || 'user';
};

export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;

  // Check if current time is past expiration time
  return Date.now() >= payload.exp * 1000;
};

export const getTokenPayload = (token) => {
  return decodeJWT(token);
};