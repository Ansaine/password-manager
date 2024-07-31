import React, { useState, useRef } from 'react';
import axios from 'axios';
import showPasswordIcon from './icons/showPasswordIcon.png';
import hidePasswordIcon from './icons/hidePasswordIcon.png';

const Form = () => {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
    passwordRef.current.type = isPasswordVisible ? 'password' : 'text';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token'); // Retrieve the token

    if (!email) {
      setMessage('No email found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/addData`,
        {
          email,
          website,
          username,
          websitePassword: password
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage('Data added successfully');
      // Clear form inputs
      setWebsite('');
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Failed to add data');
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-700 font-bold mb-1">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Enter website"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex mb-4 space-x-4">
          <div className="w-1/2">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                ref={passwordRef}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                <img
                  src={isPasswordVisible ? hidePasswordIcon : showPasswordIcon}
                  alt="Toggle password visibility"
                  className="w-6 h-6 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Save
          </button>
        </div>
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Form;
