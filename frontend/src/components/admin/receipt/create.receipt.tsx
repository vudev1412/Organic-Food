import {
  App,
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  createReceiptAPI,
  getEmployeesAPI,
  getProductsAPI,
  getSuppliersAPI,
} from "../../../service/api";
import { useCurrentApp } from "../../context/app.context";
interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateReceipt = ({ open, setOpen, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const { message, notification } = App.useApp();
  const { user } = useCurrentApp();
  useEffect(() => {
    getProductsAPI("page=1&size=1000&active=true").then((res) =>
      setProducts(res.data?.data?.result)
    );
    getSuppliersAPI("?size=1000").then((res) =>
      setSuppliers(res.data?.data?.result)
    );
  }, []);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      // tạo payload chuẩn gửi lên backend
      const payload = {
        deliverName: values.deliverName,
        supplierId: values.supplierId,
        userId: user?.id, // ✅ lấy từ context
        shipDate: values.shipDate?.toISOString() || null,
        discount: values.discount || 0,
        details:
          values.receiptDetails?.map((d: any) => ({
            productId: d.productId,
            quantity: d.quantity,
            importPrice: d.importPrice,
          })) || [], // nếu null thì backend sẽ nhận mảng rỗng
      };

      const res = await createReceiptAPI(payload);

      if (res && res.data) {
        message.success("Tạo receipt thành công");
        form.resetFields();
        setOpen(false);
        refreshTable();
      } else {
        notification.error({ message: "Lỗi", description: "Tạo thất bại" });
      }
    } catch (err) {
      notification.error({ message: "Lỗi", description: "Có lỗi xảy ra" });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Tạo Receipt"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={800}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Người giao"
          name="deliverName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[{ required: true }]}
        >
          <Select
            options={suppliers.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>

        <Form.Item
          label="Ngày giao"
          name="shipDate"
          rules={[{ required: true }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Giảm giá" name="discount" initialValue={0}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.List
          name="receiptDetails"
          rules={[{ required: true, message: "Cần ít nhất 1 sản phẩm" }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Chọn sản phẩm" }]}
                  >
                    <Select
                      style={{ width: 200 }}
                      options={products.map((p) => ({
                        label: p.name,
                        value: p.id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Nhập số lượng" }]}
                  >
                    <InputNumber placeholder="Số lượng" min={1} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "importPrice"]}
                    rules={[{ required: true, message: "Nhập giá nhập" }]}
                  >
                    <InputNumber placeholder="Giá nhập" min={0} />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateReceipt;
