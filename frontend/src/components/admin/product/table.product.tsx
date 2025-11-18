import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useRef, useState } from "react";
import { App, Button, Popconfirm, Tag } from "antd";
import { getProductsAPI, deleteProductAPI } from "../../../service/api";

interface IProduct {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  active: boolean;
}

interface ICertificate {
  id: number;
  name: string;
  image: string;
}

interface IProductTable {
  imageUrl: string;
  certNo: string;
  date: string;
  product: IProduct;
  certificate: ICertificate;
}

type TSearch = {
  name?: string;
  certNo?: string;
};

const TableProduct = () => {
  const actionRef = useRef<ActionType>(null);
  const [meta, setMeta] = useState({ page: 1, size: 5, total: 0 });
  const [isDelete, setIsDelete] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(
    null
  );

  const [openModelCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IProductTable | null>(null);
  const { message, notification } = App.useApp();

  const formatProdutId = (entity: IProductTable) => {
    if (!entity?.product.id) return "Không có ID";

    const id = entity.product.id;

    if (id < 10) return `SP00${id}`;
    if (id < 100) return `SP0${id}`;
    if (id < 1000) return `SP${id}`;

    return `SP${id}`;
  };

  const handleDelete = async (id: number) => {
    setIsDelete(true);
    try {
      const res: any = await deleteProductAPI(id);

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
      render(_, entity) {
        return (
          <a
            onClick={() => {
              setOpenViewDetail(true);
              setDataViewDetail(entity);
            }}
            href="#"
          >
            {formatProdutId(entity)}
          </a>
        );
      },
    },

    {
      title: "Tên sản phẩm",
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
      dataIndex: ["certificate", "name"],
      search: false,
    },
    {
      title: "Thao tác",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => console.log("Edit:", entity)}
          />
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(entity.product.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDelete }}
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

  return (
    <>
      <ProTable<IProductTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey={(record) => `${record.product.id}-${record.certificate.id}`}
        headerTitle="Danh sách Product Certificates"
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

          // Nếu không có sort từ client → mặc định sort product.id ASC
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

          if (res.data) {
            setMeta(res.data.data.meta);
          }

          return {
            data: res.data?.data.result,
            success: true,
            total: res.data?.data.meta.total,
          };
        }}
      />
    </>
  );
};

export default TableProduct;
