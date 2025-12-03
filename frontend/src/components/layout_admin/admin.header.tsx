// File path: /src/components/layout_admin/admin.header.tsx

import React from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Dropdown, Space, type MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { logoutAPI } from "../../service/api";
import { useCurrentApp } from "../context/app.context";

const AdminHeader: React.FC = () => {
  const { user, setUser, setIsAuthenticated } = useCurrentApp();
  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("organic_cart_items");
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/tai-khoan/thong-tin">Hồ sơ</Link>,
    },
    {
      key: "2",
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "4",
      danger: true,
      label: <label onClick={() => handleLogout()}>Đăng xuất</label>,
    },
  ];
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-end h-16 px-6">
        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-800 relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-2 cursor-pointer">
            <Dropdown menu={{ items }} placement="bottomRight" arrow>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <UserOutlined style={{ fontSize: 20 }} />
                  {user?.name}
                </Space>
              </a>
            </Dropdown>
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
