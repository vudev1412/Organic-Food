import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProductDetailById, getSubImgByProductId } from "../../service/api";

// Giả lập import logo chứng chỉ (Mock data)
import vietgapLogo from "../../../../upload/images/certs/vietgap.png";
import usdaLogo from "../../../../upload/images/certs/usda_organic.png";
import ProductImageGallery from "../../components/section/product-detail/ProductImageGallery";
import ProductInfo from "../../components/section/product-detail/ProductInfo";
import ProductTabs from "../../components/section/product-detail/ProductTabs";
import RelatedProducts from "../../components/common/RelatedProducts";
import CertificationModal from "../../components/section/product-detail/CertificationModal";

// Dữ liệu cho chứng chỉ (Mock data)
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

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const productId = location.state?.productId;

  // State quản lý dữ liệu
  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [selectedImage, setSelectedImage] = useState<string>("");

  // State cho tương tác UI
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCert, setSelectedCert] = useState<ICertification | null>(null);

  // State cho form review
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        setIsLoading(true);
        const baseUrl = "http://localhost:8080/storage/images/products/";
        try {
          const response = await getProductDetailById(productId);
          if (response.data.data) {
            const productData = response.data.data;
            setProduct(productData);

            const mainImageUrl = `${baseUrl}${productData.image}`;
            setSelectedImage(mainImageUrl);

            try {
              const imgRes = await getSubImgByProductId(productId);

              if (
                imgRes.data.data &&
                Array.isArray(imgRes.data.data) &&
                imgRes.data.data.length > 0
              ) {
                // Map mảng ảnh phụ
                const subImageUrls = imgRes.data.data.map(
                  (img: IProductImage) => `${baseUrl}${img.imgUrl}`
                );

                // Set gallery = ảnh chính + ảnh phụ
                setGalleryImages([mainImageUrl, ...subImageUrls]);
              } else {
                // Không có ảnh phụ, set gallery chỉ có ảnh chính
                setGalleryImages([mainImageUrl]);
              }
            } catch (imgError) {
              console.error("Lỗi khi tải ảnh phụ:", imgError);
              // Nếu lỗi, vẫn set gallery với ảnh chính
              setGalleryImages([mainImageUrl]);
            }

            // TODO: Fetch comment theo productId
            setComments(initialComments);
          }
        } catch (error) {
          console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("Không tìm thấy ID sản phẩm (Có thể do F5).");
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // --- Handlers ---
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

  // --- Loading / Error Guards ---
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

  // --- Render ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            <ProductImageGallery
              productName={product.name}
              selectedImage={selectedImage}
              images={galleryImages} // Dùng mock cho thumbnail
              onSelectImage={setSelectedImage}
            />

            <ProductInfo
              product={product}
              averageRating={averageRating}
              commentCount={comments.length}
              certifications={certifications}
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
