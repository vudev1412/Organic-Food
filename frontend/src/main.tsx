import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import HomePage from "./pages/home";
import ProductPage from "./pages/product";
import AboutPage from "./pages/about";
import SingUp from "./pages/signup";
import SingIn from "./pages/signin";
import Cart from "./pages/cart";
import ProductDetai from "./pages/product-detail";

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
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/about-us",
        element: <AboutPage />,
      },
      {
        path: "/gio-hang",
        element: <Cart />,
      },
      {
        path: "/chi-tiet",
        element: <ProductDetai />,
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
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
