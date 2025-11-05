import { Outlet } from "react-router-dom";
import AdminHeader from "./components/layout_admin/admin.header";
import AdminFooter from "./components/layout_admin/admin.footer";
import Sidebar from "./components/section/dashboard/sidebar";

const AdminLayout = () => {
  return (
    <>
      <div className=" flex">
        <Sidebar />
        <div className="flex-1">
          <AdminHeader />
          <div className="m-4">
            <Outlet />
          </div>
        </div>
      </div>

      <AdminFooter />
    </>
  );
};

export default AdminLayout;
