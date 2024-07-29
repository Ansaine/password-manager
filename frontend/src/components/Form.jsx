import React from 'react';
import { useRef } from 'react';

import showPasswordIcon from './icons/showPasswordIcon.png'
import hidePasswordIcon from './icons/hidePasswordIcon.png'

const Form = () => {

  const ref = useRef();
  const togglePassword = () => {
    if (ref.current.src.includes(showPasswordIcon)) {
      ref.current.src = hidePasswordIcon;
    } else {
        ref.current.src = showPasswordIcon;
    }
  };


  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Password</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-700 font-bold mb-1">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            placeholder="Enter website"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex mb-4 space-x-4">
          <div className="w-1/2">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username or email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                <img src={showPasswordIcon} ref={ref} alt="eye" className="w-6 h-6 cursor-pointer" onClick={togglePassword} />
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
      </form>
    </div>
  );
};

export default Form;
