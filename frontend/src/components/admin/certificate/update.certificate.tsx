// src/components/admin/certificate/update.certificate.tsx
import { App, Divider, Form, Input, Modal, Upload, Button, message } from "antd";
import { useEffect, useState } from "react";
import { updateCertificateAPI, uploadFileCertsAPI } from "../../../service/api";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/lib";
import type { RcFile } from "antd/es/upload";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: ICertificate | null;
  setDataUpdate: (v: ICertificate | null) => void;
}

const UpdateCertificate = ({
  open,
  setOpen,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { message: msg, notification } = App.useApp();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue(dataUpdate);
      if (dataUpdate.image) {
        setFileList([
          {
            uid: "-1",
            name: dataUpdate.image,
            status: "done",
            url: dataUpdate.image,
          },
        ]);
      }
    }
  }, [dataUpdate]);

  const uploadFileToServer = async (file: RcFile) => {
    const res = await uploadFileCertsAPI(file, "images/certs");
    return res.data;
  };

  const onFinish = async (values: any) => {
    if (!dataUpdate) return;
    setIsSubmit(true);
    try {
      let image = dataUpdate.image || "";
      if (fileList[0]?.originFileObj) {
        image = await uploadFileToServer(fileList[0].originFileObj as RcFile);
      }
      const payload = { ...values, image };
      const res = await updateCertificateAPI(dataUpdate.id, payload);
      if (res?.data) {
        msg.success("Cập nhật thành công");
        form.resetFields();
        setFileList([]);
        setDataUpdate(null);
        setOpen(false);
        refreshTable();
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Cập nhật thất bại",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật Certificate"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        setDataUpdate(null);
        form.resetFields();
        setFileList([]);
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Upload ảnh">
          <Upload
            fileList={fileList}
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

export default UpdateCertificate;
