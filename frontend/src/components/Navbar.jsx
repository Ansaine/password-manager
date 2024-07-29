import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-white text-lg font-bold">Password Manager</span>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="text-white hover:text-gray-300">Home</a>
          </li>
          <li>
            <a href="/about" className="text-white hover:text-gray-300">About</a>
          </li>
          <li>
            <a href="/contactus" className="text-white hover:text-gray-300">Contact Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
