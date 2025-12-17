// File path: /src/components/admin/supplier/create.supplier.tsx

import {
  App,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { createSupplierAPI } from "../../../service/api";

const { Option } = Select;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateSupplier = ({ open, setOpen, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // ================= LOAD ĐỊA GIỚI =================
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // ================= AUTO CODE =================
  const handleNameChange = (name: string) => {
    if (name) {
      const code = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "")
        .toUpperCase();

      form.setFieldsValue({ code });
    } else {
      form.setFieldsValue({ code: "" });
    }
  };

  // ================= ĐỊA CHỈ =================
  const handleProvinceChange = (value: string) => {
    const selected = provinces.find((p) => p.Name === value);
    setDistricts(selected?.Districts || []);
    setWards([]);
    form.setFieldsValue({ district: undefined, ward: undefined });
  };

  const handleDistrictChange = (value: string) => {
    const selected = districts.find((d) => d.Name === value);
    setWards(selected?.Wards || []);
    form.setFieldsValue({ ward: undefined });
  };

  const buildFullAddress = (values: any) =>
    [values.street, values.ward, values.district, values.province]
      .filter(Boolean)
      .join(", ");

  // ================= SUBMIT =================
  const onFinish = async (values: any) => {
    setIsSubmit(true);

    try {
      const payload = {
        ...values,
        address: buildFullAddress(values),
      };

      delete payload.province;
      delete payload.district;
      delete payload.ward;
      delete payload.street;

      const res = await createSupplierAPI(payload);

      if (res?.data) {
        message.success("Tạo mới supplier thành công");
        form.resetFields();
        setDistricts([]);
        setWards([]);
        setOpen(false);
        refreshTable();
      } else {
        notification.error({
          message: "Lỗi",
          description: "Tạo supplier thất bại",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi",
        description: err?.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thêm nhà cung cấp"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setDistricts([]);
        setWards([]);
      }}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={700}
    >
      <Divider />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input onChange={(e) => handleNameChange(e.target.value)} />
        </Form.Item>

        <Form.Item label="Mã" name="code" hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Mã số thuế" name="taxNo">
          <Input />
        </Form.Item>

        <Form.Item
          label="Điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* ================= ĐỊA CHỈ ================= */}
        <Divider orientation="left">Địa chỉ</Divider>

        <Form.Item
          name="province"
          rules={[{ required: true, message: "Chọn Tỉnh/Thành phố" }]}
        >
          <Select
            showSearch
            placeholder="Tỉnh / Thành phố"
            onChange={handleProvinceChange}
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
          rules={[{ required: true, message: "Chọn Quận/Huyện" }]}
        >
          <Select
            placeholder="Quận / Huyện"
            disabled={!districts.length}
            onChange={handleDistrictChange}
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
          rules={[{ required: true, message: "Chọn Phường/Xã" }]}
        >
          <Select placeholder="Phường / Xã" disabled={!wards.length}>
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
            { required: true, message: "Nhập số nhà, tên đường" },
          ]}
        >
          <Input placeholder="Số nhà, tên đường" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSupplier;
