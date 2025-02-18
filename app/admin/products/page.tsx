'use client';

import { Table, Button, Modal, Form, Input, Space, Popconfirm, Pagination, Spin } from 'antd';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiSearch, FiTrash2 } from 'react-icons/fi';
import debounce from 'debounce';

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch products from API
  const fetchProducts = async (query = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?page=${page}&pageSize=${pageSize}&search=${query}`);
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Handle search with debounce
  const handleSearch = debounce((value: any) => {
    setSearch(value);
    setPage(1);
    fetchProducts(value);
  }, 500);

  // Handle form submission for adding/updating a product
  const handleSubmit = async (values: any) => {
    try {
      const url = editingId ? `/api/products` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...values } : values),
      });

      if (res.ok) {
        toast.success(editingId ? 'Product updated!' : 'Product created!');
        fetchProducts(search);
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

  // Handle deletion of a product
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted!');
        fetchProducts(search);
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text: String, record: any, index: number) => (page - 1) * 10 + (index + 1),
      width: 70,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Link', dataIndex: 'link', key: 'link' },
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
        <h1 className="text-2xl font-bold text-black">Products Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search products by name..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
            allowClear
            prefix={<FiSearch />}
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
            Add Product
          </Button>
        </div>
      </div>
      {loading ? (
        <Spin size="large" className="flex justify-center mt-10" />
      ) : (<><Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        pagination={false} // Pagination handled separately
        className="text-black"
      /> <div className="flex justify-end mt-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
          />
        </div></>)}

      <Modal
        title={editingId ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 3, message: 'Name must be at least 3 characters' },
              { max: 20, message: 'Name must be less than 50 characters' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Description is required' },
              { min: 10, message: 'Description must be at least 10 characters' },
              { max: 200, message: 'Description must be less than 200 characters' },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="link"
            label="Link"
            rules={[
              { required: true, message: 'Link is required' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button className='bg-blue-500' type="primary" htmlType="submit">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
