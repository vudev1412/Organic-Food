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
import Cart from "./pages/client/cart";
import Profile from "./pages/account/profile";
import ProfileHeader from "./components/layout/profile/app.header";
import ProductDetail from "./pages/client/product-detail";
import Address from "./pages/account/address";
// import Password from "antd/es/input/Password";
import ChangePassword from "./pages/account/password";
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
import { AppProvider } from "./components/context/app.context";
import ProtectedRouter from "./components/auth/admin";

import ProtectedRoute from "./components/auth";
import viVN from "antd/locale/vi_VN";

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
        path: "/san-pham",
        element: <ProductPage />,
      },
      {
        path: "/gioi-thieu",
        element: <AboutPage />,
      },
      {
        path: "/gio-hang",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chi-tiet",
        element: <ProductDetail />,
      },

      {
        path: "/lien-he",
        element: <Contact />,
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
            path: "mat-khau",
            element: <ChangePassword />,
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
    path: "/dang-ky",
    element: <SingUp />,
  },
  {
    path: "/dang-nhap",
    element: <SingIn />,
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
      { path: "complaints", element: <ReturnRequests /> }, // Trang /admin
      // { path: "users", element: <ManageUsers /> }, // Trang /admin/users
      // { path: "products", element: <ManageProducts /> }, // Trang /admin/products
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={viVN}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
