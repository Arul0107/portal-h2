import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, message, Button, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm(); // Form instance for resetting fields

  // Fetch users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employees');
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          message.error('Failed to fetch users');
        }
        setLoading(false);
      } catch (error) {
        message.error('Error fetching users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      message.success('User deleted successfully');
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      message.error('Error deleting user');
    }
  };

  // Show edit modal
  const showEditModal = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...user,
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '', // Format date for input[type="date"]
    });
  };

  // Handle submit for editing user
  const handleEditSubmit = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/employees/${editingUser._id}`, values);
      if (response.status === 200) {
        message.success('User updated successfully');
        // Update the user in the state
        setUsers(users.map((user) => (user._id === editingUser._id ? { ...response.data.employee } : user)));
        setIsModalVisible(false);
        setEditingUser(null);
      } else {
        message.error('Failed to update user');
      }
    } catch (error) {
      message.error('Error updating user');
    }
  };

  const columns = [
    { title: 'Employee ID', dataIndex: 'employee_id', key: 'employee_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    {
      title: 'DOB',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) => (dob ? new Date(dob).toLocaleDateString() : 'N/A'),
    },
    { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Department ID', dataIndex: 'department_id', key: 'department_id' },
    { title: 'Asset ID', dataIndex: 'asset_id', key: 'asset_id' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <>
          <Button onClick={() => showEditModal(user)}>Edit</Button>
          <Button onClick={() => handleDelete(user._id)} style={{ marginLeft: 10 }} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Data</h2>
      <Table columns={columns} dataSource={users} rowKey="_id" pagination={{ pageSize: 5 }} />
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields(); // Reset form fields
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item name="employee_id" label="Employee ID">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="department_id" label="Department ID">
            <Input />
          </Form.Item>
          <Form.Item name="asset_id" label="Asset ID">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTable;
