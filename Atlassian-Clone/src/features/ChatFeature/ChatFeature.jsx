import React from 'react';

const ChatFeature = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 Buy Premium for This</h2>
        <p className="text-gray-600 mb-2">
          🚧 Currently Not Available, But Coming Soon!
        </p>
        <p className="text-blue-500 font-medium">🧩 Built Using WebSocket</p>
      </div>
    </div>
  );
};

export default ChatFeature;
