import type React from "react";
import { useCurrentApp } from "../context/app.context";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { fetchAccountAPI } from "../../service/api";

interface IProps {
  children: React.ReactNode;
}
const ProtectedRoute = (props: IProps) => {
  const { isAuthenticated, setUser, setIsAuthenticated, setIsAppLoading } = useCurrentApp();
  useEffect(() => {
    console.log("AdminLayout mounted");
    const fetchAccount = async () => {
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
  if (isAuthenticated === false) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    );
  }
  return <>{props.children}</>;
};
export default ProtectedRoute;
