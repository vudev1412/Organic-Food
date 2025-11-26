// File path: /src/components/admin/supplier/table.supplier.tsx

import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm } from "antd";
import DetailSupplier from "./delete.supplier";
import CreateSupplier from "./create.supplier";
import UpdateSupplier from "./update.supplier";
import { deleteSupplierAPI, getSuppliersAPI } from "../../../service/api";

type TSearch = {
  name: string;
  code: string;
  phone: string;
};

const TableSupplier = () => {
  const actionRef = useRef<ActionType>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<ISupplier | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ISupplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { message, notification } = App.useApp();

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (id: number) => {
    setIsDeleting(true);

    const res = await deleteSupplierAPI(id);

    if (res?.status === 204) {
      message.success("Xóa supplier thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Lỗi",
        description: res?.message ?? "Có lỗi xảy ra",
      });
    }

    setIsDeleting(false);
  };

  const formatSupplierId = (entity: ISupplier) => {
    if (!entity?.id) return "Không có ID";

    const id = entity.id;

    if (id < 10) return `NCC00${id}`;
    if (id < 100) return `NCC0${id}`;
    if (id < 1000) return `NCC${id}`;

    return `NCC${id}`;
  };
  const columns: ProColumns<ISupplier>[] = [
    {
      title: "Mã",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => <a>{formatSupplierId(entity)}</a>,
    },
    { title: "Tên", dataIndex: "name", sorter: true, copyable: true },
    { title: "Điện thoại", dataIndex: "phone", copyable: true },
    { title: "Email", dataIndex: "email", copyable: true },
    {
      title: "Thao tác",
      hideInSearch: true,
      render(_, entity) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={(e) => {
                setDataUpdate(entity);
                setOpenUpdate(true);
                e.stopPropagation();
              }}
            />
            <Popconfirm
              title="Xóa nhà cung cấp"
              description="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDelete(entity.id)}
              okButtonProps={{ loading: isDeleting }}
            >
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer" }}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <h2>Tìm kiếm</h2>
      <ProTable<ISupplier, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = `page=${params.current}&size=${params.pageSize}`;

          if (params.name) query += `&filter=name~'${params.name}'`;
          if (params.code) query += `&filter=code~'${params.code}'`;
          if (params.phone) query += `&filter=phone~'${params.phone}'`;

          const res = await getSuppliersAPI(query);

          return {
            data: res.data?.data.result,
            success: true,
            page: res.data?.data.meta.page,
            total: res.data?.data.meta.total,
          };
        }}
        rowKey="id"
        headerTitle="Quản lý nhà cung cấp"
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} hàng`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
        onRow={(record) => ({
          onClick: () => {
            setOpenDetail(true);
            setDataDetail(record);
          },
        })}
      />

      <DetailSupplier
        open={openDetail}
        setOpen={setOpenDetail}
        data={dataDetail}
        setData={setDataDetail}
      />
      <CreateSupplier
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={refreshTable}
      />
      <UpdateSupplier
        open={openUpdate}
        setOpen={setOpenUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableSupplier;
