// File path: /src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import HomePage from "./pages/client/home";

import AboutPage from "./pages/client/about";
import SingUp from "./pages/auth/signup";
import SingIn from "./pages/auth/signin";
import Profile from "./pages/account/profile";
import ProfileHeader from "./components/layout/profile/app.header";
import ProductDetail from "./pages/client/product-detail";
import Address from "./pages/account/address";
import Certificate from "./pages/client/certificate";
import Contact from "./pages/client/contact";
import ProductPage from "./pages/client/product";

// Admin
import AdminLayout from "./layout_admin";
import Dashboard from "./pages/admin/dashboard";
import Customers from "./pages/admin/customers";
import Employees from "./pages/admin/employees";
import Categories from "./pages/admin/categories";
import Products from "./pages/admin/products";
import Suppliers from "./pages/admin/suppliers";
import CustomerOrders from "./pages/admin/orders";
import ReturnRequests from "./pages/admin/complaints";
import { App, ConfigProvider } from "antd";

import ProtectedRouter from "./components/auth/admin";

import ProtectedRoute from "./components/auth";
import viVN from "antd/locale/vi_VN";
import { AppProvider } from "./components/context/app.provider";
import VnpayPage from "./pages/client/vnpay";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SalePage from "./pages/client/sale";
import OrderTrackingPage from "./pages/account/order";
import RegisterMemBerPage from "./pages/client/register.member";
import OrderHistoryPage from "./pages/account/order.history";
import BackupRestorePage from "./pages/admin/backup.restore";
import Payment from "./pages/client/payment";

import Voucher from "./pages/admin/voucher";

import SuccessPage from "./components/section/payment/SuccessPage";
import MembershipPage from "./pages/client/MembershipPage";
import MembershipSuccessPage from "./pages/client/MembershipSuccessPage";
import RolePermissionManager from "./pages/admin/permisstion";
import Receipt from "./pages/admin/receipt";
import TableCertificate from "./components/admin/certificate/table.certificate";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/dang-ky",
        element: <SingUp />,
      },
      {
        path: "/dang-nhap",
        element: <SingIn />,
      },
      {
        path: "/quen-mat-khau",
        element: <ForgotPassword />,
      },
      {
        path: "/dang-ky-thanh-vien",
        element: (
          // Nên bọc ProtectedRoute để bắt buộc đăng nhập mới được xem/mua
          <ProtectedRoute>
            <MembershipPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/membership-success",
        element: (
          <ProtectedRoute>
            <MembershipSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/membership-cancel",
        // Nếu hủy thì quay lại trang đăng ký ban đầu
        element: (
          <ProtectedRoute>
            <MembershipPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/san-pham",
        element: <ProductPage />,
      },
      {
        path: "/khuyen-mai",
        element: <SalePage />,
      },
      {
        path: "/gioi-thieu",
        element: <AboutPage />,
      },
      {
        path: "/thanh-toan",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/thanh-toan/thanh-cong",
        element: (
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/san-pham/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/danh-muc/:slug",
        element: <ProductPage />,
      },

      {
        path: "/lien-he",
        element: <Contact />,
      },
      {
        path: "/thanh-toan",
        element: <VnpayPage />,
      },
      {
        path: "/dang-ky-thanh-vien",
        element: <RegisterMemBerPage />,
      },

      {
        path: "/tai-khoan",
        element: <ProfileHeader />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "thong-tin",
            element: <Profile />,
          },
          {
            path: "dia-chi",
            element: <Address />,
          },
          {
            path: "don-hang",
            element: <OrderTrackingPage />,
          },
          {
            path: "lich-su-don-hang",
            element: <OrderHistoryPage />,
          },
        ],
      },
      {
        path: "/chung-chi",
        element: <Certificate />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRouter>
        <AdminLayout />
      </ProtectedRouter>
    ),
    children: [
      { index: true, element: <Dashboard /> }, // Trang /admin
      { path: "customers", element: <Customers /> }, // Trang /admin
      { path: "employees", element: <Employees /> }, // Trang /admin
      { path: "products", element: <Products /> }, // Trang /admin
      { path: "categories", element: <Categories /> }, // Trang /admin
      { path: "suppliers", element: <Suppliers /> }, // Trang /admin
      { path: "orders", element: <CustomerOrders /> }, // Trang /admin
      { path: "complaints", element: <ReturnRequests /> },
      { path: "voucher", element: <Voucher /> },
      { path: "permission", element: <RolePermissionManager /> },
      { path: "receipts", element: <Receipt /> },
      { path: "certificates", element: <TableCertificate /> },

      { path: "backup", element: <BackupRestorePage /> }, // Trang /admin
      // { path: "users", element: <ManageUsers /> }, // Trang /admin/users
      // { path: "products", element: <ManageProducts /> }, // Trang /admin/products
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <App>
    <AppProvider>
      <ConfigProvider locale={viVN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>
  </App>
);
