// File path: /src/components/layout/app.header.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/png/logo.png";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  CaretDownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useCurrentApp } from "../context/app.context";
import { Dropdown, type MenuProps, Drawer, Menu, Button, Avatar } from "antd";
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

  // 1. Lấy handleLogout từ Context (đổi tên thành contextLogout để tránh trùng tên)
  const {
    user,
    isAuthenticated,
    cartItems,
    removeFromCart,
    updateCartQuantity,
    handleLogout: contextLogout,
  } = useCurrentApp();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // 2. Cập nhật logic Logout
  const handleLogoutClick = async () => {
    try {
      // Gọi API để Backend invalidate token (nếu có)
      await logoutAPI();
    } catch (error) {
      console.error("Logout API warning:", error);
      // Kệ lỗi API, vẫn tiến hành logout ở client
    } finally {
      // ✅ Gọi hàm logout an toàn từ Context (Chỉ xóa local, không xóa DB)
      contextLogout();

      // Đóng menu mobile nếu đang mở
      setIsMobileMenuOpen(false);

      // Chuyển về trang chủ
      navigate("/");
    }
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Searching:", searchTerm);
  };

  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile-header",
      label: (
        <div className="flex items-center gap-3 p-1 min-w-[200px]">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="bg-green-100 !text-green-600"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm leading-tight">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 capitalize">
              {user?.role?.name?.toLowerCase() || "Member"}
            </span>
          </div>
        </div>
      ),
      disabled: true,
      style: { cursor: "default" },
    },
    { type: "divider" },
    {
      key: "1",
      icon: <ProfileOutlined className="text-gray-500" />,
      label: (
        <Link to="/tai-khoan/thong-tin" className="font-medium">
          Hồ sơ cá nhân
        </Link>
      ),
    },
    {
      key: "2",
      icon: <EnvironmentOutlined className="text-gray-500" />,
      label: (
        <Link to="/tai-khoan/dia-chi" className="font-medium">
          Sổ địa chỉ
        </Link>
      ),
    },
    ...(user?.role?.name === "ADMIN"
      ? [
          {
            key: "3",
            icon: <DashboardOutlined className="text-blue-500" />,
            label: (
              <Link to="/admin" className="font-medium">
                Trang quản trị
              </Link>
            ),
          },
        ]
      : []),

    { type: "divider" },

    {
      key: "4",
      danger: true,
      icon: <LogoutOutlined />,
      // ✅ Sử dụng hàm logout mới
      onClick: handleLogoutClick,
      label: <span className="font-medium">Đăng xuất</span>,
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
      key: "sale",
      label: "Khuyến mãi",
      onClick: () => {
        navigate("/khuyen-mai");
        setIsMobileMenuOpen(false);
      },
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
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
        <nav className="hidden lg:flex items-center gap-3 ml-8 h-full">
          {/* --- MEGA MENU --- */}
          <div
            className="h-full flex items-center static"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <Link
              to="/san-pham"
              onClick={closeMegaMenu}
              className="!text-gray-700 font-medium text-[15px] hover:!text-green-600 transition-colors h-full flex items-center relative z-20"
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

            {isMegaMenuOpen && (
              <div className="block fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] z-[999]">
                <div className="absolute -top-2 left-0 w-full h-4 bg-transparent"></div>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm -z-10"></div>
                <div className="bg-white border-t border-gray-100 shadow-2xl max-h-[70vh] overflow-y-auto animate-fade-in-down">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {categories.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                        <p className="text-sm italic">Đang tải danh mục...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-8">
                        <div className="col-span-4 grid grid-cols-4 gap-8">
                          {categories.map((cat) => (
                            <div key={cat.id} className="group/cat">
                              <Link
                                to={`/danh-muc/${cat.slug}`}
                                onClick={closeMegaMenu}
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
                                      onClick={closeMegaMenu}
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
                              onClick={closeMegaMenu}
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
          <Link
            to="/khuyen-mai"
            className="!text-gray-700 font-medium text-[15px] hover:!text-green-600 h-full flex items-center px-2 transition-colors"
          >
            Khuyến mãi
          </Link>
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
                menu={{
                  items: userMenuItems,
                  className: "p-2 rounded-xl shadow-lg border border-gray-100",
                }}
                placement="bottomRight"
                trigger={["hover"]}
                arrow={{ pointAtCenter: true }}
              >
                <div className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group">
                  <Avatar
                    size="small"
                    className="!bg-green-600 flex items-center justify-center"
                    icon={<UserOutlined />}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold !text-gray-700 group-hover:!text-green-700 max-w-[100px] truncate transition-colors">
                      {user?.name}
                    </span>
                  </div>

                  <CaretDownOutlined className="text-[10px] text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </Dropdown>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-2 !text-gray-700 font-medium hover:!text-green-600 transition-colors"
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
        title={
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Logo" className="h-8 w-" />
          </Link>
        }
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width="85%"
        className="lg:hidden"
        closable={false}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setIsMobileMenuOpen(false)}
            className="!text-gray-500 hover:!bg-gray-100"
          />
        }
        styles={{
          header: { borderBottom: "1px solid #f0f0f0", padding: "16px 24px" },
          body: { padding: 0 },
        }}
      >
        <div className="flex flex-col h-full">
          {/* Phần 1: Search Bar & User Info */}
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="mb-4">
              <ProductSearch
                onSearch={(val) => {
                  handleSearch(val);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>

            {isAuthenticated ? (
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    className="!bg-green-100 !text-green-600"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.name?.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                  <Link
                    to="/tai-khoan/thong-tin"
                    className="text-center text-xs text-gray-600 py-1.5 bg-gray-50 rounded hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <div
                    className="text-center text-xs text-red-500 py-1.5 bg-red-50 rounded cursor-pointer hover:bg-red-100 transition-colors font-medium"
                    // ✅ Sử dụng hàm logout mới
                    onClick={handleLogoutClick}
                  >
                    Đăng xuất
                  </div>
                </div>

                {user?.role?.name === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="block mt-2 text-center text-xs text-blue-600 py-1.5 bg-blue-50 rounded hover:bg-blue-100 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trang quản trị
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500 text-sm mb-3">
                  Chào mừng đến với cửa hàng!
                </p>
                <Link
                  to="/dang-nhap"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    block
                    type="primary"
                    className="!bg-green-600 hover:!bg-green-500 h-10 font-medium shadow-md shadow-green-200"
                  >
                    Đăng nhập / Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Phần 2: Menu Items */}
          <div className="flex-1 overflow-y-auto py-2">
            <Menu
              mode="inline"
              items={mobileMenuItems}
              className="border-none font-medium !bg-transparent"
              selectedKeys={[location.pathname]}
            />
          </div>

          {/* Phần 3: Footer nhỏ */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">© 2024 Organic Food</p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default AppHeader;
