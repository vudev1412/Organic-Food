// File path: /src/pages/admin/employees.tsx

import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import StatusBadge from "../../components/section/dashboard/status.badge";
import TableActions from "../../components/section/dashboard/table.acction";
import { Pagination } from "antd";
import TableEmployee from "../../components/admin/employee/table.employee";

// 🔹 Kiểu dữ liệu cho nhân viên
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
}

const Employees = () => {
  return (
    <>
      <TableEmployee />
    </>
  );
};

export default Employees;
