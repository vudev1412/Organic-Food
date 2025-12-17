// src/components/admin/product/create.product.tsx

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
  AppstoreOutlined,
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
  getAllCategoriesAPI,
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
  certificateId?: number;
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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  // Upload states
  const [mainImageFileList, setMainImageFileList] = useState<UploadFile[]>([]);
  const [subImageFileList, setSubImageFileList] = useState<UploadFile[]>([]);

  // Chứng chỉ động
  const [certList, setCertList] = useState<CertificateForm[]>([
    {
      key: Date.now(),
      certificateId: undefined,
      certNo: "",
      certDate: undefined,
      fileList: [],
    },
  ]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certRes, unitRes, catRes] = await Promise.all([
          getCertificate(),
          getUnits(),
          getAllCategoriesAPI(),
        ]);
        if (certRes?.data?.data) setCertificates(certRes.data.data);
        if (unitRes?.data?.data) setUnits(unitRes.data.data);
        if (catRes?.data?.data?.result) setCategories(catRes.data.data.result);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const addCertificate = () => {
    setCertList([
      ...certList,
      {
        key: Date.now(),
        certificateId: undefined,
        certNo: "",
        certDate: undefined,
        fileList: [],
      },
    ]);
  };

  const removeCertificate = (key: number) => {
    setCertList(certList.filter((item) => item.key !== key));
  };

  const uploadFileToServer = async (file: RcFile, folder: string) => {
    const api = folder.includes("certs")
      ? uploadFileCertsAPI
      : uploadFileProductAPI;
    const res = await api(file, folder);
    return res.data;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Upload ảnh chính
      let mainImageUrl = null;
      if (mainImageFileList[0]?.originFileObj) {
        mainImageUrl = await uploadFileToServer(
          mainImageFileList[0].originFileObj as RcFile,
          "images/products"
        );
      }

      // Upload ảnh phụ
      const productImagesUrls = await Promise.all(
        subImageFileList
          .filter((f) => f.originFileObj)
          .map((f) => uploadFileToServer(f.originFileObj as RcFile, "images/products"))
      );

      // Upload chứng chỉ
      const certificatesPayload = await Promise.all(
        certList
          .filter((c) => c.certificateId && c.fileList.length > 0)
          .map(async (c) => {
            let imageUrl = null;
            if (c.fileList[0]?.originFileObj) {
              imageUrl = await uploadFileToServer(
                c.fileList[0].originFileObj as RcFile,
                "images/certs"
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

      // Xử lý mô tả chi tiết từ Form.List → JSON string
      const rawSections = values.descriptionSections || [];
      const validSections = rawSections
        .map((section: any) => ({
          heading: section.heading?.trim(),
          items: (section.items || [])
            .filter((item: any) => item.subtitle?.trim() && item.text?.trim())
            .map((item: any) => ({
              subtitle: item.subtitle.trim(),
              text: item.text.trim(),
            })),
        }))
        .filter((section: any) => section.heading && section.items.length > 0);

      const payload = {
        ...values,
        mfgDate: values.mfgDate?.toISOString(),
        expDate: values.expDate?.toISOString(),
        image: mainImageUrl,
        productImages: productImagesUrls,
        certificates: certificatesPayload,
        description:
          validSections.length > 0 ? JSON.stringify(validSections) : null,
      };

      const res = await createProductAPI(payload);
      if (res?.data) {
        message.success("Tạo sản phẩm thành công!");
        form.resetFields();
        setMainImageFileList([]);
        setSubImageFileList([]);
        setCertList([
          { key: Date.now(), certificateId: undefined, fileList: [] },
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
          <SafetyCertificateOutlined
            style={{ color: "#1677ff", fontSize: 24 }}
          />
          <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>
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
          { key: Date.now(), certificateId: undefined, fileList: [] },
        ]);
      }}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ active: true }}
      >
        {/* THÔNG TIN SẢN PHẨM */}
        <Divider orientation="left">Thông tin sản phẩm</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true }]}
            >
              <Input size="large" placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Giá bán (₫)"
                  rules={[{ required: true }]}
                >
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
                <Form.Item
                  name="quantity"
                  label="Số lượng tồn"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="unitId"
                  label="Đơn vị"
                  rules={[{ required: true }]}
                >
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
                  label="Danh mục"
                  rules={[{ required: true }]}
                >
                  <Select size="large" placeholder="Chọn danh mục">
                    {categories.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="origin_address" label="Xuất xứ">
              <Input size="large" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="mfgDate" label="Ngày sản xuất">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="expDate" label="Hạn sử dụng">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="active" valuePropName="checked" label="Trạng thái">
              <Switch
                checkedChildren="Đang bán"
                unCheckedChildren="Tạm ngưng"
              />
            </Form.Item>
          </Col>

          {/* ẢNH */}
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

        {/* MÔ TẢ CHI TIẾT - MỚI THÊM */}
        <Divider orientation="left">
          <AppstoreOutlined style={{ color: "#722ed1" }} /> Mô tả chi tiết sản
          phẩm
        </Divider>

        <Form.List name="descriptionSections">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, idx) => (
                <Card
                  key={key}
                  style={{
                    marginBottom: 24,
                    borderRadius: 16,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  }}
                  title={
                    <Space align="center">
                      <span style={{ fontSize: 18, fontWeight: 600 }}>
                        Phần {idx + 1}
                      </span>
                      {fields.length > 1 && (
                        <Popconfirm
                          title="Xóa phần này?"
                          onConfirm={() => remove(name)}
                        >
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      )}
                    </Space>
                  }
                  extra={
                    <Button
                      type="link"
                      onClick={() =>
                        add({ subtitle: "", text: "" }, `${name}.items`)
                      }
                      style={{ color: "#1677ff" }}
                    >
                      + Thêm mục con
                    </Button>
                  }
                >
                  <Form.Item
                    {...{ name: [name, "heading"] }}
                    rules={[{ required: true, message: "Nhập tiêu đề phần" }]}
                  >
                    <Input
                      size="large"
                      placeholder="VD: Điểm nổi bật của sản phẩm"
                      style={{ fontWeight: 600 }}
                    />
                  </Form.Item>

                  <Form.List name={[name, "items"]}>
                    {(subFields, { add: addItem, remove: removeItem }) => (
                      <Space
                        direction="vertical"
                        size={16}
                        style={{ width: "100%", marginTop: 16 }}
                      >
                        {subFields.map((subField, subIdx) => (
                          <Card
                            key={subField.key}
                            size="small"
                            style={{ background: "#f8faff", borderRadius: 12 }}
                            extra={
                              subFields.length > 1 && (
                                <Button
                                  danger
                                  type="text"
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeItem(subIdx)}
                                />
                              )
                            }
                          >
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item
                                  {...subField}
                                  name={[subField.name, "subtitle"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập tiêu đề nhỏ",
                                    },
                                  ]}
                                >
                                  <Input placeholder="VD: Nguồn gốc Organic" />
                                </Form.Item>
                              </Col>
                              <Col span={16}>
                                <Form.Item
                                  {...subField}
                                  name={[subField.name, "text"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập nội dung",
                                    },
                                  ]}
                                >
                                  <TextArea
                                    rows={3}
                                    placeholder="Mô tả chi tiết..."
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addItem()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm mục con
                        </Button>
                      </Space>
                    )}
                  </Form.List>
                </Card>
              ))}

              <Button
                type="primary"
                ghost
                onClick={() =>
                  add({ heading: "", items: [{ subtitle: "", text: "" }] })
                }
                block
                icon={<PlusOutlined />}
                style={{ height: 48 }}
              >
                Thêm phần mô tả mới
              </Button>
            </>
          )}
        </Form.List>

        {/* CHỨNG CHỈ */}
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

        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => setOpenModalCreate(false)}
            style={{ marginRight: 12 }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            Tạo sản phẩm
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateProductCertificate;
