import { UserOutlined } from "@ant-design/icons";
import { Avatar, Descriptions, Drawer } from "antd";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IEmployee | null;
  setDataViewDetail: (v: IEmployee | null) => void;
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
        <Descriptions.Item label="Mã nhân viên" span={2}>
          {dataViewDetail?.employeeCode}
        </Descriptions.Item>
        <Descriptions.Item label="Tên" span={2}>
          {dataViewDetail?.user.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {dataViewDetail?.user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Điện thoại" span={2}>
          {dataViewDetail?.user.phone}
        </Descriptions.Item>
         <Descriptions.Item label="Địa chỉ" span={2}>
          {dataViewDetail?.address}
        </Descriptions.Item>
        
        <Descriptions.Item label="Ngày làm" span={2}>
          {dataViewDetail?.hireDate}
        </Descriptions.Item>
        <Descriptions.Item label="Lương" span={2}>
          {dataViewDetail?.salary}
        </Descriptions.Item>
        <Descriptions.Item label="Avatar" span={2}>
          <Avatar icon={<UserOutlined />} />
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailEmployee;
