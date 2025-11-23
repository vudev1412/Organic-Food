import { App, Divider, Form, Input, Modal, Select, type FormProps } from "antd";
import { useEffect, useState } from "react";
import { updateCategoryAPI, getParentCategoriesAPI } from "../../../service/api";

interface IProps {
  openModelUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  dataUpdate: ICategoryTable | null;
  setDataUpdate: (v: ICategoryTable | null) => void;
  refreshTable: () => void;
}

const UpdateCategory = ({
  openModelUpdate,
  setOpenModalUpdate,
  dataUpdate,
  setDataUpdate,
  refreshTable,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [parentList, setParentList] = useState<IParentCategory[]>([]);
  const [loadingParent, setLoadingParent] = useState(false);
  const { message, notification } = App.useApp();

  /** Fetch parent category */
  const fetchParentCategories = async () => {
    setLoadingParent(true);
    try {
      const res = await getParentCategoriesAPI();

      const raw = res?.data?.data ?? res?.data ?? [];
      const items = Array.isArray(raw)
        ? raw.map((i: any) => (i?.data ? i.data : i))
        : [];

      setParentList(items);
    } catch (error: any) {
      notification.error({
        message: "Lỗi tải danh sách parent",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoadingParent(false);
    }
  };

  useEffect(() => {
    if (openModelUpdate) fetchParentCategories();
  }, [openModelUpdate]);

  /** Khi mở modal set form values */
  useEffect(() => {
    if (dataUpdate && openModelUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        slug: dataUpdate.slug,
        parentId:
          dataUpdate.parentCategoryId ??
          dataUpdate.parentCategory?.id ??
          null,
      });
    }
  }, [dataUpdate, openModelUpdate]);

  /** SUBMIT */
  const onFinish: FormProps<ICategoryTable>["onFinish"] = async (values) => {
    if (!dataUpdate) return;

    const payload = {
      name: values.name,
      slug: values.slug,
      parentId: values.parentId ?? null,
    };

    console.log("➡ Payload gửi API:", payload);

    setIsSubmit(true);
    try {
      const res = await updateCategoryAPI(dataUpdate.id, payload);
      if (res.status === 200) {
        message.success("Cập nhật category thành công");
        handleClose();
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

  /** Close modal */
  const handleClose = () => {
    form.resetFields();
    setOpenModalUpdate(false);
    setDataUpdate(null);
  };

  /** Parent options */
  const parentOptions = parentList
    .filter((c) => c.id !== dataUpdate?.id)
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

  return (
    <Modal
      title="Cập nhật Category"
      open={openModelUpdate}
      onOk={() => form.submit()}
      onCancel={handleClose}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      maskClosable={false}
      destroyOnClose
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Tên category"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên category" },
            { whitespace: true, message: "Tên không được chỉ chứa khoảng trắng" },
          ]}
        >
          <Input placeholder="Nhập tên category" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: "Vui lòng nhập slug" },
            { whitespace: true, message: "Slug không được chỉ chứa khoảng trắng" },
          ]}
        >
          <Input placeholder="Nhập slug" />
        </Form.Item>

        <Form.Item label="Parent Category" name="parentId">
          <Select
            allowClear
            placeholder="Chọn parent category (tùy chọn)"
            options={parentOptions}
            loading={loadingParent}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCategory;
