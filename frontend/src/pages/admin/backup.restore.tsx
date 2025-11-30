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
  Tag,
} from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  FileTextOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const BackupRestorePage: React.FC = () => {
  const [path, setPath] = useState("");
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [result, setResult] = useState<{
    type: string;
    title: string;
    msg: string;
    filePath?: string;
  } | null>(null);

  // Tự động tạo tên file backup - ưu tiên lưu vào D:/backups
  const generateBackupPath = () => {
    const now = new Date();
    const date = now.toLocaleDateString("vi-VN").replace(/\//g, "-");
    const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const filename = `organic_store_backup_${date}_${time}.sql`;

    const isWindows = navigator.userAgent.includes("Win");
    const defaultPath = isWindows
      ? `D:/backups/${filename}`
      : `/tmp/${filename}`;

    setPath(defaultPath);
    message.info(`Đã tạo tên file tự động: ${filename}`);
  };

  const handleBackup = async () => {
    if (!path.trim()) {
      message.warning("Vui lòng nhập đường dẫn lưu file backup!");
      return;
    }

    setLoadingBackup(true);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/db/backup?path=${encodeURIComponent(path.trim())}`
      );

      if (res.status === 200) {
        const filePath = path.trim();
        setResult({
          type: "success",
          title: "Backup thành công!",
          msg: "Đã sao lưu toàn bộ dữ liệu hệ thống thành công.",
          filePath,
        });
        message.success("Backup hoàn tất!");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Không thể kết nối đến server";
      setResult({
        type: "error",
        title: "Backup thất bại!",
        msg: errMsg,
      });
      message.error("Backup thất bại!");
    } finally {
      setLoadingBackup(false);
    }
  };

  const handleRestore = async () => {
    if (!path.trim()) {
      message.warning("Vui lòng nhập đường dẫn file .sql để khôi phục!");
      return;
    }

    setLoadingRestore(true);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/db/restore?path=${encodeURIComponent(path.trim())}`
      );

      if (res.status === 200) {
        setResult({
          type: "success",
          title: "Khôi phục thành công!",
          msg: "Hệ thống đã được khôi phục từ file backup thành công.",
          filePath: path.trim(),
        });
        message.success("Khôi phục hoàn tất!");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Không thể thực hiện khôi phục";
      setResult({
        type: "error",
        title: "Khôi phục thất bại!",
        msg: errMsg,
      });
      message.error("Khôi phục thất bại!");
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header đẹp, chuyên nghiệp */}
        <div className="text-center mb-10">
          <Space direction="vertical" size={24}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-xl">
              <DatabaseOutlined className="text-5xl text-white" />
            </div>
            <Title level={1} style={{ fontSize: 36, fontWeight: 700, color: "#1e293b" }}>
              Quản lý sao lưu & khôi phục
            </Title>
            <Text type="secondary" style={{ fontSize: 18 }}>
              Bảo vệ dữ liệu hệ thống – Backup định kỳ, khôi phục nhanh chóng
            </Text>
          </Space>
        </div>

        <Card
          bordered={false}
          className="shadow-xl rounded-2xl overflow-hidden"
          bodyStyle={{ padding: "40px 48px" }}
        >
          {/* Nhập đường dẫn */}
          <div className="mb-8">
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Space align="center">
                <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0, color: "#262626" }}>
                  Đường dẫn file sao lưu / khôi phục
                </Title>
              </Space>

              <Space.Compact style={{ width: "100%" }}>
                <Input
                  size="large"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="Ví dụ: D:/backups/organic_store_backup_2025-04-05_143000.sql"
                  style={{ height: 56, fontSize: 16, fontFamily: "monospace" }}
                  prefix={<FileTextOutlined style={{ color: "#8c8c8c" }} />}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<ClockCircleOutlined />}
                  onClick={generateBackupPath}
                  style={{ height: 56, minWidth: 180, fontSize: 16 }}
                >
                  Tạo tên tự động
                </Button>
              </Space.Compact>

              <Alert
                type="info"
                showIcon
                message={
                  <Text strong>
                    Gợi ý: Tạo thư mục <Tag color="blue">D:/backups</Tag> trên server trước khi backup
                  </Text>
                }
                style={{ borderRadius: 12 }}
              />
            </Space>
          </div>

          <Divider />

          {/* Hai nút hành động chính */}
          <div className="grid md:grid-cols-2 gap-10">

            {/* BACKUP */}
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-2xl shadow-lg mb-6">
                  {loadingBackup ? (
                    <Spin size="large" />
                  ) : (
                    <DownloadOutlined className="text-5xl text-white" />
                  )}
                </div>
                <Title level={3} style={{ color: "#1890ff", marginBottom: 16 }}>
                  Sao lưu dữ liệu
                </Title>
                <Text style={{ fontSize: 16, color: "#595959" }}>
                  Tạo bản sao lưu đầy đủ toàn bộ CSDL (cấu trúc + dữ liệu)
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={loadingBackup}
                onClick={handleBackup}
                icon={<DownloadOutlined />}
                style={{
                  height: 60,
                  fontSize: 18,
                  fontWeight: 600,
                  borderRadius: 16,
                  background: "linear-gradient(90deg, #1890ff, #40a9ff)",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(24,144,255,0.3)",
                }}
              >
                {loadingBackup ? "Đang sao lưu..." : "Thực hiện Backup ngay"}
              </Button>
            </div>

            {/* RESTORE */}
            <div className="text-center p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-2xl shadow-lg mb-6">
                  {loadingRestore ? (
                    <Spin size="large" />
                  ) : (
                    <UploadOutlined className="text-5xl text-white" />
                  )}
                </div>
                <Title level={3} style={{ color: "#ff4d4f", marginBottom: 16 }}>
                  Khôi phục dữ liệu
                </Title>
                <Text style={{ fontSize: 16, color: "#595959" }}>
                  <Text strong type="danger">
                    Cảnh báo: Toàn bộ dữ liệu hiện tại sẽ bị thay thế!
                  </Text>
                </Text>
              </div>

              <Popconfirm
                title="Xác nhận khôi phục dữ liệu?"
                description={
                  <div style={{ maxWidth: 320 }}>
                    <Text strong type="danger">
                      <AlertOutlined style={{ marginRight: 8 }} />
                      Hành động này sẽ XÓA TOÀN BỘ dữ liệu hiện tại!
                    </Text>
                    <br /><br />
                    <Text>Bạn đã backup dữ liệu mới nhất chưa?</Text>
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
                  block
                  loading={loadingRestore}
                  icon={<UploadOutlined />}
                  style={{
                    height: 60,
                    fontSize: 18,
                    fontWeight: 600,
                    borderRadius: 16,
                    background: "linear-gradient(90deg, #ff4d4f, #ff7875)",
                    border: "none",
                    boxShadow: "0 8px 20px rgba(255,77,79,0.3)",
                  }}
                >
                  {loadingRestore ? "Đang khôi phục..." : "Thực hiện Restore"}
                </Button>
              </Popconfirm>
            </div>
          </div>

          {/* Kết quả thực hiện */}
          {result && (
            <div className="mt-10">
              <Alert
                type={result.type === "success" ? "success" : "error"}
                showIcon
                icon={
                  result.type === "success" ? (
                    <CheckCircleFilled style={{ fontSize: 32 }} />
                  ) : (
                    <ExclamationCircleFilled style={{ fontSize: 32 }} />
                  )
                }
                message={
                  <Title level={3} style={{ margin: 0, color: result.type === "success" ? "#52c41a" : "#ff4d4f" }}>
                    {result.title}
                  </Title>
                }
                description={
                  <div style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 16 }}>{result.msg}</Text>
                    {result.filePath && (
                      <div style={{ marginTop: 12, padding: 12, background: "#f6ffed", borderRadius: 8, border: "1px solid #b7eb8f" }}>
                        <Text strong>Đường dẫn file:</Text>
                        <div style={{ fontFamily: "monospace", color: "#08979c", wordBreak: "break-all", marginTop: 4 }}>
                          {result.filePath}
                        </div>
                      </div>
                    )}
                  </div>
                }
                style={{ padding: "24px", borderRadius: 16 }}
              />
            </div>
          )}

          {/* Hướng dẫn quan trọng */}
          <div className="mt-10 p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl">
            <Space size={16}>
              <SafetyOutlined style={{ fontSize: 36, color: "#d46b08" }} />
              <div>
                <Title level={4} style={{ color: "#d46b08", margin: 0 }}>
                  Lưu ý quan trọng
                </Title>
                <ul style={{ margin: "12px 0 0 0", paddingLeft: 20, color: "#595959" }}>
                  <li>Luôn <strong>backup trước khi restore</strong> – không thể hoàn tác!</li>
                  <li>Đảm bảo thư mục <Tag color="orange">D:/backups</Tag> đã được tạo trên server</li>
                  <li>Quyền ghi file phải được cấp cho user chạy ứng dụng</li>
                  <li>File backup phải có định dạng <Tag>.sql</Tag> và tồn tại thực tế</li>
                </ul>
              </div>
            </Space>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default BackupRestorePage;