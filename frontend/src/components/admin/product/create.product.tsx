import {
  App,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  InputNumber,
  Switch,
  DatePicker,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { createProductAPI, getCertificate } from "../../../service/api";
import moment, { Moment } from "moment";

const { Option } = Select;

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  unit: string;
  price: number;
  quantity: number;
  origin_address?: string;
  description?: string;
  active: boolean;
  mfgDate?: Moment;
  expDate?: Moment;
  image?: string;
  certificateId?: number;
};

const CreateProductCertificate = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm<FieldType>();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [certificates, setCertificates] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getCertificate();
        if (res && res.data && Array.isArray(res.data.data)) {
          setCertificates(res.data.data);
        } else {
          setCertificates([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách certificate:", error);
        setCertificates([]);
      }
    };
    fetchCertificates();
  }, []);

  const onFinish = async (values: FieldType) => {
    setIsSubmit(true);

    // Payload backend mong muốn
    const payload = {
      product: {
        name: values.name,
        unit: values.unit,
        price: values.price,
        quantity: values.quantity,
        active: values.active,
        origin_address: values.origin_address,
        description: values.description,
        mfgDate: values.mfgDate?.toISOString(),
        expDate: values.expDate?.toISOString(),
        image: values.image,
      },
      certificate: {
        id: values.certificateId,
      },
    };

    try {
      const res = await createProductAPI(payload);
      if (res?.data) {
        message.success("Tạo sản phẩm và chứng nhận thành công");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Tạo sản phẩm và chứng nhận"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={600}
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Product Fields */}
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Đơn vị" name="unit" rules={[{ required: true }]}>
          <Select placeholder="Chọn đơn vị">
            <Option value="kg">Kg</Option>
            <Option value="g">Gram</Option>
            <Option value="lit">Lít</Option>
            <Option value="box">Hộp</Option>
            <Option value="pcs">Cái</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Nơi sản xuất" name="origin_address">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Ngày sản xuất" name="mfgDate">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Hạn sử dụng" name="expDate">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Ảnh" name="image">
          <Input />
        </Form.Item>

        <Form.Item
          label="Kích hoạt"
          name="active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        {/* Certificate */}
        <Divider>Chứng nhận</Divider>
        <Form.Item
          label="Chọn chứng chỉ"
          name="certificateId"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn chứng chỉ">
            {certificates.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductCertificate;
