import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  Card,
  message,
  Popconfirm,
} from "antd";

import {
  PlusOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";

import {
  createProductAPI,
  getCertificate,
  getUnits,
  uploadFileProductAPI,
  uploadFileCertsAPI,
} from "../../../service/api";

import type { UploadFile } from "antd/lib";
import type { RcFile } from "antd/es/upload";

const { Title } = Typography;
const { TextArea } = Input;

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

interface CertificateForm {
  key: number;
  certificateId: number;
  certNo?: string;
  certDate?: dayjs.Dayjs;
  fileList: UploadFile[];
}

const CreateProductCertificate = ({
  openModalCreate,
  setOpenModalCreate,
  refreshTable,
}: IProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [certificates, setCertificates] = useState<
    { id: number; name: string }[]
  >([]);

  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);

  // Upload states
  const [mainImageFileList, setMainImageFileList] = useState<UploadFile[]>([]);
  const [subImageFileList, setSubImageFileList] = useState<UploadFile[]>([]);

  // Dynamic certificate list
  const [certList, setCertList] = useState<CertificateForm[]>([
    {
      key: Date.now(),
      certificateId: undefined as any,
      certNo: "",
      certDate: undefined,
      fileList: [],
    },
  ]);

  // Load certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getCertificate();
        if (res?.data?.data) setCertificates(res.data.data);
      } catch (error) {
        console.error("Lỗi tải danh sách chứng chỉ:", error);
      }
    };
    fetchCertificates();
  }, []);

  // Load units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnits();
        if (res?.data?.data) setUnits(res.data.data);
      } catch (error) {
        console.error("Lỗi tải đơn vị:", error);
      }
    };
    fetchUnits();
  }, []);

  const addCertificate = () => {
    setCertList([
      ...certList,
      {
        key: Date.now(),
        certificateId: undefined as any,
        certNo: "",
        certDate: undefined,
        fileList: [],
      },
    ]);
  };

  const removeCertificate = (key: number) => {
    setCertList(certList.filter((item) => item.key !== key));
  };

  // Upload file lên server
  const uploadFileToServer = async (file: RcFile, folder: string) => {
    try {
      const uploadAPI = folder.includes("certs")
        ? uploadFileCertsAPI
        : uploadFileProductAPI;

      const response = await uploadAPI(file, folder);
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Upload main image
      let mainImageUrl = null;
      if (mainImageFileList[0]?.originFileObj) {
        mainImageUrl = await uploadFileToServer(
          mainImageFileList[0].originFileObj as RcFile,
          "products"
        );
      }

      // Upload sub images
      const productImagesUrls = await Promise.all(
        subImageFileList.map(async (file) => {
          if (file.originFileObj) {
            const url = await uploadFileToServer(
              file.originFileObj as RcFile,
              "products"
            );
            return url;
          }
          return null;
        })
      );

      // Certificates
      const certificatesPayload = await Promise.all(
        certList
          .filter((c) => c.certificateId && c.fileList.length > 0)
          .map(async (c) => {
            let imageUrl = null;
            if (c.fileList[0]?.originFileObj) {
              imageUrl = await uploadFileToServer(
                c.fileList[0].originFileObj as RcFile,
                "certs"
              );
            }
            return {
              certificateId: c.certificateId,
              certNo: c.certNo,
              date: c.certDate?.toISOString(),
              imageUrl,
            };
          })
      );

      // Final payload
      const payload = {
        ...values,
        mfgDate: values.mfgDate?.toISOString(),
        expDate: values.expDate?.toISOString(),
        image: mainImageUrl,
        productImages: productImagesUrls.filter(Boolean),
        certificates: certificatesPayload,
      };

      const res = await createProductAPI(payload);

      if (res?.data) {
        message.success("Tạo sản phẩm thành công!");
        form.resetFields();
        setMainImageFileList([]);
        setSubImageFileList([]);
        setCertList([
          {
            key: Date.now(),
            certificateId: undefined as any,
            fileList: [],
          },
        ]);
        setOpenModalCreate(false);
        refreshTable();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Tạo sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: "#1890ff", fontSize: 22 }} />
          <Title level={4} style={{ margin: 0 }}>
            Tạo sản phẩm mới
          </Title>
        </Space>
      }
      open={openModalCreate}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
        setMainImageFileList([]);
        setSubImageFileList([]);
        setCertList([
          {
            key: Date.now(),
            certificateId: undefined as any,
            fileList: [],
          },
        ]);
      }}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ active: true }}
      >
        <Divider orientation="left">Thông tin sản phẩm</Divider>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
              <Input size="large" placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="price" label="Giá bán (₫)" rules={[{ required: true }]}>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(v) => v!.replace(/\$\s?|(,*)/g, "") as any}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="quantity" label="Số lượng tồn" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="unitId" label="Đơn vị" rules={[{ required: true }]}>
                  <Select size="large" placeholder="Chọn đơn vị">
                    {units.map((unit) => (
                      <Select.Option key={unit.id} value={unit.id}>
                        {unit.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="categoryId"
                  label="Danh mục ID"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="origin_address" label="Xuất xứ">
              <Input size="large" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="mfgDate" label="Ngày sản xuất">
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="expDate" label="Hạn sử dụng">
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="active" valuePropName="checked" label="Trạng thái">
              <Switch checkedChildren="Đang bán" unCheckedChildren="Tạm ngưng" />
            </Form.Item>
          </Col>

          {/* IMAGE UPLOAD */}
          <Col span={12}>
            <Form.Item label="Ảnh đại diện (bắt buộc)" required>
              <ImgCrop rotationSlider quality={0.8}>
                <Upload
                  listType="picture-card"
                  fileList={mainImageFileList}
                  onChange={({ fileList }) =>
                    setMainImageFileList(fileList.slice(-1))
                  }
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {mainImageFileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item label="Ảnh phụ (tối đa 8)">
              <Upload
                listType="picture-card"
                fileList={subImageFileList}
                onChange={({ fileList }) => setSubImageFileList(fileList)}
                beforeUpload={() => false}
                multiple
                maxCount={8}
              >
                {subImageFileList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* CERTIFICATES */}
        <Divider orientation="left">
          <SafetyCertificateOutlined /> Chứng nhận sản phẩm
        </Divider>

        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {certList.map((cert, index) => (
            <Card
              key={cert.key}
              size="small"
              title={
                <span>
                  <SafetyCertificateOutlined /> Chứng chỉ {index + 1}
                </span>
              }
              extra={
                certList.length > 1 && (
                  <Popconfirm
                    title="Xóa chứng chỉ này?"
                    onConfirm={() => removeCertificate(cert.key)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                )
              }
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Select
                    allowClear
                    size="large"
                    placeholder="Chọn loại chứng chỉ"
                    value={cert.certificateId ?? undefined}
                    onChange={(value) => {
                      const updated = [...certList];
                      updated[index].certificateId = value ?? undefined;
                      setCertList(updated);
                    }}
                    style={{ width: "100%" }}
                  >
                    {certificates.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col span={6}>
                  <Input
                    size="large"
                    placeholder="Số chứng chỉ"
                    value={cert.certNo}
                    onChange={(e) => {
                      const updated = [...certList];
                      updated[index].certNo = e.target.value;
                      setCertList(updated);
                    }}
                  />
                </Col>

                <Col span={5}>
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Ngày cấp"
                    value={cert.certDate}
                    onChange={(date) => {
                      const updated = [...certList];
                      updated[index].certDate = date;
                      setCertList(updated);
                    }}
                  />
                </Col>

                <Col span={5}>
                  <Upload
                    listType="picture-card"
                    fileList={cert.fileList}
                    onChange={({ fileList }) => {
                      const updated = [...certList];
                      updated[index].fileList = fileList.slice(-1);
                      setCertList(updated);
                    }}
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*,.pdf"
                  >
                    {cert.fileList.length === 0 && (
                      <div style={{ fontSize: 12 }}>
                        <UploadOutlined />
                        <div style={{ marginTop: 4 }}>Ảnh/PDF</div>
                      </div>
                    )}
                  </Upload>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Button
            type="dashed"
            onClick={addCertificate}
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
          >
            Thêm chứng chỉ khác
          </Button>
        </div>

        <Divider />

        {/* SUBMIT */}
        <div style={{ textAlign: "right" }}>
          <Button onClick={() => setOpenModalCreate(false)} style={{ marginRight: 12 }}>
            Hủy
          </Button>

          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Tạo sản phẩm
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateProductCertificate;
