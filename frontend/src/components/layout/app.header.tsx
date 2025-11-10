import logo from "../../assets/png/logo.png";
// import bg from "../../assets/jpg/background-header.jpg";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const AppHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
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
          <Link to={isLoggedIn ? "/account" : "/dang-nhap"}>
          <UserOutlined />
        </Link>
          <Link to={"/gio-hang"}>
            <ShoppingCartOutlined />
          </Link>
        </div>
      </header>
    </>
  );
};

export default AppHeader;
