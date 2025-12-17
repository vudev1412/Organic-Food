// src/components/admin/promotion/create.promotion.tsx

import {
  App,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  DatePicker,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createPromotionAPI,
  getProductsAPI,
} from "../../../service/api";

const { RangePicker } = DatePicker;

const CreatePromotion = ({ open, setOpen, refreshTable }: any) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Load product giống CreateOrder
  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      const res = await getProductsAPI("page=1&size=1000&active=true");
      setProducts(res.data?.data?.result || []);
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không tải được danh sách sản phẩm",
      });
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);

    const [startDate, endDate] = values.promotionDate;

    const payload = {
      name: values.name,
      type: values.type,
      value: Number(values.value),
      active: values.active ?? true,
      products: (values.products || []).map((p: any) => ({
        productId: p.productId,
        startDate: startDate.toISOString(), // gán chung
        endDate: endDate.toISOString(),     // gán chung
      })),
    };

    try {
      await createPromotionAPI(payload);
      message.success("Tạo chương trình khuyến mãi thành công");
      form.resetFields();
      setOpen(false);
      refreshTable();
    } catch (err: any) {
      notification.error({
        message: "Tạo thất bại",
        description: err?.response?.data?.message || "Vui lòng thử lại",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thêm chương trình khuyến mãi"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setOpen(false);
      }}
      confirmLoading={isSubmit}
      width={750}
      destroyOnClose
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Tên */}
        <Form.Item
          label="Tên chương trình"
          name="name"
          rules={[{ required: true, message: "Nhập tên chương trình" }]}
        >
          <Input />
        </Form.Item>

        {/* Loại */}
        <Form.Item
          label="Loại khuyến mãi"
          name="type"
          rules={[{ required: true, message: "Chọn loại khuyến mãi" }]}
        >
          <Select
            options={[
              { value: "PERCENT", label: "Giảm %" },
              { value: "FIXED_AMOUNT", label: "Giảm tiền" },
            ]}
          />
        </Form.Item>

        {/* Giá trị */}
        <Form.Item
          label="Giá trị"
          name="value"
          rules={[{ required: true, message: "Nhập giá trị" }]}
        >
          <Input type="number" />
        </Form.Item>

        {/* Active */}
        <Form.Item
          label="Kích hoạt"
          name="active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        {/* Thời gian áp dụng chung (ĐÃ RÀNG BUỘC) */}
        <Form.Item
          label="Thời gian áp dụng"
          name="promotionDate"
          rules={[
            { required: true, message: "Chọn thời gian áp dụng" },
            {
              validator: (_, value) => {
                if (!value || value.length !== 2) {
                  return Promise.resolve();
                }

                const [start, end] = value;

                if (end.isBefore(start)) {
                  return Promise.reject(
                    new Error("Thời gian kết thúc phải sau thời gian bắt đầu")
                  );
                }

                if (start.isBefore(dayjs())) {
                  return Promise.reject(
                    new Error("Thời gian bắt đầu không được ở trong quá khứ")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <RangePicker
            showTime
            className="w-full"
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>

        {/* Products */}
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              <Divider orientation="left">Sản phẩm áp dụng</Divider>

              {fields.map(({ key, name }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <Form.Item
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Chọn sản phẩm" }]}
                    style={{ flex: 1 }}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn sản phẩm"
                      optionFilterProp="children"
                      options={products.map((p) => ({
                        value: p.id,
                        label: p.name,
                      }))}
                    />
                  </Form.Item>

                  <Button danger onClick={() => remove(name)}>
                    Xóa
                  </Button>
                </div>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Thêm sản phẩm
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreatePromotion;
