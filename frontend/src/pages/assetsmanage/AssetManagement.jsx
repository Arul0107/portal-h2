import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Tag,
  Row,
  Col,
  Divider,
  Typography,
  Layout,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./AssetManagement.css"; // Import responsive styles
import Sidebar from "../../components/Sidebar";
import axios from "axios"; // Import axios for API calls

const { Option } = Select;
const { Header } = Layout;

const AssetManagement = () => {
  const [assets, setAssets] = useState([]); // Store asset details
  const [filteredAssets, setFilteredAssets] = useState([]); // Store filtered asset details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();

  // State to manage employees
  const [employees, setEmployees] = useState([]);

  // Fetch employees and assets on page load
  useEffect(() => {
    fetchEmployees();
    fetchAssets(); // Fetch assets from the server
  }, []);

  // Fetch employees from the server
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployees(response.data);
      console.log("Employees data:", response.data); // Check the data here
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees");
    }
  };
  
  // Fetch assets from the server
  const fetchAssets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/assets"); // Adjust to your actual API URL
      setAssets(response.data);
      setFilteredAssets(response.data); // Initialize filtered assets
    } catch (error) {
      console.error("Error fetching assets:", error);
      message.error("Failed to fetch assets");
    }
  };

  const showAddModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setEditingAsset(null);
  };

  const generateAssetID = () => `AST${Date.now().toString().slice(-4)}`;  // Asset ID generator

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
  
      if (!values.asset_id || values.asset_id.trim() === "") {
        values.asset_id = generateAssetID();
      }
  
      console.log("Generated Asset ID:", values.asset_id);  // Log the asset ID
  
      const employee = employees.find(
        (emp) => emp.employee_id === values.employee_id
      );
  
      const newAsset = {
        asset_id: values.asset_id,
        name: values.name,
        type: values.type,
        condition: values.condition,
        employee_id: values.employee_id,
        employee_name: employee ? employee.name : "",
        department: values.department,
        status: "received",
      };
  
      console.log("Asset to be submitted:", newAsset);
  
      if (editingAsset) {
        await axios.put(`http://localhost:5000/assets/${editingAsset._id}`, newAsset);
        message.success("Asset updated successfully!");
      } else {
        await axios.post("http://localhost:5000/assets/register", newAsset);
        message.success("Asset added successfully!");
      }
  
      fetchAssets();
      setIsModalVisible(false); // Close modal
    } catch (error) {
      console.error("Error saving asset:", error); // Log exact error
      message.error(error.response?.data?.message || "Failed to save asset");
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setIsModalVisible(true);
    form.setFieldsValue(record); // Populate form with asset data
    setEditingAsset(record);
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:5000/assets/${key}`); // Adjust URL
      message.success("Asset deleted successfully!");
      fetchAssets(); // Refresh the asset list
    } catch (error) {
      console.error("Error deleting asset:", error);
      message.error("Failed to delete asset");
    }
  };

  const handleStatusChange = async (key, status) => {
    const updatedStatus = status === "received" ? "notReturned" : "received";
    try {
      await axios.put(`http://localhost:5000/assets/${key}`, {
        status: updatedStatus,
      }); // Adjust URL
      message.success(`Asset status updated to ${updatedStatus}`);
      fetchAssets(); // Refresh the assets list
    } catch (error) {
      console.error("Error updating asset status:", error);
      message.error("Failed to update asset status");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = assets.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.employee_name.toLowerCase().includes(value) ||
        item.department.toLowerCase().includes(value)
    );
    setFilteredAssets(filtered);
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Asset ID",
      dataIndex: "asset_id",
      key: "asset_id",
    },
    {
      title: "Asset Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Types",
      dataIndex: "type",
      key: "type",
      render: (types) =>
        types
          ? types.map((type, index) => <Tag key={index}>{type}</Tag>)
          : "No Type Assigned",
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      key: "status",
      render: (record) =>
        record.status === "received" ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Received
          </Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Not Returned
          </Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => handleStatusChange(record._id, record.status)}
          >
            {record.status === "received"
              ? "Mark as Not Returned"
              : "Mark as Received"}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="asset-management-page">
      <Sidebar />
      <Header className="header">
        <h1 className="header-title">Asset Management</h1>
      </Header>
      <Divider />

      <Input
        className="search-bar"
        placeholder="Search by Asset Name, Employee Name, or Department"
        onChange={handleSearch}
        style={{ marginBottom: "16px", marginRight: "10px" }}
      />

      <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
        Add Asset
      </Button>
      <Table
        columns={columns}
        dataSource={filteredAssets} // Ensure filteredAssets is used for rendering
        rowKey="_id" // Use MongoDB object ID as the unique key
        style={{ marginTop: 16 }}
        scroll={{ x: 768 }} // Enable horizontal scrolling
      />

      <Modal
        title={editingAsset ? "Edit Asset" : "Add Asset"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800} // Set the modal width to a reasonable value for responsiveness
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="employee_id"
                label="Employee ID"
                rules={[{ required: true, message: "Employee ID is required" }]}
              >
                <Select placeholder="Select Employee ID">
                  {employees.map((emp) => (
                    <Option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_id} - {emp.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="asset_id"
                label="Asset ID"
                rules={[
                  { required: true, message: "Please enter a valid Asset ID" },
                ]}
              >
                <Input placeholder="Enter a unique Asset ID (e.g., LPT-1001)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Asset Name">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="type" label="Asset Types">
                <Select mode="multiple" placeholder="Select Asset Types">
                  <Option value="Laptop">Laptop</Option>
                  <Option value="Monitor">Monitor</Option>
                  <Option value="Keyboard">Keyboard</Option>
                  <Option value="Mouse">Mouse</Option>
                  <Option value="Phone">Phone</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="condition" label="Asset Condition">
                <Select>
                  <Option value="New">New</Option>
                  <Option value="Used">Used</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="department" label="Department">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetManagement;
