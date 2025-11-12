import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import AppFooter from "./components/layout/app.footer";
import { useEffect } from "react";
import { fetchAccountAPI } from "./service/api";
import { useCurrentApp } from "./components/context/app.context";
import PacmanLoader from "react-spinners/PacmanLoader";
const Layout = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  );
};

export default Layout;
