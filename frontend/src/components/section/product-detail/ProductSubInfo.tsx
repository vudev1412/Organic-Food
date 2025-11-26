// File path: /src/components/section/product-detail/ProductSubInfo.tsx

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faBoxOpen,
  faHourglassHalf,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

// Giả lập interface nếu chưa import
// interface IProductDetail { ... }

interface ProductSubInfoProps {
  product: IProductDetail;
}

interface InfoItemProps {
  icon: IconDefinition;
  label: string;
  value: string;
  // Thay đổi: tách riêng class nền và class màu icon để kiểm soát tốt hơn
  bgClass: string;
  iconClass: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  bgClass,
  iconClass,
}) => (
  <div className="flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 group">
    {/* Icon Container: Bỏ opacity, dùng màu nền trực tiếp */}
    <div
      className={`w-14 h-14 flex items-center justify-center rounded-full ${bgClass} mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
    >
      <FontAwesomeIcon
        icon={icon}
        // Tăng kích thước icon và dùng màu đậm
        className={`text-2xl ${iconClass}`}
      />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-gray-800 font-bold text-lg">{value}</p>
    </div>
  </div>
);

const ProductSubInfo: React.FC<ProductSubInfoProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-1.5 h-8 bg-green-600 rounded-r-md mr-3 inline-block"></span>
        Chi tiết sản phẩm
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Đơn vị tính: Dùng màu Nâu Đất (Amber) tượng trưng cho đóng gói/hữu cơ */}
        <InfoItem
          icon={faBoxOpen}
          label="Đơn vị tính"
          value={product.unit}
          bgClass="bg-amber-100"
          iconClass="text-amber-700"
        />

        {/* Xuất xứ: Dùng màu Xanh Rêu/Xanh Lá Đậm (Emerald) tượng trưng cho vùng đất */}
        <InfoItem
          icon={faMapMarkerAlt}
          label="Xuất xứ"
          value={product.origin_address}
          bgClass="bg-emerald-100"
          iconClass="text-emerald-700"
        />

        {/* Ngày sản xuất: Dùng màu Xanh Lá Tươi (Green) tượng trưng cho sự tươi mới */}
        <InfoItem
          icon={faCalendarAlt}
          label="Ngày sản xuất"
          value={formatDate(product.mfgDate)}
          bgClass="bg-green-100"
          iconClass="text-green-700"
        />

        {/* Hạn sử dụng: Dùng màu Cam Đất (Orange) - cảnh báo nhẹ nhàng nhưng vẫn tone ấm */}
        <InfoItem
          icon={faHourglassHalf}
          label="Hạn sử dụng"
          value={formatDate(product.expDate)}
          bgClass="bg-orange-100"
          iconClass="text-orange-700"
        />
      </div>

      {/* Note box: Tone xanh mint nhẹ nhàng */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 text-green-800 text-sm flex items-start gap-3">
        <p className="">
          <span className="font-semibold">Lưu ý bảo quản:</span> Sản phẩm
          Organic không sử dụng chất bảo quản, vui lòng giữ ở nơi khô ráo,
          thoáng mát hoặc ngăn mát tủ lạnh để đảm bảo độ tươi ngon nhất.
        </p>
      </div>
    </div>
  );
};

export default ProductSubInfo;
