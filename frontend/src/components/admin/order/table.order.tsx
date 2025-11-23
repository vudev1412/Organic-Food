import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Spin } from "antd";
import DetailOrderDetail from "./detail.order";
import CreateOrderDetail from "./create.order";
import UpdateOrderDetail from "./update.order";
import {
  deleteOrderDetailAPI,
  getOrderDetailsFullAPI,
  getProductDetailById, // <-- import API mới
} from "../../../service/api";

type TSearch = {
  orderId?: number;
  productId?: number;
};

const TableOrderDetail = ({
  orders,
}: {
  orders: IOrder[];
}) => {
  const actionRef = useRef<ActionType>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<IOrderDetailFull | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IOrderDetailFull | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productNames, setProductNames] = useState<{ [key: number]: string }>({});
  const { message, notification } = App.useApp();

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (orderId: number, productId: number) => {
    setIsDeleting(true);
    try {
      await deleteOrderDetailAPI(orderId, productId);
      message.success("Xóa order detail thành công");
      refreshTable();
    } catch (error) {
      notification.error({ message: "Lỗi", description: "Xóa thất bại" });
    }
    setIsDeleting(false);
  };

  const formatDHId = (entity: IOrderDetailFull) => {
    if (!entity?.orderId) return "Không có ID";
    const id = entity.orderId;
    if (id < 10) return `DH00${id}`;
    if (id < 100) return `DH0${id}`;
    return `DH${id}`;
  };

  const columns: ProColumns<IOrderDetailFull>[] = [
    {
      title: "Mã",
      dataIndex: "orderId",
      render: (_, entity) => <a>{formatDHId(entity)}</a>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      render: (_, entity) => {
        const name = productNames[entity.productId];
        if (!name) {
          // nếu chưa có, gọi API để lấy tên
          getProductDetailById(entity.productId)
            .then((res) => {
              setProductNames((prev) => ({
                ...prev,
                [entity.productId]: res.data.data?.name,
              }));
            })
            .catch(() => {
              setProductNames((prev) => ({
                ...prev,
                [entity.productId]: "Không xác định",
              }));
            });
          return <Spin size="small" />; // loading khi đang fetch
        }
        return name;
      },
    },
    { title: "Số lượng", dataIndex: "quantity", align: "right", },
    { title: "Giá", dataIndex: "price", align: "right", },
    {
      title: "Thao tác",
      hideInSearch: true,
      render: (_, entity) => (
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
            title="Xóa order detail"
            onConfirm={() => handleDelete(entity.orderId, entity.productId)}
            okButtonProps={{ loading: isDeleting }}
          >
            <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IOrderDetailFull, TSearch>
        columns={columns}
        actionRef={actionRef}
        rowKey={(r) => `${r.orderId}-${r.productId}`}
        request={async (params) => {
          let query = `page=${params.current}&size=${params.pageSize}`;
          if (params.orderId) query += `&filter=order.id='${params.orderId}'`;
          if (params.productId)
            query += `&filter=product.id='${params.productId}'`;

          const res = await getOrderDetailsFullAPI(query);

          return {
            data: res.data?.data.result,
            success: true,
            page: res.data?.data.meta.page,
            total: res.data?.data.meta.total,
          };
        }}
        headerTitle="Đơn hàng"
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

      <DetailOrderDetail
        open={openDetail}
        setOpen={setOpenDetail}
        data={dataDetail}
        setData={setDataDetail}
      />
      <CreateOrderDetail
        open={openCreate}
        setOpen={setOpenCreate}
        refreshTable={refreshTable}
        orders={orders}
      />
      <UpdateOrderDetail
        open={openUpdate}
        setOpen={setOpenUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        orders={orders}
      />
    </>
  );
};

export default TableOrderDetail;
