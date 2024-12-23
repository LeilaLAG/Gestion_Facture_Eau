import axios from 'axios';

const checkAuth = async () => {

  try {
    const response = await axios.get('http://localhost:8000/api/check-auth', {
      withCredentials: true, // This is necessary to send the cookie with the request
    });

    return response.data.isAuthenticated; // Assume your backend responds with the authentication status
  } catch (error) {
    console.error('Error checking authentication:');
    return false;
  }
};

export {checkAuth}
