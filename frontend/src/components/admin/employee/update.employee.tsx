// src/components/admin/employee/update.employee.tsx

import {
  App,
  Divider,
  Form,
  Input,
  Modal,
  type FormProps,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { updateEmployeeAPI } from "../../../service/api";

interface IProps {
  openModelUpdate: boolean;
  setOpenModelUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IEmployee | null) => void;
  dataUpdate: IEmployee | null;
}

type FieldType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  employeeCode: string;
  hireDate: dayjs.Dayjs | null;
  birth: dayjs.Dayjs | null;
};

const UpdateEmployee = (props: IProps) => {
  const { openModelUpdate, setOpenModelUpdate, refreshTable, setDataUpdate, dataUpdate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
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
        hireDate: dataUpdate.hireDate ? dayjs(dataUpdate.hireDate) : null,
        birth: dataUpdate.birth ? dayjs(dataUpdate.birth) : null,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!dataUpdate) return;
    setIsSubmit(true);

    // Chuyển ngày birth và hireDate sang ISO string nếu có
    const payload: IEmployee = {
      id: dataUpdate.id,
      employeeCode: values.employeeCode,
      address: values.address,
      hireDate: values.hireDate ? values.hireDate.toISOString() : null,
      birth: values.birth ? values.birth.toISOString() : null,
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
        message.success("Cập nhật nhân viên thành công");
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
      title="Cập nhật nhân viên"
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
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item hidden label="ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập Email!" }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mã nhân viên" name="employeeCode" rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Ngày vào làm" name="hireDate" rules={[{ required: true, message: "Vui lòng chọn ngày vào làm!" }]}>
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="birth" rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}>
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEmployee;
