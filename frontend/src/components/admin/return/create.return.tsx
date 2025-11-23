import { App, Divider, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { createReturnAPI, getCustomersAPI, getOrderAPIByUserId } from "../../../service/api";

const CreateReturn = ({ open, setOpen, refreshTable }: any) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  // Hàm format Mã hóa đơn HDxxx
  const formatORId = (id?: number) => {
    if (!id) return "Không có ID";
    if (id < 10) return `HD00${id}`;
    if (id < 100) return `HD0${id}`;
    return `HD${id}`;
  };

  // Mapping trạng thái sang tiếng Việt
  const mapStatus: Record<string, string> = {
    PENDING: "Đang chờ duyệt",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
  };

  // Load customers khi mở modal
  useEffect(() => {
    if (open) fetchCustomers();
  }, [open]);

  const fetchCustomers = async () => {
    const res = await getCustomersAPI("");
    if (res?.data?.data.result) {
      const list = res.data.data.result.map((c: any) => ({
        label: c.user?.name || `Customer #${c.id}`,
        value: c.id,
        userId: c.user?.id,
      }));
      setCustomers(list);
    }
  };

  // Chọn customer => load order theo userId
  const handleCustomerChange = async (customerId: number) => {
    const customer = customers.find((c) => c.value === customerId);
    if (!customer) return;

    const userId = customer.userId;
    setSelectedCustomer(customerId);
    form.setFieldValue("orderId", null);

    const res = await getOrderAPIByUserId(userId);
    if (res?.data?.data) {
      const orderList = res.data.data.map((o: any) => ({
        label: `${formatORId(o.id)} - ${mapStatus[o.statusOrder] ?? o.statusOrder}`,
        value: o.id,
      }));
      setOrders(orderList);
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const res = await createReturnAPI(values);
    if (res?.data) {
      message.success("Tạo return thành công");
      form.resetFields();
      setOpen(false);
      refreshTable();
    } else {
      notification.error({ message: "Lỗi", description: "Tạo thất bại" });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Tạo đổi trả"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form layout="vertical" form={form} onFinish={onFinish}>

        {/* Step 1 - chọn customer */}
        <Form.Item label="Khách hàng" name="customerId" rules={[{ required: true }]}>
          <Select
            placeholder="Chọn khách hàng"
            options={customers}
            onChange={handleCustomerChange}
          />
        </Form.Item>

        {/* Step 2 - chọn order của customer */}
        <Form.Item label="Đơn hàng" name="orderId" rules={[{ required: true }]}>
          <Select
            placeholder={selectedCustomer ? "Chọn đơn hàng" : "Hãy chọn khách hàng trước"}
            options={orders}
            disabled={!selectedCustomer}
          />
        </Form.Item>

        <Form.Item label="Lý do" name="reason" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Tình trạng" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Đang chờ duyệt", value: "PENDING" },
              { label: "Đã duyệt", value: "APPROVED" },
              { label: "Từ chối", value: "REJECTED" },
              { label: "Đã hủy", value: "CANCELED" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Loại yêu cầu" name="returnType" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Hoàn tiền", value: "REFUND" },
              { label: "Đổi sản phẩm", value: "EXCHANGE" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Ghi chú quy trình" name="processNote">
          <Input.TextArea rows={3} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateReturn;
