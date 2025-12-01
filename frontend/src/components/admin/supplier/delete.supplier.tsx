// File path: /src/components/admin/supplier/delete.supplier.tsx

import { Drawer, Descriptions } from "antd";
interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;

  data: ISupplier | null;
  setData: (v: ISupplier | null) => void;
}
const DetailSupplier = ({ open, setOpen, data, setData }: IProps) => {
  const formatSupplierId = (id?: number | null) => {
    if (id == null) return "-";
    return `NCC${id.toString().padStart(6, "0")}`;
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
        <Descriptions.Item label="Mã">
          {formatSupplierId(data?.id)}
        </Descriptions.Item>
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
