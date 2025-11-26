// File path: /src/pages/admin/dashboard.tsx

import React from "react";
import { Users, DollarSign, ShoppingCart } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import StatusBadge from "../../components/section/dashboard/status.badge";
import StatCard from "../../components/section/dashboard/state.card";

const Dashboard: React.FC = () => {
  // --- Dữ liệu giả ---
  const dashboardStats = {
    newCustomers: { value: "124", change: "+12%" },
    monthlyRevenue: { value: "58.200.000₫", change: "+8%" },
    monthlyOrders: { value: "342", change: "-5%" },
  };

  const revenueChartData = [
    { name: "T1", DoanhThu: 12000000 },
    { name: "T2", DoanhThu: 18000000 },
    { name: "T3", DoanhThu: 15000000 },
    { name: "T4", DoanhThu: 20000000 },
    { name: "T5", DoanhThu: 30000000 },
    { name: "T6", DoanhThu: 25000000 },
    { name: "T7", DoanhThu: 35000000 },
    { name: "T8", DoanhThu: 40000000 },
    { name: "T9", DoanhThu: 37000000 },
    { name: "T10", DoanhThu: 42000000 },
    { name: "T11", DoanhThu: 46000000 },
    { name: "T12", DoanhThu: 50000000 },
  ];

  const mockOrders = [
    {
      id: "#OD001",
      customer: "Nguyễn Văn A",
      total: "1.200.000₫",
      status: "Đã giao",
    },
    {
      id: "#OD002",
      customer: "Trần Thị B",
      total: "950.000₫",
      status: "Đang xử lý",
    },
    {
      id: "#OD003",
      customer: "Phạm Văn C",
      total: "2.100.000₫",
      status: "Đã huỷ",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Thống kê</h1>

      {/* --- Thẻ thống kê --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Khách hàng mới (tháng)"
          value={dashboardStats.newCustomers.value}
          change={dashboardStats.newCustomers.change}
          icon={<Users size={24} className="text-indigo-500" />}
          iconColor="bg-indigo-100"
        />
        <StatCard
          title="Doanh thu (tháng)"
          value={dashboardStats.monthlyRevenue.value}
          change={dashboardStats.monthlyRevenue.change}
          icon={<DollarSign size={24} className="text-green-500" />}
          iconColor="bg-green-100"
        />
        <StatCard
          title="Đơn hàng (tháng)"
          value={dashboardStats.monthlyOrders.value}
          change={dashboardStats.monthlyOrders.change}
          icon={<ShoppingCart size={24} className="text-blue-500" />}
          iconColor="bg-blue-100"
        />
      </div>

      {/* --- Biểu đồ + Đơn hàng gần đây --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Doanh thu 12 tháng
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => `${value / 1000000}M`}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN").format(Number(value))
                  }
                />
                <Legend />
                <Bar dataKey="DoanhThu" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Đơn hàng gần đây */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Đơn hàng gần đây
          </h3>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{order.customer}</p>
                  <p className="text-sm text-gray-500">
                    {order.id} - {order.total}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
