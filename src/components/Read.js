import React, { useEffect, useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Initialize PocketBase client

export default function Read() {
  const [APIData, setAPIData] = useState([]);

  useEffect(() => {
    getData(); // Fetch data on component mount
  }, []);

  const setData = (data) => {
    let { id, First_Name, Last_Name } = data; // Removed checkbox from destructuring
    localStorage.setItem('ID', id);
    localStorage.setItem('First_Name', First_Name);
    localStorage.setItem('Last_Name', Last_Name);
  };

  const onDelete = async (id) => {
    try {
      await pb.collection('Username').delete(id); // Delete record by ID
      getData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const getData = async () => {
    try {
      const records = await pb.collection('Username').getFullList(); // Fetch all records
      setAPIData(records);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  return (
    <div>
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
                <Link to='/update'>
                  <Table.Cell>
                    <Button onClick={() => setData(data)}>Update</Button>
                  </Table.Cell>
                </Link>
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