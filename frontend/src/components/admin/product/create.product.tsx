import {
  App,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  type FormProps,
  Switch,
  InputNumber,
  DatePicker,
} from "antd";
import { useState } from "react";
import { createProductAPI } from "../../../service/api";
import moment, { Moment } from "moment";

interface IProps {
  openModelCreate: boolean;
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
  rating_avg?: number;
  image?: string;
  mfgDate?: Moment; // Moment object từ DatePicker
  expDate?: Moment; // Moment object từ DatePicker
  categoryId?: number;
};

const CreateProduct = (props: IProps) => {
  const { openModelCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    // Chuyển Moment sang ISO string để backend nhận
    const payload = {
      ...values,
      mfgDate: values.mfgDate ? values.mfgDate.toISOString() : undefined,
      expDate: values.expDate ? values.expDate.toISOString() : undefined,
    };

    try {
      const res = await createProductAPI(payload);
      if (res && res.data) {
        message.success("Tạo mới sản phẩm thành công");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Xảy ra lỗi",
          description:
            res?.message && Array.isArray(res.message)
              ? res.message[0]
              : res?.message || "Không thể tạo sản phẩm",
          duration: 5,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: error.message || "Không thể tạo sản phẩm",
        duration: 5,
      });
    }

    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm mới sản phẩm"
      open={openModelCreate}
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
        name="create-product"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Đơn vị"
          name="unit"
          rules={[{ required: true, message: "Vui lòng nhập đơn vị!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType> label="Nơi sản xuất" name="origin_address">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item<FieldType> label="Đánh giá trung bình" name="rating_avg">
          <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType> label="Ảnh" name="image">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Ngày sản xuất" name="mfgDate">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType> label="Hạn sử dụng" name="expDate">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType> label="Category ID" name="categoryId">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Kích hoạt"
          name="active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProduct;
