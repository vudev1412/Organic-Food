import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { deleteUserAPI, getCustomersAPI } from "../../../service/api";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag } from "antd";
import DetailUser from "./user.detail";
import CreateUser from "./create.customer";
import UpdateUser from "./update.customer";

type TSearch = {
  name: string;
  email: string;
  phone: string;
};
interface IUser {}

const MyTable = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({
    page: 1,
    size: 5,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<ICustomerTable | null>(
    null
  );

  const [openModelCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<ICustomerTable | null>(null);

  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const { message, notification } = App.useApp();
  const formatUserId = (entity: ICustomerTable) => {
    if (!entity?.id) return "Không có ID";

    const id = entity.id;

    if (id < 10) return `NV00${id}`;
    if (id < 100) return `NV0${id}`;
    if (id < 1000) return `NV${id}`;

    return `NV${id}`;
  };

  // ========================= DELETE =========================
  const handleDeleteUser = async (id: number) => {
    setIsDeleteUser(true);
    const res = await deleteUserAPI(id);

    if (res && res.data) {
      message.success("Xóa user thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
    setIsDeleteUser(false);
  };

  // ========================= COLUMNS =========================
  const columns: ProColumns<ICustomerTable>[] = [
    {
      title: "ID",
      dataIndex: ["user", "id"],
      key: "id",
      hideInSearch: true,
      render: (_, entity) => (
        <a
          onClick={() => {
            setOpenViewDetail(true);
            setDataViewDetail(entity);
          }}
        >
          {formatUserId(entity)}
        </a>
      ),
    },
    {
      title: "Tên",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
      renderText: (_, entity) => entity.user.name,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      copyable: true,
    },
    {
      title: "Điện thoại",
      dataIndex: ["user", "phone"],
      key: "phone",
      copyable: true,
    },
    {
      title: "Thành viên",
      dataIndex: "member",
      key: "member",
      hideInSearch: true,
      render: (_, entity: ICustomerTable) => (
        <Tag color={entity.member ? "green" : "red"}>
          {entity.member ? "Đã đăng ký" : "Chưa đăng ký"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />

          <Popconfirm
            placement="leftTop"
            title="Xác nhận xóa user"
            description="Bạn có chắc muốn xóa user này?"
            onConfirm={() => handleDeleteUser(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteUser }}
          >
            <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  // ========================= REFRESH TABLE =========================
  const refreshTable = () => {
    actionRef.current?.reload();
  };

  // ========================= RENDER =========================
  return (
    <>
      <ProTable<ICustomerTable, TSearch>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        rowKey="id"
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
            type="primary"
          >
            Thêm mới
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          console.log("Request called with sort:", sort);
          let query = `page=${params.current}&size=${params.pageSize}`;

          // ================== FILTER ==================
          if (params.name) query += `&filter=user.name~'${params.name}'`;
          if (params.email) query += `&filter=user.email~'${params.email}'`;
          if (params.phone) query += `&filter=user.phone~'${params.phone}'`;

          if (sort && Object.keys(sort).length > 0) {
            const sortField = Object.keys(sort)[0].replace(/,/g, ".");
            const sortOrder = sort[Object.keys(sort)[0]];

            if (sortOrder) {
              const order = sortOrder === "ascend" ? "ASC" : "DESC";
              query += `&sort=${sortField},${order}`;
            }
          }

          const res = await getCustomersAPI(query);
          console.log(res);
          if (res.data) setMeta(res.data.data.meta);

          return {
            data: res.data?.data.result,
            success: true,
            total: res.data?.data.meta.total,
            page: res.data?.data.meta.page,
          };
        }}
        pagination={{
          current: meta.page,
          pageSize: meta.size,
          total: meta.total,
          showSizeChanger: true,
          showTotal: (total, range) => (
            <span>
              {range[0]} - {range[1]} trên {total} rows
            </span>
          ),
        }}
      />

      {/* ================== MODALS ================== */}
      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateUser
        openModelCreate={openModelCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateUser
        openModelUpdate={openModalUpdate}
        setOpenModelUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default MyTable;
