import { Drawer, Descriptions, List } from "antd";

const DetailPromotion = ({ open, setOpen, data, setData }: any) => {
  return (
    <Drawer
      title="Chi tiết Promotion"
      width="50vw"
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên">{data?.name}</Descriptions.Item>
        <Descriptions.Item label="Loại">{data?.type}</Descriptions.Item>
        <Descriptions.Item label="Giá trị">{data?.value}</Descriptions.Item>
      </Descriptions>

      <h3>Sản phẩm áp dụng</h3>
      <List
        dataSource={data?.promotionDetails || []}
        renderItem={(item: any) => (
          <List.Item>
            {item.product.name} – {item.product.price}
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default DetailPromotion;
