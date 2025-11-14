import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarSolid,
  faTimes,
  faShoppingCart,
  faBolt,
  faCheck,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getProductDetailById } from "../../service/api";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
// Giả lập import ảnh sản phẩm
import cachua from "../../assets/jpg/ca-chua-beef-huu-co.jpg";
import cachua1 from "../../assets/jpg/cachua1.jpg";
import cachua2 from "../../assets/jpg/cachua2.jpg";
import cachua3 from "../../assets/jpg/cachua3.jpg";

// Giả lập import logo chứng chỉ
import vietgapLogo from "../../../../upload/images/certs/vietgap.png";
import usdaLogo from "../../../../upload/images/certs/usda_organic.png";

// Interface cho Chứng chỉ
interface ICertification {
  id: number;
  name: string;
  logo: string;
  imageUrl: string;
  description: string;
}

// Interface cho Bình luận
interface IComment {
  user: string;
  rating: number;
  content: string;
  date?: string;
}

// Dữ liệu cho chứng chỉ
const certifications: ICertification[] = [
  {
    id: 1,
    name: "VietGAP",
    logo: vietgapLogo,
    imageUrl: vietgapLogo,
    description:
      "VietGAP (Vietnamese Good Agricultural Practices) là các quy định về thực hành sản xuất nông nghiệp tốt ở Việt Nam...",
  },
  {
    id: 2,
    name: "USDA Organic",
    logo: usdaLogo,
    imageUrl: usdaLogo,
    description:
      "USDA Organic là một chứng nhận hữu cơ của Bộ Nông nghiệp Hoa Kỳ (USDA)...",
  },
];

// Dữ liệu bình luận
const initialComments: IComment[] = [
  {
    user: "Nguyễn Văn A",
    rating: 5,
    content: "Cà chua rất tươi và ngon! Sẽ ủng hộ shop dài dài.",
    date: "12/11/2025",
  },
  {
    user: "Trần Thị B",
    rating: 4,
    content: "Giao hàng nhanh, chất lượng tốt, nhưng quả hơi nhỏ.",
    date: "10/11/2025",
  },
];

// Interface cho props của StarRating
interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  interactive = false,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={
            (interactive ? hoverRating || rating : rating) >= star
              ? faStarSolid
              : faStarRegular
          }
          className={`text-yellow-400 ${sizeClasses[size]} ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
          onClick={() => interactive && setRating && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};
// ... (Phần import, interface, component StarRating giữ nguyên)

const ProductDetail: React.FC = () => {
  const images: string[] = [cachua, cachua1, cachua2, cachua3];
  const location = useLocation();
  const productId = location.state?.productId;
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [productRating, setProductRating] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "reviews">(
    "desc"
  );

  const [comments, setComments] = useState<IComment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);

  const [selectedCert, setSelectedCert] = useState<ICertification | null>(null);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleReviewSubmit = () => {
    if (newComment.trim()) {
      const today = new Date();
      const dateStr = `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;

      setComments([
        { user: "Bạn", rating: newRating, content: newComment, date: dateStr },
        ...comments,
      ]);
      setNewComment("");
      setNewRating(5);
    }
  };

  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
      : productRating;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Cột trái: Hình ảnh sản phẩm */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-2xl bg-gray-100 group">
                <img
                  src={selectedImage}
                  alt="Main"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -20%
                </div>
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                      selectedImage === img
                        ? "border-green-600 ring-2 ring-green-200 scale-105"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cột phải: Thông tin sản phẩm */}
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Cà chua beef hữu cơ
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={averageRating} size="lg" />
                  <span className="text-gray-600">
                    {averageRating.toFixed(1)} ({comments.length} đánh giá)
                  </span>
                </div>
              </div>

              {/* [THAY ĐỔI] Giá nhỏ lại */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-green-700">
                    40.000₫
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    50.000₫
                  </span>
                </div>
                <p className="text-sm text-green-700">Tiết kiệm 10.000₫</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 ">
                <h4 className="font-semibold mb-2 flex items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="text-green-600"
                  />
                  Chứng nhận chất lượng
                </h4>
                <div className="flex gap-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-2 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-green-300"
                      onClick={() => setSelectedCert(cert)}
                    >
                      <img
                        src={cert.logo}
                        alt={cert.name}
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Số lượng (kg):</h3>
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={handleDecrease}
                    className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <div className="w-16 text-center text-lg font-semibold select-none">
                    {quantity}
                  </div>
                  <button
                    onClick={handleIncrease}
                    className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Thêm vào giỏ
                </button>
                <button className="flex-1 bg-orange-500 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faBolt} />
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Phần Tab */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-4 font-semibold transition-colors text-base md:text-lg ${
                activeTab === "desc"
                  ? "bg-white text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("desc")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`flex-1 py-4 px-4 font-semibold transition-colors text-base md:text-lg ${
                activeTab === "info"
                  ? "bg-white text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Thông tin sản phẩm
            </button>
            <button
              className={`flex-1 py-4 px-4 font-semibold transition-colors text-base md:text-lg ${
                activeTab === "reviews"
                  ? "bg-white text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({comments.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-10">
            {/* Tab: Mô tả */}
            {activeTab === "desc" && (
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p>
                  Cà chua beef hữu cơ là giống cao cấp, quả to, chắc, ít hạt,
                  cơm dày, vị ngọt thanh và hương thơm đặc trưng.
                </p>
                <p>
                  Được trồng theo phương pháp hữu cơ không sử dụng hóa chất, đảm
                  bảo an toàn cho sức khỏe. Sản phẩm đạt chứng nhận VietGAP và
                  USDA Organic, cam kết mang đến bữa ăn sạch và dinh dưỡng cho
                  gia đình bạn.
                </p>
                <ul className="list-disc pl-5">
                  <li>Giàu Vitamin A, C, và K.</li>
                  <li>Chứa Lycopene, một chất chống oxy hóa mạnh.</li>
                  <li>Tốt cho da, mắt và hệ tiêu hóa.</li>
                </ul>
              </div>
            )}

            {/* Tab: Thông tin sản phẩm */}
            {activeTab === "info" && (
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-600 mt-1"
                  />
                  <span>
                    <strong>Chứng chỉ:</strong> Hữu cơ OCOP 3 sao, VietGAP, USDA
                    Organic
                  </span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-600 mt-1"
                  />
                  <span>
                    <strong>Nguồn gốc:</strong> Trang trại organicfood.vn
                  </span>
                </li>
                <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-600 mt-1"
                  />
                  <span>
                    <strong>Ngày thu hoạch:</strong> 10/11/2025
                  </span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-600 mt-1"
                  />
                  <span>
                    <strong>Hạn sử dụng:</strong> 20/12/2025
                  </span>
                </li>
              </ul>
            )}

            {/* Tab: Đánh giá */}
            {activeTab === "reviews" && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                  {/* Rating Summary */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex flex-col items-center justify-center border border-green-200">
                    <div className="text-6xl font-bold text-green-700 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={averageRating} size="lg" />
                    <p className="text-gray-600 mt-3 text-center">
                      {comments.length} đánh giá
                    </p>
                  </div>

                  {/* Write Review Form */}
                  <div className="lg:col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">
                      Viết đánh giá của bạn
                    </h3>
                    <div className="mb-4">
                      <label className="font-medium mb-2 block">
                        Xếp hạng của bạn:
                      </label>
                      <StarRating
                        rating={newRating}
                        setRating={setNewRating}
                        interactive={true}
                        size="lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="font-medium mb-2 block">
                        Nhận xét:
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setNewComment(e.target.value)
                        }
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        className="border border-gray-300 rounded-xl p-4 w-full h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <button
                      onClick={handleReviewSubmit}
                      className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 font-semibold text-lg transition-all hover:shadow-lg"
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6">
                    Tất cả đánh giá ({comments.length})
                  </h3>
                  <div className="space-y-4">
                    {comments.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                            {c.user.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-lg">{c.user}</p>
                              {c.date && (
                                <span className="text-sm text-gray-500">
                                  {c.date}
                                </span>
                              )}
                            </div>
                            <StarRating rating={c.rating} size="sm" />
                            <p className="text-gray-700 mt-3 leading-relaxed">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 mt-8">
          <h2 className="text-3xl font-bold mb-8">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden relative group transition-all duration-300 hover:shadow-xl hover:border-green-300"
              >
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <img
                    src={cachua}
                    alt={`Sản phẩm ${item}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-90 flex items-center justify-center transition-all duration-300">
                    <Link
                      to={"/chi-tiet"}
                      className="opacity-0 group-hover:opacity-100 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <Link
                    to={"/chi-tiet"}
                    className="hover:text-green-700 transition-colors"
                  >
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      Cà chua beef hữu cơ
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold text-lg">
                      40.000₫
                    </span>
                    <StarRating rating={4} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Chứng chỉ */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full relative transform transition-all"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h3 className="text-3xl font-bold mb-6 pr-10">
              {selectedCert.name}
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.name}
                className="w-full h-64 object-contain"
              />
            </div>
            <p className="text-gray-700 leading-relaxed">
              {selectedCert.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
