// DocumentManagement.js
import React, { useEffect, useState } from 'react';
import { Upload, Modal, Form, Input, Button, Checkbox, Layout, Divider, Table, Tooltip, message } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import './DocumentManagement.css';
import { ref, set, push, remove, onValue } from 'firebase/database';
import { database } from '../../services/firebaseConfig';

const { Header, Content } = Layout;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

const initialDocuments = [
  { label: "Copy of Standard X certificate and mark sheets", key: "doc1", type: "pdf" },
  { label: "Copy of Passport/Passport application form", key: "doc8", type: "photo" },
];

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ employeeName: '', submittedBy: '', submittedTo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    const fetchDocuments = () => {
      const documentsRef = ref(database, 'documents');
      onValue(documentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const docsArray = Object.keys(data).map((key) => ({ key, ...data[key] }));
          setDocuments(docsArray);
        } else {
          setDocuments([]);
        }
      });
    };
    fetchDocuments();
  }, []);

  const openReceiveModal = (document = {}) => {
    setIsEditing(!!document.key);
    setFormData(document);
    setEditKey(document.key || null);
    setModalIsOpen(true);
  };

  const closeReceiveModal = () => {
    setModalIsOpen(false);
    setFormData({ employeeName: '', submittedBy: '', submittedTo: '' });
  };

  const handleFileValidation = (file, docType) => {
    const isPDF = file.type === 'application/pdf';
    const isJPG = file.type === 'image/jpeg';
    const isSizeValid = file.size <= MAX_FILE_SIZE;

    if (docType === 'pdf' && !isPDF) {
      message.error(`${file.name} is not a PDF file!`);
      return false;
    }
    if (docType === 'photo' && !isJPG) {
      message.error(`${file.name} is not a valid JPG file!`);
      return false;
    }
    if (!isSizeValid) {
      message.error(`${file.name} exceeds the 15 MB size limit.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (key, info) => {
    const { fileList } = info;
    const docType = initialDocuments.find((doc) => doc.key === key)?.type;
    const validFiles = fileList.filter(file => handleFileValidation(file, docType));

    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], file: validFiles.length > 0 ? validFiles[0].name : null, confirmed: validFiles.length > 0 },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.employeeName || !formData.submittedBy || !formData.submittedTo) {
      message.error('Please fill in all required fields.');
      return;
    }

    const newDocument = {
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const documentsRef = ref(database, 'documents');
    const newDocRef = push(documentsRef);

    set(newDocRef, newDocument)
      .then(() => {
        message.success('Document added successfully!');
        closeReceiveModal();
      })
      .catch((error) => {
        message.error(`Failed to add document: ${error.message || 'Unknown error'}`);
      });
  };

  const handleDelete = (key) => {
    const documentRef = ref(database, `documents/${key}`);
    remove(documentRef)
      .then(() => {
        message.success("Document deleted successfully!");
      })
      .catch((error) => {
        message.error("Failed to delete document.");
      });
  };

  const columns = [
    { title: 'Employee Name', dataIndex: 'employeeName', render: (text) => <span>{text || 'N/A'}</span> },
    { title: 'Document', dataIndex: 'document', render: (_, record) => initialDocuments.map((doc) => (
        <div key={doc.key}>
          {record[doc.key]?.file ? <span>{doc.label}: {record[doc.key]?.file}</span> : <span>{doc.label}: Pending</span>}
        </div>
      )) },
    { title: 'Created At', dataIndex: 'createdAt', render: (text) => new Date(text).toLocaleString() },
    { title: 'Updated At', dataIndex: 'updatedAt', render: (text) => new Date(text).toLocaleString() },
    { title: 'Actions', render: (_, record) => (
        <>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => openReceiveModal(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header className="header">
          <h1>Document Management</h1>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <Divider />
          <Button type="primary" onClick={() => openReceiveModal()}>Upload Document</Button>
          <Table columns={columns} dataSource={documents} pagination={false} />
        </Content>

        <Modal title={isEditing ? 'Edit Document' : 'Upload Document'} visible={modalIsOpen} onCancel={closeReceiveModal} footer={null}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Employee Name" required>
              <Input name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Submitted By" required>
              <Input name="submittedBy" value={formData.submittedBy} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Submitted To" required>
              <Input name="submittedTo" value={formData.submittedTo} onChange={handleInputChange} />
            </Form.Item>
            {initialDocuments.map((document) => (
              <Form.Item key={document.key} label={document.label}>
                <Upload
                  name={document.key}
                  beforeUpload={(file) => handleFileValidation(file, document.type)}
                  onChange={(info) => handleFileChange(document.key, info)}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload {document.type}</Button>
                </Upload>
              </Form.Item>
            ))}
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default DocumentManagement;
  