'use client';

import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/authContext';
import { useEffect } from 'react';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/admin', label: 'Dashboard' },
  { key: '/admin/users', label: 'Users' },
  { key: '/admin/products', label: 'Products' },
  { key: '/admin/research', label: 'Research' },
  { key: '/admin/services', label: 'Services' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      // router.push('/login');
    }
  }, [token, router]);

  return (
    <Layout style={{ minHeight: "calc(100vh - 65px)" }}>
      <Sider theme="light" width={200}>
        <div className="p-4 text-sm text-black">⚙️💀💀💀💀💀⚙️</div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>
    </Layout>
  );
}