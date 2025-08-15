import React, { useState } from 'react';
import './App.css';
import AdminPanel from './components/AdminPanel';

const VALID_USERS = ['john', 'niraj', 'christian', 'mike', 'paul', 'tommy', 'talha'];
const VALID_PASSWORD = 'BBB45Z_moon_launch';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!VALID_USERS.includes(username.trim().toLowerCase())) {
      setError('Unknown user');
    } else if (password !== VALID_PASSWORD) {
      setError('Incorrect password');
    } else {
      setError('');
      setLoggedIn(true);
    }
  };

  if (!loggedIn) {
    return <AdminPanel />;
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Forge v2 Admin Panel</h1>
        {error && <div className="error">{error}</div>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
);
}
