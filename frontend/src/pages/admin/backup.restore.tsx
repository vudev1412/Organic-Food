import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Space,
  Typography,
  message,
  Alert,
  Divider,
  Popconfirm,
  Table,
  Tag,
  Spin,
  notification,
} from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CloudDownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface IBackupInfo {
  absolutePath: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

interface IBackupResult {
  type: "success" | "error";
  title: string;
  msg: string;
}

const BackupRestorePage: React.FC = () => {
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [backupList, setBackupList] = useState<IBackupInfo[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<IBackupInfo | null>(null);
  const [result, setResult] = useState<IBackupResult | null>(null);

  // Lấy danh sách backup khi component mount
  useEffect(() => {
    fetchBackupList();
  }, []);

  // Lấy danh sách backup
  const fetchBackupList = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/db/backups/list");
      console.log("List Response:", res.data);
      
      const apiData = res.data.data || res.data;
      
      if (apiData.success && apiData.data) {
        setBackupList(apiData.data);
        console.log("Loaded backups:", apiData.data.length);
      } else if (Array.isArray(apiData)) {
        setBackupList(apiData);
      }
    } catch (err: any) {
      console.error("Error fetching backups:", err);
      notification.error({
        message: "Tải danh sách thất bại",
        description: err.response?.data?.message || "Không thể tải danh sách backup!",
        placement: "topRight",
      });
    }
    setLoadingList(false);
  };

  // Backup
  const handleBackup = async () => {
    setLoadingBackup(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:8080/api/v1/db/backup/create");
      console.log("Backup Response:", res.data);
      
      const apiResponse = res.data.data || res.data;
      
      if (apiResponse.success && apiResponse.data) {
        const backupInfo = apiResponse.data;
        
        setResult({
          type: "success",
          title: "✅ Backup thành công",
          msg: `File: ${backupInfo.fileName} | Kích thước: ${(backupInfo.fileSize / 1024 / 1024).toFixed(2)} MB`,
        });
        
        notification.success({
          message: "🎉 Backup thành công!",
          description: (
            <div>
              <p><strong>File:</strong> {backupInfo.fileName}</p>
              <p><strong>Kích thước:</strong> {(backupInfo.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Đường dẫn:</strong> {backupInfo.absolutePath}</p>
            </div>
          ),
          placement: "topRight",
          duration: 5,
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
        
        // Refresh danh sách
        setTimeout(() => fetchBackupList(), 500);
      }
    } catch (err: any) {
      console.error("Backup error:", err);
      setResult({
        type: "error",
        title: "❌ Backup thất bại",
        msg: err.response?.data?.message || "Backup thất bại",
      });
      
      notification.error({
        message: "❌ Backup thất bại",
        description: err.response?.data?.message || "Có lỗi xảy ra khi backup database",
        placement: "topRight",
        duration: 5,
        icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
    setLoadingBackup(false);
  };

  // Restore
  const handleRestore = async (backup: IBackupInfo) => {
    setLoadingRestore(true);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/db/restore?path=${encodeURIComponent(
          backup.absolutePath
        )}`
      );

      console.log("Restore Response:", res.data);
      const apiResponse = res.data.data || res.data;

      if (apiResponse.success) {
        setResult({
          type: "success",
          title: "✅ Khôi phục thành công",
          msg: `Đã khôi phục từ: ${backup.fileName}`,
        });
        
        notification.success({
          message: "🎉 Khôi phục thành công!",
          description: (
            <div>
              <p><strong>File:</strong> {backup.fileName}</p>
              <p><strong>Kích thước:</strong> {(backup.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              <p>Database đã được khôi phục về trạng thái lúc backup.</p>
            </div>
          ),
          placement: "topRight",
          duration: 5,
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      }
    } catch (err: any) {
      console.error("Restore error:", err);
      setResult({
        type: "error",
        title: "❌ Khôi phục thất bại",
        msg: err.response?.data?.message || "Không thể khôi phục",
      });
      
      notification.error({
        message: "❌ Khôi phục thất bại",
        description: err.response?.data?.message || "Có lỗi xảy ra khi khôi phục database",
        placement: "topRight",
        duration: 5,
        icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
    setLoadingRestore(false);
  };

  // Download file backup
  const handleDownload = async (backup: IBackupInfo) => {
    const hideLoading = message.loading("Đang chuẩn bị tải xuống...", 0);
    
    try {
      // Sử dụng endpoint riêng không bị wrap
      const res = await axios.get(
        `http://localhost:8080/api/v1/files/backup/download?path=${encodeURIComponent(
          backup.absolutePath
        )}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", backup.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      hideLoading();
      
      notification.success({
        message: "✅ Tải xuống thành công",
        description: `File ${backup.fileName} đã được tải về máy`,
        placement: "topRight",
        duration: 3,
      });
    } catch (err: any) {
      hideLoading();
      console.error("Download error:", err);
      
      notification.error({
        message: "❌ Tải xuống thất bại",
        description: err.response?.data?.message || "Không thể tải file backup",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  // Xóa backup
  const handleDelete = async (backup: IBackupInfo) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/db/backup/delete?path=${encodeURIComponent(
          backup.absolutePath
        )}`
      );

      console.log("Delete Response:", res.data);
      const apiResponse = res.data.data || res.data;

      if (apiResponse.success) {
        notification.success({
          message: "✅ Đã xóa backup",
          description: `File ${backup.fileName} đã được xóa khỏi hệ thống`,
          placement: "topRight",
          duration: 3,
        });
        
        fetchBackupList();
        
        if (selectedBackup?.absolutePath === backup.absolutePath) {
          setSelectedBackup(null);
        }
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      
      notification.error({
        message: "❌ Xóa thất bại",
        description: err.response?.data?.message || "Không thể xóa file backup",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  // Columns cho Table
  const columns: ColumnsType<IBackupInfo> = [
    {
      title: "Tên File",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string, record: IBackupInfo) => (
        <Space>
          <DatabaseOutlined />
          <span>{text}</span>
          {selectedBackup?.absolutePath === record.absolutePath && (
            <Tag color="blue">Đang chọn</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Kích thước",
      dataIndex: "fileSize",
      key: "fileSize",
      render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record: IBackupInfo) => (
        <Space>
          <Button
            type={
              selectedBackup?.absolutePath === record.absolutePath
                ? "primary"
                : "default"
            }
            size="small"
            onClick={() => {
              setSelectedBackup(record);
              message.success(`Đã chọn: ${record.fileName}`);
            }}
          >
            Chọn
          </Button>
          {/* <Button
            icon={<CloudDownloadOutlined />}
            size="small"
            onClick={() => handleDownload(record)}
          >
            Tải về
          </Button> */}
          <Popconfirm
            title="Xóa backup này?"
            description={`Bạn có chắc muốn xóa ${record.fileName}?`}
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <DatabaseOutlined className="text-6xl text-blue-600" />
          <Title level={2}>Quản lý Sao lưu & Khôi phục</Title>
          <Text type="secondary">
            Tạo bản sao lưu và khôi phục chỉ với một cú nhấp chuột
          </Text>
        </div>

        {/* Alert kết quả */}
        {result && (
          <Alert
            className="mb-6"
            message={result.title}
            description={result.msg}
            type={result.type}
            showIcon
            closable
            onClose={() => setResult(null)}
          />
        )}

        <Card className="shadow-lg rounded-2xl p-8 mb-6">
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
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
                  icon={<DownloadOutlined />}
                >
                  {loadingBackup ? "Đang sao lưu..." : "Backup ngay"}
                </Button>
              </Card>

              <Card className="p-6 text-center rounded-xl border-red-200 bg-red-50">
                <UploadOutlined className="text-5xl text-red-600 mb-3" />
                <Title level={4}>Khôi phục</Title>
                <Text type="danger">Dữ liệu hiện tại sẽ bị thay thế!</Text>
                <Popconfirm
                  title="⚠️ Khôi phục dữ liệu?"
                  description={
                    selectedBackup ? (
                      <div>
                        <p><strong>File:</strong> {selectedBackup.fileName}</p>
                        <p><strong>Kích thước:</strong> {(selectedBackup.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                        <p style={{ color: "red", marginTop: 8 }}>
                          ⚠️ Dữ liệu hiện tại sẽ bị ghi đè!
                        </p>
                      </div>
                    ) : (
                      "Vui lòng chọn file backup!"
                    )
                  }
                  okText="Xác nhận"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => selectedBackup && handleRestore(selectedBackup)}
                  disabled={!selectedBackup}
                >
                  <Button
                    className="mt-4"
                    danger
                    size="large"
                    loading={loadingRestore}
                    disabled={!selectedBackup}
                    block
                    icon={<UploadOutlined />}
                  >
                    {loadingRestore ? "Đang khôi phục..." : "Khôi phục"}
                  </Button>
                </Popconfirm>
                {!selectedBackup && (
                  <Text type="secondary" className="block mt-2 text-sm">
                    Chọn file backup từ danh sách bên dưới
                  </Text>
                )}
              </Card>
            </div>
          </Space>
        </Card>

        {/* Danh sách Backup */}
        <Card
          className="shadow-lg rounded-2xl"
          title={
            <Space>
              <DatabaseOutlined />
              <span>Danh sách Backup ({backupList.length})</span>
            </Space>
          }
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchBackupList();
                message.success("Đã làm mới danh sách!");
              }}
              loading={loadingList}
            >
              Làm mới
            </Button>
          }
        >
          {loadingList ? (
            <div className="text-center py-12">
              <Spin size="large" />
              <p className="mt-4">Đang tải danh sách backup...</p>
            </div>
          ) : backupList.length === 0 ? (
            <div className="text-center py-12">
              <DatabaseOutlined className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">
                Chưa có file backup nào. Hãy tạo backup mới!
              </p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={backupList}
              rowKey="absolutePath"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} file backup`,
              }}
              rowClassName={(record) =>
                selectedBackup?.absolutePath === record.absolutePath
                  ? "bg-blue-50"
                  : ""
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default BackupRestorePage;