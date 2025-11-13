import React from "react";
import PageCard from "../../components/section/dashboard/page.card";
import FilterBar from "../../components/section/dashboard/filter.bar";
import DataTable from "../../components/section/dashboard/data.table";
import TableActions from "../../components/section/dashboard/table.acction";
import { Pagination } from "antd";
import MyTable from "../../components/admin/customer/table.customer";


interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  joinDate: string;
}

const Customers = () => {
  return (
    <>
      <MyTable/>
    </>
  )
}


export default Customers;
