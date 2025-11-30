import { useState, useEffect } from "react";
import { Button, List, Card, Tag } from "antd";
import {
  CheckCircleFilled,
  CrownFilled,
  SketchOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import {
  createMembershipPaymentAPI,
  getCustomerInfoAPI,
} from "../../service/api";
import { formatCurrency } from "../../utils/format";
import { useCurrentApp } from "../../components/context/app.context";
import MembershipPaymentModal from "../../components/section/payment/MembershipPaymentModal";

const MEMBERSHIP_PRICE = 5000;

const benefits = [
  "Miễn phí vận chuyển cho mọi đơn hàng < 5km",
  "Giảm trực tiếp 5% trên tổng hóa đơn",
  "Quà tặng sinh nhật đặc biệt",
  "Ưu tiên hỗ trợ 24/7",
  "Huy hiệu VIP độc quyền",
];

const MembershipPage = () => {
  const { user, setUser, showToast, isAppLoading } = useCurrentApp();
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const isMember = user?.member === true;

  // ✅ Fetch lại user để chắc chắn member state chính xác khi mở trang
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (user?.role === "CUSTOMER") {
        try {
          const customerRes = await getCustomerInfoAPI(user.id);
          if (customerRes?.data?.data) {
            setUser({ ...user, ...customerRes.data.data });
          }
        } catch (error) {
          console.error("Không lấy được customer info:", error);
        }
      }
    };

    fetchCustomerInfo();
  }, [user?.id, user?.role, setUser]);

  const handleRegister = async () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để đăng ký!", "warning");
      return;
    }

    if (isMember) {
      showToast("Bạn đã là thành viên VIP rồi!", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await createMembershipPaymentAPI({
        userId: user.id,
        amount: MEMBERSHIP_PRICE,
      });

      if (res.data?.error) {
        showToast(res.data.message || "Bạn đã là thành viên VIP!", "error");
        return;
      }

      if (res.data && res.data.data) {
        setPaymentData(res.data.data);
        setPaymentModalOpen(true);
      } else {
        showToast(
          "Không lấy được thông tin thanh toán. Vui lòng thử lại!",
          "error"
        );
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* --- BANNER CHÍNH --- */}
        <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-10">
          <CrownFilled className="absolute -right-10 -bottom-10 text-[15rem] text-white opacity-10 rotate-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-white/30">
                <ThunderboltFilled className="text-yellow-300" />
                GÓI HỘI VIÊN CAO CẤP
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center md:justify-start gap-3">
                {isMember ? "BẠN ĐANG LÀ VIP" : "TRỞ THÀNH THÀNH VIÊN VIP"}
              </h1>

              <p className="text-green-50 text-lg max-w-lg leading-relaxed">
                {isMember
                  ? "Cảm ơn bạn đã đồng hành cùng chúng tôi. Hãy tận hưởng những đặc quyền dành riêng cho bạn!"
                  : "Nâng cấp ngay để mở khóa ưu đãi không giới hạn và tiết kiệm chi phí mua sắm mỗi ngày."}
              </p>
            </div>

            {/* CARD GIÁ / TRẠNG THÁI */}
            <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl w-full md:w-80 text-center transform hover:scale-105 transition-transform duration-300">
              {isMember ? (
                <div className="py-4">
                  <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    <CrownFilled />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    VIP MEMBER
                  </h3>
                  <Tag color="success" className="mt-2 text-sm px-3 py-1">
                    Đang hoạt động
                  </Tag>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">
                    Trọn gói 1 năm
                  </p>

                  <div className="text-4xl font-extrabold text-green-600 mb-6">
                    {formatCurrency(MEMBERSHIP_PRICE)}
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    shape="round"
                    disabled={isMember || isAppLoading} // ✅ disable khi VIP hoặc đang load
                    loading={loading}
                    onClick={handleRegister}
                    className={`w-full h-12 text-lg font-bold 
                      ${
                        isMember
                          ? "bg-gray-300 cursor-not-allowed border-none"
                          : "bg-gradient-to-r from-yellow-400 to-orange-500 border-none hover:shadow-lg hover:from-yellow-500 hover:to-orange-600"
                      }`}
                  >
                    {isMember ? "Bạn đã là VIP" : "Đăng ký ngay"}
                  </Button>

                  <p className="text-xs text-gray-400 mt-4">
                    Thanh toán an toàn qua PayOS
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- DANH SÁCH QUYỀN LỢI --- */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-sm border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <SketchOutlined className="text-blue-500" /> Đặc quyền của bạn
            </h3>

            <List
              itemLayout="horizontal"
              dataSource={benefits}
              renderItem={(item) => (
                <List.Item className="!border-none !py-3">
                  <div className="flex items-start gap-4 text-gray-700 text-base">
                    <CheckCircleFilled className="text-green-500 text-xl mt-1 shrink-0" />
                    <span>{item}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <div className="bg-green-50 rounded-2xl border border-green-100 p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-4 rounded-full shadow-md mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2454/2454282.png"
                alt="Support"
                className="w-16 h-16 object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Cần hỗ trợ tư vấn?
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Đội ngũ chăm sóc khách hàng VIP luôn sẵn sàng giải đáp mọi thắc
              mắc của bạn.
            </p>

            <Button
              type="default"
              className="border-green-600 text-green-600 hover:text-green-700 font-semibold"
            >
              Liên hệ ngay
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL THANH TOÁN */}
      <MembershipPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        paymentData={paymentData}
      />
    </div>
  );
};

export default MembershipPage;
