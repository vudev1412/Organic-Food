import logo from "../../assets/png/logo.png";
// import bg from "../../assets/jpg/background-header.jpg";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

import { useCurrentApp } from "../context/app.context";
import { Dropdown, Space, type MenuProps } from "antd";
import { logoutAPI } from "../../service/api";

const AppHeader = () => {
  const { user, isAuthenticated,setUser, setIsAuthenticated } = useCurrentApp();
  
  const handleLogout = async() => {
    const res = await logoutAPI();
    if(res.data){
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/account/profile">Hồ sơ</Link>,
    },
    {
      key: "2",
      label: <Link to="/account/address">Địa chỉ</Link>,
    },
    
    ...(user?.role === "ADMIN"
      ? [
          {
            key: "3",
            label: <Link to="/admin">Trang quản trị</Link>,
          },
        ]
      : []),
    {
      key: "4",
      danger: true,
      label: <label onClick={() => handleLogout()}>Đăng xuất</label>,
    },
  ];

  return (
    <>
      <header className=" flex justify-between px-[50px]  shadow-md">
        <div className="">
          <Link to={"/"}>
            <img src={logo} alt="Organic" className="w-[160px]" />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link to={"/product"}>Sản phẩm</Link>
          <Link to={"/about-us"}>Về chúng tôi</Link>
          <Link to={"/chung-chi"}>Chứng chỉ</Link>
          <Link to={"/lien-he"}>Liên hệ</Link>
        </div>
        
        <div className="flex items-center gap-5">
          <Link to={"/gio-hang"}>
            <ShoppingCartOutlined />
          </Link>
          {isAuthenticated ? (
            // Nếu đã đăng nhập → hiện dropdown
            <Dropdown menu={{ items }} placement="bottomRight" arrow>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <UserOutlined style={{ fontSize: 20 }} />
                  {user?.name}
                </Space>
              </a>
            </Dropdown>
          ) : (
            <Link to={"/dang-nhap"}>
              <UserOutlined style={{ fontSize: 20 }} />
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default AppHeader;