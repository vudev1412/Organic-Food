// File path: /src/pages/client/product-detail.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getBestPromotionByProductId,
  getProductDetailById,
  getSubImgByProductId,
  getProductCertificateByIdProduct,
  getReviewsByProductIdAPI,
  createReviewAPI,
  updateReviewAPI,
  deleteReviewAPI,
} from "../../service/api";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ProductImageGallery from "../../components/section/product-detail/ProductImageGallery";
import ProductInfo from "../../components/section/product-detail/ProductInfo";
import ProductTabs from "../../components/section/product-detail/ProductTabs";
import RelatedProducts from "../../components/common/RelatedProducts";
import CertificationModal from "../../components/section/product-detail/CertificationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentApp } from "../../components/context/app.context";

const PRODUCT_IMAGE_BASE_URL = "http://localhost:8080/storage/images/products/";
const CERT_IMAGE_BASE_URL = "http://localhost:8080/storage/images/certs/";

interface IProductCertificateDetail {
  certificateId: number;
  name: string;
  typeImageUrl: string;
  certNo: string;
  date: string;
  specificImageUrl: string;
}

const ProductDetail: React.FC = () => {
  const { user, showToast } = useCurrentApp();
  const REVIEW_PAGE_SIZE = 1;
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id ? parseInt(id) : (location.state?.productId as number);

  // State Product
  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [bestPromotion, setBestPromotion] = useState<IBestPromotion | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [certifications, setCertifications] = useState<ICertification[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCert, setSelectedCert] = useState<ICertification | null>(null);

  // State Review & Pagination
  const [reviews, setReviews] = useState<IResReviewDTO[]>([]);
  const [reviewMeta, setReviewMeta] = useState({
    page: 1,
    size: 1,
    pages: 0,
    total: 0,
  });
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // State form review
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);

  // State kiểm tra user đã review chưa
  const [userReview, setUserReview] = useState<IResReviewDTO | null>(null);

  // === FIX: Hàm fetch reviews với xử lý đúng cấu trúc dữ liệu ===
  const fetchReviews = useCallback(
    async (pId: number, page: number) => {
      try {
        setIsReviewLoading(true);
        console.log("Fetching reviews for product:", pId, "page:", page);

        // API Spring trả về page index từ 0, nhưng UI dùng từ 1
        const res = await getReviewsByProductIdAPI(pId, page, REVIEW_PAGE_SIZE);

        console.log("Raw API Response:", res);
        console.log("Response data:", res.data);

        // FIX: Kiểm tra cấu trúc response đúng
        // API trả về: { data: { meta: {...}, result: [...] } }
        if (res.data && res.data.data) {
          const apiData = res.data.data;
          const totalReviews = apiData.meta?.total || 0;
          const calculatedPages = Math.ceil(totalReviews / REVIEW_PAGE_SIZE);
          console.log("API Data:", apiData);
          console.log("Result array:", apiData.result);
          console.log("Meta:", apiData.meta);

          // Set reviews từ result array
          setReviews(apiData.result || []);

          // Kiểm tra xem user hiện tại đã review chưa
          if (user && apiData.result) {
            const existingReview = apiData.result.find(
              (review: IResReviewDTO) => review.userId === user.id
            );
            setUserReview(existingReview || null);
            console.log("User existing review:", existingReview);
          } else {
            setUserReview(null);
          }

          // Set metadata
          setReviewMeta({
            page: page,

            size: REVIEW_PAGE_SIZE,
            pages: calculatedPages || apiData.meta?.pages || 0,
            total: totalReviews,
          });

          console.log("Reviews loaded:", apiData.result?.length || 0);
        } else {
          console.warn("Unexpected response structure:", res);
          setReviews([]);
          setUserReview(null);
          setReviewMeta({ page: 1, size: 5, pages: 0, total: 0 });
        }
      } catch (error: any) {
        console.error("Error fetching reviews:", error);
        console.error("Error response:", error.response?.data);

        // Reset về trạng thái empty
        setReviews([]);
        setUserReview(null);
        setReviewMeta({ page: 1, size: 5, pages: 0, total: 0 });

        // Không show toast cho lỗi fetch để tránh spam
        // showToast('Lỗi tải đánh giá', 'error');
      } finally {
        setIsReviewLoading(false);
      }
    },
    [user]
  );

  // Effect chính (Load Product)
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      // Gọi Fetch Reviews ngay lập tức
      fetchReviews(productId, 1);

      const fetchMainData = async () => {
        let productData: IProductDetail | null = null;
        let mainImageUrl = "";
        let bestPromotionData: IBestPromotion | null = null;
        let certificationsData: ICertification[] = [];
        let allRequests = [];

        allRequests.push(
          getProductDetailById(productId).then((response) => {
            if (response.data.data) {
              productData = response.data.data;
              mainImageUrl = `${PRODUCT_IMAGE_BASE_URL}${productData.image}`;
              return response.data.data;
            }
            return null;
          })
        );

        allRequests.push(getSubImgByProductId(productId));

        allRequests.push(
          getBestPromotionByProductId(productId).then((response) => {
            if (response.data.data) bestPromotionData = response.data.data;
            return response;
          })
        );

        allRequests.push(
          getProductCertificateByIdProduct(productId)
            .then((response) => {
              if (response.data.data && Array.isArray(response.data.data)) {
                certificationsData = response.data.data.map(
                  (cert: IProductCertificateDetail) => ({
                    id: cert.certificateId,
                    name: cert.name,
                    logo: `${CERT_IMAGE_BASE_URL}${cert.typeImageUrl}`,
                    imageUrl: `${CERT_IMAGE_BASE_URL}${cert.specificImageUrl}`,
                    description: `Chứng nhận số: ${cert.certNo}.`,
                  })
                );
                return { data: certificationsData };
              }
              return { data: [] };
            })
            .catch(() => ({ data: [] }))
        );

        try {
          const [resProd, resSub, resPromo, resCerts] =
            await Promise.allSettled(allRequests);

          if (productData) {
            setProduct(productData);
            setSelectedImage(mainImageUrl);
          }
          if (
            resCerts.status === "fulfilled" &&
            Array.isArray(resCerts.value.data)
          ) {
            setCertifications(resCerts.value.data);
          }
          if (bestPromotionData) setBestPromotion(bestPromotionData);

          if (resSub.status === "fulfilled" && productData) {
            const imgRes = resSub.value as any;
            let subImageUrls: string[] = [];
            if (imgRes.data.data && Array.isArray(imgRes.data.data)) {
              subImageUrls = imgRes.data.data.map(
                (img: any) => `${PRODUCT_IMAGE_BASE_URL}${img.imgUrl}`
              );
            }
            setGalleryImages([mainImageUrl, ...subImageUrls]);
          } else {
            setGalleryImages(mainImageUrl ? [mainImageUrl] : []);
          }
        } catch (error) {
          console.error("Error loading product detail", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMainData();
    };

    fetchProductData();
  }, [productId, fetchReviews]);

  // === HANDLERS REVIEW ===

  // 1. Tạo Review
  const handleReviewSubmit = async () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để đánh giá", "warning");
      return;
    }

    // Kiểm tra đã review chưa
    if (userReview) {
      showToast(
        "Bạn đã đánh giá sản phẩm này rồi. Vui lòng chỉnh sửa đánh giá hiện tại của bạn.",
        "warning"
      );
      return;
    }

    if (!newComment.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá", "warning");
      return;
    }

    try {
      setIsReviewLoading(true);

      console.log("Creating review with data:", {
        productId,
        userId: user.id,
        rating: newRating,
        comment: newComment,
      });

      const response = await createReviewAPI({
        productId: productId,
        userId: user.id,
        rating: newRating,
        comment: newComment,
      });

      console.log("Create review response:", response);

      showToast("Đánh giá thành công!", "success");
      setNewComment("");
      setNewRating(5);
      // Refresh lại list review về trang 1
      await fetchReviews(productId, 1);

      // ⭐ THÊM DÒNG NÀY - Refresh rating_avg của product
      await refreshProductRating();
      // Refresh lại list review về trang 1
      await fetchReviews(productId, 1);
    } catch (error: any) {
      console.error("Error creating review:", error);

      // Xử lý lỗi đã đánh giá từ backend
      if (error.response?.data?.message?.includes("đã đánh giá")) {
        showToast("Bạn đã đánh giá sản phẩm này rồi.", "warning");
        // Refresh để cập nhật lại userReview state
        await fetchReviews(productId, 1);
      } else {
        const msg = error.response?.data?.message || "Lỗi khi gửi đánh giá";
        showToast(msg, "error");
      }
    } finally {
      setIsReviewLoading(false);
    }
  };

  // 2. Xóa Review
  const handleDeleteReview = async (reviewId: number) => {
    try {
      console.log("Deleting review:", reviewId);

      await deleteReviewAPI(reviewId);
      showToast("Đã xóa đánh giá", "success");

      // Refresh lại trang hiện tại
      await fetchReviews(productId, reviewMeta.page);
      await refreshProductRating();
    } catch (error: any) {
      console.error("Error deleting review:", error);
      const msg = error.response?.data?.message || "Không thể xóa đánh giá này";
      showToast(msg, "error");
    }
  };

  // 3. Sửa Review
  const handleUpdateReview = async (
    reviewId: number,
    data: IUpdateReviewDTO
  ) => {
    try {
      console.log("Updating review:", reviewId, "with data:", data);

      await updateReviewAPI(reviewId, data);
      showToast("Cập nhật đánh giá thành công", "success");

      // Refresh lại trang hiện tại
      await fetchReviews(productId, reviewMeta.page);
      await refreshProductRating();
    } catch (error: any) {
      console.error("Error updating review:", error);
      const msg = error.response?.data?.message || "Lỗi cập nhật đánh giá";
      showToast(msg, "error");
    }
  };
  const refreshProductRating = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await getProductDetailById(productId);
      if (response.data.data) {
        const newRating = response.data.data.rating_avg;

        // Chỉ cập nhật rating_avg, không load lại toàn bộ product
        setProduct((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            rating_avg: newRating,
          };
        });

        console.log("✅ Refreshed product rating:", newRating);
      }
    } catch (error) {
      console.error("Error refreshing product rating:", error);
    }
  }, [productId, product]);
  // 4. Chuyển trang
  const handlePageChange = (newPage: number) => {
    console.log("Changing to page:", newPage);
    fetchReviews(productId, newPage);
  };

  // Logic UI
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };
  const handleQuantityChange = (newQty: number) => setQuantity(newQty);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Đang tải...</div>
      </div>
    );

  if (!product)
    return <div className="text-center mt-10">Không tìm thấy sản phẩm</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-4 lg:py-12">
        <button
          onClick={() => navigate(-1)}
          className="group mb-3 flex items-center gap-2 text-gray-600 hover:text-green-700 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </div>
          <span className="text-2xl font-bold">Quay lại danh sách</span>
        </button>

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
              averageRating={product.rating_avg || 0}
              commentCount={reviewMeta.total}
              certifications={certifications}
              bestPromotion={bestPromotion}
              onCertClick={setSelectedCert}
              quantity={quantity}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              onQuantityChange={handleQuantityChange}
            />
          </div>
        </div>

        <ProductTabs
          product={product}
          reviews={reviews}
          totalReviews={reviewMeta.total}
          averageRating={product.rating_avg || 0}
          newComment={newComment}
          setNewComment={setNewComment}
          newRating={newRating}
          setNewRating={setNewRating}
          onReviewSubmit={handleReviewSubmit}
          currentPage={reviewMeta.page}
          totalPages={reviewMeta.pages}
          onPageChange={handlePageChange}
          onUpdateReview={handleUpdateReview}
          onDeleteReview={handleDeleteReview}
          isReviewLoading={isReviewLoading}
          userReview={userReview}
        />

        <RelatedProducts />
      </div>

      <CertificationModal
        certification={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};

export default ProductDetail;
