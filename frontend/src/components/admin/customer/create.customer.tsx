// File path: /src/components/admin/customer/create.customer.tsx

import { App, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useState } from "react";
import { createCustomerProfileAPI, createUserAPI } from "../../../service/api";

interface IProps {
  openModelCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  password: string;
  email: string;
  phone: string;
};

const CreateUser = (props: IProps) => {
  const { openModelCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, password, email, phone } = values;
    setIsSubmit(true);

    try {
      // 1️⃣ Tạo user trước
      const resUser = await createUserAPI(name, email, phone, "CUSTOMER");

      if (resUser?.data?.success === false || !resUser?.data?.data?.id) {
        const backendError =
          resUser?.error ||
          resUser?.data?.message ||
          "Tạo user thất bại từ backend";

        // Focus vào field theo keyword trong thông báo
        if (backendError.includes("số điện thoại")) {
          form.setFields([{ name: "phone", errors: [backendError] }]);
          form.scrollToField("phone", { behavior: "smooth", block: "center" });
        } else if (backendError.includes("email")) {
          form.setFields([{ name: "email", errors: [backendError] }]);
          form.scrollToField("email", { behavior: "smooth", block: "center" });
        } else if (
          backendError.includes("họ tên") ||
          backendError.includes("tên")
        ) {
          form.setFields([{ name: "name", errors: [backendError] }]);
          form.scrollToField("name", { behavior: "smooth", block: "center" });
        } else if (backendError.includes("password")) {
          form.setFields([{ name: "password", errors: [backendError] }]);
          form.scrollToField("password", {
            behavior: "smooth",
            block: "center",
          });
        } else {
          notification.error({
            message: "Xảy ra lỗi",
            description: backendError,
            duration: 5,
          });
        }

        throw new Error(backendError);
      }

      const userId = resUser.data.data.id;

      // 2️⃣ Tạo CustomerProfile dựa trên userId vừa tạo
      const resProfile = await createCustomerProfileAPI({
        member: false,
        user: { id: userId },
      });

      if (resProfile?.data?.success === false || !resProfile?.data?.data?.id) {
        const backendError =
          resProfile?.data?.message ||
          "Tạo CustomerProfile thất bại từ backend";
        notification.error({
          message: "Xảy ra lỗi",
          description: backendError,
          duration: 5,
        });
        throw new Error(backendError);
      }

      // Thành công
      message.success("Tạo user thành công");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } catch (err: any) {
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra";

      console.log("Error:", backendError);
    } finally {
      setIsSubmit(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
    if (errorInfo?.errorFields && errorInfo.errorFields.length > 0) {
      const firstErrorField = errorInfo.errorFields[0]
        .name[0] as keyof FieldType;
      form.scrollToField(firstErrorField, {
        behavior: "smooth",
        block: "center",
      });
      form.setFields([
        {
          name: firstErrorField,
          errors: errorInfo.errorFields[0].errors,
        },
      ]);
    }
  };

  return (
    <Modal
      title="Thêm mới người dùng"
      open={openModelCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText={"Tạo mới"}
      cancelText={"Hủy"}
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form
        form={form}
        name="basic"
        style={{ maxWidth: 600 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập Email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
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
                "Số điện thoại không hợp lệ! (VD: 0987654321 hoặc +84987654321)",
            },
          ]}
        >
          <Input
            maxLength={12} // +84 + 9 số = 12 ký tự
            onKeyPress={(e) => {
              const allowed = /[0-9]/;

              // Cho phép ký tự "+" chỉ ở đầu
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

              // Cho phép +84 hoặc số
              if (!/^\+?[0-9]+$/.test(pasteText)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
