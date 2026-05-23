import React, { useContext, useEffect, useState } from 'react';
import Thead from '../../components/ListComponents/Thead';
import TRow from '../../components/ListComponents/TRow';
import axios from 'axios';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';
import { showToast } from '../../utils/toast.js';

const ListFeature = () => {
  const [rows, setRows] = useState([]);
  const [button, setButton] = useState(true);
  const { User } = useContext(LoginContext);

  const [newRow, setNewRow] = useState({
    Types: '',
    Key: '',
    Summary: '',
    Status: '',
    comment: '',
    Assignee: 'Devansh Jain',
    Priority: '',
    Updated: '',
    Reporter: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/List/getList');
      setRows(response.data.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/List/NewList', newRow);

      // Optimistically update UI
      setRows((prevRows) => [response.data, ...prevRows]);

      setButton(true);
      showToast.success('Data added successfully!');
      setNewRow({
        Types: '',
        Key: '',
        Summary: '',
        Status: '',
        comment: '',
        Assignee: User,
        Priority: '',
        Updated: '',
        Reporter: '',
      });
    } catch (error) {
      console.error('Error adding new data:', error);
      showToast.error('Failed to add data.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">📋 Issue Tracker Table</h2>
        <p className="text-sm text-gray-500">Manage and view all the issues created</p>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <Thead />
          <tbody>
            {rows.map((row, index) => (
              <TRow key={index} data={row} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        {button ? (
          <button
            type="button"
            onClick={() => setButton(false)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            ➕ Add New
          </button>
        ) : (
          <form onSubmit={handlePost} className="mt-6 space-y-4 bg-gray-50 p-6 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Type', key: 'Types' },
                { label: 'Key', key: 'Key' },
                { label: 'Summary', key: 'Summary' },
                { label: 'Status', key: 'Status' },
                { label: 'Comment', key: 'comment' },
                { label: 'Priority', key: 'Priority' },
                { label: 'Updated', key: 'Updated' },
                { label: 'Reporter', key: 'Reporter' },
              ].map(({ label, key }) => (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  value={newRow[key]}
                  onChange={(e) => setNewRow({ ...newRow, [key]: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                ✅ Submit
              </button>
              <button
                type="button"
                onClick={() => setButton(true)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ListFeature;
