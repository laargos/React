import PocketBase from 'pocketbase';
import React, { useState } from 'react';
import './App.css'; // Make sure to import your CSS file

const pb = new PocketBase('http://127.0.0.1:8090');

function App() {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    emailVisibility: true,
    verified: false,
  });
  const [users, setUsers] = useState([]); // State to hold user records

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('users').create(formData);
      console.log('Record created:', record);
      setUsers((prevUsers) => [...prevUsers, record]); // Add new user to the state
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        emailVisibility: true,
        verified: false,
      });
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('users').delete(id);
      console.log('Record deleted:', id);
      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Create New User</h1>
        {error && <p>Error: {error.message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
          <label>
            <input
              type="checkbox"
              name="emailVisibility"
              checked={formData.emailVisibility}
              onChange={handleChange}
            />
            Email Visibility
          </label>
          <label>
            <input
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
            />
            Verified
          </label>
          <button type="submit">Create User</button>
        </form>

        <h2>Existing Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;