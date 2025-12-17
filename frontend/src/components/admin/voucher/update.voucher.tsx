// File: src/components/admin/voucher/update.voucher.tsx

import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  App,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { getVoucherByIdAPI, updateVoucherAPI } from "../../../service/api";

const { RangePicker } = DatePicker;

interface IProps {
  open: boolean;
  voucherId: number | null;
  onClose: () => void;
}

const UpdateVoucher = ({ open, voucherId, onClose }: IProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (open && voucherId) {
      load();
    }
  }, [open, voucherId]);

  const load = async () => {
    const res = await getVoucherByIdAPI(voucherId!);

    // ✅ Phải lấy res.data.data
    const data = res.data.data;

    form.setFieldsValue({
      ...data,
      dates: [
        data.startDate ? dayjs(data.startDate) : null,
        data.endDate ? dayjs(data.endDate) : null,
      ],
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      startDate: values.dates?.[0]?.toISOString(),
      endDate: values.dates?.[1]?.toISOString(),
    };
    delete payload.dates;

    await updateVoucherAPI(voucherId!, payload);
    message.success("Cập nhật thành công");
    onClose();
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleSubmit} title="Cập nhật Voucher">
      <Form layout="vertical" form={form}>
        <Form.Item label="Mã voucher" name="code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Loại" name="typeVoucher" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "PERCENT", value: "PERCENT" },
              { label: "FIXED_AMOUNT", value: "FIXED_AMOUNT" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Giá trị" name="value" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Thời gian" name="dates">
          <RangePicker style={{ width: "100%" }} showTime />
        </Form.Item>

        <Form.Item label="Kích hoạt" name="active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateVoucher;
