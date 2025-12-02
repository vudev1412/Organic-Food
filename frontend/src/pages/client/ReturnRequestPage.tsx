import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Upload,
  message,
  Radio,
  Typography,
} from "antd";
import {
  UploadOutlined,
  LeftOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderByIdAPI,
  createReturnRequest,
  uploadReturnImage,
} from "../../service/api";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface IOrderDetail {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productImage: string;
}

interface IOrder {
  id: number;
  orderAt: string;
  statusOrder: string;
  orderDetails: IOrderDetail[];
}

const reasons = [
  "Sản phẩm bị lỗi",
  "Hỏng hóc trong quá trình vận chuyển",
  "Sai kích thước / màu sắc",
  "Không giống mô tả",
  "Thiếu phụ kiện",
  "Khác",
];

const ReturnRequestPage = () => {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [selectedItems, setSelectedItems] = useState<any>({});
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState("");
  const [returnType, setReturnType] = useState("REFUND");
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch order
  useEffect(() => {
    if (id) loadOrder(Number(id));
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      const res = await getOrderById(orderId);
      setOrder(res.data?.data);
    } catch {
      message.error("Không thể tải đơn hàng");
    }
  };

  const toggleItem = (item: IOrderDetail) => {
    setSelectedItems((prev: any) => {
      if (prev[item.productId]) {
        const copy = { ...prev };
        delete copy[item.productId];
        return copy;
      }
      return {
        ...prev,
        [item.productId]: {
          productId: item.productId,
          quantity: 1,
          price: item.price,
          productName: item.productName,
        },
      };
    });
  };

  const changeQty = (productId: number, value: number) => {
    setSelectedItems((prev: any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value,
      },
    }));
  };

  // Upload ảnh minh chứng
  const uploadProps = {
    multiple: true,
    beforeUpload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await uploadReturnImage(formData);
        setUploadImages((prev) => [...prev, res.data.url]);
        message.success("Tải ảnh thành công!");
      } catch {
        message.error("Tải ảnh thất bại");
      }

      return false;
    },
  };

  // Tổng tiền hoàn
  const totalRefund = Object.values(selectedItems).reduce(
    (sum: any, item: any) => sum + item.quantity * item.price,
    0
  );

  // Submit
  const handleSubmit = async () => {
    if (!order) return;

    if (Object.keys(selectedItems).length === 0) {
      return message.warning("Vui lòng chọn ít nhất 1 sản phẩm");
    }

    if (!reason) {
      return message.warning("Vui lòng chọn lý do");
    }

    setLoading(true);

    try {
      const body = {
        orderId: order.id,
        reason,
        returnType,
        note,
        items: Object.values(selectedItems),
        images: uploadImages,
      };

      const res = await createReturnRequest(body);

      message.success("Gửi yêu cầu đổi trả thành công!");
      navigate("/returns");
    } catch (err) {
      message.error("Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Button
        type="link"
        className="flex items-center mb-4"
        onClick={() => navigate(-1)}
      >
        <LeftOutlined /> Quay lại
      </Button>

      <Title level={3} className="mb-5">
        Yêu cầu đổi trả đơn hàng DH{String(order.id).padStart(6, "0")}
      </Title>

      {/* Chọn sản phẩm */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <Title level={4}>Chọn sản phẩm đổi trả</Title>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {order.orderDetails.map((item) => (
            <div
              key={item.productId}
              className={`border p-4 rounded-xl flex gap-4 cursor-pointer ${
                selectedItems[item.productId]
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
              onClick={() => toggleItem(item)}
            >
              <img
                src={
                  item.productImage.startsWith("http")
                    ? item.productImage
                    : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${
                        item.productImage
                      }`
                }
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.productName}</p>
                <p className="text-gray-500">
                  Giá:{" "}
                  <b>
                    {item.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </b>
                </p>

                {selectedItems[item.productId] && (
                  <div className="flex items-center mt-2 gap-3">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeQty(
                          item.productId,
                          Math.max(
                            1,
                            selectedItems[item.productId].quantity - 1
                          )
                        );
                      }}
                    />

                    <span>{selectedItems[item.productId].quantity}</span>

                    <Button
                      icon={<PlusOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeQty(
                          item.productId,
                          Math.min(
                            item.quantity,
                            selectedItems[item.productId].quantity + 1
                          )
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lý do */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <Title level={4}>Lý do đổi trả</Title>

        <Select
          className="w-full mt-3"
          placeholder="Chọn lý do"
          onChange={setReason}
          options={reasons.map((r) => ({ label: r, value: r }))}
        />

        <TextArea
          className="mt-4"
          rows={4}
          placeholder="Mô tả chi tiết vấn đề..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Loại đổi trả */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <Title level={4}>Hình thức đổi trả</Title>

        <Radio.Group
          className="mt-3"
          value={returnType}
          onChange={(e) => setReturnType(e.target.value)}
        >
          <Radio value="REFUND">Hoàn tiền</Radio>
          <Radio value="EXCHANGE">Đổi sản phẩm</Radio>
        </Radio.Group>
      </div>

      {/* Upload ảnh */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <Title level={4}>Hình ảnh minh chứng</Title>

        <Upload {...uploadProps} listType="picture" maxCount={5}>
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </div>

      {/* Tổng tiền */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <Title level={4}>Tổng cộng</Title>
        <Text className="text-green-600 text-2xl font-bold">
          {totalRefund.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </div>

      {/* Submit */}
      <Button
        type="primary"
        size="large"
        className="w-full py-6 text-lg font-semibold"
        onClick={handleSubmit}
        loading={loading}
      >
        Gửi yêu cầu đổi trả
      </Button>
    </div>
  );
};

export default ReturnRequestPage;
