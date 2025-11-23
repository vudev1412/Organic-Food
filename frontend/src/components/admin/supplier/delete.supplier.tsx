import { Drawer, Descriptions } from "antd";
interface IProps {
   open: boolean;
  setOpen: (v: boolean) => void;
  
  data: ISupplier | null;
  setData: (v: ISupplier | null) => void;
}
const DetailSupplier = ({ open, setOpen, data, setData }:IProps) => {
  const formatSupplierId = (entity: ISupplier) => {
    if (!entity?.id) return "Không có ID";

    const id = entity.id;

    if (id < 10) return `NCC00${id}`;
    if (id < 100) return `NCC0${id}`;
    if (id < 1000) return `NCC${id}`;

    return `NCC${id}`;
  };
  return (
    <Drawer
      title="Chi tiết Supplier"
      width="50vw"
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã">{formatSupplierId(data)}</Descriptions.Item>
        <Descriptions.Item label="Tên">{data?.name}</Descriptions.Item>
        {/* <Descriptions.Item label="Mã">{data?.code}</Descriptions.Item> */}
        <Descriptions.Item label="Mã số thuế">{data?.taxNo}</Descriptions.Item>
        <Descriptions.Item label="Điện thoại">{data?.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          {data?.address}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailSupplier;
