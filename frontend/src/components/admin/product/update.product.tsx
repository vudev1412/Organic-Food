import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  DatePicker,
  Select,
  Upload,
  Button,
  Space,
  Card,
  message,
  Popconfirm,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import {
  updateProductAPI,
  uploadFileProductAPI,
  uploadFileCertsAPI,
  getCertificate,
  getUnits,
  getAllCategoriesAPI,
} from "../../../service/api";
import { parseProductDescription } from "../../../utils/productHelper";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface IProps {
  openModelUpdate: boolean;
  setOpenModelUpdate: (v: boolean) => void;
  dataUpdate: IProduct | null;
  setDataUpdate: (v: IProduct | null) => void;
  refreshTable: () => void;
}

interface CertificateForm {
  key: number;
  certificateId?: number;
  certNo?: string;
  certDate?: dayjs.Dayjs | null;
  fileList: any[];
}

interface DescriptionItem {
  subtitle: string;
  text: string;
}

interface DescriptionSection {
  heading: string;
  items: DescriptionItem[];
  key: number;
}

const UpdateProduct: React.FC<IProps> = ({
  openModelUpdate,
  setOpenModelUpdate,
  dataUpdate,
  setDataUpdate,
  refreshTable,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [mainImageList, setMainImageList] = useState<any[]>([]);
  const [subImageList, setSubImageList] = useState<any[]>([]);
  const [certOptions, setCertOptions] = useState<{ id: number; name: string }[]>(
    []
  );
  const [certList, setCertList] = useState<CertificateForm[]>([]);
  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [descriptionSections, setDescriptionSections] = useState<
    DescriptionSection[]
  >([]);

  // Fetch data: certificates, categories, units
  useEffect(() => {
    getCertificate()
      .then((res) => setCertOptions(res?.data?.data || []))
      .catch(() => setCertOptions([]));
    getAllCategoriesAPI()
      .then((res) => setCategories(res?.data?.data?.result || []))
      .catch(() => setCategories([]));
    getUnits()
      .then((res) => setUnits(res?.data?.data || []))
      .catch(() => setUnits([]));
  }, []);

  // Load data when opening modal
  useEffect(() => {
    if (!dataUpdate) return;

    form.setFieldsValue({
      name: dataUpdate.name,
      price: dataUpdate.price,
      quantity: dataUpdate.quantity,
      unitId: dataUpdate.unit,
      categoryId: dataUpdate.categoryId,
      origin_address: dataUpdate.origin_address,
      description: dataUpdate.description,
      active: dataUpdate.active,
      mfgDate: dataUpdate.mfgDate ? dayjs(dataUpdate.mfgDate) : null,
      expDate: dataUpdate.expDate ? dayjs(dataUpdate.expDate) : null,
    });

    // Main image
    setMainImageList(
      dataUpdate.image
        ? [
            {
              uid: "-1",
              name: "main.jpg",
              status: "done",
              url: `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${dataUpdate.image}`,
            },
          ]
        : []
    );

    // Sub images
    setSubImageList(
      dataUpdate.images?.length
        ? dataUpdate.images.map((img, i) => ({
            uid: `-${i + 1}`,
            name: `sub-${i}.jpg`,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${img.imgUrl}`,
          }))
        : []
    );

    // Certificates
    setCertList(
      dataUpdate.certificates?.length
        ? dataUpdate.certificates.map((c, i) => {
            let certId = c.certificateId || c.certificate?.id;
            if (certId !== undefined && certId !== null) certId = Number(certId);
            return {
              key: Date.now() + i,
              certificateId: certId,
              certNo: c.certNo || "",
              certDate: c.date ? dayjs(c.date) : null,
              fileList: c.imageUrl
                ? [
                    {
                      uid: `cert-${i}`,
                      name: "cert.jpg",
                      status: "done",
                      url: `${import.meta.env.VITE_BACKEND_CERS_IMAGE_URL}${c.imageUrl}`,
                    },
                  ]
                : [],
            };
          })
        : [{ key: Date.now(), certificateId: undefined, fileList: [] }]
    );

    // Description sections
    const parsedDesc = parseProductDescription(dataUpdate.description);
    if (parsedDesc.type === "json" && parsedDesc.content.length > 0) {
      setDescriptionSections(
        parsedDesc.content.map((s, i) => ({ ...s, key: Date.now() + i }))
      );
    } else {
      setDescriptionSections([{ heading: "", items: [{ subtitle: "", text: "" }], key: Date.now() }]);
    }
  }, [dataUpdate, form]);

  const uploadFileToServer = async (file: RcFile, folder: string) => {
      const api = folder.includes("images/certs")
        ? uploadFileCertsAPI
        : uploadFileProductAPI;
      const res = await api(file, folder);
      return res.data;
    };

  const handleSubmit = async (values: any) => {
    if (!dataUpdate) return;
    if (mainImageList.length === 0) {
      message.error("Vui lòng chọn ảnh đại diện!");
      return;
    }
    setLoading(true);
    try {
      // Main image
      let mainImageUrl: string | null = null;
      if (mainImageList[0]?.originFileObj) {
        mainImageUrl = await uploadFileToServer(
          mainImageList[0].originFileObj,
          "images/products"
        );
      } else if (mainImageList[0]?.url) {
        mainImageUrl = mainImageList[0].url.split("/").pop();
      }

      // Sub images
      const productImagesUrls = await Promise.all(
        subImageList.map(async (f) => {
          if (f.originFileObj) return await uploadFileToServer(f.originFileObj, "images/products");
          if (f.url) return f.url.split("/").pop();
          return null;
        })
      );

      // Certificates
      const certificatesPayload = await Promise.all(
        certList
          .filter((c) => c.certificateId)
          .map(async (c) => {
            let imageUrl: string | null = null;
            if (c.fileList[0]?.originFileObj)
              imageUrl = await uploadFileToServer(c.fileList[0].originFileObj, "images/certs");
            else if (c.fileList[0]?.url) imageUrl = c.fileList[0].url.split("/").pop();
            return {
              certificateId: Number(c.certificateId),
              certNo: c.certNo || "",
              date: c.certDate?.toISOString() || null,
              imageUrl,
            };
          })
      );

      // Merge description
      const descriptionJSON = JSON.stringify(
        descriptionSections.map((s) => ({
          heading: s.heading,
          items: s.items.map((i) => ({ subtitle: i.subtitle, text: i.text })),
        }))
      );

      const payload = {
        name: values.name,
        price: Number(values.price),
        quantity: Number(values.quantity),
        unit: Number(values.unitId),
        categoryId: Number(values.categoryId),
        origin_address: values.origin_address || null,
        description: descriptionJSON,
        active: values.active ?? true,
        mfgDate: values.mfgDate?.toISOString() || null,
        expDate: values.expDate?.toISOString() || null,
        image: mainImageUrl,
        productImages: productImagesUrls.filter((img) => img !== null),
        certificates: certificatesPayload,
      };

      await updateProductAPI(dataUpdate.id, payload);
      message.success("Cập nhật sản phẩm thành công!");
      setOpenModelUpdate(false);
      setDataUpdate(null);
      refreshTable();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const addDescriptionSection = () => {
    setDescriptionSections([
      ...descriptionSections,
      { heading: "", items: [{ subtitle: "", text: "" }], key: Date.now() },
    ]);
  };

  const removeDescriptionSection = (key: number) => {
    setDescriptionSections(descriptionSections.filter((s) => s.key !== key));
  };

  const addItemToSection = (sectionIndex: number) => {
    const updated = [...descriptionSections];
    updated[sectionIndex].items.push({ subtitle: "", text: "" });
    setDescriptionSections(updated);
  };

  const removeItemFromSection = (sectionIndex: number, itemIndex: number) => {
    const updated = [...descriptionSections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setDescriptionSections(updated);
  };

  return (
    <Modal
      title={
        <Title level={4}>
          <SafetyCertificateOutlined /> Chỉnh sửa sản phẩm
        </Title>
      }
      open={openModelUpdate}
      onCancel={() => {
        setOpenModelUpdate(false);
        setDataUpdate(null);
        form.resetFields();
        setMainImageList([]);
        setSubImageList([]);
        setCertList([]);
        setDescriptionSections([]);
      }}
      footer={null}
      width={1100}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Basic product info */}
        <Divider orientation="left">Thông tin sản phẩm</Divider>
        <Row gutter={24}>
          <Col span={12}>
            {/* Name, price, quantity, unit, category, origin, mfg/exp date, active, description */}
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="price" label="Giá bán (₫)" rules={[{ required: true }]}>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    size="large"
                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="quantity" label="Số lượng tồn" rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} min={0} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="unitId" label="Đơn vị" rules={[{ required: true }]}>
                  <Select size="large">
                    {units.map((u) => (
                      <Select.Option key={u.id} value={u.id}>
                        {u.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
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
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Images */}
            <Form.Item label="Ảnh đại diện (bắt buộc)" required>
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  fileList={mainImageList}
                  onChange={({ fileList }) => setMainImageList(fileList.slice(-1))}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {mainImageList.length === 0 && (
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
                fileList={subImageList}
                onChange={({ fileList }) => setSubImageList(fileList)}
                beforeUpload={() => false}
                multiple
                maxCount={8}
              >
                {subImageList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Description Sections */}
        <Divider orientation="left">Mô tả sản phẩm</Divider>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {descriptionSections.map((section, sIdx) => (
            <Card
              key={section.key}
              size="small"
              title={
                <Input
                  placeholder="Tiêu đề section"
                  value={section.heading}
                  onChange={(e) => {
                    const updated = [...descriptionSections];
                    updated[sIdx].heading = e.target.value;
                    setDescriptionSections(updated);
                  }}
                />
              }
              extra={
                descriptionSections.length > 1 && (
                  <Popconfirm
                    title="Xóa section này?"
                    onConfirm={() => removeDescriptionSection(section.key)}
                  >
                    <Button danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                )
              }
            >
              {section.items.map((item, iIdx) => (
                <Card
                  key={iIdx}
                  type="inner"
                  style={{ marginBottom: 8 }}
                  title={
                    <Input
                      placeholder="Subtitle"
                      value={item.subtitle}
                      onChange={(e) => {
                        const updated = [...descriptionSections];
                        updated[sIdx].items[iIdx].subtitle = e.target.value;
                        setDescriptionSections(updated);
                      }}
                    />
                  }
                  extra={
                    section.items.length > 1 && (
                      <Popconfirm
                        title="Xóa item này?"
                        onConfirm={() => removeItemFromSection(sIdx, iIdx)}
                      >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    )
                  }
                >
                  <TextArea
                    placeholder="Text"
                    value={item.text}
                    onChange={(e) => {
                      const updated = [...descriptionSections];
                      updated[sIdx].items[iIdx].text = e.target.value;
                      setDescriptionSections(updated);
                    }}
                    rows={2}
                  />
                </Card>
              ))}
              <Button
                type="dashed"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => addItemToSection(sIdx)}
                block
              >
                Thêm item
              </Button>
            </Card>
          ))}
        </Space>
        <Button
          type="dashed"
          onClick={addDescriptionSection}
          block
          icon={<PlusOutlined />}
          style={{ marginTop: 8 }}
        >
          Thêm section
        </Button>

        {/* Certificates */}
        <Divider orientation="left">
          <SafetyCertificateOutlined /> Chứng nhận sản phẩm
        </Divider>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {certList.map((cert, index) => (
            <Card
              key={cert.key}
              size="small"
              title={`Chứng chỉ ${index + 1}`}
              extra={
                certList.length > 1 && (
                  <Popconfirm
                    title="Xóa chứng chỉ này?"
                    onConfirm={() => setCertList(certList.filter((c) => c.key !== cert.key))}
                  >
                    <Button danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                )
              }
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Select
                    placeholder="Chọn loại chứng chỉ"
                    value={cert.certificateId}
                    onChange={(v) => {
                      const updated = [...certList];
                      updated[index].certificateId = v;
                      setCertList(updated);
                    }}
                    style={{ width: "100%" }}
                  >
                    {certOptions.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Input
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
                    style={{ width: "100%" }}
                    placeholder="Ngày cấp"
                    format="DD/MM/YYYY"
                    value={cert.certDate}
                    onChange={(d) => {
                      const updated = [...certList];
                      updated[index].certDate = d;
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
          <Button type="dashed" onClick={() => setCertList([...certList, { key: Date.now(), certificateId: undefined, fileList: [] }])} block icon={<PlusOutlined />}>
            Thêm chứng chỉ
          </Button>
        </div>

        <Divider />
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => {
              setOpenModelUpdate(false);
              setDataUpdate(null);
            }}
            style={{ marginRight: 12 }}
          >
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Cập nhật sản phẩm
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
