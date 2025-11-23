import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/png/logo.png";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useCurrentApp } from "../context/app.context";
import { Dropdown, type MenuProps, Drawer, Menu, Button } from "antd";
import { logoutAPI, getAllCategoriesAPI } from "../../service/api";
import "./index.scss";
import ProductSearch from "../section/product/search.bar";
import CartDropdown from "../common/cart.dropdown";

interface ICategory {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
}

type MenuItem = Required<MenuProps>["items"][number];

const AppHeader = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useCurrentApp();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- STATE MỚI: Quản lý hiển thị Mega Menu ---
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

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
      localStorage.removeItem("organic_cart_items");
      clearCart();
      navigate("/");
    }
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Searching:", searchTerm);
  };

  // --- HÀM MỚI: Đóng menu khi click ---
  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "1", label: <Link to="/tai-khoan/thong-tin">Hồ sơ</Link> },
    { key: "2", label: <Link to="/tai-khoan/dia-chi">Địa chỉ</Link> },
    ...(user?.role === "ADMIN"
      ? [{ key: "3", label: <Link to="/admin">Trang quản trị</Link> }]
      : []),
    {
      key: "4",
      danger: true,
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  const mobileMenuItems: MenuItem[] = [
    {
      key: "products",
      label: "Sản phẩm",
      children: categories.map((cat) => {
        const subCategories = allCategories.filter(
          (c) => c.parentCategoryId === cat.id
        );
        return {
          key: `cat-${cat.id}`,
          label: cat.name,
          children:
            subCategories.length > 0
              ? subCategories.map((sub) => ({
                  key: `sub-${sub.id}`,
                  label: sub.name,
                  onClick: () => {
                    navigate(`/danh-muc/${sub.slug}`);
                    setIsMobileMenuOpen(false);
                  },
                }))
              : undefined,
          onClick:
            subCategories.length === 0
              ? () => {
                  navigate(`/danh-muc/${cat.slug}`);
                  setIsMobileMenuOpen(false);
                }
              : undefined,
        };
      }),
    },
    {
      key: "intro",
      label: "Về chúng tôi",
      onClick: () => {
        navigate("/gioi-thieu");
        setIsMobileMenuOpen(false);
      },
    },
    {
      key: "cert",
      label: "Chứng chỉ",
      onClick: () => {
        navigate("/chung-chi");
        setIsMobileMenuOpen(false);
      },
    },
    {
      key: "contact",
      label: "Liên hệ",
      onClick: () => {
        navigate("/lien-he");
        setIsMobileMenuOpen(false);
      },
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 1. MOBILE HAMBURGER BUTTON */}
        <div className="lg:hidden flex items-center">
          <Button
            type="text"
            icon={<MenuOutlined className="text-xl !text-gray-700" />}
            onClick={() => setIsMobileMenuOpen(true)}
          />
        </div>

        {/* 2. LOGO */}
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto sm:h-12" />
          </Link>
        </div>

        {/* 3. DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8 ml-8 h-full">
          {/* --- MEGA MENU FULL WIDTH (UPDATED) --- */}
          {/* Thay vì dùng group-hover css, ta dùng React events */}
          <div
            className="h-full flex items-center static"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <Link
              to="/san-pham"
              onClick={closeMegaMenu} // Click link cha cũng đóng
              className="!text-gray-700 font-medium text-[15px] hover:!text-green-600 transition-colors h-full flex items-center px-4 relative z-20"
            >
              Sản phẩm
              <svg
                className="w-3 h-3 ml-1 text-gray-400 hover:text-green-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>

            {/* --- DROPDOWN FULL SCREEN (CONTROLLED BY STATE) --- */}
            {isMegaMenuOpen && (
              <div className="block fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] z-[999]">
                <div className="absolute -top-2 left-0 w-full h-4 bg-transparent"></div>

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm -z-10"></div>

                {/* NỘI DUNG MENU */}
                <div className="bg-white border-t border-gray-100 shadow-2xl max-h-[70vh] overflow-y-auto animate-fade-in-down">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* CHECK DỮ LIỆU */}
                    {categories.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                        <p className="text-sm italic">Đang tải danh mục...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-8">
                        {/* Render danh mục (Chiếm 4 cột) */}
                        <div className="col-span-4 grid grid-cols-4 gap-8">
                          {categories.map((cat) => (
                            <div key={cat.id} className="group/cat">
                              <Link
                                to={`/danh-muc/${cat.slug}`}
                                onClick={closeMegaMenu} // CLICK VÀO DANH MỤC CHA -> ĐÓNG MENU
                                className="flex items-center gap-2 font-bold !text-gray-900 text-lg mb-3 hover:!text-green-600 transition-colors border-b border-gray-100 pb-2"
                              >
                                {cat.name}
                              </Link>

                              <div className="flex flex-col gap-2">
                                {allCategories
                                  .filter((c) => c.parentCategoryId === cat.id)
                                  .map((sub) => (
                                    <Link
                                      key={sub.id}
                                      to={`/danh-muc/${sub.slug}`}
                                      onClick={closeMegaMenu} // CLICK VÀO DANH MỤC CON -> ĐÓNG MENU
                                      className="text-[14px] !text-gray-500 hover:!text-green-600 hover:translate-x-1 transition-transform duration-200 flex items-center gap-1"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/cat:bg-green-500 transition-colors"></span>
                                      {sub.name}
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Banner quảng cáo bên phải (Chiếm 1 cột) */}
                        <div className="col-span-1">
                          <div className="bg-green-50 rounded-xl p-6 h-full flex flex-col justify-center items-start border border-green-100">
                            <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded mb-3">
                              MỚI NHẤT
                            </span>
                            <h4 className="font-bold !text-gray-900 text-xl mb-2 leading-tight">
                              Rau củ Organic Tươi Ngon
                            </h4>
                            <p className="!text-gray-600 text-sm mb-4">
                              Giảm giá 20% cho đơn hàng đầu tiên trong tuần này.
                            </p>
                            <Link
                              to="/san-pham"
                              onClick={closeMegaMenu} // CLICK BANNER -> ĐÓNG MENU
                              className="w-full text-center px-4 py-2 bg-green-600 !text-green-900 text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md shadow-green-200"
                            >
                              Mua ngay
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CÁC LINK KHÁC */}
          <Link
            to="/gioi-thieu"
            className="!text-gray-700 font-medium text-[15px] hover:!text-green-600 h-full flex items-center px-2 transition-colors"
          >
            Về chúng tôi
          </Link>
          <Link
            to="/chung-chi"
            className="!text-gray-700 font-medium text-[15px] hover:!text-green-600 h-full flex items-center px-2 transition-colors"
          >
            Chứng chỉ
          </Link>
          <Link
            to="/lien-he"
            className="!text-gray-700 font-medium text-[15px] hover:!text-green-600 h-full flex items-center px-2 transition-colors"
          >
            Liên hệ
          </Link>
        </nav>

        {/* 4. SEARCH & ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
          {/* STYLE UPDATE: Tăng width lên w-80 để vừa nút X */}
          <div className="hidden lg:block w-80">
            <ProductSearch onSearch={handleSearch} />
          </div>

          <div className="relative z-50">
            <div
              className="cursor-pointer p-2 relative hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCartOutlined className="text-xl sm:text-2xl !text-gray-700" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                {cartItems.length}
              </span>
            </div>

            <CartDropdown
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
            />
          </div>

          <div className="hidden sm:block">
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 cursor-pointer hover:!text-green-600 !text-gray-700 font-medium"
                >
                  <UserOutlined className="text-lg" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </a>
              </Dropdown>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-2 !text-gray-700 font-medium hover:!text-green-600"
              >
                <UserOutlined className="text-xl" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 5. MOBILE MENU DRAWER */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={300}
        className="lg:hidden"
      >
        <div className="mb-6">
          <ProductSearch
            onSearch={(val) => {
              handleSearch(val);
              setIsMobileMenuOpen(false);
            }}
          />
        </div>

        <div className="mb-6 border-b border-gray-100 pb-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full !text-green-600">
                <UserOutlined />
              </div>
              <div>
                <p className="font-bold !text-gray-900">{user?.name}</p>
                <p
                  className="text-xs !text-gray-500 cursor-pointer hover:!text-red-500"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </p>
              </div>
            </div>
          ) : (
            <Link to="/dang-nhap" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                block
                type="primary"
                className="!bg-green-600 hover:!bg-green-500"
              >
                Đăng nhập / Đăng ký
              </Button>
            </Link>
          )}

          {isAuthenticated && (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/tai-khoan/thong-tin"
                className="!text-gray-600 py-1 hover:!text-green-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hồ sơ cá nhân
              </Link>
              <Link
                to="/tai-khoan/dia-chi"
                className="!text-gray-600 py-1 hover:!text-green-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sổ địa chỉ
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="!text-gray-600 py-1 hover:!text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trang quản trị
                </Link>
              )}
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          items={mobileMenuItems}
          className="border-none font-medium"
        />
      </Drawer>
    </header>
  );
};

export default AppHeader;
