import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';

const socket = io('http://localhost:5000'); // backend URL

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const {User,setUser}=useContext(LoginContext);
  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    // Clean up the listener
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        content: message,
        sender: User, // Replace with dynamic user info if needed
      };

      socket.emit('sendMessage', messageData);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h3>Live Chat</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        {chatMessages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender || 'Unknown'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={message}
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '80%', padding: '5px' }}
        />
        <button type="submit" style={{ width: '18%', padding: '5px' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
