import { Drawer, Tag, Typography, Divider, Image, Space, Card } from "antd";
import {
  AppstoreOutlined,
  CalendarOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { parseProductDescription } from "../../../utils/productHelper";
import { data } from "react-router-dom";

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

  const mainImage = dataViewDetail.image
    ? `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${dataViewDetail.image}`
    : null;

  const subImages =
    dataViewDetail.images?.map(
      (img) => `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${img.imgUrl}`
    ) || [];

  const formatProductId = (id: number) => {
    return `SP${id.toString().padStart(6, "0")}`;
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <Space align="center">
            <Text strong className="text-3xl text-blue-700">
              Chi tiết sản phẩm
            </Text>
            <Tag color="blue" className="text-2xl px-8 py-3 font-bold rounded-full shadow-lg">
              {formatProductId(dataViewDetail.id)}
            </Tag>
          </Space>
        </div>
      }
      placement="right"
      width={760}
      onClose={onClose}
      open={openViewDetail}
      headerStyle={{ borderBottom: "1px solid #f0f0f0", padding: "16px 24px" }}
      bodyStyle={{ padding: "24px", backgroundColor: "#fafafa" }}
      closeIcon={null}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* MÃ SẢN PHẨM NỔI BẬT */}
        

        {/* Ảnh sản phẩm */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ flex: "0 0 300px" }}>
              <Image
                src={mainImage || undefined}
                fallback="https://via.placeholder.com/300"
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                preview={{
                  mask: <span style={{ fontSize: 13 }}>Xem ảnh lớn</span>,
                }}
              />
            </div>
            {subImages.length > 0 && (
              <div style={{ flex: 1 }}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: 16,
                    fontSize: 16,
                    color: "#1a1a1a",
                  }}
                >
                  Ảnh phụ ({subImages.length})
                </Text>
                <Space wrap size={14}>
                  {subImages.map((url, i) => (
                    <Image
                      key={i}
                      src={url}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "2px solid #f0f0f0",
                      }}
                      preview={{ mask: null }}
                    />
                  ))}
                </Space>
              </div>
            )}
          </div>
        </Card>

        {/* THÔNG TIN CƠ BẢN - ĐẸP, THẲNG HÀNG, FONT ĐỒNG NHẤT */}
        <Card
          title={
            <Title
              level={5}
              style={{ margin: 0, color: "#1677ff", fontWeight: 600 }}
            >
              <TagOutlined style={{ marginRight: 8 }} />
              Thông tin cơ bản
            </Title>
          }
          bordered={false}
          style={{ borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
          bodyStyle={{ padding: "24px 24px 16px" }}
        >
          <Space
            direction="vertical"
            size={18}
            style={{ width: "100%", fontSize: 15.5, lineHeight: 1.6 }}
          >
            {/* Tên sản phẩm */}
            <div>
              <Text
                type="secondary"
                strong
                style={{ display: "block", marginBottom: 6, fontSize: 15 }}
              >
                Tên sản phẩm
              </Text>
              <Title
                level={4}
                style={{
                  margin: 0,
                  color: "#1a1a1a",
                  fontWeight: 600,
                  fontSize: 22,
                }}
              >
                {dataViewDetail.name}
              </Title>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Các thông tin còn lại - 2 cột đều nhau */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Đơn vị tính */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text type="secondary" strong>
                  Đơn vị tính:
                </Text>
                <Text
                  strong
                  style={{ marginLeft: 12, color: "#262626", fontSize: 16 }}
                >
                  {dataViewDetail.unit
                    ? `${dataViewDetail.unit}`
                    : "Chưa cập nhật"}
                </Text>
              </div>

              {/* Tồn kho */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text type="secondary" strong>
                  Tồn kho:
                </Text>
                <Text
                  strong
                  style={{
                    marginLeft: 12,
                    fontSize: 18,
                    color:
                      dataViewDetail.quantity > 10
                        ? "#52c41a"
                        : dataViewDetail.quantity > 0
                        ? "#fa8c16"
                        : "#f5222d",
                  }}
                >
                  {dataViewDetail.quantity}
                </Text>
              </div>

              {/* Giá bán */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text type="secondary" strong>
                  Giá bán:
                </Text>
                <Text
                  strong
                  style={{ marginLeft: 12, fontSize: 24, color: "#f5222d" }}
                >
                  {dataViewDetail.price?.toLocaleString("vi-VN")} ₫
                </Text>
              </div>

              {/* Trạng thái */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text type="secondary" strong>
                  Trạng thái:
                </Text>
                <Tag
                  color={dataViewDetail.active ? "green" : "red"}
                  style={{
                    marginLeft: 12,
                    fontSize: 14,
                    padding: "4px 12px",
                    fontWeight: 600,
                  }}
                >
                  {dataViewDetail.active ? "Đang bán" : "Tạm ngưng"}
                </Tag>
              </div>

              <div>
                <Text type="secondary" strong>
                  Xuất xứ:
                </Text>
                <Text
                  style={{ marginLeft: 12, color: "#262626", fontSize: 15.5 }}
                >
                  {dataViewDetail.origin_address || "Chưa cập nhật"}
                </Text>
              </div>
            </div>
          </Space>
        </Card>

        {/* Các phần còn lại giữ nguyên đẹp như cũ */}
        {dataViewDetail.description && (
          <div>
            <Title
              level={5}
              style={{ marginBottom: 24, color: "#1677ff", fontWeight: 600 }}
            >
              <AppstoreOutlined style={{ marginRight: 10 }} />
              Mô tả chi tiết sản phẩm
            </Title>
            {(() => {
              const result = parseProductDescription(
                dataViewDetail.description
              );
              if (result.type === "json" && result.content.length > 0) {
                return (
                  <Space
                    direction="vertical"
                    size={28}
                    style={{ width: "100%" }}
                  >
                    {result.content.map((section, idx) => (
                      <Card
                        key={idx}
                        style={{
                          borderRadius: 16,
                          boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
                        }}
                        bodyStyle={{ padding: "32px" }}
                      >
                        <Title
                          level={4}
                          style={{
                            color: "#1677ff",
                            marginBottom: 24,
                            fontWeight: 700,
                            paddingBottom: 12,
                            borderBottom: "2px solid #e6f7ff",
                          }}
                        >
                          {section.heading}
                        </Title>
                        <Space
                          direction="vertical"
                          size={22}
                          style={{ width: "100%" }}
                        >
                          {section.items.map((item, i) => (
                            <div key={i}>
                              <Text
                                strong
                                style={{
                                  fontSize: 16.5,
                                  color: "#1a1a1a",
                                  display: "block",
                                  marginBottom: 10,
                                }}
                              >
                                {item.subtitle}
                              </Text>
                              <div
                                style={{
                                  padding: "20px 24px",
                                  background:
                                    "linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%)",
                                  borderRadius: 14,
                                  borderLeft: "6px solid #1677ff",
                                  lineHeight: 1.9,
                                  fontSize: 15.2,
                                  color: "#262626",
                                  boxShadow:
                                    "inset 0 2px 10px rgba(22,119,255,0.08)",
                                  border: "1px solid #d6e4ff",
                                }}
                              >
                                {item.text}
                              </div>
                            </div>
                          ))}
                        </Space>
                      </Card>
                    ))}
                  </Space>
                );
              }
              return (
                <Card
                  style={{
                    borderRadius: 16,
                    background:
                      "linear-gradient(135deg, #f8faff 0%, #f0f5ff 100%)",
                    borderLeft: "6px solid #1677ff",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
                  }}
                  bodyStyle={{ padding: "32px" }}
                >
                  <div
                    style={{
                      lineHeight: 2,
                      fontSize: 15.5,
                      color: "#262626",
                      whiteSpace: "pre-wrap",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: result.content.replace(/\n/g, "<br/>"),
                    }}
                  />
                </Card>
              );
            })()}
          </div>
        )}

        {/* Thời hạn sử dụng */}
        <Card
          title={
            <Title
              level={5}
              style={{ margin: 0, color: "#1677ff", fontWeight: 600 }}
            >
              <CalendarOutlined style={{ marginRight: 8 }} />
              Thời hạn sử dụng
            </Title>
          }
          bordered={false}
          style={{ borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
        >
          <Space size={40}>
            <div>
              <Text type="secondary" strong>
                Ngày sản xuất
              </Text>
              <div
                style={{
                  marginTop: 8,
                  fontWeight: 600,
                  fontSize: 17,
                  color: "#1a1a1a",
                }}
              >
                {dataViewDetail.mfgDate
                  ? dayjs(dataViewDetail.mfgDate).format("DD/MM/YYYY")
                  : "—"}
              </div>
            </div>
            <Divider
              type="vertical"
              style={{ height: 50, borderLeft: "2px solid #e0e0e0" }}
            />
            <div>
              <Text type="secondary" strong>
                Hạn sử dụng
              </Text>
              <div
                style={{
                  marginTop: 8,
                  fontWeight: 600,
                  fontSize: 17,
                  color: "#1a1a1a",
                }}
              >
                {dataViewDetail.expDate
                  ? dayjs(dataViewDetail.expDate).format("DD/MM/YYYY")
                  : "—"}
              </div>
            </div>
          </Space>
        </Card>

        {/* Chứng chỉ */}
        {dataViewDetail.certificates &&
          dataViewDetail.certificates.length > 0 && (
            <div>
              <Title
                level={5}
                style={{ marginBottom: 20, color: "#1677ff", fontWeight: 600 }}
              >
                <SafetyCertificateOutlined style={{ marginRight: 10 }} />
                Chứng chỉ & Giấy tờ ({dataViewDetail.certificates.length})
              </Title>
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
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
                      key={c.id}
                      hoverable
                      style={{
                        borderRadius: 16,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                        border: "1px solid #f0f0f0",
                      }}
                      bodyStyle={{ padding: "20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 20,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={certImage}
                          width={90}
                          height={90}
                          style={{
                            borderRadius: 12,
                            objectFit: "cover",
                            border: "3px solid #e6f7ff",
                          }}
                          preview={{ mask: "Xem chứng chỉ" }}
                        />
                        <div style={{ flex: 1 }}>
                          <Title
                            level={5}
                            style={{ margin: "0 0 8px 0", color: "#1a1a1a" }}
                          >
                            {c.name}
                          </Title>
                          <Space direction="vertical" size={6}>
                            <Text strong style={{ color: "#595959" }}>
                              Số chứng chỉ:{" "}
                              <Text style={{ color: "#262626" }}>
                                {c.certNo || "—"}
                              </Text>
                            </Text>
                            <Text type="secondary">
                              Ngày cấp:{" "}
                              {c.date
                                ? dayjs(c.date).format("DD/MM/YYYY")
                                : "—"}
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
