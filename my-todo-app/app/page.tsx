"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000/todos";

const Home: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axios.get(API_URL)
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = () => {
    const todo = { id: Date.now(), text: newTodo, completed: false };
    axios.post(API_URL, todo)
      .then(response => setTodos([...todos, response.data]))
      .catch(error => console.error('Error adding todo:', error));
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find((t: any) => t.id === id);
    axios.put(`${API_URL}/${id}`, { ...todo, completed: !todo.completed })
      .then(response => {
        setTodos(todos.map((t: any) => (t.id === id ? response.data : t)));
      })
      .catch(error => console.error('Error toggling todo:', error));
  };

  const deleteTodo = (id: number) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((t: any) => t.id !== id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ textAlign: 'center' }}>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
        style={{ padding: '8px', marginRight: '8px', width: '200px' }}
      />
      <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
      <ul>
        {todos.map((todo: any) => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '8px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;