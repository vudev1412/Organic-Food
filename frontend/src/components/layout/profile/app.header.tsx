import { Menu, type MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
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
];
const ProfileHeader = () => {
  const navigate = useNavigate();

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
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
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
