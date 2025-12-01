// src/components/admin/employee/create.employee.tsx

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, App, Button } from "antd";
import { User, Mail, Phone, Lock, MapPin, Calendar, Home } from "lucide-react";
import {
  createUserAPI,
  createEmployeeProfileAPI,
  getAllRolesAPI,
} from "../../../service/api";
import dayjs from "dayjs";

const { Option } = Select;

interface IProps {
  openModelCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

interface IRole {
  id: number;
  name: string;
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
  const [roles, setRoles] = useState<IRole[]>([]);

  // Load tỉnh thành
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // Load roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAllRolesAPI();
        if (res?.data?.data) setRoles(res.data.data);
      } catch (error) {
        console.error("Lỗi tải roles:", error);
      }
    };
    fetchRoles();
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

  // ================ VALIDATOR SỐ ĐIỆN THOẠI +84 / 0 ================
  const validatePhoneNumber = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng nhập số điện thoại"));
    }

    // Chuẩn hóa: loại bỏ khoảng trắng, dấu cách
    const cleaned = value.replace(/\s/g, "");

    // Kiểm tra định dạng +84... hoặc 0...
    const phoneRegex = /^(\+84|0)\d{9}$/;
    if (!phoneRegex.test(cleaned)) {
      return Promise.reject(
        new Error("Số điện thoại phải bắt đầu bằng +84 hoặc 0 và có 10 số")
      );
    }

    return Promise.resolve();
  };

  // Tự động format lại khi người dùng gõ
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Chỉ giữ lại số

    if (value.startsWith("84") && value.length > 2) {
      value = "0" + value.slice(2);
    }
    if (value.startsWith("0")) {
      value = value.slice(0, 10); // Giới hạn 10 số
    }

    // Cập nhật lại vào form (không cần setFieldValue vì Input tự quản lý)
    e.target.value = value;
  };

  // ================ VALIDATOR TUỔI >= 18 ================
  const validateAge = (_: any, value: dayjs.Dayjs | null) => {
    if (!value) return Promise.reject(new Error("Vui lòng chọn ngày sinh"));
    const age = dayjs().diff(value, "year");
    if (age < 18) {
      return Promise.reject(new Error("Nhân viên phải từ 18 tuổi trở lên"));
    }
    return Promise.resolve();
  };

  // ================ VALIDATOR NGÀY VÀO LÀM ================
  const validateHireDate = (_: any, value: dayjs.Dayjs | null) => {
    if (!value) return Promise.reject(new Error("Vui lòng chọn ngày vào làm"));

    const birthDate = form.getFieldValue("birthDate");
    if (birthDate && value.isBefore(birthDate)) {
      return Promise.reject(
        new Error("Ngày vào làm không thể trước ngày sinh")
      );
    }
    if (value.isAfter(dayjs())) {
      return Promise.reject(
        new Error("Ngày vào làm không được trong tương lai")
      );
    }
    return Promise.resolve();
  };

  // ================ SUBMIT ================
  const onFinish = async (values: any) => {
    setIsSubmit(true);

    try {
      if (!values.roleName) {
        form.setFields([
          { name: "roleName", errors: ["Vui lòng chọn vai trò"] },
        ]);
        form.scrollToField("roleName", { behavior: "smooth", block: "center" });
        return;
      }

      // Chuẩn hóa số điện thoại về dạng 0xxxxxxxxx
      let phone = values.phone.replace(/\s/g, "");
      if (phone.startsWith("+84")) phone = "0" + phone.slice(3);
      else if (phone.startsWith("84") && !phone.startsWith("0"))
        phone = "0" + phone.slice(2);

      // 1. Tạo user trước (có role + password)
      const resUser = await createUserAPI(
        values.name,
        values.email,
        phone,
        values.roleName,
        values.password
      );

      // Kiểm tra lỗi từ backend (ưu tiên cao nhất)
      if (
        resUser?.status >= 400 ||
        resUser?.data?.success === false ||
        !resUser?.data?.data?.id
      ) {
        const backendError =
          resUser?.error ||
          resUser?.message ||
          resUser?.response?.data?.error ||
          "Tạo tài khoản thất bại";

        // Tự động focus + scroll đến field bị lỗi
        if (backendError.toLowerCase().includes("email")) {
          form.setFields([{ name: "email", errors: [backendError] }]);
          form.scrollToField("email", { behavior: "smooth", block: "center" });
        } else if (
          backendError.toLowerCase().includes("số điện thoại") ||
          backendError.toLowerCase().includes("phone")
        ) {
          form.setFields([{ name: "phone", errors: [backendError] }]);
          form.scrollToField("phone", { behavior: "smooth", block: "center" });
        } else if (
          backendError.toLowerCase().includes("tên") ||
          backendError.toLowerCase().includes("name")
        ) {
          form.setFields([{ name: "name", errors: [backendError] }]);
          form.scrollToField("name", { behavior: "smooth", block: "center" });
        } else if (
          backendError.toLowerCase().includes("mật khẩu") ||
          backendError.toLowerCase().includes("password")
        ) {
          form.setFields([{ name: "password", errors: [backendError] }]);
          form.scrollToField("password", {
            behavior: "smooth",
            block: "center",
          });
        } else {
          notification.error({
            message: "Tạo tài khoản thất bại",
            description: backendError,
            duration: 6,
          });
        }

        throw new Error(backendError); // Dừng lại, không tạo profile
      }

      // Lấy userId từ mọi kiểu response
      const userId = resUser?.data?.data?.id || resUser?.data?.id;
      if (!userId) {
        notification.error({
          message: "Lỗi hệ thống",
          description: "Không nhận được ID người dùng từ server",
        });
        throw new Error("Missing user ID");
      }

      // 2. Tạo Employee Profile
      const resProfile = await createEmployeeProfileAPI({
        user: { id: userId },
        hireDate: values.hireDate?.toISOString(),
        birth: values.birthDate?.toISOString(),
        address: getFullAddress(values) || values.street,
      });

      // Kiểm tra lỗi tạo profile
      if (
        resProfile?.status >= 400 ||
        resProfile?.data?.success === false ||
        !resProfile?.data?.data?.id
      ) {
        const profileError =
          resProfile?.data?.error ||
          resProfile?.data?.message ||
          "Tạo hồ sơ nhân viên thất bại";

        notification.error({
          message: "Tạo hồ sơ nhân viên thất bại",
          description: profileError,
          duration: 6,
        });
        throw new Error(profileError);
      }

      // Thành công hoàn toàn
      message.success("Thêm nhân viên thành công!");
      form.resetFields();
      setDistricts([]);
      setWards([]);
      setOpenModalCreate(false);
      refreshTable();
    } catch (err: any) {
      // Chỉ chạy khi chưa xử lý lỗi ở trên (tránh trùng thông báo)
      if (
        !err.message?.includes("Tạo tài khoản thất bại") &&
        !err.message?.includes("Tạo hồ sơ nhân viên thất bại")
      ) {
        notification.error({
          message: "Lỗi không xác định",
          description:
            err?.response?.data?.error || err.message || "Vui lòng thử lại",
          duration: 6,
        });
      }
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
      closeIcon={
        <div className="p-2 hover:bg-gray-100 rounded-full text-xl">×</div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
        {/* Họ tên + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<User size={16} className="text-gray-400" />}
              placeholder="Nguyễn Văn A"
              className="h-11"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<Mail size={16} className="text-gray-400" />}
              placeholder="abc@company.com"
              className="h-11"
            />
          </Form.Item>
        </div>

        {/* SĐT + Mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ validator: validatePhoneNumber }]}
          >
            <Input
              prefix={<Phone size={16} className="text-gray-400" />}
              placeholder="0987654321 hoặc +84987654321"
              className="h-11"
              maxLength={12}
              onChange={handlePhoneChange}
              onKeyPress={(e) => !/[0-9+]/.test(e.key) && e.preventDefault()}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<Lock size={16} className="text-gray-400" />}
              placeholder="••••••••"
              className="h-11"
            />
          </Form.Item>
        </div>

        {/* Vai trò */}
        <Form.Item
          name="roleName"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò" className="h-11">
            {roles.map((r) => (
              <Option key={r.id} value={r.name}>
                {r.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ngày sinh + Ngày vào làm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Form.Item
            name="birthDate"
            label="Ngày sinh"
            rules={[{ validator: validateAge }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              className="w-full h-11"
              suffixIcon={<Calendar size={16} className="text-gray-400" />}
              disabledDate={(current) =>
                current &&
                (current > dayjs().endOf("day") ||
                  current < dayjs().subtract(100, "year"))
              }
            />
          </Form.Item>

          <Form.Item
            name="hireDate"
            label="Ngày vào làm"
            rules={[{ validator: validateHireDate }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày vào làm"
              className="w-full h-11"
              suffixIcon={<Calendar size={16} className="text-gray-400" />}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
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
            rules={[
              { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn Tỉnh/Thành phố"
              optionFilterProp="children"
              onChange={handleProvinceChange}
              className="h-11"
            >
              {provinces.map((p) => (
                <Option key={p.Id} value={p.Name}>
                  {p.Name}
                </Option>
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
                <Option key={d.Id} value={d.Name}>
                  {d.Name}
                </Option>
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
                <Option key={w.Id} value={w.Name}>
                  {w.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="street"
            rules={[
              { required: true, message: "Vui lòng nhập số nhà, tên đường" },
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="VD: 123 Đường Láng, Tòa A, Lầu 5"
              prefix={<Home size={16} className="text-gray-400 mt-3" />}
            />
          </Form.Item>
        </div>

        {/* Nút */}
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
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Tạo nhân viên
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateEmployee;
