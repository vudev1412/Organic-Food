import { UserOutlined } from "@ant-design/icons";
import { Avatar, Descriptions, Drawer } from "antd";
import dayjs from "dayjs"; // <-- import dayjs

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

  const formatUserId = (entity: ICustomerTable) => {
    if (!entity?.id) return "Không có ID";

    const id = entity.id;
    if (id < 10) return `NV00${id}`;
    if (id < 100) return `NV0${id}`;
    if (id < 1000) return `NV${id}`;
    return `NV${id}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  return (
    <Drawer
      title="Chức năng xem chi tiết"
      width="50vw"
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin user" bordered column={2}>
        <Descriptions.Item label="Mã" span={2}>
          {formatUserId(dataViewDetail)}
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
          {formatDate(dataViewDetail?.hireDate)}
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
