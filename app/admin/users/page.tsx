'use client';

import { Table, Button, Modal, Form, Input, Space, Popconfirm, Select, Spin, Tag } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiSearch, FiTrash2 } from 'react-icons/fi';
import debounce from 'debounce';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  // Pagination, search, and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState(''); // New state for userType filter
  const [loading, setLoading] = useState(false);

  // Debounced search function (delay 500ms) using the "debounce" package
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on new search
      }, 500),
    []
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  // Fetch users with pagination, search, and filter by userType
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: searchQuery,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (userTypeFilter) {
        queryParams.append('userType', userTypeFilter); // Include userType filter in the query params
      }

      const res = await fetch(`/api/users?${queryParams.toString()}`);
      const data = await res.json();

      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever page, pageSize, search query, or userTypeFilter changes.
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchQuery, userTypeFilter]);

  // Handle search input changes using debounce.
  const handleSearchChange = (e: any) => {
    debouncedSearch(e.target.value);
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success(editingId ? 'User updated!' : 'User created!');
        fetchUsers();
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

  const handleDelete = async (id: String) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted!');
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text: String, record: any, index: number) => (currentPage - 1) * 10 + (index + 1),
      width: 70,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
      render: (text:String) => {
        let color = '';

        switch (text) {
          case 's-admin':
            color = 'red';
            break;
          case 'admin':
            color = 'green';
            break;
          case 'user':
            color = 'blue';
            break;
          default:
            color = 'default';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: String, record: any) => (
        <Space>
          {(record?.userType === 'admin' || record?.userType === 'user') && (
            <>
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
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header with title, search bar, filter by user type, and add user button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Users Management</h1>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by name..."
            onChange={handleSearchChange}
            allowClear
            style={{ width: 200 }}
            prefix={<FiSearch />}
          />
          <Select
            value={userTypeFilter}
            onChange={setUserTypeFilter}
            placeholder="Filter by User Type"
            style={{ width: 200 }}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="s-admin">Super Admin</Select.Option>
          </Select>
          <Button
            type="primary"
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className='bg-blue-500'
          >
            Add User
          </Button>
        </div>
      </div>

      {loading ? (
        <Spin size="large" className="flex justify-center mt-10" />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, newPageSize) => {
              setCurrentPage(page);
              setPageSize(newPageSize);
            },
          }}
          className="text-black"
        />
      )}

      <Modal
        title={editingId ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !editingId, message: 'Password is required' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="userType"
            label="User Type"
            rules={[{ required: true, message: 'Please select a user type' }]}
          >
            <Select placeholder="Select a user type">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="s-admin">Super Admin</Select.Option>
            </Select>
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
