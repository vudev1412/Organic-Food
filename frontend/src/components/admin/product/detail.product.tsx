import { Avatar, Descriptions, Drawer, Image } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IProductTable | null;
  setDataViewDetail: (v: IProductTable | null) => void;
}

const DetailProduct = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };
  console.log(
    import.meta.env.VITE_BACKEND_CERS_IMAGE_URL +
      dataViewDetail?.certificate.image
  );
  return (
    <Drawer
      title="Chi tiết sản phẩm"
      width="50vw"
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin sản phẩm" bordered column={2}>
        <Descriptions.Item label="ID" span={2}>
          {dataViewDetail?.product.id}
        </Descriptions.Item>
        <Descriptions.Item label="Ảnh" span={2}>
          {dataViewDetail?.product?.image ? (
            <Avatar
              size={120}
              src={
                import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL +
                dataViewDetail.product.image
              }
              shape="square"
              style={{ border: "1px solid #ddd" }}
            />
          ) : (
            <Avatar size={120} icon={<AppstoreOutlined />} shape="square" />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tên" span={2}>
          {dataViewDetail?.product.name}
        </Descriptions.Item>
        <Descriptions.Item label="Đơn vị tính" span={2}>
          {dataViewDetail?.product.unit}
        </Descriptions.Item>
        <Descriptions.Item label="Giá" span={2}>
          {dataViewDetail?.product.price}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng" span={2}>
          {dataViewDetail?.product.quantity}
        </Descriptions.Item>
        {/* Nếu muốn hiển thị thêm các trường khác */}
        <Descriptions.Item label="Trạng thái" span={2}>
          {dataViewDetail?.product.active ? "Đang bán" : "Tạm ngưng"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sản xuất" span={2}>
          {dataViewDetail?.product.mfgDate
            ? new Date(dataViewDetail.product.mfgDate).toLocaleDateString()
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Hạn sử dụng" span={2}>
          {dataViewDetail?.product.expDate
            ? new Date(dataViewDetail.product.expDate).toLocaleDateString()
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Chứng chỉ" span={2}>
          {dataViewDetail?.certificate.image ? (
            <Avatar
              size={120}
              src={
                import.meta.env.VITE_BACKEND_CERS_IMAGE_URL +
                dataViewDetail.certificate.image
              }
              shape="square"
              style={{ border: "1px solid #ddd" }}
            />
          ) : (
            <Avatar size={120} icon={<AppstoreOutlined />} shape="square" />
          )}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailProduct;
