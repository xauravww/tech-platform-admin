'use client';

import { Card, Row, Col, Statistic, Spin } from 'antd';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    research: 0,
    services: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from your API endpoints
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [users, products, research, services] = await Promise.all([
          fetch('/api/users').then(res => res.json()),
          fetch('/api/products').then(res => res.json()),
          fetch('/api/research').then(res => res.json()),
          fetch('/api/services').then(res => res.json()),
        ]);

        setStats({
          users: users?.users?.length,
          products: products?.products?.length || 0,
          research: research?.researches?.length,
          services: services?.services?.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      {isLoading ? (<Spin size="large" className="flex justify-center mt-10" />) : (

        <div>
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic title="Total Users" value={stats.users} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Products" value={stats.products} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Research" value={stats.research} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Services" value={stats.services} />
              </Card>
            </Col>
          </Row>
        </div>
        
      )
      
      }


    </div>
  );
}