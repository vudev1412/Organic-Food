// File path: /src/components/admin/product/update.product.tsx

import {
  App,
  Divider,
  Form,
  Input,
  Modal,
  InputNumber,
  Switch,
  type FormProps,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  getCertificate,
  updateProductCertificateAPI,
} from "../../../service/api";

interface IProps {
  openModelUpdate: boolean;
  setOpenModelUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IProductTable | null) => void;
  dataUpdate: IProductTable | null;
}

type FieldType = {
  product: {
    id: number;
    name: string;
    unit: string;
    price: number;
    quantity: number;
    origin_address: string;
    description: string;
    active: boolean;
  };
  certificate: {
    id: number;
  };
  imageUrl: string;
  certNo: string;
  date: string;
};

const UpdateProductCertificate = (props: IProps) => {
  const {
    openModelUpdate,
    setOpenModelUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;
  const { Option } = Select;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm<FieldType>();

  // Fill dữ liệu từ dataUpdate vào form
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        product: {
          id: dataUpdate.product.id,
          name: dataUpdate.product.name,
          unit: dataUpdate.product.unit,
          price: dataUpdate.product.price,
          quantity: dataUpdate.product.quantity,
          active: dataUpdate.product.active,
          origin_address: dataUpdate.product.origin_address,
          description: dataUpdate.product.description,
        },
        certificate: {
          id: dataUpdate.certificate.id,
        },
        imageUrl: dataUpdate.imageUrl,
        certNo: dataUpdate.certNo,
        date: dataUpdate.date
          ? new Date(dataUpdate.date).toISOString().slice(0, 16)
          : null,
      });
    }
  }, [dataUpdate]);
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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!dataUpdate) return;

    setIsSubmit(true);

    const productId = dataUpdate.product.id;
    const certificateId = dataUpdate.certificate.id;

    // Chuyển date từ datetime-local sang ISO string
    const dateISO = values.date ? new Date(values.date).toISOString() : null;

    const payload = {
      imageUrl: values.imageUrl,
      certNo: values.certNo,
      date: dateISO,
      product: {
        id: values.product.id,
        name: values.product.name,
        unit: values.product.unit,
        price: values.product.price,
        quantity: values.product.quantity,
        active: values.product.active,
        origin_address: values.product.origin_address,
        description: values.product.description,
      },
      certificate: {
        id: values.certificate.id,
      },
    };

    try {
      const res = await updateProductCertificateAPI(
        productId,
        certificateId,
        payload
      );

      if (res && res.data) {
        message.success("Cập nhật ProductCertificate thành công");
        setOpenModelUpdate(false);
        setDataUpdate(null);
        refreshTable();
        form.resetFields();
      }
    } catch (error: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật sản phẩm và chứng nhận"
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
      <Form
        form={form}
        name="update-product-certificate"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        {/* Product Fields */}
        <Form.Item hidden name={["product", "id"]}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name={["product", "name"]}
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Đơn vị"
          name={["product", "unit"]}
          rules={[{ required: true, message: "Vui lòng nhập đơn vị" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name={["product", "price"]}
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
              message: "Giá không hợp lệ",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name={["product", "quantity"]}
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
              message: "Số lượng không hợp lệ",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Hoạt động"
          name={["product", "active"]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Nơi sản xuất" name={["product", "origin_address"]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name={["product", "description"]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider>Chứng nhận</Divider>

        <Form.Item
          label="Chứng chỉ"
          name={["certificate", "id"]}
          rules={[{ required: true, message: "Vui lòng chọn chứng chỉ" }]}
        >
          <Select
            placeholder="Chọn chứng chỉ"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {certificates.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item label="Mã chứng nhận" name="certNo">
          <Input />
        </Form.Item>

        <Form.Item label="Hình ảnh chứng nhận" name="imageUrl">
          <Input />
        </Form.Item>

        <Form.Item label="Ngày cấp" name="date">
          <Input type="datetime-local" />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default UpdateProductCertificate;
