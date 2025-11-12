import PacmanLoader from "react-spinners/PacmanLoader";
import { useCurrentApp } from "../context/app.context";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { fetchAccountAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";

const ProtectedRouter = ({ children }: { children: React.ReactNode }) => {
  const {
    isAuthenticated,
    isAppLoading,
    setUser,
    setIsAuthenticated,
    setIsAppLoading,
    user,
  } = useCurrentApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetchAccountAPI();
        if (res.data) {
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
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

  if (isAppLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <PacmanLoader size={30} color="#36d6b4" />
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Result
        status="404"
        title="Chưa đăng nhập"
        subTitle="Bạn cần đăng nhập để truy cập trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/dang-nhap")}>
            Đăng nhập
          </Button>
        }
      />
    );
  }


  if (user?.role !== "ADMIN") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRouter;