import React from 'react';

const Thead = () => {
  return (
    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
      <tr>
        <th className="px-4 py-2 text-left">Types</th>
        <th className="px-4 py-2 text-left">Key</th>
        <th className="px-4 py-2 text-left">Summary</th>
        <th className="px-4 py-2 text-left">Status</th>
        <th className="px-4 py-2 text-left">Comment</th>
        <th className="px-4 py-2 text-left">Category</th>
        <th className="px-4 py-2 text-left">Assignee</th>
        <th className="px-4 py-2 text-left">Priority</th>
        <th className="px-4 py-2 text-left">Created</th>
        <th className="px-4 py-2 text-left">Updated</th>
        <th className="px-4 py-2 text-left">Reporter</th>
      </tr>
    </thead>
  );
};

export default Thead;
