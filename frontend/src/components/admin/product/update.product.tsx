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

const { TextArea } = Input;
const { Title } = Typography;

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
  const [certOptions, setCertOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [certList, setCertList] = useState<CertificateForm[]>([]);

  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getCertificate();
        setCertOptions(res?.data?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy chứng chỉ:", error);
        setCertOptions([]);
      }
    };

    fetchCertificates();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesAPI();
        if (res?.data?.data?.result) {
          setCategories(res.data.data.result);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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

  // Load data khi mở modal update
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

    // Ảnh chính
    if (dataUpdate.image) {
      setMainImageList([
        {
          uid: "-1",
          name: "main.jpg",
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${
            dataUpdate.image
          }`,
        },
      ]);
    } else setMainImageList([]);

    // Ảnh phụ
    if (dataUpdate.images?.length) {
      setSubImageList(
        dataUpdate.images.map((img, i) => ({
          uid: `-${i + 1}`,
          name: `sub-${i}.jpg`,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${img.imgUrl}`,
        }))
      );
    } else setSubImageList([]);

    // =============================
    // FIXED: MAP CERTIFICATE CORRECTLY - Đảm bảo certificateId được parse đúng
    // =============================
    if (dataUpdate.certificates?.length) {
      setCertList(
        dataUpdate.certificates.map((c, i) => {
          // Lấy certificateId từ nhiều nguồn có thể
          let certId = c.certificateId || c.certificate?.id;

          // Đảm bảo convert sang number
          if (certId !== undefined && certId !== null) {
            certId = Number(certId);
          }

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
                    url: `${import.meta.env.VITE_BACKEND_CERS_IMAGE_URL}${
                      c.imageUrl
                    }`,
                  },
                ]
              : [],
          };
        })
      );
    } else {
      setCertList([
        { key: Date.now(), certificateId: undefined, fileList: [] },
      ]);
    }
  }, [dataUpdate, form]);

  const uploadFileToServer = async (file: File, folder: string) => {
    try {
      const uploadAPI =
        folder === "images/certs" ? uploadFileCertsAPI : uploadFileProductAPI;
      const res = await uploadAPI(file, folder);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const handleSubmit = async (values: any) => {
    if (!dataUpdate) return;

    if (mainImageList.length === 0) {
      message.error("Vui lòng chọn ảnh đại diện!");
      return;
    }

    setLoading(true);

    try {
      // Ảnh chính
      let mainImageUrl: string | null = null;

      if (mainImageList[0]?.originFileObj) {
        mainImageUrl = await uploadFileToServer(
          mainImageList[0].originFileObj,
          "images/products"
        );
      } else if (mainImageList[0]?.url) {
        mainImageUrl = mainImageList[0].url.split("/").pop();
      }

      // Ảnh phụ
      const productImagesUrls = await Promise.all(
        subImageList.map(async (f) => {
          if (f.originFileObj) {
            return await uploadFileToServer(f.originFileObj, "images/products");
          } else if (f.url) {
            return f.url.split("/").pop();
          }
          return null;
        })
      );

      // Chứng chỉ
      const certificatesPayload = await Promise.all(
        certList
          .filter((c) => c.certificateId)
          .map(async (c) => {
            let imageUrl: string | null = null;

            if (c.fileList[0]?.originFileObj) {
              imageUrl = await uploadFileToServer(
                c.fileList[0].originFileObj,
                "images/certs"
              );
            } else if (c.fileList[0]?.url) {
              imageUrl = c.fileList[0].url.split("/").pop();
            }

            return {
              certificateId: Number(c.certificateId),
              certNo: c.certNo || "",
              date: c.certDate?.toISOString() || null,
              imageUrl,
            };
          })
      );

      const payload = {
        name: values.name,
        price: Number(values.price),
        quantity: Number(values.quantity),
        unit: Number(values.unitId),
        categoryId: Number(values.categoryId),
        origin_address: values.origin_address || null,
        description: values.description || null,
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
      console.error("Lỗi cập nhật:", error);
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const addCert = () => {
    setCertList([
      ...certList,
      { key: Date.now(), certificateId: undefined, fileList: [] },
    ]);
  };

  const removeCert = (key: number) => {
    setCertList(certList.filter((c) => c.key !== key));
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
      }}
      footer={null}
      width={1100}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Divider orientation="left">Thông tin sản phẩm</Divider>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Giá bán (₫)"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    size="large"
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="quantity"
                  label="Số lượng tồn"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="unitId"
                  label="Đơn vị"
                  rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                >
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
                <Form.Item
                  name="categoryId"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
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

            <Form.Item name="description" label="Mô tả sản phẩm">
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
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Ảnh đại diện (bắt buộc)" required>
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  fileList={mainImageList}
                  onChange={({ fileList }) =>
                    setMainImageList(fileList.slice(-1))
                  }
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
                    onConfirm={() => removeCert(cert.key)}
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
                      updated[index] = {
                        ...updated[index],
                        certificateId: v,
                      };
                      setCertList(updated);
                    }}
                    style={{ width: "100%" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
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
                      updated[index] = {
                        ...updated[index],
                        certNo: e.target.value,
                      };
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
                      updated[index] = {
                        ...updated[index],
                        certDate: d,
                      };
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
                      updated[index] = {
                        ...updated[index],
                        fileList: fileList.slice(-1),
                      };
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
          <Button type="dashed" onClick={addCert} block icon={<PlusOutlined />}>
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

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            Cập nhật sản phẩm
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
