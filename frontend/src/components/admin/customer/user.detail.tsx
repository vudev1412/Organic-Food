// File path: /src/components/admin/customer/user.detail.tsx

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Descriptions, Drawer } from "antd";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: ICustomerTable | null;
  setDataViewDetail: (v: ICustomerTable | null) => void;
}
const DetailUser = (props: IProps) => {
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
  return (
    <>
      <Drawer
        title="Chức nắng xem chi tiết"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="Thông tin user" bordered column={2}>
          <Descriptions.Item label="Mã" span={2}>
            {dataViewDetail?.id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên" span={2}>
            {dataViewDetail?.user.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {dataViewDetail?.user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={2}>
            {dataViewDetail?.user.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Thành viên" span={2}>
            {dataViewDetail?.member === true ? "Đã đăng ký" : "Chưa đăng ký"}
          </Descriptions.Item>
          <Descriptions.Item label="Avatar" span={2}>
            <Avatar icon={<UserOutlined />} />
          </Descriptions.Item>
        </Descriptions>
        ;
      </Drawer>
    </>
  );
};

export default DetailUser;
