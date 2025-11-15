import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import { Pagination } from "antd";
import TableActions from "../../components/section/dashboard/table.acction";
import TableSupplier from "../../components/admin/supplier/table.supplier";

interface ISupplier {
  supplier_id: number;
  name: string;
  code?: string | null;
  tax_no?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

const Suppliers = () => {
  return (
    <>
      <TableSupplier/>
    </>
  )
}

export default Suppliers;
