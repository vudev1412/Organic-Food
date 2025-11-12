import React from "react"; // Đã thêm React
import { Link } from "react-router-dom";
import logo from "../../assets/png/logo.png"; 
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useCurrentApp } from "../context/app.context"; 
import { Dropdown, Space, type MenuProps } from "antd";
import { logoutAPI } from "../../service/api"; 
import "./index.scss"; 



// Danh mục sản phẩm mẫu
const productCategories = [
  {
    name: "Quà Tặng Trái cây",
    url: "/collections/hop-qua-trai-cay",
    sub_items: [],
  },
  {
    name: "Trái Cây Theo Mùa",
    url: "/collections/trai-cay-theo-mua",
    sub_items: [
      { name: "Trái Cây Việt", url: "/collections/trai-cay-viet" },
      { name: "Trái Cây Nhập Khẩu", url: "/collections/trai-cay-nhap-khau" },
      {
        name: "Trái Cây Sấy - Đông Lạnh",
        url: "/collections/trai-cay-say-dong-lanh",
      },
      {
        name: "Nước Ép Trái Cây Tươi",
        url: "/collections/nuoc-ep-trai-cay-tuoi",
      },
    ],
  },
  {
    name: "Bếp O - Ready To Eat",
    url: "/collections/bep-org-ready-to-eat",
    sub_items: [],
  },
  {
    name: "Rau Củ Quả",
    url: "/collections/rau-cu-qua",
    sub_items: [
      { name: "Rau lá hữu cơ", url: "/collections/rau-la-huu-co" },
      { name: "Củ Quả hữu cơ", url: "/collections/cu-qua-huu-co" },
      { name: "Nấm", url: "/collections/nam" },
    ],
  },
  {
    name: "Tươi Sống",
    url: "/collections/tuoi-song",
    sub_items: [
      { name: "Thịt Heo Hữu Cơ", url: "/collections/thit-heo-huu-co" },
      { name: "Thịt Gia Cầm - Trứng", url: "/collections/thit-gia-cam-trung" },
      { name: "Khô & Một Nắng", url: "/collections/kho-mot-nang" },
    ],
  },
  {
    name: "Bếp O - Ready To Cook",
    url: "/collections/ready-to-cook",
    sub_items: [],
  },
  {
    name: "Thực Phẩm Khô",
    url: "/collections/thuc-pham-kho",
    sub_items: [
      { name: "Các Loại Hạt Hữu Cơ", url: "/collections/cac-loai-hat-huu-co" },
      { name: "Ngũ Cốc Hữu Cơ", url: "/collections/hat-ngu-coc-huu-co" },
      { name: "Gạo Hữu Cơ", url: "/collections/gao-huu-co" },
      { name: "Mì & Nui Hữu Cơ", url: "/collections/mi-nui-huu-co" },
      { name: "Bánh Kẹo & Socola", url: "/collections/banh-keo-socola" },
      { name: "Đồ Khô Khác", url: "/collections/do-kho-khac" },
      {
        name: "Nguyên Liệu Làm Bánh",
        url: "/collections/nguyen-lieu-lam-banh",
      },
      { name: "Snack Organic", url: "/collections/snack-organic" },
    ],
  },
  {
    name: "Gia Vị & Phụ Liệu",
    url: "/collections/gia-vi-phu-lieu",
    sub_items: [
      { name: "Gia Vị", url: "/collections/gia-vi" },
      { name: "Nguyên - Phụ Liệu", url: "/collections/nguyen-phu-lieu" },
      { name: "Mật Ong", url: "/collections/mat-ong-1" },
    ],
  },
  {
    name: "Đồ Uống Tốt Sức Khỏe",
    url: "/collections/do-uong-huu-co",
    sub_items: [
      { name: "Trà Hữu Cơ", url: "/collections/tra-huu-co" },
      { name: "Cà Phê Hữu Cơ", url: "/collections/caffee-huu-co" },
      { name: "Nước Ép Hữu Cơ", url: "/collections/nuoc-ep-huu-co" },
      { name: "Đồ Uống Có Cồn", url: "/collections/nuoc-uong-co-con" },
    ],
  },
  {
    name: "Bơ - Sữa",
    url: "/collections/bo-sua",
    sub_items: [
      { name: "Sữa Hạt", url: "/collections/sua-hat" },
      { name: "Sữa Tươi", url: "/collections/sua-tuoi" },
      { name: "Sữa Chua", url: "/collections/sua-chua" },
      { name: "Bơ & Phomai", url: "/collections/bo-phomai" },
      { name: "Sữa Đặc", url: "/collections/sua-dac" },
    ],
  },
  {
    name: "Mẹ & Bé",
    url: "/collections/nhom-me-va-be",
    sub_items: [
      { name: "Thực Phẩm Cho Mẹ", url: "/collections/thuc-pham-cho-me" },
      { name: "Thực Phẩm Cho Bé", url: "/collections/thuc-pham-cho-be" },
      { name: "Sức Khoẻ Cho Bé", url: "/collections/suc-khoe-cho-be" },
      { name: "Đồ Dùng Cho Bé", url: "/collections/do-dung-cho-be" },
    ],
  },
];

const AppHeader = () => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } =
    useCurrentApp();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  const items: MenuProps["items"] = [
    { key: "1", label: <Link to="/tai-khoan/thong-tin">Hồ sơ</Link> },
    { key: "2", label: <Link to="/tai-khoan/dia-chi">Địa chỉ</Link> },
    ...(user?.role === "ADMIN"
      ? [{ key: "3", label: <Link to="/admin">Trang quản trị</Link> }]
      : []),
    {
      key: "4",
      danger: true,
      label: <label onClick={handleLogout}>Đăng xuất</label>,
    },
  ];

  /**
   * ĐÃ THÊM: Hàm này sẽ loại bỏ focus khỏi phần tử vừa được nhấp
   * giúp tắt :focus-within và đóng mega menu khi điều hướng.
   */
  const handleMenuClick = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" /> 
        </Link>
      </div>

      <nav className="nav">
        <div className="menu-item">
          {/* ĐÃ THÊM: onClick cho link chính */}
          <Link to="/san-pham" onClick={handleMenuClick}>
            Sản phẩm
          </Link>

          {/* ĐÃ THÊM: onClick cho container của mega-menu */}
          <div className="mega-menu" onClick={handleMenuClick}>
            {productCategories.map((cat) => (
              <div key={cat.name} className="category">
                <Link to={cat.url} className="parent">
                  {cat.name}
                </Link>
                {cat.sub_items.map((sub) => (
                  <Link key={sub.url} to={sub.url} className="child">
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Link to="/gioi-thieu" className="nav-link">
          Về chúng tôi
        </Link>
        <Link to="/chung-chi" className="nav-link">
          Chứng chỉ
        </Link>
        <Link to="/lien-he" className="nav-link">
          Liên hệ
        </Link>
      </nav>

      <div className="actions">
        <Link to="/gio-hang">
          <ShoppingCartOutlined />
        </Link>
        {isAuthenticated ? (
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <UserOutlined />
                {user?.name}
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Link to="/dang-nhap">
            <UserOutlined />
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;