import { useContext, useEffect, useState } from 'react';
import { FaSearch, FaPlus, FaRocket, FaRegStar, FaSlidersH } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import ToDolist from '../../features/ToDolist';
import Jira from './Jira';
import ChatFeature from '../../features/ChatFeature/ChatFeature';
import Chat from '../../components/ChatComponents/Chat';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import LoginProvider from '../../../Context/LoginContext/LoginProvider';

export default function JiraDashboard() {
  const [activeTab, setActiveTab] = useState('Worked on');
  const {User,setUser}=useContext(LoginContext);
  

  const tabs = ['Summary', 'ToDo ', 'Create List/Forms', 'Starred', 'Assigned to me','Chat',"NewChat"];
  // const tasks = [
  //   { title: 'ygds dfhghf gsdf', id: 'XLR8-3', status: 'Updated' },
  //   { title: 'asfgsfdgdfs', id: 'XLR8-13', status: 'Created' },
  //   { title: 'dsfgdfdfgdfg', id: 'XLR8-12', status: 'Created' },
  //   { title: 'd', id: 'XLR8-11', status: 'Created' },
  //   { title: 'hlf', id: 'XLR8-9', status: 'Updated' },
  //   { title: 'gfs', id: 'XLR8-6', status: 'Updated' },
  //   { title: 'czcz', id: 'XLR8-8', status: 'Created' },
  //   { title: 'dfasdf', id: 'XLR8-7', status: 'Created' },
  // ];
  useEffect(() => {
    
  
    console.log(User);
    
  }, [])
  
  return (
    <div className="flex h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 text-sm shadow-md">
                <div className="mb-6 text-xl font-bold text-blue-600">Hello ! {User}</div>

        <div className="mb-6 text-xl font-bold text-blue-600">Jira</div>
        <nav className="space-y-3">
          <div className="text-blue-600 font-semibold">For you</div>
          <div className="hover:text-blue-500 cursor-pointer">Recent</div>
          <div className="hover:text-blue-500 cursor-pointer">Starred</div>
          <div className="hover:text-blue-500 cursor-pointer">Apps</div>
          <div className="font-semibold mt-2">Plans</div>
          <div className="ml-2 text-gray-700 hover:text-blue-500 cursor-pointer">Projects</div>
          <div className="ml-4 text-blue-600 font-medium">assdhlfksj</div>
          <div className="ml-6 text-sm hover:text-blue-500 cursor-pointer">View all projects</div>
          <div className="hover:text-blue-500 cursor-pointer">Filters</div>
          <div className="hover:text-blue-500 cursor-pointer">Dashboards</div>
          <div className="hover:text-blue-500 cursor-pointer">Teams</div>
          <div className="hover:text-blue-500 cursor-pointer">Goals</div>
          <div className="text-xs text-gray-500 mt-4 hover:text-blue-400 cursor-pointer">Customize sidebar</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="text-2xl font-bold mb-6">For you {User}</div>

        {/* Recent Project */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-lg w-80 shadow-sm mb-6">
          <div className="font-semibold text-lg">assdhlfksj</div>
          <div className="text-sm text-gray-600">Company-managed business</div>
          <div className="mt-3 space-y-1 text-sm">
            <div>Quick links</div>
            <div>
              My open work items <span className="bg-gray-300 rounded-full px-2 py-0.5 text-xs ml-1">2</span>
            </div>
            <div>Done work items</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 text-sm border-b mb-4 font-medium">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              // onClick={handleSections(tab)}
              className={`relative pb-2 px-1 cursor-pointer transition duration-200 ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab}
              {tab === 'Assigned to me' && (
                <span className="ml-1 bg-gray-300 text-xs rounded-full px-2 py-0.5">3</span>
              )}
            </div>
          ))}
        </div>

        {/* Task List */}
        <div className="text-xs text-gray-500 mb-3">IN THE LAST MONTH</div>
        <div className="space-y-4">
          {/* {tasks.map((task, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="accent-blue-500" />
                <div>
                  <div className="text-sm font-medium">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.id} - assdhlfksj</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">{task.status}</span>
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold shadow">
                  DJ
                </div>
              </div>
            </div>
          ))} */}
          <>
           {activeTab === 'ToDo ' && <ToDolist />}
           {activeTab === 'Create List/Forms' && <Jira />}
           {activeTab==='Chat'&&<ChatFeature/>}
           {activeTab=='NewChat' &&<Chat/>}
          </>

        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 p-4 bg-white border-l shadow-md">
        <div className="bg-yellow-100 p-4 rounded-md">
          <div className="font-bold text-lg mb-1">Jira Product Discovery</div>
          <div className="text-sm text-gray-700 mb-2">Build the right features, the right way</div>
          <p className="text-xs text-gray-600 mb-3">
            Prioritize your ideas then easily move them into delivery, without losing any details.
          </p>
          <button className="bg-white border border-gray-300 px-3 py-1 text-sm rounded hover:bg-gray-100">
            Try it now
          </button>
        </div>
      </div>
    </div>
  );
}
