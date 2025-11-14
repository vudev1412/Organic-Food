import { App, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useEffect, useState } from "react";
import { updateUserAPI } from "../../../service/api";

interface IProps {
  openModelUpdate: boolean;
  setOpenModelUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: ICustomerTable | null) => void;
  dataUpdate: ICustomerTable | null;
}
type FieldType = {
  id: number;
  name: string;
  email: string;
  phone: string;
};
const UpdateUser = (props: IProps) => {
  const {
    openModelUpdate,
    setOpenModelUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        name: dataUpdate.name,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    }
  }, [dataUpdate]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, name, email, phone } = values;
    setIsSubmit(true);
    const res = await updateUserAPI(id, email, name, phone);
    if (res && res.data) {
      message.success("Cập nhật user thành công");
      form.resetFields();
      setOpenModelUpdate(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        open={openModelUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModelUpdate(false);
          setDataUpdate(null);
          form.resetFields();
        }}
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />

        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            hidden
            label="id"
            name="id"
            rules={[{ required: true, message: "Vui lòng nhập id!" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item<FieldType>
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập số họ tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UpdateUser;