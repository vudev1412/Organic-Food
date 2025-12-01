import {
  Drawer,
  Descriptions,
  Table,
  Tag,
  Typography,
  Space,
  Divider,
  Button,
} from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const formatReceiptId = (id: number) => `PN${id.toString().padStart(6, "0")}`;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: ResReceiptDTO | null;
  setData: (v: ResReceiptDTO | null) => void;
}

const DetailReceipt = ({ open, setOpen, data, setData }: IProps) => {
  if (!data) return null;

  const totalAmount = data.totalAmount?.toLocaleString("vi-VN") || "0";

  const columns = [
    {
      title: <Text strong>Sản phẩm</Text>,
      dataIndex: ["product", "name"],
      key: "product",
      width: 300,
      ellipsis: true,
      render: (name: string) => (
        <Text strong style={{ fontSize: 14 }}>
          {name}
        </Text>
      ),
    },
    {
      title: <Text strong>Số lượng</Text>,
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center" as const,
      render: (qty: number) => (
        <Tag color="blue" className="font-medium">
          {qty}
        </Tag>
      ),
    },
    {
      title: <Text strong>Giá nhập</Text>,
      dataIndex: "importPrice",
      key: "importPrice",
      width: 130,
      align: "right" as const,
      render: (price: number) => (
        <Text strong type="danger">
          {price.toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: <Text strong>Thành tiền</Text>,
      key: "total",
      width: 150,
      align: "right" as const,
      render: (_: any, record: any) => {
        const total = record.quantity * record.importPrice;
        return (
          <Text strong type="danger" style={{ fontSize: 15 }}>
            {total.toLocaleString("vi-VN")} ₫
          </Text>
        );
      },
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <Tag color="blue" size="large" className="text-lg font-bold">
            {formatReceiptId(data.id)}
          </Tag>
          <span className="text-xl font-bold text-gray-800">
            Chi tiết phiếu nhập hàng
          </span>
        </div>
      }
      placement="right"
      width={820}
      open={open}
      onClose={() => {
        setOpen(false);
        setData(null);
      }}
      closeIcon={null}
      extra={
        <Button type="text" danger size="large" onClick={() => setOpen(false)}>
          Đóng
        </Button>
      }
      styles={{ body: { padding: 0 } }}
    >
      <div className="p-6">
        {/* Thông tin phiếu nhập */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
          <Title level={4} className="text-indigo-700 mb-5 !font-semibold">
            Thông tin phiếu nhập
          </Title>

          <Descriptions
            bordered
            column={2}
            size="middle"
            className="bg-white rounded-lg"
            labelStyle={{
              width: 180,
              minWidth: 180,
              fontWeight: 600,
              backgroundColor: "#f8fafc",
              whiteSpace: "nowrap",
              verticalAlign: "top",
            }}
            contentStyle={{
              fontWeight: 500,
              wordBreak: "break-word",
              verticalAlign: "top",
            }}
          >
            <Descriptions.Item label="Mã phiếu nhập" span={2}>
              <Tag color="blue" size="large" className="text-lg font-bold">
                {formatReceiptId(data.id)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Người nhận hàng">
              <Text strong>{data.deliverName || "—"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Nhà cung cấp">
              <Text strong>{data.supplier?.name || "—"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày giao hàng">
              {data.shipDate ? (
                <Space direction="vertical" size={0}>
                  <Text strong>
                    {dayjs(data.shipDate).format("DD/MM/YYYY")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(data.shipDate).format("HH:mm")}
                  </Text>
                </Space>
              ) : (
                "—"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Người tạo phiếu">
              <Text>{data.user?.name || "Hệ thống"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Tổng tiền" span={2}>
              <Text type="danger" className="text-3xl font-bold">
                {totalAmount} ₫
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider className="my-8" />

        {/* Chi tiết sản phẩm */}
        <div>
          <Title level={4} className="text-gray-800 mb-5 !font-semibold">
            Chi tiết sản phẩm nhập
          </Title>

          <div className="border rounded-lg overflow-hidden shadow-sm">
            <Table
              dataSource={data.receiptDetails || []}
              columns={columns}
              rowKey={(record) => record.product.id}
              pagination={false}
              bordered={false}
              size="middle"
              scroll={{ x: 700 }}
              summary={(pageData) => {
                const totalQty = pageData.reduce(
                  (sum, r) => sum + r.quantity,
                  0
                );
                const totalAmountSum = pageData.reduce(
                  (sum, r) => sum + r.quantity * r.importPrice,
                  0
                );

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row className="bg-gradient-to-r from-indigo-50 to-blue-50 font-bold text-base">
                      <Table.Summary.Cell index={0} colSpan={1}>
                        <Text strong>Tổng cộng</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center">
                        <Tag color="purple" className="text-base font-bold">
                          {totalQty}
                        </Tag>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} align="right">
                        <Text strong type="danger" className="text-xl">
                          {totalAmountSum.toLocaleString("vi-VN")} ₫
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500">
          {" "}
          <Text type="secondary">
            {" "}
            Phiếu nhập được tạo vào{" "}
            {dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")}{" "}
          </Text>{" "}
        </div>
      </div>
    </Drawer>
  );
};

export default DetailReceipt;
