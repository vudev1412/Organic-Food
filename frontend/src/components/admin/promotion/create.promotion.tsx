import { App, Divider, Form, Input, Modal, Select } from "antd";
import { useState } from "react";
import { createPromotionAPI } from "../../../service/api";


const CreatePromotion = ({ open, setOpen, refreshTable }: any) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const res = await createPromotionAPI(values);

    if (res?.data) {
      message.success("Tạo promotion thành công");
      form.resetFields();
      setOpen(false);
      refreshTable();
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm Promotion"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => setOpen(false)}
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "PERCENT", label: "Giảm %" },
              { value: "FIXED_AMOUNT", label: "Giảm tiền" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Giá trị" name="value" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePromotion;
