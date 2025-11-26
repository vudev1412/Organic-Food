import {
  Avatar,
  Descriptions,
  Drawer,
  Tag,
  Typography,
  Divider,
  Image,
  Space,
  Card,
} from "antd";
import {
  AppstoreOutlined,
  CalendarOutlined,
  TagOutlined,
  DollarOutlined,
  StockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;


interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IProduct | null;
  setDataViewDetail: (v: IProduct | null) => void;
}

const DetailProduct = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  if (!dataViewDetail) return null;
  console.log(import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL + dataViewDetail.image);
  const mainImage = dataViewDetail.image
    ? `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${dataViewDetail.image}`
    : null;

  const subImages =
    dataViewDetail.images?.map(
      (img) => `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${img.imgUrl}`
    ) || [];
  console.log("CERTIFICATES:", dataViewDetail.certificates);
  const formatProductId = (product: IProduct) => {
    if (!product?.id) return "Không có ID";
    const id = product.id;
    if (id < 10) return `SP00${id}`;
    if (id < 100) return `SP0${id}`;
    if (id < 1000) return `SP${id}`;
    return `SP${id}`;
  };
  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SafetyCertificateOutlined
            style={{ fontSize: 24, color: "#1890ff" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết sản phẩm
          </Title>
        </div>
      }
      placement="right"
      width={720}
      onClose={onClose}
      open={openViewDetail}
      headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
      bodyStyle={{ padding: "24px" }}
      closeIcon={null}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Ảnh sản phẩm - Layout đẹp hơn */}
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            {/* Ảnh chính */}
            <div style={{ flex: "0 0 280px" }}>
              <Image
                src={mainImage || undefined}
                fallback="https://via.placeholder.com/280"
                style={{
                  width: 280,
                  height: 280,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
                preview={{ mask: <span>Xem ảnh lớn</span> }}
              />
            </div>

            {/* Ảnh phụ */}
            {subImages.length > 0 && (
              <div style={{ flex: 1 }}>
                <Text
                  strong
                  style={{ display: "block", marginBottom: 12, fontSize: 15 }}
                >
                  Ảnh phụ ({subImages.length})
                </Text>
                <Space wrap size={12}>
                  {subImages.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                      preview={{ mask: null }}
                    />
                  ))}
                </Space>
              </div>
            )}
          </div>
        </Card>

        {/* Thông tin cơ bản */}
        <Card
          title={
            <Title level={5}>
              <TagOutlined /> Thông tin cơ bản
            </Title>
          }
          bordered={false}
        >
          <Descriptions column={2} colon={false}>
            <Descriptions.Item label={<Text strong>Mã:</Text>}>
              <Tag color="blue">{formatProductId(dataViewDetail)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={<Text strong>Tên sản phẩm:</Text>}
              span={2}
            >
              <Title level={5} style={{ margin: 0, color: "#1a1a1a" }}>
                {dataViewDetail.name}
              </Title>
            </Descriptions.Item>

            <Descriptions.Item label={<Text strong>Giá bán:</Text>}>
              <Text strong type="danger" style={{ fontSize: 18 }}>
                {dataViewDetail.price?.toLocaleString("vi-VN")} VNĐ
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Số lượng tồn:</Text>}>
              <Text strong>
                {dataViewDetail.quantity} {dataViewDetail.unit}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label={<Text strong>Trạng thái:</Text>}>
              <Tag
                color={dataViewDetail.active ? "green" : "red"}
                style={{ fontWeight: 500 }}
              >
                {dataViewDetail.active ? "Đang bán" : "Tạm ngưng"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Đơn vị tính:</Text>}>
              {dataViewDetail.unit || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Ngày sản xuất & Hạn sử dụng */}
        <Card
          title={
            <Title level={5}>
              <CalendarOutlined /> Thời hạn sử dụng
            </Title>
          }
          bordered={false}
        >
          <Space size={24}>
            <div>
              <Text type="secondary">Ngày sản xuất</Text>
              <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
                {dataViewDetail.mfgDate
                  ? dayjs(dataViewDetail.mfgDate).format("DD/MM/YYYY")
                  : "-"}
              </div>
            </div>
            <Divider type="vertical" style={{ height: 40 }} />
            <div>
              <Text type="secondary">Hạn sử dụng</Text>
              <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
                {dataViewDetail.expDate
                  ? dayjs(dataViewDetail.expDate).format("DD/MM/YYYY")
                  : "-"}
              </div>
            </div>
          </Space>
        </Card>

        {/* Chứng chỉ - Thiết kế dạng card đẹp */}
        {dataViewDetail.certificates &&
          dataViewDetail.certificates.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 16 }}>
                <SafetyCertificateOutlined
                  style={{ color: "#52c41a", marginRight: 8 }}
                />
                Chứng chỉ & Giấy tờ ({dataViewDetail.certificates.length})
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {dataViewDetail.certificates.map((c) => {
                  const certImage =
                    (c.image &&
                      `${import.meta.env.VITE_BACKEND_CERS_IMAGE_URL}${
                        c.image
                      }`) ||
                    (c.imageUrl &&
                      `${import.meta.env.VITE_BACKEND_CERS_IMAGE_URL}${
                        c.imageUrl
                      }`) ||
                    "https://via.placeholder.com/80";

                  return (
                    <Card
                      key={c.id + "-" + (c.certNo || Math.random())}
                      hoverable
                      style={{ borderRadius: 12 }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={certImage}
                          width={80}
                          height={80}
                          style={{ borderRadius: 8, objectFit: "cover" }}
                          preview={{ mask: "Xem chứng chỉ" }}
                        />

                        <div style={{ flex: 1 }}>
                          <Title level={5} style={{ margin: "0 0 4px 0" }}>
                            {c.name}
                          </Title>

                          <Space direction="vertical" size={4}>
                            <Text>
                              <strong>Số chứng chỉ:</strong> {c.certNo || "-"}
                            </Text>

                            <Text type="secondary">
                              <CalendarOutlined style={{ marginRight: 4 }} />
                              Ngày cấp:{" "}
                              {c.date
                                ? dayjs(c.date).format("DD/MM/YYYY")
                                : "-"}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </Space>
            </div>
          )}
      </div>
    </Drawer>
  );
};

export default DetailProduct;
