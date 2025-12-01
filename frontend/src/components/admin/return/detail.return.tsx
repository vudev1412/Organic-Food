// File path: /src/components/admin/return/detail.return.tsx

import { Drawer, Descriptions } from "antd";
import dayjs from "dayjs";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IReturn | null;
  setData: (v: IReturn | null) => void;
}

// Format Mã hoàn trả
const formatORId = (id?: number | null) => {
    if (id == null) return "-";
    return `RT${id.toString().padStart(6, "0")}`;
  };

// Format Mã hóa đơn
const formatReturnId = (id?: number | null) => {
    if (id == null) return "-";
    return `RT${id.toString().padStart(6, "0")}`;
  };

// Format ngày giờ
const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "Chưa có";
  return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
};

const DetailReturn = ({ open, setOpen, data, setData }: IProps) => {
  return (
    <Drawer
      title="Chi tiết Hoàn Trả"
      width="50vw"
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã hoàn trả">
          {formatReturnId(data?.id)}
        </Descriptions.Item>
        <Descriptions.Item label="Mã hóa đơn">
          {formatORId(data?.orderId)}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {data?.customerName}
        </Descriptions.Item>

        <Descriptions.Item label="Lý do" span={2}>
          {data?.reason}
        </Descriptions.Item>

        <Descriptions.Item label="Tình trạng">{data?.status}</Descriptions.Item>
        <Descriptions.Item label="Loại yêu cầu">
          {data?.returnType}
        </Descriptions.Item>

        <Descriptions.Item label="Tạo lúc">
          {formatDate(data?.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Đã được phê duyệt tại">
          {formatDate(data?.approvedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Được xử lý bởi">
          {data?.processedBy}
        </Descriptions.Item>

        <Descriptions.Item label="Ghi chú quy trình" span={2}>
          {data?.processNote}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailReturn;
