import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

const MembershipSuccessPage = () => {
  const navigate = useNavigate();

  // Có thể gọi API check lại status nếu muốn chắc chắn 100%
  // Nhưng thường webhook đã xử lý xong rồi.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <CheckCircleFilled className="text-6xl text-green-500 mb-6 animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Nâng cấp VIP thành công!
        </h1>
        <p className="text-gray-500 mb-8">
          Chúc mừng bạn đã trở thành thành viên VIP. Hãy tận hưởng các ưu đãi
          đặc biệt ngay bây giờ.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            type="primary"
            size="large"
            className="bg-green-600 hover:bg-green-700 h-12 font-bold rounded-xl"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
          <Button
            size="large"
            className="h-12 rounded-xl"
            onClick={() => navigate("/tai-khoan")}
          >
            Kiểm tra hồ sơ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSuccessPage;
