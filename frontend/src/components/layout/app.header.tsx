import React from "react"; // Đã thêm React
import { Link } from "react-router-dom";
import logo from "../../assets/png/logo.png";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useCurrentApp } from "../context/app.context";
import { Dropdown, Space, type MenuProps } from "antd";
import { logoutAPI, getAllCategoriesAPI } from "../../service/api";
import "./index.scss";
import { useEffect, useState } from "react";

const AppHeader = () => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } =
    useCurrentApp();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  // Lấy danh mục từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAPI();
        if (response && response.data && "data" in response.data) {
          const allCats = (response.data as unknown as IBackendRes<ICategory[]>)
            .data as ICategory[];
          if (allCats && Array.isArray(allCats)) {
            setAllCategories(allCats);
            // Lọc chỉ danh mục cha (parentCategory === null)
            const parentCategories = allCats.filter(
              (cat: ICategory) => cat.parentCategory === null
            );
            setCategories(parentCategories);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
            {categories.map((cat) => {
              // Lấy tất cả danh mục con của danh mục cha này
              const subCategories =
                allCategories.filter(
                  (c: ICategory) => c.parentCategory?.id === cat.id
                ) || [];
              return (
                <div key={cat.name} className="category">
                  <Link to={`/danh-muc/${cat.slug}`} className="parent">
                    {cat.name}
                  </Link>
                  {subCategories.map((sub: ICategory) => (
                    <Link
                      key={sub.slug}
                      to={`/danh-muc/${sub.slug}`}
                      className="child"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              );
            })}
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
