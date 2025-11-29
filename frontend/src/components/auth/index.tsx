// File path: /src/components/auth/index.tsx

import type React from "react";
import { useCurrentApp } from "../context/app.context";
import { Button, Result, Spin } from "antd"; // Import thêm Spin để loading
import { useEffect } from "react";
import { fetchAccountAPI } from "../../service/api";
import { useNavigate } from "react-router-dom"; // Import hook điều hướng

interface IProps {
  children: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {
  const {
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    isAppLoading, // Lấy biến này ra để check loading
    setIsAppLoading,
  } = useCurrentApp();

  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  useEffect(() => {
    // Nếu đã login rồi thì không cần check lại (tùy logic dự án, nhưng thường là vậy để tối ưu)
    // Nhưng code gốc của bạn check mỗi lần mount nên tôi giữ nguyên logic đó
    const fetchAccount = async () => {
      // Đảm bảo set loading true khi bắt đầu
      setIsAppLoading(true);
      try {
        const res = await fetchAccountAPI();
        if (res.data) {
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Fetch account failed:", err);
        setIsAuthenticated(false);
      } finally {
        setIsAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  // 1. Nếu đang loading thì hiện vòng quay, tránh hiện thông báo lỗi ngay lập tức
  if (isAppLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // 2. Nếu không loading VÀ chưa đăng nhập thì hiện thông báo yêu cầu đăng nhập
  if (isAuthenticated === false) {
    return (
      <Result
        status="403" // Dùng 403 (Forbidden) hợp lý hơn 404
        title="Yêu cầu đăng nhập"
        subTitle="Vui lòng đăng nhập để thực hiện chức năng này."
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/dang-nhap")} // Chuyển hướng sang trang login
          >
            Đăng nhập ngay
          </Button>
        }
      />
    );
  }

  // 3. Nếu đã đăng nhập thì hiện nội dung trang
  return <>{props.children}</>;
};

export default ProtectedRoute;
