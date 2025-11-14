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
        <Descriptions.Item label="Name" span={2}>
          {dataViewDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Unit" span={2}>
          {dataViewDetail?.unit}
        </Descriptions.Item>
        <Descriptions.Item label="Price" span={2}>
          {dataViewDetail?.price}
        </Descriptions.Item>
        <Descriptions.Item label="Quantity" span={2}>
          {dataViewDetail?.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Image" span={2}>
          {dataViewDetail?.image ? (
            <Avatar src={dataViewDetail.image} />
          ) : (
            <Avatar icon={<AppstoreOutlined />} />
          )}
        </Descriptions.Item>
        {/* Nếu muốn hiển thị thêm các trường khác */}
        <Descriptions.Item label="Active" span={2}>
          {dataViewDetail?.active ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="MFG Date" span={2}>
          {dataViewDetail?.mfgDate ? new Date(dataViewDetail.mfgDate).toLocaleDateString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="EXP Date" span={2}>
          {dataViewDetail?.expDate ? new Date(dataViewDetail.expDate).toLocaleDateString() : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailProduct;
