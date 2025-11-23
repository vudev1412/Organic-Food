import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag } from "antd";
import { getProductsAPI, deleteProductAPI } from "../../../service/api";
import DetailProduct from "./detail.product";
import UpdateProduct from "./update.product";
import CreateProductCertificate from "./create.product";

type TSearch = {
  name?: string;
  certNo?: string;
};

const TableProduct = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({ page: 1, size: 5, total: 0 });
  const [isDelete, setIsDelete] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IProductTable | null>(null);
  const { message, notification } = App.useApp();

  const formatProdutId = (entity: IProductTable) => {
    if (!entity?.product?.id) return "Không có ID";
    const id = entity.product.id;
    if (id < 10) return `SP00${id}`;
    if (id < 100) return `SP0${id}`;
    if (id < 1000) return `SP${id}`;
    return `SP${id}`;
  };

  const handleDelete = async (productId: number, certificateId: number) => {
    setIsDelete(true);
    try {
      const res: any = await deleteProductAPI(productId, certificateId);
      if (res.status === 200 || res.status === 204) {
        message.success("Xóa thành công");
        actionRef.current?.reload();
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể xóa sản phẩm",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsDelete(false);
    }
  };

  const columns: ProColumns<IProductTable>[] = [
    {
      title: "ID",
      dataIndex: ["product", "id"],
      sorter: true,
      defaultSortOrder: "ascend",
      hideInSearch: true,
      render: (_, entity) => (
        <a
          onClick={() => {
            setOpenViewDetail(true);
            setDataViewDetail(entity);
          }}
          href="#"
        >
          {formatProdutId(entity)}
        </a>
      ),
    },
    {
      title: "Tên",
      dataIndex: ["product", "name"],
      search: true,
    },
    {
      title: "Giá",
      dataIndex: ["product", "price"],
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Số lượng",
      dataIndex: ["product", "quantity"],
      hideInSearch: true,
    },
    {
      title: "Chứng nhận",
      dataIndex: "certificates",
      search: false,
      render: (certs: ICertificate[], entity: IProductTable) =>
        certs.map((c) => (
          <Tag key={c.id} color="blue">
            {c.name} - {c.name}
          </Tag>
        )),
    },
    {
      title: "Tình trạng",
      dataIndex: "member",
      key: "member",
      hideInSearch: true,
      render: (_, entity: IProductTable) => (
        <Tag color={entity.product.active ? "green" : "red"}>
          {entity.product.active ? "Đang bán" : "Tạm ngưng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />
          {entity.certificates.map((c) => (
            <Popconfirm
              key={c.id}
              title="Xác nhận xóa"
              description={`Bạn có chắc muốn xóa chứng nhận "${c.name}" khỏi sản phẩm này?`}
              onConfirm={() => handleDelete(entity.product.id, c.id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDelete }}
            >
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer", marginRight: 5 }}
              />
            </Popconfirm>
          ))}
        </>
      ),
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<IProductTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey={(record) => `${record.product.id}`}
        headerTitle="Sản phẩm"
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
          >
            Tạo mới
          </Button>,
        ]}
        pagination={{
          current: meta.page,
          pageSize: meta.size,
          total: meta.total,
          showSizeChanger: true,
        }}
        request={async (params, sort) => {
          let query = `page=${params.current}&size=${params.pageSize}`;
          if (params.name) query += `&filter=product.name~'${params.name}'`;
          if (params.certNo) query += `&filter=certNo~'${params.certNo}'`;

          if (Object.keys(sort).length === 0) {
            query += `&sort=product.id,ASC`;
          } else {
            const field = Object.keys(sort)[0];
            const order = sort[field];
            if (order) {
              const sortOrder = order === "ascend" ? "ASC" : "DESC";
              query += `&sort=${field},${sortOrder}`;
            }
          }

          const res = await getProductsAPI(query);
          if (res.data) setMeta(res.data.data.meta);

          // Gộp các chứng nhận trùng sản phẩm
          const rawData = res.data?.data.result || [];
          const mapProduct: Record<number, IProductTable> = {};
          rawData.forEach((item: any) => {
            const prodId = item.product.id;
            if (!mapProduct[prodId]) {
              mapProduct[prodId] = {
                ...item,
                certificates: [...(item.certificates || [item.certificate])],
              };
            } else {
              mapProduct[prodId].certificates.push(
                ...(item.certificates || [item.certificate])
              );
            }
          });
          const mergedData = Object.values(mapProduct);

          return {
            data: mergedData,
            success: true,
            total: res.data?.data.meta.total,
          };
        }}
      />

      {/* Modal chi tiết */}
      <DetailProduct
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      {/* Modal tạo mới Product + Certificate */}
      <CreateProductCertificate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      {/* Modal update sản phẩm
      <UpdateProduct
        openModelUpdate={openModalUpdate}
        setOpenModelUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      /> */}
    </>
  );
};

export default TableProduct;