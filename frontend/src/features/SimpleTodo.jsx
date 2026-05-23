import React, { useState } from 'react';

const SimpleTodo = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Simple Todo App</h2>
      <input
        type="text"
        value={input}
        placeholder="Enter a task"
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>• {todo}</li>
        ))}
      </ul>
    </div>
  );
};

export default SimpleTodo;
