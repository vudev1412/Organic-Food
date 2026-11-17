// File path: /src/components/layout_admin/admin.footer.tsx

// import "./index.scss";
// import logo from "../../assets/png/logo.png";
const AdminFooter = () => {
  return (
    <footer className=" py-10">
      <div className=" pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Organic Store. All rights reserved.
      </div>
    </footer>
  );
};

export default AdminFooter;
