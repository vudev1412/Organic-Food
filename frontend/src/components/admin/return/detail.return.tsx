// File path: /src/components/admin/return/detail.return.tsx

import { Drawer, Card, Row, Col, Typography, Divider, Image, Empty, Flex, Tag, Space } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IReturn | null;
  setData: (v: IReturn | null) => void;
}

// Format mã hoàn trả
const formatReturnId = (id?: number | null) =>
  id ? `RT${id.toString().padStart(6, "0")}` : "-";

// Format mã đơn hàng
const formatOrderId = (id?: number | null) =>
  id ? `DH${id.toString().padStart(6, "0")}` : "-";

// Format ngày giờ
const formatDate = (dateStr?: string | null) =>
  dateStr ? dayjs(dateStr).format("DD/MM/YYYY HH:mm") : "Chưa có";

// Map trạng thái sang tiếng Việt + màu Tag
const mapStatus: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Đang chờ duyệt", color: "processing" },
  APPROVED: { label: "Đã duyệt", color: "success" },
  REJECTED: { label: "Từ chối", color: "error" },
  CANCELED: { label: "Đã hủy", color: "default" },
};

// Map loại yêu cầu sang tiếng Việt + màu Tag
const mapReturnType: Record<string, { label: string; color: string }> = {
  REFUND: { label: "Hoàn tiền", color: "warning" },
  EXCHANGE: { label: "Đổi sản phẩm", color: "purple" },
};

const DetailReturn = ({ open, setOpen, data, setData }: IProps) => {
  if (!data) return null;

  const statusInfo = data.status ? mapStatus[data.status] ?? { label: data.status, color: "default" } : null;
  const typeInfo = data.returnType ? mapReturnType[data.returnType] ?? { label: data.returnType, color: "default" } : null;

  return (
    <Drawer
      title={<Title level={4} style={{ margin: 0 }}>Chi tiết yêu cầu hoàn trả</Title>}
      width={640}
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
      bodyStyle={{ padding: "24px" }}
      headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Thông tin cơ bản */}
        <Card>
          <Title level={5}>Thông tin chung</Title>
          <Divider style={{ margin: "12px 0" }} />
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Mã hoàn trả:</Text>
              <div style={{ marginTop: 4 }}>{formatReturnId(data.id)}</div>
            </Col>
            <Col span={12}>
              <Text strong>Mã đơn hàng:</Text>
              <div style={{ marginTop: 4 }}>{formatOrderId(data.orderId)}</div>
            </Col>
            <Col span={12}>
              <Text strong>Trạng thái:</Text>
              <div style={{ marginTop: 4 }}>
                {statusInfo ? <Tag color={statusInfo.color}>{statusInfo.label}</Tag> : "-"}
              </div>
            </Col>
            <Col span={12}>
              <Text strong>Loại yêu cầu:</Text>
              <div style={{ marginTop: 4 }}>
                {typeInfo ? <Tag color={typeInfo.color}>{typeInfo.label}</Tag> : "-"}
              </div>
            </Col>
            <Col span={24}>
              <Text strong>Lý do hoàn trả:</Text>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{data.reason || "-"}</div>
            </Col>
          </Row>
        </Card>

        {/* Thông tin xử lý */}
        <Card>
          <Title level={5}>Thông tin xử lý</Title>
          <Divider style={{ margin: "12px 0" }} />
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Thời gian tạo:</Text>
              <div style={{ marginTop: 4 }}>{formatDate(data.createdAt)}</div>
            </Col>
            <Col span={12}>
              <Text strong>Thời gian phê duyệt:</Text>
              <div style={{ marginTop: 4 }}>{formatDate(data.approvedAt)}</div>
            </Col>
            <Col span={12}>
              <Text strong>Người xử lý:</Text>
              <div style={{ marginTop: 4 }}>{data.processedBy || "-"}</div>
            </Col>
            <Col span={24}>
              <Text strong>Ghi chú xử lý:</Text>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{data.processNote || "-"}</div>
            </Col>
          </Row>
        </Card>

        {/* Hình ảnh hoàn trả */}
        <Card>
          <Title level={5}>Hình ảnh hoàn trả</Title>
          <Divider style={{ margin: "12px 0" }} />
          {data.returnImages && data.returnImages.length > 0 ? (
            <Image.PreviewGroup>
              <Flex gap={16} wrap="wrap">
                {data.returnImages.map((img) => (
                  <Image
                    key={img.id}
                    src={import.meta.env.VITE_BACKEND_RETURNS_IMAGE_URL + img.imageUrl}
                    width={180}
                    height={180}
                    style={{
                      objectFit: "cover",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    }}
                    preview={{
                      mask: <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 8 }}>Xem lớn</div>,
                    }}
                  />
                ))}
              </Flex>
            </Image.PreviewGroup>
          ) : (
            <Empty description="Không có hình ảnh hoàn trả" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
      </Space>
    </Drawer>
  );
};

export default DetailReturn;