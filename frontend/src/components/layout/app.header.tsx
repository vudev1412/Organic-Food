import logo from "../../assets/png/logo.png";
import bg from "../../assets/jpg/background-header.jpg";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
const AppHeader = () => {
  return (
    <>
      <header className=" flex justify-between px-[50px]  shadow-md">
        <div className="">
          <Link to={"/"}>
            <img src={logo} alt="Organic" className="w-[160px]" />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link to={"/product"}>Product</Link>
          <Link to={"/about-us"}>About us</Link>
        </div>
        <div className="flex items-center gap-5">
          <Link to={"/dang-nhap"}>
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
