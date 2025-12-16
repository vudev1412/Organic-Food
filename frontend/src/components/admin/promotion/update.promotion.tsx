import { App, Divider, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updatePromotionAPI } from "../../../service/api";

const UpdatePromotion = ({
  open,
  setOpen,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: any) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    if (dataUpdate) form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const res = await updatePromotionAPI(values.id, values);

    if (res?.data) {
      message.success("Cập nhật thành công");
      setOpen(false);
      setDataUpdate(null);
      refreshTable();
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Cập nhật Promotion"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        setDataUpdate(null);
      }}
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "PERCENT", label: "Giảm %" },
              { value: "AMOUNT", label: "Giảm tiền" },
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

export default UpdatePromotion;
