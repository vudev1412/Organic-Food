// src/components/admin/employee/create.employee.tsx

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, App, Button } from "antd";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Calendar,
  Home,
} from "lucide-react";
import {
  createUserAPI,
  createEmployeeProfileAPI,
} from "../../../service/api";

const { Option } = Select;

interface IProps {
  openModelCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateEmployee: React.FC<IProps> = ({
  openModelCreate,
  setOpenModalCreate,
  refreshTable,
}) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Load tỉnh thành từ API
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  const handleProvinceChange = (value: string) => {
    const selectedProvince = provinces.find((p) => p.Name === value);
    setDistricts(selectedProvince?.Districts || []);
    setWards([]);
    form.setFieldsValue({ district: undefined, ward: undefined });
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find((d) => d.Name === value);
    setWards(selectedDistrict?.Wards || []);
    form.setFieldsValue({ ward: undefined });
  };

  const getFullAddress = (values: any) =>
    [values.street, values.ward, values.district, values.province]
      .filter(Boolean)
      .join(", ");

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      // Tạo user
      const resUser = await createUserAPI(
        values.name,
        values.email,
        values.password,
        values.phone,
        "EMPLOYEE"
      );
      if (!resUser?.data?.data?.id) throw new Error("Tạo tài khoản thất bại");

      const userId = resUser.data.data.id;

      await createEmployeeProfileAPI({
        user: { id: userId },
        hireDate: values.hireDate?.toISOString(),
        birth: values.birthDate?.toISOString(),
        address: getFullAddress(values) || values.street,
      });

      message.success("Thêm nhân viên thành công!");
      form.resetFields();
      setDistricts([]);
      setWards([]);
      setOpenModalCreate(false);
      refreshTable();
    } catch (err: any) {
      notification.error({
        message: "Thất bại",
        description: err.response?.data?.message || err.message || "Lỗi không xác định",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-xl font-bold text-indigo-700">
          <User size={26} />
          Thêm nhân viên mới
        </div>
      }
      open={openModelCreate}
      onCancel={() => {
        form.resetFields();
        setDistricts([]);
        setWards([]);
        setOpenModalCreate(false);
      }}
      footer={null}
      width={800}
      closeIcon={<div className="p-2 hover:bg-gray-100 rounded-full text-xl">×</div>}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
        {/* Họ tên + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input prefix={<User size={16} className="text-gray-400" />} placeholder="Nguyễn Văn A" className="h-11" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<Mail size={16} className="text-gray-400" />} placeholder="abc@company.com" className="h-11" />
          </Form.Item>
        </div>

        {/* SĐT + Mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^0\d{9}$/, message: "SĐT phải có 10 số, bắt đầu bằng 0" },
            ]}
          >
            <Input prefix={<Phone size={16} className="text-gray-400" />} placeholder="0987654321" className="h-11" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password prefix={<Lock size={16} className="text-gray-400" />} placeholder="••••••••" className="h-11" />
          </Form.Item>
        </div>

        {/* Ngày vào làm + Ngày sinh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="hireDate"
            label="Ngày vào làm"
            rules={[{ required: true, message: "Vui lòng chọn ngày vào làm" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              className="w-full h-11"
              suffixIcon={<Calendar size={16} className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              className="w-full h-11"
              suffixIcon={<Calendar size={16} className="text-gray-400" />}
            />
          </Form.Item>
        </div>

        {/* Địa chỉ */}
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-800 font-bold text-lg mb-4">
            <MapPin size={22} />
            Địa chỉ cư trú (bắt buộc)
          </div>

          <Form.Item
            name="province"
            rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố" }]}
          >
            <Select
              showSearch
              placeholder="Chọn Tỉnh/Thành phố"
              optionFilterProp="children"
              onChange={handleProvinceChange}
              className="h-11"
            >
              {provinces.map((p) => (
                <Option key={p.Id} value={p.Name}>{p.Name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
          >
            <Select
              showSearch
              placeholder="Chọn Quận/Huyện"
              disabled={districts.length === 0}
              onChange={handleDistrictChange}
              className="h-11"
            >
              {districts.map((d) => (
                <Option key={d.Id} value={d.Name}>{d.Name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            rules={[{ required: true, message: "Vui lòng chọn Phường/Xã" }]}
          >
            <Select
              showSearch
              placeholder="Chọn Phường/Xã"
              disabled={wards.length === 0}
              className="h-11"
            >
              {wards.map((w) => (
                <Option key={w.Id} value={w.Name}>{w.Name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="street"
            rules={[{ required: true, message: "Vui lòng nhập số nhà, tên đường" }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="VD: 123 Đường Láng, Tòa A, Lầu 5"
              prefix={<Home size={16} className="text-gray-400 mt-3" />}
            />
          </Form.Item>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="default"
            onClick={() => {
              form.resetFields();
              setDistricts([]);
              setWards([]);
              setOpenModalCreate(false);
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
          >
            Tạo nhân viên
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateEmployee;
