import { Drawer, Descriptions } from "antd";
import dayjs from "dayjs";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IReturn | null;
  setData: (v: IReturn | null) => void;
}

// Format Mã hoàn trả
const formatReturnId = (entity: IReturn | null) => {
  if (!entity?.id) return "Không có ID";
  const id = entity.id;
  if (id < 10) return `RT00${id}`;
  if (id < 100) return `RT0${id}`;
  return `RT${id}`;
};

// Format Mã hóa đơn
const formatORId = (orderId: number | undefined) => {
  if (!orderId) return "Không có ID";
  if (orderId < 10) return `HD00${orderId}`;
  if (orderId < 100) return `HD0${orderId}`;
  return `HD${orderId}`;
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
        <Descriptions.Item label="Mã hoàn trả">{formatReturnId(data)}</Descriptions.Item>
        <Descriptions.Item label="Mã hóa đơn">{formatORId(data?.orderId)}</Descriptions.Item>
        <Descriptions.Item label="Khách hàng">{data?.customerName}</Descriptions.Item>

        <Descriptions.Item label="Lý do" span={2}>
          {data?.reason}
        </Descriptions.Item>

        <Descriptions.Item label="Tình trạng">{data?.status}</Descriptions.Item>
        <Descriptions.Item label="Loại yêu cầu">{data?.returnType}</Descriptions.Item>

        <Descriptions.Item label="Tạo lúc">{formatDate(data?.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="Đã được phê duyệt tại">{formatDate(data?.approvedAt)}</Descriptions.Item>

        <Descriptions.Item label="Được xử lý bởi">{data?.processedBy}</Descriptions.Item>

        <Descriptions.Item label="Ghi chú quy trình" span={2}>
          {data?.processNote}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailReturn;
