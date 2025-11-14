import { App, Button, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useState } from "react";
import { createCategoryAPI } from "../../../service/api";

interface IProps {
  openModelCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateCategory = ({ openModelCreate, setOpenModalCreate, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const onFinish: FormProps<ICreateCategoryDTO>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const res = await createCategoryAPI(values);
      if (res.status === 201 || res.status === 200) {
        message.success("Tạo mới category thành công");
        form.resetFields();
        setOpenModalCreate(false);
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
      title="Thêm mới category"
      open={openModelCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
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

export default CreateCategory;
