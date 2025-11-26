// File path: /src/components/admin/category/create.category.tsx

import { App, Divider, Form, Input, Modal, Select, type FormProps } from "antd";
import { useEffect, useState } from "react";
import {
  createCategoryAPI,
  getParentCategoriesAPI,
} from "../../../service/api";

interface IProps {
  openModelCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateCategory = ({
  openModelCreate,
  setOpenModalCreate,
  refreshTable,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [parentList, setParentList] = useState<ICategory[]>([]);
  const [loadingParent, setLoadingParent] = useState(false);
  const { message, notification } = App.useApp();

  // Lấy danh sách parent categories từ API
  useEffect(() => {
    if (openModelCreate) {
      fetchParentCategories();
    }
  }, [openModelCreate]);

  const fetchParentCategories = async () => {
    setLoadingParent(true);
    try {
      const res = await getParentCategoriesAPI();
      if (res.data && res.data.data) {
        setParentList(res.data.data);
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi tải danh sách parent",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoadingParent(false);
    }
  };

  const onFinish: FormProps<ICreateCategoryDTO>["onFinish"] = async (
    values
  ) => {
    const payload: any = {
      name: values.name,
      slug: values.slug,
    };

    // Chỉ gửi parentCategoryId nếu có giá trị
    if (values.parentCategoryId) {
      payload.parentCategoryId = values.parentCategoryId;
    }

    console.log("Payload gửi đi:", payload); // ✅ Debug

    setIsSubmit(true);
    try {
      const res = await createCategoryAPI(payload);
      if (res.status === 201 || res.status === 200) {
        message.success("Tạo mới category thành công");
        handleClose();
        refreshTable();
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

  const handleClose = () => {
    form.resetFields();
    setOpenModalCreate(false);
  };

  // Tạo danh sách parent options
  const parentOptions = parentList.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <Modal
      title="Thêm mới category"
      open={openModelCreate}
      onOk={() => form.submit()}
      onCancel={handleClose}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      maskClosable={false}
      destroyOnClose
    >
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Tên category"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên category" },
            {
              whitespace: true,
              message: "Tên không được chỉ chứa khoảng trắng",
            },
          ]}
        >
          <Input placeholder="Nhập tên category" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: "Vui lòng nhập slug" },
            {
              whitespace: true,
              message: "Slug không được chỉ chứa khoảng trắng",
            },
          ]}
        >
          <Input placeholder="Nhập slug" />
        </Form.Item>

        <Form.Item label="Parent Category" name="parentCategoryId">
          <Select
            allowClear
            placeholder="Chọn parent category (tùy chọn)"
            options={parentOptions}
            loading={loadingParent}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            notFoundContent={
              loadingParent ? "Đang tải..." : "Không tìm thấy category"
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCategory;
