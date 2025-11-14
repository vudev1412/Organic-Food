import { App, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useEffect, useState } from "react";
import { updateCategoryAPI } from "../../../service/api";

interface IProps {
  openModelUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  dataUpdate: ICategory | null;
  setDataUpdate: (v: ICategory | null) => void;
  refreshTable: () => void;
}

const UpdateCategory = ({ openModelUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue(dataUpdate);
    }
  }, [dataUpdate]);

  const onFinish: FormProps<ICategory>["onFinish"] = async (values) => {
    if (!dataUpdate) return;
    setIsSubmit(true);
    try {
      const res = await updateCategoryAPI(dataUpdate.id, values);
      if (res.status === 200) {
        message.success("Cập nhật category thành công");
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
        refreshTable();
      }
    } catch (error: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật category"
      open={openModelUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên category" name="name" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "Vui lòng nhập slug!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Parent category ID" name="parent_category_id">
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCategory;
