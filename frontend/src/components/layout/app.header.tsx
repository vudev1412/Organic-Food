import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/png/logo.png";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useCurrentApp } from "../context/app.context";
import { Dropdown, Space, type MenuProps } from "antd";
import { logoutAPI, getAllCategoriesAPI } from "../../service/api";
import "./index.scss";
import ProductSearch from "../section/product/search.bar";
import CartDropdown from "../common/cart.dropdown";

// --- Interface định nghĩa (nếu chưa có thì thêm vào, hoặc dùng any tạm) ---
interface ICategory {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
}

const AppHeader = () => {
  const {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    cartItems,
    removeFromCart,
    updateCartQuantity,
  } = useCurrentApp();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  // --- STATE MỚI: Quản lý việc đóng mở giỏ hàng ---
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAPI();
        const results = response?.data?.data?.result;

        if (Array.isArray(results)) {
          setAllCategories(results);
          const parentCategories = results.filter(
            (cat: ICategory) => cat.parentCategoryId === null
          );
          setCategories(parentCategories);
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

  const handleMenuClick = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Searching:", searchTerm);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "150px", height: "auto" }}
          />
        </Link>
      </div>

      <nav className="nav">
        <div className="menu-item">
          <Link to="/san-pham" onClick={handleMenuClick}>
            Sản phẩm
          </Link>

          <div className="mega-menu" onClick={handleMenuClick}>
            {categories.map((cat) => {
              const subCategories = allCategories.filter(
                (c: ICategory) => c.parentCategoryId === cat.id
              );

              return (
                <div key={cat.id} className="category">
                  <Link to={`/danh-muc/${cat.slug}`} className="parent">
                    {cat.name}
                  </Link>
                  {subCategories.map((sub: ICategory) => (
                    <Link
                      key={sub.id}
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

      <ProductSearch onSearch={handleSearch} />

      <div className="actions">
        {/* --- BẮT ĐẦU PHẦN SỬA GIỎ HÀNG --- */}
        <div className="relative z-50">
          {/* Nút icon giỏ hàng: Thêm onClick để toggle state */}
          <div
            className="cursor-pointer py-2 relative"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCartOutlined className="text-2xl text-gray-700 hover:text-blue-600 transition duration-200" />

            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartItems.length}
            </span>
          </div>
          {/* Sử dụng CartDropdown component */}
          <CartDropdown
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
          />
        </div>
        {/* --- KẾT THÚC PHẦN GIỎ HÀNG --- */}

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
