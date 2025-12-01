// File path: /src/pages/admin/dashboard.tsx

import React, { useEffect, useState } from "react";
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
import {
  getMonthlyRevenueAPI,
  getNewCustomersThisMonthAPI,
  getOrderMonthAPI,
  getTopSellingProductsAPI,
  getRecentOrdersAPI // <-- mới
} from "../../service/api";

export interface TopProductDTO {
  productId: number;
  productName: string;
  quantitySold: number;
}

export interface RecentOrderDTO {
  id: string;
  customer: string;
  total: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState({
    newCustomers: "--",
    monthlyRevenue: "--",
    monthlyOrders: "--",
  });

  const [topProducts, setTopProducts] = useState<TopProductDTO[]>([]);
  const [revenueChartData, setRevenueChartData] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      name: `T${i + 1}`,
      DoanhThu: 0,
    }))
  );

  const [recentOrders, setRecentOrders] = useState<RecentOrderDTO[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // --- Khách hàng mới ---
        const resCustomers = await getNewCustomersThisMonthAPI(month, year);
        setDashboardStats((prev) => ({
          ...prev,
          newCustomers: resCustomers.data?.data ?? 0,
        }));

        // --- Đơn hàng tháng ---
        const resOrders = await getOrderMonthAPI(month, year);
        setDashboardStats((prev) => ({
          ...prev,
          monthlyOrders: resOrders.data?.data ?? 0,
        }));

        // --- Top sản phẩm ---
        const resTopProducts = await getTopSellingProductsAPI(month, year, 5);
        setTopProducts(resTopProducts.data?.data ?? []);

        // --- Doanh thu 12 tháng ---
        const resRevenue = await getMonthlyRevenueAPI(year);
        const chartData = Array.from({ length: 12 }, (_, i) => ({
          name: `T${i + 1}`,
          DoanhThu: resRevenue.data?.data[i] ?? 0,
        }));
        setRevenueChartData(chartData);

        // --- Doanh thu tháng hiện tại ---
        setDashboardStats((prev) => ({
          ...prev,
          monthlyRevenue: resRevenue.data?.data[month - 1] ?? 0,
        }));

        // --- 10 đơn hàng gần đây ---
        const resRecentOrders = await getRecentOrdersAPI();
        console.log(resRecentOrders)
        setRecentOrders(resRecentOrders.data?.data ?? []);
      } catch (error) {
        console.error("Error loading dashboard stats: ", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Thống kê</h1>

      {/* --- Thẻ thống kê --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Khách hàng mới (tháng)"
          value={dashboardStats.newCustomers}
          change="+0%"
          icon={<Users size={24} className="text-indigo-500" />}
          iconColor="bg-indigo-100"
        />
        <StatCard
          title="Doanh thu (tháng)"
          value={dashboardStats.monthlyRevenue}
          change="+0%"
          icon={<DollarSign size={24} className="text-green-500" />}
          iconColor="bg-green-100"
        />
        <StatCard
          title="Đơn hàng (tháng)"
          value={dashboardStats.monthlyOrders}
          change="+0%"
          icon={<ShoppingCart size={24} className="text-blue-500" />}
          iconColor="bg-blue-100"
        />
      </div>

      {/* Biểu đồ + Đơn hàng & Sản phẩm bán chạy */}
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

        {/* Cột bên phải: Đơn hàng & Top sản phẩm */}
        <div className="space-y-6">
          {/* Đơn hàng gần đây */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Đơn hàng gần đây
            </h3>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.id} - {order.total}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Không có dữ liệu
                </p>
              )}
            </div>
          </div>

          {/* Sản phẩm bán chạy */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Sản phẩm bán chạy (tháng)
            </h3>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex justify-between items-center bg-gray-50 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 text-gray-600 font-medium text-center">
                      {index + 1}
                    </div>
                    <div className="flex-1 px-3 truncate">
                      <p className="font-medium text-gray-800">
                        {product.productName}
                      </p>
                    </div>
                    <div className="w-20 text-right text-sm text-gray-500">
                      {product.quantitySold} bán
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Không có dữ liệu
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
