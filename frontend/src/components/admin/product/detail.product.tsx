import { Avatar, Descriptions, Drawer } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IProduct | null;
  setDataViewDetail: (v: IProduct | null) => void;
}

const DetailProduct = (props: IProps) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title="Chi tiết sản phẩm"
      width="50vw"
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin sản phẩm" bordered column={2}>
        <Descriptions.Item label="ID" span={2}>
          {dataViewDetail?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Tên" span={2}>
          {dataViewDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Đơn vị tính" span={2}>
          {dataViewDetail?.unit}
        </Descriptions.Item>
        <Descriptions.Item label="Giá" span={2}>
          {dataViewDetail?.price}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng" span={2}>
          {dataViewDetail?.quantity}
        </Descriptions.Item>
        {/* Nếu muốn hiển thị thêm các trường khác */}
        <Descriptions.Item label="Trạng thái" span={2}>
          {dataViewDetail?.active ? "Đang bán" : "Tạm ngưng"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sản xuất" span={2}>
          {dataViewDetail?.mfgDate ? new Date(dataViewDetail.mfgDate).toLocaleDateString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Hạn sử dụng" span={2}>
          {dataViewDetail?.expDate ? new Date(dataViewDetail.expDate).toLocaleDateString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ảnh" span={2}>
          
          {dataViewDetail?.image ? (
            <Avatar src={import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL + dataViewDetail?.image} />
          ) : (
            <Avatar icon={<AppstoreOutlined />} />
          )}
        </Descriptions.Item>
        
      </Descriptions>
    </Drawer>
  );
};

export default DetailProduct;
