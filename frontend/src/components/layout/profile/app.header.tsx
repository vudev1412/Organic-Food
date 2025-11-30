// File path: /src/components/layout/profile/app.header.tsx

import { Menu, type MenuProps } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Import thêm useLocation

import "./layout.profile.scss";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/tai-khoan/thong-tin",
    label: "Hồ sơ",
  },
  {
    key: "/tai-khoan/dia-chi",
    label: "Địa chỉ",
  },
  {
    key: "/tai-khoan/don-hang",
    label: "Đơn hàng",
  },
];

const ProfileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook lấy đường dẫn hiện tại

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <div className="admin-wrapper pt-4 pb-4">
      <div className="side-bar">
        <div className="first-text">Tài khoản của tôi</div>
        <Menu
          onClick={handleMenuClick}
          style={{ width: 256 }}
          selectedKeys={[location.pathname]} // Highlight menu item đang active
          mode="inline"
          items={items}
        />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileHeader;
