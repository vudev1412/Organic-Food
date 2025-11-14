import { UserOutlined } from "@ant-design/icons";
import { Avatar, Descriptions, Drawer } from "antd";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: ICustomerTable | null;
  setDataViewDetail: (v: ICustomerTable | null) => void;
}

const DetailEmployee = (props: IProps) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title="Chức năng xem chi tiết"
      width="50vw"
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin user" bordered column={2}>
        <Descriptions.Item label="Id" span={2}>
          {dataViewDetail?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Name" span={2}>
          {dataViewDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {dataViewDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone" span={2}>
          {dataViewDetail?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Avatar" span={2}>
          <Avatar icon={<UserOutlined />} />
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailEmployee;
