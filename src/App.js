/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

function App() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');

  // Add a useEffect to log page changes for debugging
  useEffect(() => {
    console.log('Current Page:', page);
    console.log('Is Logged In:', isLoggedIn);
  }, [page, isLoggedIn]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.success) {
        setPage('login');
        setError('Signup successful! Please log in.');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.success) {
        // Explicitly set both login state and page
        setIsLoggedIn(true);
        setPage('shopping-list');
      } else {
        setError(result.message || 'Login failed');
        // Ensure page remains on login if login fails
        setPage('login');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      // Ensure page remains on login if there's a network error
      setPage('login');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('login');
    setUsername('');
    setPassword('');
    setItems([]);
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), text: newItem, completed: false }]);
      setNewItem('');
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (item) => {
    setEditingItem(item);
  };

  const saveEdit = () => {
    setItems(items.map(item =>
        item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
  };

  const colorPalette = {
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    cardBackground: 'linear-gradient(to right, #ffffff 0%, #f9f9f9 100%)',
    primaryColor: '#6a11cb',
    secondaryColor: '#2575fc',
    accentColor: '#ff9a9e',
    textColor: '#333',
    lightText: '#666',
    successColor: '#48dbfb',
    errorColor: '#ff6b6b'
  };

  const styles = {
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: colorPalette.background,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      margin: 0,
      padding: 0,
    },
    card: {
      background: colorPalette.cardBackground,
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '450px',
      animation: 'fadeIn 0.5s ease-out',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    title: {
      textAlign: 'center',
      color: colorPalette.primaryColor,
      marginBottom: '1.5rem',
      fontSize: '2rem',
      fontWeight: 700,
      background: `linear-gradient(to right, ${colorPalette.primaryColor}, ${colorPalette.secondaryColor})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: `1px solid ${colorPalette.accentColor}`,
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255,255,255,0.7)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    primaryButton: {
      background: `linear-gradient(to right, ${colorPalette.primaryColor}, ${colorPalette.secondaryColor})`,
      color: 'white',
      border: 'none',
      padding: '12px 15px',
      borderRadius: '12px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    listItem: {
      background: 'linear-gradient(to right, #ffffff, #f1f2f3)',
      borderRadius: '12px',
      padding: '12px',
      marginBottom: '0.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.05)',
    },
    actionButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    errorMessage: {
      color: colorPalette.errorColor,
      textAlign: 'center',
      marginBottom: '1rem',
      fontWeight: 600,
    },
    switchLink: {
      textAlign: 'center',
      color: colorPalette.secondaryColor,
      cursor: 'pointer',
      textDecoration: 'underline',
      marginTop: '0.5rem',
      transition: 'color 0.3s ease',
    }
  };

  const renderLogin = () => (
      <div style={styles.pageContainer}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔐 Login</h1>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
              />
            </div>
            <div>
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
              />
            </div>
            <button type="submit" style={styles.primaryButton}>Login</button>
            <p
                onClick={() => setPage('signup')}
                style={styles.switchLink}
            >
              Need an account? Sign up
            </p>
          </form>
        </div>
      </div>
  );

  const renderSignup = () => (
      <div style={styles.pageContainer}>
        <div style={styles.card}>
          <h1 style={styles.title}>📝 Sign Up</h1>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleSignup} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
              />
            </div>
            <div>
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
              />
            </div>
            <button type="submit" style={styles.primaryButton}>Sign Up</button>
            <p
                onClick={() => setPage('login')}
                style={styles.switchLink}
            >
              Already have an account? Login
            </p>
          </form>
        </div>
      </div>
  );

  const renderShoppingList = () => (
      <div style={styles.pageContainer}>
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h1 style={styles.title}>🛒 Shopping List</h1>
            <button onClick={handleLogout} style={{...styles.actionButton, fontSize: '1.2rem'}}>🚪 Logout</button>
          </div>
          <div style={{display: 'flex', marginBottom: '1rem', gap: '0.5rem'}}>
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add shopping item"
                style={styles.input}
            />
            <button onClick={addItem} style={{...styles.primaryButton, padding: '12px'}}>➕ Add</button>
          </div>
          {items.length === 0 ? (
              <p style={{textAlign: 'center', color: styles.lightText}}>Your shopping list is empty 📭</p>
          ) : (
              <ul style={{listStyle: 'none', padding: 0}}>
                {items.map(item => (
                    <li key={item.id} style={styles.listItem}>
                      {editingItem && editingItem.id === item.id ? (
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <input
                                type="text"
                                value={editingItem.text}
                                onChange={(e) => setEditingItem({...editingItem, text: e.target.value})}
                                style={styles.input}
                            />
                            <button onClick={saveEdit} style={{...styles.primaryButton, padding: '12px'}}>💾 Save</button>
                          </div>
                      ) : (
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>{item.text}</span>
                            <div>
                              <button
                                  onClick={() => startEditing(item)}
                                  style={{...styles.actionButton, marginRight: '0.5rem'}}
                              >
                                ✏️
                              </button>
                              <button
                                  onClick={() => deleteItem(item.id)}
                                  style={styles.actionButton}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                      )}
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );

  return (
      <div style={{
        background: colorPalette.background,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Add a debug condition to always show login page if not logged in */}
        {(!isLoggedIn || page === 'login') && renderLogin()}
        {page === 'signup' && renderSignup()}
        {isLoggedIn && page === 'shopping-list' && renderShoppingList()}
      </div>
  );
}

function client() {
  createRoot(document.getElementById("root")).render(<App />);
}
if (typeof document !== "undefined") { client(); }

export default async function server(request: Request): Promise<Response> {
  const { sqlite } = await import("https://esm.town/v/stevekrouse/sqlite");
  const KEY = new URL(import.meta.url).pathname.split("/").at(-1);

  // Create users table
  await sqlite.execute(`
    CREATE TABLE IF NOT EXISTS ${KEY}_users (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              username TEXT UNIQUE NOT NULL,
                                              password TEXT NOT NULL
    )
  `);

  // Handle signup
  if (request.method === 'POST' && new URL(request.url).pathname.endsWith('/signup')) {
    const { username, password } = await request.json();

    try {
      await sqlite.execute(`
        INSERT INTO ${KEY}_users (username, password) VALUES (?, ?)
      `, [username, password]);

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Username already exists'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle login
  if (request.method === 'POST' && new URL(request.url).pathname.endsWith('/login')) {
    const { username, password } = await request.json();

    const result = await sqlite.execute(`
      SELECT * FROM ${KEY}_users
      WHERE username = ? AND password = ?
    `, [username, password]);

    if (result.rows.length > 0) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid username or password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Render main page
  return new Response(`
    <html>
      <head>
        <title>Colorful Shopping List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          body { 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
          }
          * {
            box-sizing: border-box;
            transition: all 0.3s ease;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="https://esm.town/v/std/catch"></script>
        <script type="module" src="${import.meta.url}"></script>
        <a href="${import.meta.url.replace("esm.town", "val.town")}" target="_top" style="position: fixed; bottom: 10px; right: 10px; color: #fff; text-decoration: none; background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 5px;">View Source</a>
      </body>
    </html>
  `, {
    headers: {
      "content-type": "text/html",
    },
  });
}