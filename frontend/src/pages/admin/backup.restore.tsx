import React, { useState } from "react";
import {
  Button,
  Card,
  Space,
  Typography,
  message,
  Alert,
  Divider,
  Popconfirm,
} from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

interface IBackupResult {
  type: "success" | "error";
  title: string;
  msg: string;
  filePath?: string;
  size?: number;
  createdAt?: string;
}

const BackupRestorePage: React.FC = () => {
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [result, setResult] = useState<IBackupResult | null>(null);

  // Backup
  const handleBackup = async () => {
    setLoadingBackup(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:8080/api/v1/db/backup");
      const apiResponse = res.data.data; // ApiResponse
      if (apiResponse.success && apiResponse.data) {
        const info = apiResponse.data; // BackupInfo
        setResult({
          type: "success",
          title: "Backup thành công",
          msg: `File đã tạo tại: ${info.absolutePath}`,
          filePath: info.absolutePath,
          size: info.fileSize,
          createdAt: info.createdAt,
        });
        message.success("Backup thành công!");
      }
    } catch (err: any) {
      setResult({
        type: "error",
        title: "Backup thất bại",
        msg: err.response?.data?.message || "Backup thất bại",
      });
      message.error("Backup thất bại!");
    }
    setLoadingBackup(false);
  };

  // Restore
  const handleRestore = async () => {
    if (!result?.filePath) return message.warning("Chưa có file để restore!");
    setLoadingRestore(true);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/db/restore?path=${encodeURIComponent(
          result.filePath
        )}`
      );

      if (res.data.success) {
        setResult({
          type: "success",
          title: "Khôi phục thành công",
          msg: `Tệp đã được khôi phục: ${result.filePath}`,
        });
        message.success("Khôi phục thành công!");
      }
    } catch (err) {
      setResult({
        type: "error",
        title: "Khôi phục thất bại",
        msg: err.response?.data?.message || "Không thể khôi phục",
      });
    }
    setLoadingRestore(false);
  };

  // Download file backup
  const handleDownload = async () => {
  if (!result?.filePath) return;

  try {
    const res = await axios.get(
      `http://localhost:8080/api/v1/db/download?path=${encodeURIComponent(result.filePath)}`,
      { responseType: "blob" } // Bắt buộc blob
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      result.filePath.split("\\").pop() || "backup.sql"
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    message.success("Đang tải file backup...");
  } catch (err) {
    message.error("Tải file thất bại!");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <DatabaseOutlined className="text-6xl text-blue-600" />
          <Title level={2}>Quản lý Sao lưu & Khôi phục</Title>
          <Text type="secondary">
            Tạo bản sao lưu và khôi phục chỉ với một cú nhấp chuột
          </Text>
        </div>

        <Card className="shadow-lg rounded-2xl p-8">
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 text-center rounded-xl border-blue-200 bg-blue-50">
                <DownloadOutlined className="text-5xl text-blue-600 mb-3" />
                <Title level={4}>Backup</Title>
                <Text type="secondary">Tạo bản sao lưu đầy đủ dữ liệu</Text>
                <Button
                  className="mt-4"
                  type="primary"
                  size="large"
                  loading={loadingBackup}
                  onClick={handleBackup}
                  block
                >
                  {loadingBackup ? "Đang sao lưu..." : "Backup ngay"}
                </Button>
              </Card>

              <Card className="p-6 text-center rounded-xl border-red-200 bg-red-50">
                <UploadOutlined className="text-5xl text-red-600 mb-3" />
                <Title level={4}>Khôi phục</Title>
                <Text type="danger">Dữ liệu hiện tại sẽ bị thay thế!</Text>
                <Popconfirm
                  title="Khôi phục dữ liệu?"
                  okText="Xác nhận"
                  cancelText="Hủy"
                  onConfirm={handleRestore}
                >
                  <Button
                    className="mt-4"
                    danger
                    size="large"
                    loading={loadingRestore}
                    block
                  >
                    {loadingRestore ? "Đang khôi phục..." : "Khôi phục"}
                  </Button>
                </Popconfirm>
              </Card>
            </div>

            {/* Hiển thị file backup */}
            {result && result.type === "success" && result.filePath && (
              <Card className="mt-4 border-green-300 bg-green-50">
                <Title level={5}>📄 File Backup Đã Tạo</Title>
                <p>
                  <b>Đường dẫn:</b> {result.filePath}
                </p>
                <p>
                  <b>Kích thước:</b> {(result.size! / 1024 / 1024).toFixed(2)}{" "}
                  MB
                </p>
                <p>
                  <b>Thời gian:</b> {result.createdAt}
                </p>

                <Space style={{ marginTop: 12 }}>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(result.filePath!)
                    }
                  >
                    📋 Copy đường dẫn
                  </Button>
                  <Button type="primary" onClick={handleDownload}>
                    ⬇️ Tải file backup
                  </Button>
                </Space>
              </Card>
            )}

            {result && result.type === "error" && (
              <Alert
                className="mt-4"
                message={result.title}
                description={result.msg}
                type="error"
                showIcon
              />
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default BackupRestorePage;
