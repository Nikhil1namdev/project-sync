import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownData = [
    {
      title: "Products",
      items: [
        { name: "Jira", link: "/UserDashboard" },
        { name: "Compass", link: "/products/compass" },
        { name: "Bitbucket", link: "/products/bitbucket" },
      ],
    },
    {
      title: "Teams",
      items: [
        { name: "Software", link: "/teams/software" },
        { name: "Marketing", link: "/teams/marketing" },
        { name: "IT", link: "/teams/it" },
      ],
    },
    {
      title: "Why Atlassian",
      items: [
        { name: "Integration", link: "/why-atlassian/integration" },
        { name: "Customer", link: "/why-atlassian/customer" },
        { name: "Resilience", link: "/why-atlassian/resilience" },
        { name: "Platform", link: "/why-atlassian/platform" },
      ],
    },
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ATLASSIAN
          </span>
        </a>

        {/* Mobile Menu Button */}
        <button
          onMouseEnter={() => setMenuOpen(!menuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <span className="sr-only">Open main menu</span>
        </button>

        {/* Menu Items */}
        <div className={`${menuOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:items-center`}>
          <ul className="flex flex-col md:flex-row font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 md:mt-0 md:border-0 bg-gray-50 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 dark:text-white"
              >
                Home
              </Link>
            </li>

            {/* Reusable Dropdowns */}
            {dropdownData.map((data, index) => (
              <Dropdown key={index} title={data.title} items={data.items} />
            ))}

            <li>
              <Link to="/services" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">
                Contact
              </Link>
            </li>
          </ul>
          <div className="flex flex-col md:flex-row md:ml-8 mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 p-4 md:p-0">
            <Link to="/Login" className="text-gray-900 hover:text-blue-700 font-medium rounded-lg text-sm px-4 py-2 text-center dark:text-white">Log in</Link>
            <Link to="/Signup" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Dropdown = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700"
      >
        {title}
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-88 dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {items.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.link}  
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default Navbar;
