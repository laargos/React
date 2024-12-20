import React, { useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Initialize PocketBase client

export default function Update() {
  const [First_Name, setFirstName] = useState('');
  const [Last_Name, setLastName] = useState('');
  const [progress, setProgress] = useState(0);
  const [id, setID] = useState(null);
  let history = useNavigate();

  useEffect(() => {
    setID(localStorage.getItem('ID'));
    setFirstName(localStorage.getItem('First_Name'));
    setLastName(localStorage.getItem('Last_Name'));
  }, []);

  const updateAPIData = async () => {
    try {
      setProgress(30); // Set initial progress
      await pb.collection('Username').update(id, {
        First_Name,
        Last_Name,
      });
      setProgress(100); // Set progress to 100 on success
      history('/read'); // Navigate to the read page
    } catch (error) {
      console.error('Error updating record:', error);
      setProgress(0); // Reset progress on error
    }
  };

  const handleButtonClick = () => {
    updateAPIData(); // Call the updateAPIData function
  };

  return (
    <div>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)} // Reset progress when finished
      />
      <Form className="create-form">
        <Form.Field>
          <label>First Name</label>
          <input
            placeholder='First Name'
            value={First_Name}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input
            placeholder='Last Name'
            value={Last_Name}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Field>
        <Button
          type='button' // Change to 'button' to prevent form submission
          onClick={handleButtonClick}
        >
          Update
        </Button>
      </Form>
    </div>
  );
}