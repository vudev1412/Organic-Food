import { App, Divider, Form, Input, Modal, type FormProps, InputNumber, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { updateEmployeeAPI } from "../../../service/api";


interface IProps {
  openModelUpdate: boolean;
  setOpenModelUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IEmployee | null) => void;
  dataUpdate: IEmployee | null;
}

interface IEmployee {
  id: number;
  employeeCode: string;
  address: string;
  hireDate: string; // giữ string
  salary: number;
  user: ICustomer;
}

interface ICustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  image?: string | null;
}

type FieldType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  employeeCode: string;
  hireDate: string; // string
  salary: number;
};

const UpdateEmployee = (props: IProps) => {
  const { openModelUpdate, setOpenModelUpdate, refreshTable, setDataUpdate, dataUpdate } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm<FieldType>();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        name: dataUpdate.user.name,
        email: dataUpdate.user.email,
        phone: dataUpdate.user.phone,
        address: dataUpdate.address,
        employeeCode: dataUpdate.employeeCode,
        hireDate: dataUpdate.hireDate, // giữ string
        salary: dataUpdate.salary,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!dataUpdate) return;
    setIsSubmit(true);

    const payload: IEmployee = {
      id: dataUpdate.id,
      employeeCode: values.employeeCode,
      address: values.address,
      hireDate: values.hireDate, // gửi trực tiếp string
      salary: values.salary,
      user: {
        id: dataUpdate.user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        image: dataUpdate.user.image ?? null,
      },
    };

    try {
      const res = await updateEmployeeAPI(dataUpdate.id, payload);

      if (res.data) {
        message.success("Cập nhật user thành công");
        form.resetFields();
        setOpenModelUpdate(false);
        setDataUpdate(null);
        refreshTable();
      }
    } catch (error: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          error.response?.data?.message &&
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response?.data?.message || error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật người dùng"
      open={openModelUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModelUpdate(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form form={form} name="update-employee" layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item<FieldType> hidden label="ID" name="id">
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
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mã nhân viên"
          name="employeeCode"
          rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Ngày vào làm"
          name="hireDate"
          rules={[{ required: true, message: "Vui lòng nhập ngày vào làm!" }]}
        >
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Lương"
          name="salary"
          rules={[{ required: true, message: "Vui lòng nhập lương!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEmployee;
