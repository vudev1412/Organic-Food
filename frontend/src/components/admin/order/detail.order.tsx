// File path: /src/components/admin/order/detail.order.tsx

import { Drawer, Descriptions } from "antd";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IProduct | null;
  setData: (v: IOrderDetailFull | null) => void;
}

// Mapping trạng thái sang tiếng Việt
const statusMap: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

// Hàm format Mã đơn hàng
const formatORId = (entity: IOrderDetailFull | null) => {
  if (!entity?.orderId) return "Không có ID";
  const id = entity.orderId;
  if (id < 10) return `HD00${id}`;
  if (id < 100) return `HD0${id}`;
  return `HD${id}`;
};

// Hàm format Mã sản phẩm
const formatPRDId = (entity: IOrderDetailFull | null) => {
  if (!entity?.productId) return "Không có ID";
  const id = entity.productId;
  if (id < 10) return `SP00${id}`;
  if (id < 100) return `SP0${id}`;
  return `SP${id}`;
};

const DetailOrderDetail = ({ open, setOpen, data, setData }: IProps) => {
  return (
    <Drawer
      title="Chi tiết đơn hàng"
      width="50vw"
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã đơn hàng">
          {formatORId(data)}
        </Descriptions.Item>
        <Descriptions.Item label="Mã sản phẩm">
          {formatPRDId(data)}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng">{data?.quantity}</Descriptions.Item>
        <Descriptions.Item label="Giá">{data?.price}</Descriptions.Item>

        <Descriptions.Item label="Tên sản phẩm">
          {data?.product?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Đơn vị">
          {data?.product?.unit}
        </Descriptions.Item>
        <Descriptions.Item label="Giá sản phẩm">
          {data?.product?.price}
        </Descriptions.Item>

        <Descriptions.Item label="Ghi chú đơn hàng">
          {data?.order?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng">
          {data?.order?.shipAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn hàng">
          {data?.order?.statusOrder ? statusMap[data.order.statusOrder] : ""}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailOrderDetail;
