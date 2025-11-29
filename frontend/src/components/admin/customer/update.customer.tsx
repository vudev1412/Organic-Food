// File path: /src/components/admin/customer/update.customer.tsx

import { App, Divider, Form, Input, Modal, Switch, type FormProps } from "antd";
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
  member: boolean;
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
        name: dataUpdate.user.name,
        email: dataUpdate.user.email,
        phone: dataUpdate.user.phone,
        member: dataUpdate.member,
      });
    }
  }, [dataUpdate]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    if (!dataUpdate) return;

    // Tạo payload đúng định dạng backend cần
    const payload = {
      id: dataUpdate!.id,
      member: values.member,
      user: {
        id: dataUpdate!.user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        image: dataUpdate!.user.image ?? null,
      },
    } as ICustomerTable;

    const res = await updateUserAPI(dataUpdate.id, payload);

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
              {
                pattern: /^(0\d{9}|\+84\d{9})$/,
                message:
                  "Số điện thoại không hợp lệ (VD: 0987654321 hoặc +84987654321)",
              },
            ]}
          >
            <Input
              maxLength={12} // +84 + 9 số
              onKeyPress={(e) => {
                const allowed = /[0-9]/;

                // Cho phép "+" ở đầu
                if (e.key === "+") {
                  if (e.currentTarget.value.length === 0) return;
                  e.preventDefault();
                  return;
                }

                // Chặn ký tự không phải số
                if (!allowed.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pasteText = e.clipboardData.getData("text");
                if (!/^\+?[0-9]+$/.test(pasteText)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="Thành viên"
            name="member"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UpdateUser;
