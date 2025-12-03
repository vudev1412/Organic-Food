// src/components/admin/certificate/create.certificate.tsx
import { App, Button, Divider, Form, Input, Modal, Upload, message } from "antd";

import { useState } from "react";
import { createCertificateAPI, uploadFileCertsAPI } from "../../../service/api";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/lib";
import type { RcFile } from "antd/es/upload";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateCertificate = ({ open, setOpen, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { message: msg, notification } = App.useApp();

  const uploadFileToServer = async (file: RcFile) => {
    const res = await uploadFileCertsAPI(file, "images/certs");
    return res.data; // backend chỉ nhận string tên file hoặc URL
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      let image = "";
      if (fileList[0]?.originFileObj) {
        image = await uploadFileToServer(fileList[0].originFileObj as RcFile);
      }
      const payload = { ...values, image };
      const res = await createCertificateAPI(payload);
      if (res?.data) {
        msg.success("Tạo mới certificate thành công");
        form.resetFields();
        setFileList([]);
        setOpen(false);
        refreshTable();
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Tạo thất bại",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thêm Certificate"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setFileList([]);
      }}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Upload ảnh" required>
          <Upload
            fileList={fileList}
            listType="picture"
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
            maxCount={1}
            accept="image/*,.pdf"
          >
            {fileList.length === 0 && (
              <Button icon={<UploadOutlined />}>Upload</Button>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCertificate;
