import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Retrieve the token

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
      const response = await axios.post(`${backendUrl}` + endpoint, { email, emailPassword }, { headers: { Authorization: `Bearer ${token}` } });
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email)           // email should be present in local storage
        setMessage('Login successful');
        navigate('/HomePage');
      } else {
        setMessage('Registration successful. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage('Operation failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-5">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? 'Don’t have an account? Register'
                : 'Already have an account? Login'}
            </button>
          </div>
          {message && <p className="text-center mt-4 text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
