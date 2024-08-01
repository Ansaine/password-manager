// src/PasswordList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import showPasswordIcon from './icons/showPasswordIcon.png';
import hidePasswordIcon from './icons/hidePasswordIcon.png';

const PasswordList = (toggleVariable) => {
  const [passwords, setPasswords] = useState([]);
  const [message, setMessage] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          setMessage('Email not found in localStorage');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/fetchAllData`, {
          params: { email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (Array.isArray(response.data)) {
          setPasswords(response.data);
        } else {
          setPasswords([]);
        }
      } catch (error) {
        setMessage('Error fetching data');
      }
    };

    fetchPasswords();
    console.log("PasswordList re-rendered");
  }, [toggleVariable]);

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const deletePassword = async (email, website) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/deletePassword`, {
        data: { email, website },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        setPasswords(passwords.filter(item => item.website !== website));
      } else {
        setMessage('Error deleting password');
      }
    } catch (error) {
      setMessage('Error deleting password');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center">Stored Passwords</h2>
      {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Website</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Password</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {passwords.length > 0 ? (
            passwords.map((item, index) => (
              <tr key={index} className="even:bg-gray-100">
                <td className="border px-4 py-2">{item.website}</td>
                <td className="border px-4 py-2">{item.username}</td>
                <td className="border px-4 py-2 relative">
                  <input
                    type={visiblePasswords[index] ? 'text' : 'password'}
                    value={item.websitePassword}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <span
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => togglePasswordVisibility(index)}
                  >
                    <img
                      src={visiblePasswords[index] ? hidePasswordIcon : showPasswordIcon}
                      alt="eye"
                      className="w-6 h-6"
                    />
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                    onClick={() => deletePassword(localStorage.getItem('email'), item.website)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">No passwords found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PasswordList;
