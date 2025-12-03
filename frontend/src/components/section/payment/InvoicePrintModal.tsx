import { Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { formatCurrency, formatOrderCode } from "../../../utils/format";

interface OrderDetail {
  productId: number;
  productName: string;
  productImage: string;
  productSlug: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderAt: string;
  note: string;
  statusOrder: string;
  estimatedDate: string;
  actualDate: string | null;
  shipAddress: string;
  receiverName: string;
  receiverPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  orderDetails: OrderDetail[];
  userId: number | null;
}

interface InvoicePrintModalProps {
  order: Order;
  visible: boolean;
  onClose: () => void;
}

const InvoicePrintModal = ({
  order,
  visible,
  onClose,
}: InvoicePrintModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-content");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Hóa đơn #${formatOrderCode(order.id)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              padding: 40px 20px;
              background: #ffffff;
            }
            
            .invoice-wrapper { 
              max-width: 900px; 
              margin: 0 auto;
              background: white;
              box-shadow: 0 0 40px rgba(0,0,0,0.08);
              border-radius: 12px;
              overflow: hidden;
            }
            
            /* Header với gradient */
            .invoice-header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 40px 50px;
              color: white;
              position: relative;
              overflow: hidden;
            }
            
            .invoice-header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -10%;
              width: 300px;
              height: 300px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
            }
            
            .header-content {
              position: relative;
              z-index: 1;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            
            .company-section {
              flex: 1;
            }
            
            .company-logo {
              font-size: 36px;
              font-weight: 700;
              margin-bottom: 8px;
              letter-spacing: -1px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .company-tagline {
              font-size: 15px;
              opacity: 0.95;
              font-weight: 500;
              margin-bottom: 16px;
            }
            
            .company-contact {
              font-size: 13px;
              opacity: 0.85;
              line-height: 1.8;
            }
            
            .invoice-info {
              text-align: right;
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              padding: 20px 25px;
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,0.2);
            }
            
            .invoice-label {
              font-size: 14px;
              opacity: 0.9;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
            }
            
            .invoice-number {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            /* Content Area */
            .invoice-body {
              padding: 45px 50px;
            }
            
            /* Info Cards */
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              margin-bottom: 40px;
            }
            
            .info-card {
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              padding: 24px;
              transition: all 0.3s ease;
            }
            
            .info-card:hover {
              border-color: #10b981;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
            }
            
            .info-title {
              font-size: 13px;
              font-weight: 700;
              color: #10b981;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 14px;
            }
            
            .info-label {
              color: #64748b;
              font-weight: 500;
            }
            
            .info-value {
              color: #1e293b;
              font-weight: 600;
            }
            
            /* Products Table */
            .products-section {
              margin-bottom: 40px;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 20px;
              padding-bottom: 12px;
              border-bottom: 3px solid #10b981;
            }
            
            .products-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .products-table thead {
              background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
            }
            
            .products-table th {
              padding: 16px;
              text-align: left;
              font-weight: 700;
              font-size: 12px;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 0.6px;
              border-bottom: 2px solid #cbd5e1;
            }
            
            .products-table td {
              padding: 18px 16px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 14px;
              color: #334155;
            }
            
            .products-table tbody tr {
              transition: background 0.2s ease;
            }
            
            .products-table tbody tr:hover {
              background: #f8fafc;
            }
            
            .products-table tbody tr:last-child td {
              border-bottom: none;
            }
            
            .product-name {
              font-weight: 600;
              color: #1e293b;
            }
            
            /* Summary Box */
            .summary-wrapper {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }
            
            .summary-box {
              width: 420px;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              padding: 28px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              font-size: 15px;
              color: #475569;
            }
            
            .summary-row.subtotal {
              font-weight: 500;
            }
            
            .summary-row.discount {
              color: #10b981;
              background: #ecfdf5;
              padding: 12px 16px;
              border-radius: 8px;
              margin: 8px -16px;
              font-weight: 600;
            }
            
            .summary-divider {
              height: 2px;
              background: linear-gradient(to right, transparent, #cbd5e1, transparent);
              margin: 16px 0;
            }
            
            .summary-row.total {
              padding: 20px 0 0 0;
              font-size: 22px;
              font-weight: 700;
              color: #dc2626;
              border-top: 3px solid #10b981;
              margin-top: 8px;
            }
            
            /* Footer */
            .invoice-footer {
              background: #f8fafc;
              padding: 35px 50px;
              text-align: center;
              border-top: 2px solid #e2e8f0;
            }
            
            .thank-you {
              font-size: 20px;
              font-weight: 700;
              color: #10b981;
              margin-bottom: 12px;
            }
            
            .footer-note {
              color: #64748b;
              font-size: 14px;
              margin-bottom: 8px;
              line-height: 1.6;
            }
            
            .footer-contact {
              color: #475569;
              font-size: 14px;
              font-weight: 600;
              margin-top: 12px;
            }
            
            .copyright {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #94a3b8;
              font-size: 12px;
            }
            
            /* Utility */
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: 700; }
            
            /* Print Styles */
            @media print {
              body { 
                padding: 0;
                background: white;
              }
              .invoice-wrapper { 
                box-shadow: none;
                border-radius: 0;
              }
              .products-table tbody tr:hover { 
                background: transparent; 
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 350);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose} size="large">
          Đóng
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          size="large"
          className="bg-green-600 hover:!bg-green-700"
        >
          In hóa đơn
        </Button>,
      ]}
      centered
      className="invoice-modal"
    >
      <div id="invoice-print-content">
        <div className="invoice-wrapper">
          {/* Header với gradient background */}
          <div className="invoice-header">
            <div className="header-content">
              <div className="company-section">
                <div className="company-logo">ORGANIC STORE</div>
                <div className="company-tagline">
                  🌿 Sản phẩm hữu cơ - Sạch & An toàn
                </div>
                <div className="company-contact">
                  📍 123 Đường Nguyễn Văn Linh, Q.7, TP.HCM
                  <br />
                  📞 Hotline: +84 800 456 478
                  <br />
                  ✉️ Email: support@organicstore.vn
                </div>
              </div>
              <div className="invoice-info">
                <div className="invoice-label">Hóa Đơn</div>
                <div className="invoice-number">
                  #{formatOrderCode(order.id)}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="invoice-body">
            {/* Info Grid */}
            <div className="info-grid">
              <div className="info-card">
                <div className="info-title">📋 THÔNG TIN ĐƠN HÀNG</div>
                <div className="info-row">
                  <span className="info-label">Ngày đặt:</span>
                  <span className="info-value">
                    {formatDate(order.orderAt)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Trạng thái:</span>
                  <span className="info-value">
                    {getStatusText(order.statusOrder)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Thanh toán:</span>
                  <span className="info-value">
                    {order.paymentMethod === "COD" ? "COD" : "Chuyển khoản"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tình trạng:</span>
                  <span className="info-value">
                    {order.paymentStatus === "SUCCESS"
                      ? "✓ Đã thanh toán"
                      : order.paymentStatus === "FAILED"
                      ? "✗ Thất bại"
                      : "⏳ Chưa thanh toán"}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-title">📍 THÔNG TIN NHẬN HÀNG</div>
                <div className="info-row">
                  <span className="info-label">Người nhận:</span>
                  <span className="info-value">{order.receiverName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Điện thoại:</span>
                  <span className="info-value">{order.receiverPhone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value" style={{ fontSize: "13px" }}>
                    {order.shipAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="products-section">
              <div className="section-title">Chi tiết sản phẩm</div>
              <table className="products-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }} className="text-center">
                      STT
                    </th>
                    <th>Tên sản phẩm</th>
                    <th className="text-center" style={{ width: "110px" }}>
                      Số lượng
                    </th>
                    <th className="text-right" style={{ width: "140px" }}>
                      Đơn giá
                    </th>
                    <th className="text-right" style={{ width: "160px" }}>
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderDetails.map((item, index) => (
                    <tr key={item.productId}>
                      <td className="text-center">{index + 1}</td>
                      <td className="product-name">{item.productName}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="text-right font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="summary-wrapper">
              <div className="summary-box">
                <div className="summary-row subtotal">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="summary-row subtotal">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="summary-row subtotal">
                  <span>Thuế VAT</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>🎉 Giảm giá</span>
                    <span>- {formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>TỔNG CỘNG</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <div className="thank-you">
              Cảm ơn quý khách đã tin tưởng Organic Store!
            </div>
            <div className="footer-note">
              Hóa đơn được tạo tự động bởi hệ thống
            </div>
            <div className="footer-contact">
              Hotline hỗ trợ: +84 800 456 478
            </div>
            <div className="copyright">
              © 2024 Organic Store. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoicePrintModal;
