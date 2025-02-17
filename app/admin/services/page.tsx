'use client';

import { Table, Button, Modal, Form, Input, Space, Popconfirm, Pagination, Spin, Select } from 'antd';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  const fetchServices = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/services?page=${page}&pageSize=${pageSize}&search=${search}`);
      const data = await res.json();
      setServices(data.services);
      setTotalItems(data.total);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSubmit = async (values: any) => {
    try {
      const url = editingId ? `/api/services` : '/api/services'; // URL stays the same
      const method = editingId ? 'PUT' : 'POST';
  
      // Include the editingId in the request body for PUT requests
      const body = editingId ? { ...values, id: editingId } : values;
  
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (res.ok) {
        toast.success(editingId ? 'Service updated!' : 'Service created!');
        fetchServices(currentPage, searchTerm);
        setIsModalVisible(false);
        form.resetFields();
        setEditingId(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };
  

  const handleDelete = async (id:String) => {
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Service deleted!');
        fetchServices(currentPage, searchTerm);
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text: String, record: any, index: number) => (currentPage - 1) * pageSize + (index + 1),
      width: 70,
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: String, record: any) => (
        <Space>
          <Button
            icon={<FiEdit />}
            type="primary"
            onClick={() => {
              setEditingId(record._id);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
            className='bg-blue-500'
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
        <h1 className="text-2xl font-bold text-black">Services Management</h1>
        <div className="flex gap-2">
          <Input allowClear placeholder="Search services..." prefix={<FiSearch />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button className='bg-blue-500' type="primary" onClick={() => { setEditingId(null); form.resetFields(); setIsModalVisible(true); }}>
            Add Service
          </Button>
        </div>
      </div>
      {loading ? (
        <Spin size="large" className="flex justify-center mt-10" />
      ) : (
        <>
          <Table columns={columns} dataSource={services} rowKey="_id" pagination={false} className="text-black" />
          <Pagination className="mt-4" current={currentPage} pageSize={pageSize} total={totalItems} onChange={(page) => setCurrentPage(page)} />
        </>
      )}

      <Modal title={editingId ? 'Edit Service' : 'Add Service'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Category is required' }]}
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

          {/* Sub-Services Management */}
          <Form.List name="sub_services">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="p-3 border rounded-lg mb-2">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Sub-Service Name"
                      rules={[{ required: true, message: 'Sub-service name is required' }]}
                    >
                      <Input placeholder="Enter sub-service name" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Sub-Service Description"
                      rules={[{ required: true, message: 'Sub-service description is required' }]}
                    >
                      <Input.TextArea placeholder="Enter sub-service description" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'technologies']}
                      label="Technologies"
                    >
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Select technologies"
                        // options={[
                        //   { label: 'React', value: 'react' },
                        //   { label: 'Node.js', value: 'node' },
                        //   { label: 'MongoDB', value: 'mongo' },
                        //   { label: 'Express.js', value: 'express' },
                        // ]}
                        options={[]}
                      />
                    </Form.Item>

                    <Button danger onClick={() => remove(name)}>Remove</Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  Add Sub-Service
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" className='bg-blue-500 mt-2'>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
