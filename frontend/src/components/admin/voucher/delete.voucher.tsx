// File: src/components/admin/voucher/voucher.detail.tsx

import { Descriptions, Modal, Tag } from "antd";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { getVoucherByIdAPI } from "../../../service/api";

interface IProps {
  open: boolean;
  voucherId: number | null;
  onClose: () => void;
}

const VoucherDetail = ({ open, voucherId, onClose }: IProps) => {
  const [data, setData] = useState<IResVoucherDTO | null>(null);

  useEffect(() => {
    if (open && voucherId) loadDetail();
  }, [open, voucherId]);

  const loadDetail = async () => {
    const res = await getVoucherByIdAPI(voucherId!);
    setData(res.data.data);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
      title="Chi tiết Voucher"
    >
      {data && (
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Mã voucher">
            <strong>{data.code}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả">
            {data.description || "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Loại voucher">
            <Tag color="blue">{data.typeVoucher}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Giá trị giảm">
            {data.typeVoucher === "PERCENT" ? (
              <strong>{data.value != null ? `${data.value}%` : "—"}</strong>
            ) : (
              <strong>
                {data.value != null
                  ? `${data.value.toLocaleString("vi-VN")} đ`
                  : "—"}
              </strong>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Giảm tối đa">
            {data.maxDiscountAmount != null
              ? `${data.maxDiscountAmount.toLocaleString("vi-VN")} đ`
              : "Không giới hạn"}
          </Descriptions.Item>

          <Descriptions.Item label="Đơn hàng tối thiểu">
            {data.minOrderValue != null
              ? `${data.minOrderValue.toLocaleString("vi-VN")} đ`
              : "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian áp dụng">
            {dayjs(data.startDate).format("DD/MM/YYYY HH:mm")} →{" "}
            {dayjs(data.endDate).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng">
            {data.quantity}
          </Descriptions.Item>

          <Descriptions.Item label="Đã sử dụng">
            {data.usedCount}
          </Descriptions.Item>

          <Descriptions.Item label="Còn lại">
            <strong>{data.quantity - data.usedCount}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            {data.active ? (
              <Tag color="green" style={{ padding: "4px 12px" }}>
                Đang kích hoạt
              </Tag>
            ) : (
              <Tag color="red" style={{ padding: "4px 12px" }}>
                Ngừng áp dụng
              </Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default VoucherDetail;
