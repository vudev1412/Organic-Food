import { Button, Divider, Modal, Select, Form, Input } from "antd";
import { useEffect, useState } from "react";

const Address = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  useEffect(() => {
    // Lấy dữ liệu hành chính Việt Nam
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // Khi chọn tỉnh/thành phố
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    const foundCity = data.find((item) => item.Name === value);
    setDistricts(foundCity?.Districts || []);
    setWards([]); // reset
  };

  // Khi chọn quận/huyện
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    const foundDistrict = districts.find((d) => d.Name === value);
    setWards(foundDistrict?.Wards || []);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h5>Địa chỉ của tôi</h5>
        <Button type="primary" onClick={showModal}>
          Thêm địa chỉ mới
        </Button>
      </div>
      <Divider />

      <Modal
        title="Thêm địa chỉ mới"
        okText="Thêm"
        cancelText="Trở lại"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Tỉnh / Thành phố">
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành phố"
              onChange={handleCityChange}
              options={data.map((item) => ({
                label: item.Name,
                value: item.Name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Quận / Huyện">
            <Select
              showSearch
              placeholder="Chọn quận/huyện"
              disabled={!selectedCity}
              onChange={handleDistrictChange}
              options={districts.map((item) => ({
                label: item.Name,
                value: item.Name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Phường / Xã">
            <Select
              showSearch
              placeholder="Chọn phường/xã"
              disabled={!selectedDistrict}
              options={wards.map((item) => ({
                label: item.Name,
                value: item.Name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ cụ thể">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
       <div className="border-b pb-3 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Địa chỉ</h3>

      <div className="flex justify-between items-start">
        {/* Thông tin địa chỉ */}
        <div className="text-gray-700">
          <div className="font-semibold text-base">
            Lê Hiền Vũ <span className="text-gray-500 ml-2">| (+84) 373 399 534</span>
          </div>
          <div className="mt-1">
            Ủy ban nhân dân ấp mới 1, Trung Chánh, Hóc Môn
          </div>
          <div>
            Xã Trung Chánh, Huyện Hóc Môn, TP. Hồ Chí Minh
          </div>
        </div>

        {/* Hành động */}
        <div className="text-right">
          <div className="text-blue-600 text-sm mb-2 cursor-pointer space-x-2">
            <span className="hover:underline">Cập nhật</span>
            <span className="hover:underline">Xóa</span>
          </div>
          <Button size="small" className="border-gray-300 hover:border-orange-500">
            Thiết lập mặc định
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Address;
