import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
  Tag,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getProductsAPI,
  getSuppliersAPI,
  updateReceiptAPI,
} from "../../../service/api";

const { Title, Text } = Typography;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: ResReceiptDTO | null;
  setDataUpdate: (v: ResReceiptDTO | null) => void;
}

const UpdateReceipt = ({
  open,
  setOpen,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const { message } = App.useApp();

  // Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, supps] = await Promise.all([
          getProductsAPI("page=1&size=1000&active=true"),
          getSuppliersAPI("?size=1000"),
        ]);
        setProducts(prods.data?.data?.result || []);
        setSuppliers(supps.data?.data?.result || []);
      } catch (error) {
        message.error("Không tải được dữ liệu");
      }
    };
    if (open) fetchData();
  }, [open]);

  // Set dữ liệu khi mở modal
  useEffect(() => {
    if (dataUpdate && open) {
      form.setFieldsValue({
        deliverName: dataUpdate.deliverName,
        supplierId: dataUpdate.supplier?.id,
        shipDate: dataUpdate.shipDate ? dayjs(dataUpdate.shipDate) : null,
        discount: dataUpdate.discount || 0,
        receiptDetails:
          dataUpdate.receiptDetails?.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            importPrice: item.importPrice,
          })) || [],
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [dataUpdate, open, form]);

  const onFinish = async (values: any) => {
    if (!dataUpdate) return;
    setIsSubmit(true);

    try {
      const payload = {
        deliverName: values.deliverName,
        supplierId: values.supplierId,
        shipDate: values.shipDate?.toISOString() || null,
        discount: values.discount || 0,
        details: (values.receiptDetails || []).map((d: any) => ({
          productId: d.productId,
          quantity: d.quantity,
          importPrice: d.importPrice,
        })),
      };

      await updateReceiptAPI(dataUpdate.id, payload);
      message.success("Cập nhật phiếu nhập thành công!");
      handleClose();
      refreshTable();
    } catch (error) {
      message.error("Cập nhật thất bại!");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
    setDataUpdate(null);
  };

  // Sửa lỗi useWatch + tính tổng an toàn
  const receiptDetails = Form.useWatch("receiptDetails", form) ?? [];
  const discountValue = Form.useWatch("discount", form) ?? 0;

  const subTotal = Array.isArray(receiptDetails)
    ? receiptDetails.reduce((sum, item) => {
        const qty = Number(item?.quantity) || 0;
        const price = Number(item?.importPrice) || 0;
        return sum + qty * price;
      }, 0)
    : 0;

  const finalTotal = Math.max(0, subTotal - discountValue);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <Tag color="blue" className="text-lg font-bold py-1 px-3">
            PN{String(dataUpdate?.id || "").padStart(6, "0")}
          </Tag>
          <Title level={4} style={{ margin: 0 }}>
            Cập nhật phiếu nhập hàng
          </Title>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={1000}
      closeIcon={<CloseOutlined className="text-lg" />}
      destroyOnClose // Quan trọng: xóa form khi đóng
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card className="shadow-sm">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Người giao hàng</Text>}
                name="deliverName"
                rules={[
                  { required: true, message: "Vui lòng nhập người nhận" },
                ]}
              >
                <Input size="large" placeholder="Ví dụ: Lê Văn B" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<Text strong>Nhà cung cấp</Text>}
                name="supplierId"
                rules={[{ required: true, message: "Chọn nhà cung cấp" }]}
              >
                <Select
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn nhà cung cấp"
                  options={suppliers.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<Text strong>Ngày giao hàng</Text>}
                name="shipDate"
                rules={[{ required: true, message: "Chọn ngày giao" }]}
              >
                <DatePicker
                  size="large"
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày giờ"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<Text strong>Giảm giá (nếu có)</Text>}
                name="discount"
                initialValue={0}
              >
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                  addonAfter="₫"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>
            <Text strong className="text-lg">
              Chi tiết sản phẩm
            </Text>
          </Divider>

          <Form.List name="receiptDetails">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} align="middle" className="mb-4">
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "productId"]}
                        rules={[{ required: true, message: "Chọn sản phẩm" }]}
                      >
                        <Select
                          showSearch
                          size="large"
                          placeholder="Tìm sản phẩm..."
                          options={products.map((p) => ({
                            label: p.name + (p.unit ? ` (${p.unit})` : ""),
                            value: p.id,
                          }))}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        rules={[{ required: true, message: "Nhập SL" }]}
                      >
                        <InputNumber
                          min={1}
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="SL"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        name={[name, "importPrice"]}
                        rules={[{ required: true, message: "Nhập giá" }]}
                      >
                        <InputNumber
                          size="large"
                          min={0}
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) =>
                            value?.replace(/\$\s?|(,*)/g, "") as any
                          }
                          addonAfter="₫"
                          placeholder="Giá nhập"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined className="text-xl" />}
                          onClick={() => remove(name)}
                        />
                      )}
                    </Col>
                  </Row>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  size="large"
                >
                  Thêm sản phẩm
                </Button>
              </>
            )}
          </Form.List>

          {/* Tổng tiền live - đã fix lỗi */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <Row justify="end">
              <Col span={10}>
                <div className="text-right space-y-3">
                  <div>
                    <Text strong className="text-lg">
                      Tạm tính:
                    </Text>
                    <Text className="text-2xl font-bold ml-4">
                      {subTotal.toLocaleString("vi-VN")} ₫
                    </Text>
                  </div>
                  {discountValue > 0 && (
                    <div>
                      <Text strong type="danger" className="text-lg">
                        Giảm giá:
                      </Text>
                      <Text type="danger" className="text-2xl font-bold ml-4">
                        -{discountValue.toLocaleString("vi-VN")} ₫
                      </Text>
                    </div>
                  )}
                  <Divider className="my-4" />
                  <div>
                    <Text strong className="text-2xl text-blue-600">
                      Thành tiền:
                    </Text>
                    <Text className="text-3xl font-bold text-blue-600 ml-6">
                      {finalTotal.toLocaleString("vi-VN")} ₫
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Divider />

          <div className="flex justify-end gap-4 mt-6">
            <Button size="large" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isSubmit}
              icon={<SaveOutlined />}
            >
              Cập nhật phiếu nhập
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default UpdateReceipt;
