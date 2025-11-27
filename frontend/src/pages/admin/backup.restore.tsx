// src/pages/admin/BackupRestorePage.tsx

import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Space,
  Typography,
  message,
  Alert,
  Spin,
  Divider,
  Popconfirm,
} from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const BackupRestorePage: React.FC = () => {
  const [path, setPath] = useState("");
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    title: string;
    msg: string;
    filePath?: string;
  } | null>(null);

  // Tự động sinh tên file backup - LƯU VÀO Ổ D:
  const generateBackupPath = () => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[-:T]/g, "");
    
    // Phát hiện hệ điều hành
    const isWindows = navigator.platform.toLowerCase().includes('win');
    
    // Mặc định lưu vào D:/backups trên Windows
    const defaultPath = isWindows 
      ? `D:/backups/organic_store_backup_${timestamp}.sql`
      : `/tmp/organic_store_backup_${timestamp}.sql`;
    
    setPath(defaultPath);
  };

  // Backup
  const handleBackup = async () => {
    if (!path.trim()) {
      message.warning("Vui lòng nhập đường dẫn file backup!");
      return;
    }

    setLoadingBackup(true);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/db/backup?path=${encodeURIComponent(path.trim())}`
      );

      console.log("Backend response:", res);
      console.log("Status:", res.status);
      console.log("Data:", res.data);

      // Kiểm tra status code 200 = thành công
      if (res.status === 200) {
        const apiData = res.data;
        const fullMessage = apiData.message || apiData.data || "Backup thành công!";
        
        // Trích xuất đường dẫn file đầy đủ
        const filePathMatch = fullMessage.match(/([A-Z]:[\\/][\w\\/.-]+\.sql|\/[\w\\/.-]+\.sql)/i);
        const filePath = filePathMatch ? filePathMatch[1] : "";

        setResult({
          type: "success",
          title: "✓ Backup thành công!",
          msg: fullMessage,
          filePath,
        });
        message.success("Backup thành công!");
      } else {
        // Không phải 200 = lỗi
        setResult({
          type: "error",
          title: "✗ Backup thất bại!",
          msg: res.data?.message || "Có lỗi xảy ra từ server",
        });
        message.error("Backup thất bại!");
      }
    } catch (err: any) {
      console.error("Backup error:", err);
      
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi kết nối đến server";

      setResult({
        type: "error",
        title: "✗ Backup thất bại!",
        msg: errMsg,
      });
      message.error("Backup thất bại!");
    } finally {
      setLoadingBackup(false);
    }
  };

  // Restore
  const handleRestore = async () => {
    if (!path.trim()) {
      message.warning("Vui lòng nhập đường dẫn file restore!");
      return;
    }

    setLoadingRestore(true);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/db/restore?path=${encodeURIComponent(path.trim())}`
      );

      console.log("Backend response:", res);
      console.log("Status:", res.status);
      console.log("Data:", res.data);

      // Kiểm tra status code 200 = thành công
      if (res.status === 200) {
        const apiData = res.data;
        const fullMessage = apiData.message || apiData.data || "Restore thành công!";
        
        // Trích xuất đường dẫn file đầy đủ
        const filePathMatch = fullMessage.match(/([A-Z]:[\\/][\w\\/.-]+\.sql|\/[\w\\/.-]+\.sql)/i);
        const filePath = filePathMatch ? filePathMatch[1] : "";

        setResult({
          type: "success",
          title: "✓ Restore thành công!",
          msg: fullMessage,
          filePath,
        });
        message.success("Restore thành công!");
      } else {
        // Không phải 200 = lỗi
        setResult({
          type: "error",
          title: "✗ Restore thất bại!",
          msg: res.data?.message || "Có lỗi xảy ra từ server",
        });
        message.error("Restore thất bại!");
      }
    } catch (err: any) {
      console.error("Restore error:", err);
      
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi kết nối đến server";

      setResult({
        type: "error",
        title: "✗ Restore thất bại!",
        msg: errMsg,
      });
      message.error("Restore thất bại!");
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-6 animate-pulse">
            <DatabaseOutlined className="text-5xl text-white" />
          </div>
          <Title
            level={1}
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          >
            Backup & Restore Database
          </Title>
          <Text type="secondary" className="text-lg mt-4 block max-w-2xl mx-auto">
            Quản lý sao lưu và khôi phục toàn bộ dữ liệu hệ thống một cách an toàn và nhanh chóng
          </Text>
        </div>

        {/* Main Card */}
        <Card
          className="shadow-2xl rounded-3xl border-0 overflow-hidden"
          bodyStyle={{ padding: "48px" }}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
            {/* Đường dẫn file */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <FileTextOutlined className="text-2xl text-indigo-600" />
                <Text strong className="text-xl text-gray-800">
                  Đường dẫn file backup/restore
                </Text>
              </div>

              <Space.Compact style={{ width: "100%" }}>
                <Input
                  size="large"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="Nhập đường dẫn tuyệt đối (VD: D:/backups/backup.sql)..."
                  className="text-lg font-mono rounded-l-2xl"
                  style={{ height: 56 }}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<ClockCircleOutlined />}
                  onClick={generateBackupPath}
                  className="rounded-r-2xl"
                  style={{ height: 56 }}
                >
                  Tạo tên tự động
                </Button>
              </Space.Compact>

              <Text type="secondary" className="text-sm block mt-3 text-gray-600">
                Gợi ý: Windows: <code className="bg-blue-100 px-2 py-1 rounded font-bold">D:/backups/organic_store.sql</code> | Linux/Mac: <code className="bg-gray-200 px-2 py-1 rounded ml-2">/tmp/backup.sql</code>
              </Text>
            </div>

            <Divider className="my-12 border-dashed border-gray-300" />

            {/* Nút hành động */}
            <div className="grid md:grid-cols-2 gap-12">
              {/* Backup */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-2xl mb-8 transform group-hover:scale-110 transition-all duration-300">
                  {loadingBackup ? <Spin size="large" /> : <DownloadOutlined className="text-6xl text-white" />}
                </div>
                <Title level={2} className="mb-4 text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  Sao lưu dữ liệu
                </Title>
                <Text className="block mb-8 text-gray-600 max-w-sm mx-auto text-lg">
                  Tạo bản sao lưu đầy đủ database (cấu trúc + dữ liệu) chỉ trong vài giây
                </Text>
                <Button
                  type="primary"
                  size="large"
                  loading={loadingBackup}
                  onClick={handleBackup}
                  icon={<DownloadOutlined />}
                  className="h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50"
                  style={{ background: "linear-gradient(90deg, #10b981, #059669)", border: "none" }}
                >
                  {loadingBackup ? "Đang sao lưu..." : "Thực hiện Backup ngay"}
                </Button>
              </div>

              {/* Restore */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-rose-500 to-red-600 rounded-full shadow-2xl mb-8 transform group-hover:scale-110 transition-all duration-300">
                  {loadingRestore ? <Spin size="large" /> : <UploadOutlined className="text-6xl text-white" />}
                </div>
                <Title level={2} className="mb-4 text-rose-600 group-hover:text-rose-700 transition-colors">
                  Khôi phục dữ liệu
                </Title>
                <Text className="block mb-4 text-gray-600 max-w-sm mx-auto text-lg">
                  <strong className="text-red-600">Cảnh báo:</strong> Toàn bộ dữ liệu hiện tại sẽ bị thay thế hoàn toàn!
                </Text>
                <Popconfirm
                  title="Bạn có chắc chắn muốn khôi phục?"
                  description={
                    <div>
                      <p>Hành động này sẽ <strong>xóa toàn bộ dữ liệu hiện tại</strong>!</p>
                      <p className="mt-2 text-sm">Bạn đã backup dữ liệu mới nhất chưa?</p>
                    </div>
                  }
                  okText="Có, khôi phục ngay"
                  cancelText="Hủy bỏ"
                  okButtonProps={{ danger: true, size: "large" }}
                  cancelButtonProps={{ size: "large" }}
                  onConfirm={handleRestore}
                >
                  <Button
                    danger
                    type="primary"
                    size="large"
                    loading={loadingRestore}
                    icon={<UploadOutlined />}
                    className="h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-rose-500/50"
                    style={{ background: "linear-gradient(90deg, #ef4444, #dc2626)", border: "none" }}
                  >
                    {loadingRestore ? "Đang khôi phục..." : "Thực hiện Restore"}
                  </Button>
                </Popconfirm>
              </div>
            </div>

            {/* Kết quả */}
            {result && (
              <div className="mt-12">
                <Alert
                  message={
                    <div className="flex items-start gap-4">
                      {result.type === "success" ? (
                        <CheckCircleOutlined className="text-4xl text-green-600 mt-1" />
                      ) : (
                        <ExclamationCircleOutlined className="text-4xl text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <Title level={3} className={`m-0 mb-2 ${result.type === "success" ? "text-green-700" : "text-red-700"}`}>
                          {result.title}
                        </Title>
                        <div className="text-base text-gray-700 mb-3">
                          {result.msg}
                        </div>
                        {result.filePath && (
                          <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-gray-300">
                            <Text strong className="text-gray-600">Đường dẫn file:</Text>
                            <div className="font-mono text-sm text-blue-600 mt-1 break-all">
                              {result.filePath}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                  type={result.type === "success" ? "success" : "error"}
                  showIcon={false}
                  className="rounded-2xl shadow-2xl border-0"
                  style={{
                    background: result.type === "success" 
                      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" 
                      : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                    border: result.type === "success" ? "2px solid #86efac" : "2px solid #fca5a5",
                    padding: "24px"
                  }}
                />
              </div>
            )}

            {/* Ghi chú */}
            <div className="mt-12 p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl">
              <Space size={20}>
                <ExclamationCircleOutlined className="text-5xl text-amber-600" />
                <div>
                  <Title level={4} className="text-amber-800 mb-3">
                    Lưu ý cực kỳ quan trọng
                  </Title>
                  <ul className="space-y-2 text-gray-700 text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Luôn <strong>backup trước khi restore</strong> – không thể hoàn tác!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Đảm bảo file backup tồn tại và đúng định dạng .sql</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Quyền ghi file trên server phải được cấp đầy đủ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span><strong>Thư mục D:/backups phải được tạo trước</strong> trên server Windows</span>
                    </li>
                  </ul>
                </div>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BackupRestorePage;