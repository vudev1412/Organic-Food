import { App, Divider, Form, Input, Modal, InputNumber, Switch, type FormProps } from "antd";
import { useEffect, useState } from "react";
import { updateProductAPI } from "../../../service/api";

interface IProps {
  openModelUpdate: boolean;
  setOpenModelUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IProduct | null) => void;
  dataUpdate: IProduct | null;
}

type FieldType = {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  origin_address: string;
  description: string;
  active: boolean;
};

const UpdateProduct = (props: IProps) => {
  const { openModelUpdate, setOpenModelUpdate, refreshTable, setDataUpdate, dataUpdate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        name: dataUpdate.name,
        unit: dataUpdate.unit,
        price: dataUpdate.price,
        quantity: dataUpdate.quantity,
        origin_address: dataUpdate.origin_address,
        description: dataUpdate.description,
        active: dataUpdate.active,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, name, unit, price, quantity, origin_address, description, active } = values;
    setIsSubmit(true);
    const res = await updateProductAPI(id, name, unit, price, origin_address, description, active);
    if (res && res.data) {
      message.success("Cập nhật sản phẩm thành công");
      form.resetFields();
      setOpenModelUpdate(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
        duration: 5,
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Cập nhật sản phẩm"
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
      <Form form={form} name="update-product" onFinish={onFinish} autoComplete="off" layout="vertical">
        <Form.Item hidden name="id" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Đơn vị" name="unit" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Giá" name="price" rules={[{ required: true, type: "number", min: 0 }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, type: "number", min: 0 }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Nơi sản xuất" name="origin_address">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Hoạt động" name="active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
