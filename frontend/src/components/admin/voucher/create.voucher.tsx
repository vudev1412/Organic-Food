// File: src/components/admin/voucher/create.voucher.tsx

import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Button,
  App,
} from "antd";

import dayjs from "dayjs";
import { createVoucherAPI } from "../../../service/api";

const { RangePicker } = DatePicker;

interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateVoucher = ({ open, onClose }: IProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      startDate: values.dates?.[0]?.toISOString(),
      endDate: values.dates?.[1]?.toISOString(),
    };
    delete payload.dates;

    await createVoucherAPI(payload);
    message.success("Tạo voucher thành công");
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      title="Tạo mã khuyến mãi"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Mã khuyến mãi"
          name="code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Loại khuyến mãi"
          name="typeVoucher"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Phần trăm", value: "PERCENT" },
              { label: "Giảm tiền", value: "FIXED_AMOUNT" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Giá trị" name="value" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Thời gian áp dụng"
          name="dates"
          rules={[{ required: true }]}
        >
          <RangePicker style={{ width: "100%" }} showTime />
        </Form.Item>

        <Form.Item label="Kích hoạt" name="active" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVoucher;
