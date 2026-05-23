import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext';

// INTERVIEW NOTE: Establishes a persistent TCP WebSocket handshake connection with Port 8000
const socket = io('http://localhost:8000'); // backend URL

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const {User,setUser}=useContext(LoginContext);
  
  useEffect(() => {
    // INTERVIEW NOTE: socket.on() mounts a dynamic event listener on the client.
    // When the backend broadcasts a "receiveMessage" payload, it triggers this callback
    // and appends the new message object ({content, sender}) to our local chat state.
    socket.on('receiveMessage', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    // Clean up the listener on unmount to avoid memory leaks and duplicate triggers
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // INTERVIEW NOTE: Emits the "sendMessage" event with a custom data payload to the backend
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        content: message,
        sender: User, // Dynamic active user read from global login context
      };

      // Dispatches the payload over the persistent websocket channel to the server
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
