// File path: /src/components/admin/return/update.return.tsx

import { App, Divider, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updateReturnAPI } from "../../../service/api";

const UpdateReturn = ({
  open,
  setOpen,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: any) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (dataUpdate) form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);

    const res = await updateReturnAPI(values.id, values);
    if (res?.data) {
      message.success("Cập nhật thành công");
      form.resetFields();
      setOpen(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({
        message: "Lỗi",
        description: "Cập nhật thất bại",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Cập nhật Return"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="Lý do" name="reason" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Tình trạng"
          name="status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Đang chờ duyệt", value: "PENDING" },
              { label: "Đã duyệt", value: "APPROVED" },
              { label: "Từ chối", value: "REJECTED" },
              { label: "Đã hủy", value: "CANCELED" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Loại yêu cầu"
          name="returnType"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Hoàn tiền", value: "REFUND" },
              { label: "Đổi sản phẩm", value: "EXCHANGE" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Ghi chú qui trình" name="processNote">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateReturn;
