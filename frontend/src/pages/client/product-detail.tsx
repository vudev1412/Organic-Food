
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStar as faStarSolid,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
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
  },
  {
    user: "Trần Thị B",
    rating: 4,
    content: "Giao hàng nhanh, chất lượng tốt, nhưng quả hơi nhỏ.",
  },
];

// Interface cho props của StarRating
interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

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
          className={`text-yellow-400 ${
            interactive ? "cursor-pointer" : ""
          }`}
          onClick={() => interactive && setRating && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const images: string[] = [cachua, cachua1, cachua2, cachua3];

  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [productRating, setProductRating] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<"info" | "desc">("info");

  const [comments, setComments] = useState<IComment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);

  const [selectedCert, setSelectedCert] = useState<ICertification | null>(
    null
  );

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleReviewSubmit = () => {
    if (newComment.trim()) {
      setComments([
        { user: "Bạn", rating: newRating, content: newComment }, // Thêm vào đầu mảng
        ...comments,
      ]);
      setNewComment("");
      setNewRating(5);
    }
  };

  // Tính toán rating trung bình (thêm .toFixed(1) để có 1 số thập phân)
  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
      : productRating;

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Cột trái: Hình ảnh sản phẩm */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full h-[450px] overflow-hidden">
              <img
                src={selectedImage}
                alt="Main"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                    selectedImage === img
                      ? "border-green-600 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cột phải: Thông tin sản phẩm */}
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold">Cà chua beef hữu cơ</h2>
            <div className="text-3xl font-semibold text-green-700">
              40.000đ
            </div>

            {/* Rating tổng */}
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} />
              <span className="ml-2 text-gray-500">
                {averageRating.toFixed(1)} / 5 (dựa trên {comments.length} đánh
                giá)
              </span>
            </div>

            {/* Chứng chỉ */}
            <div>
              <h3 className="font-semibold text-lg">Chứng nhận chất lượng</h3>
              <div className="flex gap-4 mt-2">
                {certifications.map((cert) => (
                  <img
                    key={cert.id}
                    src={cert.logo}
                    alt={cert.name}
                    className="w-16 h-16 object-contain cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedCert(cert)}
                  />
                ))}
              </div>
            </div>

            {/* Tabs Thông tin & Mô tả */}
            <div className="mt-4">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 font-semibold ${
                    activeTab === "info"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  Thông tin
                </button>
                <button
                  className={`py-2 px-4 font-semibold ${
                    activeTab === "desc"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("desc")}
                >
                  Mô tả
                </button>
              </div>
              <div className="py-4 text-gray-700">
                {activeTab === "info" ? (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Chứng chỉ: Hữu cơ OCOP 3 sao, VietGAP, USDA Organic</li>
                    <li>Nguồn gốc: Trang trại organicfood.vn</li>
                    <li>Ngày thu hoạch: 10/11/2025</li>
                    <li>Hạn sử dụng: 20/12/2025</li>
                  </ul>
                ) : (
                  <p className="text-sm">
                    Cà chua beef hữu cơ là giống cao cấp, quả to, chắc, ít hạt,
                    cơm dày, vị ngọt thanh và hương thơm đặc trưng...
                  </p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg mt-3">Số lượng:</h3>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-32 mt-2">
                <button
                  onClick={handleDecrease}
                  className="w-10 h-10 flex items-center justify-center text-2xl border-r border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <div className="w-12 text-center text-lg select-none">
                  {quantity}
                </div>
                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 flex items-center justify-center text-2xl border-l border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-green-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-colors">
                Thêm vào giỏ hàng
              </button>
              <button className="bg-orange-500 text-white py-3 px-8 rounded-lg text-lg hover:bg-orange-600 transition-colors">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-12" />

      {/* Related Products Section (Giữ nguyên) */}
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-semibold mb-8 text-center">
          Sản phẩm liên quan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white shadow-md rounded-xl overflow-hidden relative group transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={cachua}
                  alt={`Sản phẩm ${item}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold rounded-xl">
                  Thêm vào giỏ hàng
                </button>
              </div>
              <div className="p-4 text-center">
                <Link
                  to={"/chi-tiet"}
                  className="hover:text-green-700 transition-colors"
                >
                  <h6 className="font-medium mb-1">Cà chua bee hữu cơ</h6>
                </Link>
                <span className="text-green-600 font-semibold">40.000đ</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-12" />

      {/* --- CẬP NHẬT: Comments Section --- */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold mb-8">Đánh giá sản phẩm</h3>

          {/* Grid: Summary + Write Review Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Block 1: Rating Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-full">
              <h4 className="text-xl font-semibold mb-2">Đánh giá chung</h4>
              <div className="text-6xl font-bold text-green-600">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} />
              <p className="text-gray-500 mt-2">
                Dựa trên {comments.length} đánh giá
              </p>
            </div>

            {/* Block 2: Write Review Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold mb-4">
                Viết đánh giá của bạn
              </h4>
              <div className="mb-3">
                <label className="font-medium">Xếp hạng:</label>
                <StarRating
                  rating={newRating}
                  setRating={setNewRating}
                  interactive={true}
                />
              </div>
              <div className="mb-3">
                <label className="font-medium">Bình luận:</label>
                <textarea
                  value={newComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewComment(e.target.value)
                  }
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  className="border border-gray-300 rounded-md p-3 w-full h-28 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleReviewSubmit}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 mt-2 w-full font-semibold text-lg"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>

          {/* Block 3: Review List */}
          <div>
            <h4 className="text-2xl font-semibold mb-6">
              Tất cả đánh giá ({comments.length})
            </h4>
            <div className="space-y-6">
              {comments.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-lg shadow-md"
                >
                  <div className="flex items-start">
                    {/* Avatar with Initials */}
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                      {c.user.charAt(0).toUpperCase()}
                    </div>
                    {/* Review Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{c.user}</p>
                      <StarRating rating={c.rating} />
                      <p className="text-gray-700 mt-2">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* --- Hết Section --- */}


      {/* Modal Chứng chỉ (Giữ nguyên) */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full relative"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedCert.name}</h3>
            <img
              src={selectedCert.imageUrl}
              alt={selectedCert.name}
              className="w-full h-64 object-contain mb-4"
            />
            <p className="text-gray-700">{selectedCert.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;