// File path: /src/components/section/dashboard/sidebar.tsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  Boxes,
  Building,
  Truck,
  ShoppingCart,
  MessageSquareWarning,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactElement<LucideProps>;
  text: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  to,
  active,
}) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center px-4 py-3 rounded-lg transition-all duration-200
        ${
          active
            ? "bg-indigo-50 text-indigo-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      {React.cloneElement(icon, { size: 20, className: "mr-3" })}
      {text}
    </Link>
  );
};

interface NavItem {
  id: string;
  text: string;
  icon: React.ReactElement<LucideProps>;
  to: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      text: "Thống kê",
      icon: <LayoutDashboard />,
      to: "",
    },
    { id: "customers", text: "Khách hàng", icon: <Users />, to: "customers" },
    {
      id: "employees",
      text: "Nhân viên",
      icon: <UserCheck />,
      to: "employees",
    },
    { id: "products", text: "Sản phẩm", icon: <Package />, to: "products" },
    {
      id: "categories",
      text: "Loại sản phẩm",
      icon: <Boxes />,
      to: "categories",
    },
    {
      id: "suppliers",
      text: "Nhà cung cấp",
      icon: <Building />,
      to: "suppliers",
    },
    // {
    //   id: "purchase-orders",
    //   text: "Quản lý nhập",
    //   icon: <Truck />,
    //   to: "purchase-orders",
    // },
    {
      id: "orders",
      text: "Quản lý đơn hàng",
      icon: <ShoppingCart />,
      to: "orders",
    },
    {
      id: "complaints",
      text: "Quản lý khiếu nại",
      icon: <MessageSquareWarning />,
      to: "complaints",
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm flex-shrink-0 hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">Admin</h1>
      </div>
      <nav className="">
        <ul className="space-y-2 p-0">
          {navItems.map((item) => (
            <li key={item.id}>
              <SidebarItem
                icon={item.icon}
                text={item.text}
                to={item.to}
                active={location.pathname === item.to}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
