'use client';

import { Table, Button, Modal, Form, Input, Space, Popconfirm, Pagination, Spin, InputNumber } from 'antd';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiSearch, FiTrash2 } from 'react-icons/fi';

export default function ResearchManagement() {
  const [researches, setResearches] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false)

  // Fetch researches with pagination and search
  const fetchResearches = async (page = 1, pageSize = 10, searchQuery = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/research?page=${page}&pageSize=${pageSize}&search=${searchQuery}`);
      const data = await res.json();
      if (res.ok) {
        setResearches(data.researches);
        setTotalItems(data.total);
      } else {
        toast.error('Failed to fetch researches');
      }
    } catch (error) {
      toast.error('Failed to fetch researches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearches(currentPage, pageSize, search);
  }, [currentPage, pageSize, search]);

  // Handle form submission for adding/updating research
  const handleSubmit = async (values: any) => {
    try {
      const url = editingId ? `/api/research` : '/api/research';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, id: editingId }),
      });

      if (res.ok) {
        toast.success(editingId ? 'Research updated!' : 'Research created!');
        fetchResearches(currentPage, pageSize, search);
        setIsModalVisible(false);
        form.resetFields();
        setEditingId(null);
      } else {
        toast.error('Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  // Handle deletion
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/research?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Research deleted!');
        fetchResearches(currentPage, pageSize, search);
      } else {
        toast.error('Failed to delete research');
      }
    } catch (error) {
      toast.error('Failed to delete research');
    }
  };

  // Define table columns
  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text: String, record: any, index: number) => (currentPage - 1) * 10 + (index + 1),
      width: 70,
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'DOI', dataIndex: 'doi', key: 'doi' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: any) => (
        <Space>
          <Button
            className="bg-blue-500"
            icon={<FiEdit />}
            type="primary"
            onClick={() => {
              setEditingId(record._id);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
            okButtonProps={{ style: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' } }}
          >
            <Button icon={<FiTrash2 />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Research Management</h1>
        <Input
          placeholder="Search Researches by name..."
          prefix={<FiSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200, marginRight: 10 }}
          allowClear
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
          className='bg-blue-500'
        >
          Add Research
        </Button>
      </div>

      {loading ? (
        <Spin size="large" className="flex justify-center mt-10" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={researches}
            rowKey="_id"
            pagination={false}
            className="text-black"
          />
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
            />
          </div>
        </>
      )}

      {/* Modal */}
      <Modal
        title={editingId ? 'Edit Research' : 'Add Research'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[
              { required: true, message: 'Year is required' },
              { 
                type: 'number', 
                min: 1900, 
                max: new Date().getFullYear(), 
                message: 'Year should be a valid number between 1900 and the current year' 
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="doi"
            label="DOI"
            rules={[
              { required: true, message: 'DOI is required' },
              { type: 'url', message: 'Invalid URL format' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='bg-blue-500'>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
