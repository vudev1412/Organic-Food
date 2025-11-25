import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getBestPromotionByProductId,
  getProductDetailById,
  getSubImgByProductId,
  // Thêm API mới
  getProductCertificateByIdProduct,
} from "../../service/api";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// XÓA: Bỏ các import ảnh chứng chỉ mock cứng (vietgapLogo, usdaLogo, euOrganicLogo)
import ProductImageGallery from "../../components/section/product-detail/ProductImageGallery";
import ProductInfo from "../../components/section/product-detail/ProductInfo";
import ProductTabs from "../../components/section/product-detail/ProductTabs";
import RelatedProducts from "../../components/common/RelatedProducts";
import CertificationModal from "../../components/section/product-detail/CertificationModal";
import type { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// --- START: Interface Mới Cho Dữ Liệu API ---
interface IProductCertificateDetail {
  certificateId: number;
  name: string;
  typeImageUrl: string;
  certNo: string;
  date: string;
  specificImageUrl: string;
}
// --- END: Interface Mới Cho Dữ Liệu API ---

// Dữ liệu bình luận (Mock data)
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

// CẬP NHẬT: Định nghĩa đường dẫn cơ sở cho ảnh sản phẩm và chứng chỉ
const PRODUCT_IMAGE_BASE_URL = "http://localhost:8080/storage/images/products/";
const CERT_IMAGE_BASE_URL = "http://localhost:8080/storage/images/certs/";

// XÓA: Loại bỏ hàm mapCertNameToLogoPath không cần thiết

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const productId = location.state?.productId;
  const navigate = useNavigate();
  // State quản lý dữ liệu
  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [bestPromotion, setBestPromotion] = useState<IBestPromotion | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string>("");

  // State cho chứng chỉ
  const [certifications, setCertifications] = useState<ICertification[]>([]);

  // State cho tương tác UI
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCert, setSelectedCert] = useState<ICertification | null>(null);

  // State cho form review
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        console.error("Không tìm thấy ID sản phẩm (Có thể do F5).");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Hàm con để lấy chi tiết sản phẩm và ảnh
      const fetchMainData = async () => {
        let productData: IProductDetail | null = null;
        let mainImageUrl = "";
        let bestPromotionData: IBestPromotion | null = null;
        let certificationsData: ICertification[] = [];
        let allRequests = [];

        // 1. Lấy chi tiết sản phẩm (CHỈ LƯU VÀO BIẾN CỤC BỘ)
        allRequests.push(
          getProductDetailById(productId).then((response) => {
            if (response.data.data) {
              productData = response.data.data;
              // ĐÃ XÓA: setProduct(productData); // Tránh re-render sớm
              mainImageUrl = `${PRODUCT_IMAGE_BASE_URL}${productData.image}`;
              // ĐÃ XÓA: setSelectedImage(mainImageUrl); // Tránh re-render sớm
              return response.data.data;
            }
            return null;
          })
        );

        // 2. Lấy ảnh phụ (Sub Images)
        allRequests.push(getSubImgByProductId(productId));

        // 3. Lấy khuyến mãi tốt nhất (CHỈ LƯU VÀO BIẾN CỤC BỘ)
        allRequests.push(
          getBestPromotionByProductId(productId).then((response) => {
            if (response.data.data) {
              bestPromotionData = response.data.data;
            }
            return response;
          })
        );

        // 4. Lấy chứng chỉ (CHỈ LƯU VÀO BIẾN CỤC BỘ VÀ TRẢ VỀ MAPPED DATA)
        allRequests.push(
          getProductCertificateByIdProduct(productId)
            .then((response) => {
              if (response.data.data && Array.isArray(response.data.data)) {
                // Map dữ liệu API sang interface ICertification
                certificationsData = response.data.data.map(
                  (cert: IProductCertificateDetail) => ({
                    id: cert.certificateId,
                    name: cert.name,
                    // CẬP NHẬT: Nối đường dẫn API trực tiếp
                    logo: `${CERT_IMAGE_BASE_URL}${cert.typeImageUrl}`,
                    imageUrl: `${CERT_IMAGE_BASE_URL}${cert.specificImageUrl}`,
                    description: `Chứng nhận số: ${
                      cert.certNo
                    }. Ngày cấp: ${new Date(cert.date).toLocaleDateString(
                      "vi-VN"
                    )}. Thông tin chi tiết về chứng nhận ${cert.name}.`,
                  })
                );
                return { data: certificationsData }; // Trả về object chứa data đã mapped
              }
              return { data: [] };
            })
            .catch((error: AxiosError) => {
              console.error("Lỗi khi tải chứng chỉ:", error);
              return { data: [] };
            })
        );

        try {
          // Chạy đồng thời các request và chờ kết quả
          const [
            responseProductDetail,
            responseSubImgs,
            responseBestPromotion,
            responseCerts,
          ] = await Promise.allSettled(allRequests);

          // *** START: SET ALL STATES CÙNG LÚC TẠI ĐÂY ***

          // 1. Set Product & Selected Image
          if (productData) {
            setProduct(productData);
            setSelectedImage(mainImageUrl);
          }

          // 2. Set Certifications
          if (
            responseCerts.status === "fulfilled" &&
            Array.isArray(responseCerts.value.data)
          ) {
            setCertifications(responseCerts.value.data);
          }

          // 3. Xử lý khuyến mãi
          if (bestPromotionData !== undefined) {
            setBestPromotion(bestPromotionData);
          } else if (responseBestPromotion.status === "rejected") {
            const axiosError = responseBestPromotion.reason as AxiosError;
            if (axiosError.response?.status === 404) {
              setBestPromotion(null);
            } else {
              console.error(
                "Lỗi khi tải khuyến mãi:",
                responseBestPromotion.reason
              );
              setBestPromotion(null);
            }
          }

          // 4. Xử lý ảnh phụ (Cần mainImageUrl đã có từ Promise 1)
          if (responseSubImgs.status === "fulfilled" && productData) {
            const imgRes = responseSubImgs.value as any;
            let subImageUrls: string[] = [];
            if (
              imgRes.data.data &&
              Array.isArray(imgRes.data.data) &&
              imgRes.data.data.length > 0
            ) {
              subImageUrls = imgRes.data.data.map(
                (img: IProductImage) => `${PRODUCT_IMAGE_BASE_URL}${img.imgUrl}`
              );
            }
            // Set gallery = ảnh chính + ảnh phụ
            setGalleryImages([mainImageUrl, ...subImageUrls]);
          } else if (productData) {
            console.error("Lỗi khi tải ảnh phụ:", responseSubImgs.reason);
            setGalleryImages([mainImageUrl]);
          } else {
            setGalleryImages([]);
          }

          // TODO: Fetch comment theo productId (Giữ mock tạm thời)
          setComments(initialComments);

          // *** END: SET ALL STATES CÙNG LÚC TẠI ĐÂY ***
        } catch (error) {
          console.error(
            "Lỗi khi tải chi tiết sản phẩm hoặc dữ liệu liên quan:",
            error
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchMainData();
    };

    fetchProductData();
  }, [productId]);

  // --- Handlers (Giữ nguyên) ---
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };
  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
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

  // --- Computed Values ---
  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
      : product?.rating_avg || 0;

  // --- Loading / Error Guards (Giữ nguyên) ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-2">
        <p className="text-2xl text-red-600">Không tìm thấy sản phẩm.</p>
        <p className="text-gray-600">
          (Nếu bạn vừa F5, hãy thử quay lại trang trước và bấm vào sản phẩm)
        </p>
      </div>
    );
  }

  // --- Render (Giữ nguyên) ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-4 lg:py-12">
        <button
          onClick={() => navigate(-1)}
          // Giữ lại layout flex và gap
          className="group mb-3 flex items-center gap-2 text-gray-600 hover:text-green-700 transition-all duration-200"
        >
          {/* Icon Container */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-green-50 transition-all">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </div>

          {/* Bọc chữ trong thẻ span và set size trực tiếp tại đây */}
          <span className="text-2xl font-bold">Quay lại danh sách</span>
        </button>
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            <ProductImageGallery
              productName={product.name}
              selectedImage={selectedImage}
              images={galleryImages}
              onSelectImage={setSelectedImage}
            />

            <ProductInfo
              product={product}
              averageRating={averageRating}
              commentCount={comments.length}
              certifications={certifications} // Sử dụng dữ liệu đã fetch từ API
              bestPromotion={bestPromotion}
              onCertClick={setSelectedCert}
              quantity={quantity}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              onQuantityChange={handleQuantityChange}
            />
          </div>
        </div>

        {/* Phần Tab */}
        <ProductTabs
          product={product}
          comments={comments}
          averageRating={averageRating}
          newComment={newComment}
          setNewComment={setNewComment}
          newRating={newRating}
          setNewRating={setNewRating}
          onReviewSubmit={handleReviewSubmit}
        />

        {/* Sản phẩm liên quan */}
        <RelatedProducts />
      </div>

      {/* Modal Chứng chỉ */}
      <CertificationModal
        certification={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};

export default ProductDetail;
