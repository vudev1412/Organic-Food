
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  Boxes,
  Building,
  ShoppingCart,
  MessageSquareWarning,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Đổi từ React.ReactElement → React.ComponentType (đúng kiểu cho icon component)
type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;

interface NavItem {
  id: string;
  text: string;
  icon: LucideIcon; // ← Sửa ở đây: dùng kiểu đúng
  to: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { id: "dashboard", text: "Thống kê", icon: LayoutDashboard, to: "" },
    { id: "customers", text: "Khách hàng", icon: Users, to: "customers" },
    { id: "employees", text: "Nhân viên", icon: UserCheck, to: "employees" },
    { id: "products", text: "Sản phẩm", icon: Package, to: "products" },
    { id: "categories", text: "Loại sản phẩm", icon: Boxes, to: "categories" },
    { id: "suppliers", text: "Nhà cung cấp", icon: Building, to: "suppliers" },
    {
      id: "orders",
      text: "Quản lý đơn hàng",
      icon: ShoppingCart,
      to: "orders",
    },
    {
      id: "complaints",
      text: "Quản lý khiếu nại",
      icon: MessageSquareWarning,
      to: "complaints",
    },
     {
      id: "backup",
      text: "Khôi phục sao lưu",
      icon: MessageSquareWarning,
      to: "backup",
    },
  ];

  const isActive = (path: string) => {
    if (path === "")
      return location.pathname === "/admin" || location.pathname === "/admin/";
    return location.pathname.includes(path);
  };

  return (
    <aside
      className={`
        bg-white shadow-sm flex-shrink-0 hidden md:flex flex-col transition-all duration-300 border-r border-gray-200
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 relative">
        <div
          className={`flex items-center gap-3 transition-all ${
            collapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-indigo-600 whitespace-nowrap">
            Admin
          </h1>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-indigo-50 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon; // ← Giờ Icon là component thật, không cần .props gì cả

            return (
              <li key={item.id}>
                <Link
                  to={`/admin/${item.to}`}
                  className={`
    group relative flex items-center py-3 rounded-xl transition-all duration-200
    ${collapsed ? "justify-center w-full px-0" : "justify-start gap-3 px-4"}
    ${
      active
        ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }
  `}
                >
                  {/* Icon luôn căn giữa đẹp khi collapse */}
                  <Icon
                    size={22}
                    className={active ? "text-indigo-700" : "text-current"}
                  />

                  {/* Text */}
                  {!collapsed && <span>{item.text}</span>}

                  {/* Tooltip khi thu gọn */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                      {item.text}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
