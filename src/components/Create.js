import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'semantic-ui-react';
import LoadingBar from 'react-top-loading-bar';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Initialize PocketBase client

export default function UserManagement() {
  const [First_Name, setFirstName] = useState('');
  const [Last_Name, setLastName] = useState('');
  const [progress, setProgress] = useState(0);
  const [APIData, setAPIData] = useState([]);
  const [editingId, setEditingId] = useState(null); // State to track which record is being edited

  useEffect(() => {
    getData(); // Fetch existing records on component mount
  }, []);

  const getData = async () => {
    try {
      const records = await pb.collection('Username').getFullList(); // Fetch all records
      setAPIData(records);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const postData = async () => {
    if (!First_Name || !Last_Name) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      setProgress(30); // Set initial progress
      await pb.collection('Username').create({
        First_Name,
        Last_Name,
      });
      setProgress(100); // Set progress to 100 on success
      resetForm(); // Reset the form
      getData(); // Refresh the list after creating a new record
    } catch (error) {
      console.error('Error creating record:', error);
      setProgress(0); // Reset progress on error
    }
  };

  const addEmptyUser  = async () => {
    try {
      setProgress(30); // Set initial progress
      await pb.collection('Username').create({
        First_Name: '', // Create with empty fields
        Last_Name: '',
      });
      setProgress(100); // Set progress to 100 on success
      getData(); // Refresh the list after creating a new record
    } catch (error) {
      console.error('Error creating empty record:', error);
      setProgress(0); // Reset progress on error
    }
  };

  const updateData = async () => {
    if (!First_Name || !Last_Name) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      setProgress(30); // Set initial progress
      await pb.collection('Username').update(editingId, {
        First_Name,
        Last_Name,
      });
      setProgress(100); // Set progress to 100 on success
      resetForm(); // Reset the form
      getData(); // Refresh the list after updating a record
    } catch (error) {
      console.error('Error updating record:', error);
      setProgress(0); // Reset progress on error
    }
  };

  const handleButtonClick = () => {
    if (editingId) {
      updateData(); // Call update function if editing
    } else {
      postData(); // Call create function if not editing
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEditingId(null); // Reset editing ID
  };

  const handleEdit = (data) => {
    setFirstName(data.First_Name);
    setLastName(data.Last_Name);
    setEditingId(data.id); // Set the ID of the record being edited
  };

  const onDelete = async (id) => {
    try {
      await pb.collection('Username').delete(id); // Delete record by ID
      getData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting record:', error);
    }
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
            placeholder='First_Name'
            value={First_Name}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input
            placeholder='Last_Name'
 value={Last_Name}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Field>
        <Button
          type='button' // Change to 'button' to prevent form submission
          onClick={handleButtonClick}
        >
          {editingId ? 'Update' : 'Submit On Pb'}
        </Button>
        <Button
          type='button' // Add button to create empty fields
          onClick={addEmptyUser }
        >
          Add Empty User on Pb
        </Button>
      </Form>

      <h2>Existing User's Pb</h2>
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Last Name</Table.HeaderCell>
            <Table.HeaderCell>Update</Table.HeaderCell>
            <Table.HeaderCell>Delete</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {APIData.map((data) => {
            return (
              <Table.Row key={data.id}>
                <Table.Cell>{data.First_Name}</Table.Cell>
                <Table.Cell>{data.Last_Name}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleEdit(data)}>Update</Button>
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => onDelete(data.id)}>Delete</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}