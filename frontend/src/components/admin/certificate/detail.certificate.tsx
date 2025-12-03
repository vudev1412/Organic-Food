// src/components/admin/certificate/detail.certificate.tsx
import { Drawer, Descriptions } from "antd";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: ICertificate | null;
  setData: (v: ICertificate | null) => void;
}
const formatCerId = (id: number) => {
  return `CC${id.toString().padStart(6, "0")}`;
};

const DetailCertificate = ({ open, setOpen, data, setData }: IProps) => {
  return (
    <Drawer
      title="Chi tiết Certificate"
      width="50vw"
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã">
          {" "}
          {data?.id ? formatCerId(data.id) : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tên">{data?.name}</Descriptions.Item>
        <Descriptions.Item label="Image">
          {data?.image ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_CERS_IMAGE_URL}${
                data.image
              }`}
              alt={data.name}
              style={{ width: 150 }}
            />
          ) : (
            "-"
          )}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailCertificate;
