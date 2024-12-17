import PocketBase from 'pocketbase';
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
// import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(' http://127.0.0.1:8090/api/collections/Username/records');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };


    fetchData();



    //post
    const pb = new PocketBase('http://127.0.0.1:8090');
    const data = {
      "employee_name": "ali",
      "employee_email": "ali@example.com"
    };

    // del
    // const b = new PocketBase('http://127.0.0.1:8090');
    // b.collection('org').delete('oq2ufgdt72dln16');



    const record = pb.collection('org').create(data);
    //delete
    // const p = new PocketBase('http://127.0.0.1:8090');
    // pb.collection('Username').delete('RECORD_ID');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          {/* Edit <code>src/App.js</code> and save to reload. */}
        </p>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <div>
            <h2>Fetched Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Learn React with me */}
        </a>
      </header>
    </div>
  );
}

export default App;