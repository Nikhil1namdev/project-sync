import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinalDashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [showOptions, setShowOptions] = useState(false);
  const isPremium = true; // Toggle for testing
  const navigate = useNavigate();

  const handleNavClick = (label) => {
    setActiveItem(label);
    console.log(`${label} is active`);

    // Handle Pricing route
    if (label === "Pricing") {
      navigate('/PricingPage');
    }
  };

  const handleJiraClick = () => {
    navigate('/JiraDashboard');
  };

  const handleDevClick = () => {
    navigate('/PricingPage');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-blue-600 text-2xl font-bold mb-10">TaskFlow</h1>
          <nav className="space-y-4">
            <NavItem label="Dashboard" active={activeItem === "Dashboard"} onClick={handleNavClick} />
            <NavItem label="Projects" active={activeItem === "To-Do"} onClick={handleNavClick} />
            <NavItem label="In Progress" active={activeItem === "In Progress"} onClick={handleNavClick} />
            <NavItem label="Completed Projects" active={activeItem === "Done"} onClick={handleNavClick} />
          </nav>

          <div className="mt-10 space-y-4">
            <NavItem label="Team" active={activeItem === "Team"} onClick={handleNavClick} />
            <NavItem label="Pricing" active={activeItem === "Pricing"} onClick={handleNavClick} />
            <NavItem label="Settings" active={activeItem === "Settings"} onClick={handleNavClick} />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full">AJ</div>
            <div>
              <div className="font-medium">Alex Johnson</div>
              <div>Product Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          >
            Create a New Project
          </button>

          {showOptions && (
            <div className="mt-4 space-y-2">
              <div
                className="p-3 bg-white shadow rounded cursor-pointer hover:bg-blue-50"
                onClick={handleJiraClick}
              >
                Jira
              </div>
              <div className="p-3 bg-white shadow rounded cursor-pointer hover:bg-blue-50">Kanban</div>
              {isPremium && (
                <div
                  className="p-3 bg-yellow-100 shadow rounded cursor-pointer hover:bg-yellow-200"
                  onClick={handleDevClick}
                >
                  Dev <span className="text-xs text-gray-600">(Premium)</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, active, onClick }) => (
  <div
    onClick={() => onClick(label)}
    className={`flex items-center space-x-2 cursor-pointer px-2 py-2 rounded-md hover:bg-blue-50 text-sm ${
      active ? "bg-blue-100 font-semibold text-blue-700" : "text-gray-700"
    }`}
  >
    <span>{label}</span>
  </div>
);

export default FinalDashboard;
