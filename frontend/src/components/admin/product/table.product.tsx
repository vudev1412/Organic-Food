import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag } from "antd";
import { getProductsAPI, deleteProductAPI } from "../../../service/api";
import DetailProduct from "./detail.product";
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
  const [dataViewDetail, setDataViewDetail] = useState<IProduct | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const { message, notification } = App.useApp();

  const formatProductId = (product: IProduct) => {
    if (!product?.id) return "Không có ID";
    const id = product.id;
    if (id < 10) return `SP00${id}`;
    if (id < 100) return `SP0${id}`;
    if (id < 1000) return `SP${id}`;
    return `SP${id}`;
  };

  const handleDelete = async (productId: number) => {
    setIsDelete(true);
    try {
      const res: any = await deleteProductAPI(productId);
      if (res.status === 200 || res.status === 204) {
        message.success("Xóa sản phẩm thành công");
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

  const columns: ProColumns<IProduct>[] = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      defaultSortOrder: "ascend",
      hideInSearch: true,
      render: (_, record) => (
        <a
          onClick={() => {
            setOpenViewDetail(true);
            setDataViewDetail(record);
          }}
          href="#"
        >
          {formatProductId(record)}
        </a>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      search: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      hideInSearch: true,
    },
    {
      title: "Chứng nhận",
      dataIndex: "certificates",
      search: false,
      render: (certs: ICertificate[] = []) =>
        certs.map((c) => (
          <Tag key={c.id} color="blue">
            {c.name}
          </Tag>
        )),
    },
    {
      title: "Tình trạng",
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.active ? "green" : "red"}>
          {record.active ? "Đang bán" : "Tạm ngưng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      hideInSearch: true,
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xóa sản phẩm"
          description={`Bạn có chắc muốn xóa sản phẩm "${record.name}" không?`}
          onConfirm={() => handleDelete(record.id)}
          okText="Xác nhận"
          cancelText="Hủy"
          okButtonProps={{ loading: isDelete }}
        >
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={(e) => {
             
              e.stopPropagation();
            }}
          />
          <DeleteTwoTone
            twoToneColor="#ff4d4f"
            style={{ cursor: "pointer" }}
          />
        </Popconfirm>
      ),
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<IProduct, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey={(record) => `${record.id}`}
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
          if (params.name) query += `&filter=name~'${params.name}'`;
          if (params.certNo) query += `&filter=certNo~'${params.certNo}'`;

          if (Object.keys(sort).length === 0) {
            query += `&sort=id,ASC`;
          } else {
            const field = Object.keys(sort)[0];
            const order = sort[field];
            if (order) {
              const sortOrder = order === "ascend" ? "ASC" : "DESC";
              query += `&sort=${field === "id" ? "id" : field},${sortOrder}`;
            }
          }

          const res = await getProductsAPI(query);
          if (res.data) setMeta(res.data.data.meta);

          const rawData = res.data?.data.result || [];
          const mapProduct: Record<number, IProduct> = {};

          rawData.forEach((item: IProduct) => {
            const prodId = item.id;
            if (!mapProduct[prodId]) {
              mapProduct[prodId] = {
                ...item,
                certificates: [...(item.certificates || [])],
              };
            } else {
              mapProduct[prodId].certificates?.push(...(item.certificates || []));
            }
          });

          return {
            data: Object.values(mapProduct),
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
    </>
  );
};

export default TableProduct;
