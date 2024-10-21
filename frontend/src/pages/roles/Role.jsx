import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Input, Button, Select, Row, Col, Typography } from 'antd';
import './Role.css';
import Rolein from '../../assets/images/roleImage.png';

const { Title } = Typography;
const { Option } = Select;

const Role = () => {
  const [userData, setUserData] = useState({
    employee_id: '',
    name: '',
    gender: '',
    dob: '',
    phone_number: '',
    address: '',
    email: '',
    department_id: '',
    asset_id: '',
    role: 'employee',
  });

  const navigate = useNavigate();

  // Fetch latest employee ID on component load
  useEffect(() => {
    const fetchEmployeeID = async () => {
      try {
        const response = await axios.get('http://localhost:5000/latest-employee-id');
        const latestID = response.data.latestEmployeeID;
        const newIDNumber = (parseInt(latestID.slice(7)) + 1).toString().padStart(2, '0');
        const newEmployeeID = `dotsemp${newIDNumber}`;
        setUserData((prevData) => ({ ...prevData, employee_id: newEmployeeID }));
      } catch (error) {
        toast.error('Failed to fetch the latest Employee ID.');
        console.error('Error fetching employee ID:', error);
      }
    };

    fetchEmployeeID();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const password = 'dotsito123'; // Static password, change if needed
    try {
      const response = await axios.post('http://localhost:5000/register', { ...userData, password });
      toast.success(`Employee registered successfully! Password: ${password}`);
      setTimeout(() => navigate('/role'), 2000);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="add-user-page">
      <Row justify="center" gutter={24} className="role-container">
        <Col xs={24} sm={12} md={12} className="left-side">
          <div className="image-container">
            <img src={Rolein} alt="Role Illustration" className="role-image" />
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} className="right-side">
          <div className="form-container">
            <Title level={2}>Create New Employee</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Employee ID" name="employee_id">
                <Input value={userData.employee_id} disabled /> {/* Disable manual edit */}
              </Form.Item>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                <Input placeholder="Enter name" value={userData.name} onChange={handleChange} name="name" />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                <Input placeholder="Enter email" value={userData.email} onChange={handleChange} name="email" />
              </Form.Item>
              <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select a gender!' }]}>
                <Select value={userData.gender} onChange={(value) => setUserData({ ...userData, gender: value })} name="gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Date of Birth" name="dob" rules={[{ required: true, message: 'Please input your date of birth!' }]}>
                <Input type="date" value={userData.dob} onChange={handleChange} name="dob" />
              </Form.Item>
              <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                <Input placeholder="Enter phone number" value={userData.phone_number} onChange={handleChange} name="phone_number" />
              </Form.Item>
              <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
                <Input placeholder="Enter address" value={userData.address} onChange={handleChange} name="address" />
              </Form.Item>
              <Form.Item label="Department ID" name="department_id" rules={[{ required: true, message: 'Please input your department ID!' }]}>
                <Input placeholder="Enter Department ID" value={userData.department_id} onChange={handleChange} name="department_id" />
              </Form.Item>
              <Form.Item label="Asset ID" name="asset_id" rules={[{ required: true, message: 'Please input your asset ID!' }]}>
                <Input placeholder="Enter Asset ID" value={userData.asset_id} onChange={handleChange} name="asset_id" />
              </Form.Item>
              <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role!' }]}>
                <Select value={userData.role} onChange={(value) => setUserData({ ...userData, role: value })} name="role">
                  <Option value="employee">Employee</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="hr">HR</Option>
                  <Option value="team_leader">Team Leader</Option>
                  <Option value="super_admin">Super Admin</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create Employee
                </Button>
              </Form.Item>
              <Button type="primary" onClick={() => navigate('/users')}>
                View Employees
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Role;
