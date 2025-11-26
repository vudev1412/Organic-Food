// File path: /src/components/section/product-detail/ProductTabs.tsx

import React, { useState } from "react";
import ProductDescription from "./ProductDescription";
import StarRating from "./StarRating";
import ProductSubInfo from "./ProductSubInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useCurrentApp } from "../../context/app.context";

type TabName = "desc" | "info" | "reviews";

interface ProductTabsProps {
  product: IProductDetail;
  reviews: IResReviewDTO[];
  totalReviews: number;
  averageRating: number;

  newComment: string;
  setNewComment: (value: string) => void;
  newRating: number;
  setNewRating: (value: number) => void;
  onReviewSubmit: () => void;

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  onUpdateReview: (id: number, data: IUpdateReviewDTO) => void;
  onDeleteReview: (id: number) => void;

  isReviewLoading: boolean;
  userReview: IResReviewDTO | null;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  reviews,
  totalReviews,
  averageRating,
  newComment,
  setNewComment,
  newRating,
  setNewRating,
  onReviewSubmit,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateReview,
  onDeleteReview,
  isReviewLoading,
  userReview,
}) => {
  const { user } = useCurrentApp();
  const [activeTab, setActiveTab] = useState<TabName>("desc");

  // State quản lý việc sửa review
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Ref để scroll đến review của user
  const userReviewRef = React.useRef<HTMLDivElement>(null);

  const startEdit = (review: IResReviewDTO) => {
    setEditingId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditComment("");
    setEditRating(5);
  };

  const handleSaveEdit = (id: number) => {
    if (!editComment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }
    onUpdateReview(id, { comment: editComment, rating: editRating });
    setEditingId(null);
  };

  // Scroll đến review của user khi có userReview và tab reviews được mở
  React.useEffect(() => {
    if (activeTab === "reviews" && userReview && userReviewRef.current) {
      setTimeout(() => {
        userReviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [activeTab, userReview]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "desc":
        return <ProductDescription content={product.description} />;

      case "info":
        return <ProductSubInfo product={product} />;

      case "reviews":
        return (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 flex flex-col items-center justify-center border border-green-200">
                <div className="text-5xl font-bold text-green-700 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={averageRating} size="lg" />
                <p className="text-gray-600 mt-2 text-sm text-center">
                  {totalReviews} đánh giá
                </p>
              </div>

              {/* Write Review Form */}
              <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">
                  Viết đánh giá của bạn
                </h3>
                {!user ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 py-4">
                    <p className="text-base">
                      Vui lòng đăng nhập để viết đánh giá.
                    </p>
                  </div>
                ) : userReview ? (
                  <div className="flex flex-col items-center justify-center h-full py-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center w-full max-w-md">
                      <div className="text-2xl mb-2">✓</div>
                      <p className="text-blue-800 font-semibold text-sm mb-1">
                        Bạn đã đánh giá sản phẩm này
                      </p>
                      <p className="text-blue-600 text-xs mb-3">
                        Bạn có thể chỉnh sửa hoặc xóa đánh giá của mình bên dưới
                      </p>
                      <div className="flex items-center justify-center gap-2 text-yellow-600">
                        <StarRating rating={userReview.rating} size="sm" />
                        <span className="font-semibold text-sm">
                          ({userReview.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="font-medium mb-1 block text-sm">
                        Xếp hạng của bạn:
                      </label>
                      <StarRating
                        rating={newRating}
                        setRating={setNewRating}
                        interactive={true}
                        size="md"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="font-medium mb-1 block text-sm">
                        Nhận xét:
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="border border-gray-300 rounded-lg p-3 w-full h-20 text-sm focus:ring-1 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>

                    <button
                      onClick={onReviewSubmit}
                      disabled={isReviewLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-semibold transition-all hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isReviewLoading ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Reviews List (Compact Design) */}
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Tất cả đánh giá ({totalReviews})
              </h3>

              {isReviewLoading && reviews.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  <p>Đang tải đánh giá...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 italic text-base">
                    Chưa có đánh giá nào.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Hãy là người đầu tiên đánh giá sản phẩm này!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => {
                    const isEditing = editingId === review.id;
                    const isOwner = user?.id === review.userId;
                    const isUserReview = userReview?.id === review.id;

                    return (
                      <div
                        key={review.id}
                        ref={isUserReview ? userReviewRef : null}
                        className={`p-4 rounded-lg border transition-all ${
                          isEditing
                            ? "border-green-500 ring-1 ring-green-500 bg-white"
                            : isUserReview
                            ? "border-green-300 bg-green-50/50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar Compact */}
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            {review.userAvatar ? (
                              <img
                                src={review.userAvatar}
                                alt={review.userName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm">
                                {review.userName
                                  ? review.userName.charAt(0).toUpperCase()
                                  : "A"}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Header: Name + Date Compact */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {review.userName || "Người dùng"}
                                </p>
                                {isOwner && (
                                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-medium">
                                    Bạn
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 mt-0.5 sm:mt-0">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>

                            {/* Action Buttons for Owner */}
                            {isOwner && !isEditing && (
                              <div className="flex gap-1 justify-end sm:justify-start mb-1 opacity-80 hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEdit(review)}
                                  className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded text-xs"
                                  title="Sửa"
                                >
                                  <FontAwesomeIcon icon={faEdit} /> Sửa
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Bạn có chắc chắn muốn xóa đánh giá này?"
                                      )
                                    ) {
                                      onDeleteReview(review.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded text-xs"
                                  title="Xóa"
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Xóa
                                </button>
                              </div>
                            )}

                            {/* Content View vs Edit */}
                            {isEditing ? (
                              <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                                <div className="mb-2">
                                  <StarRating
                                    rating={editRating}
                                    setRating={setEditRating}
                                    interactive={true}
                                    size="sm"
                                  />
                                </div>
                                <textarea
                                  className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none resize-none"
                                  value={editComment}
                                  onChange={(e) =>
                                    setEditComment(e.target.value)
                                  }
                                  rows={2}
                                  placeholder="Nhập nội dung đánh giá..."
                                />
                                <div className="flex gap-2 mt-2 justify-end text-xs">
                                  <button
                                    onClick={cancelEdit}
                                    className="px-3 py-1.5 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1 transition"
                                  >
                                    <FontAwesomeIcon icon={faTimes} /> Hủy
                                  </button>
                                  <button
                                    onClick={() => handleSaveEdit(review.id)}
                                    className="px-3 py-1.5 text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1 transition"
                                  >
                                    <FontAwesomeIcon icon={faSave} /> Lưu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-1">
                                <StarRating rating={review.rating} size="sm" />
                                <p className="text-gray-700 mt-1.5 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {review.comment}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination UI Compact */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-6">
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`h-8 w-8 flex items-center justify-center rounded border text-xs transition ${
                      currentPage === 1
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "bg-white hover:bg-green-50 text-gray-600"
                    }`}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`h-8 w-8 flex items-center justify-center rounded border text-xs font-semibold transition ${
                          currentPage === page
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-600 hover:bg-green-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`h-8 w-8 flex items-center justify-center rounded border text-xs transition ${
                      currentPage === totalPages
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "bg-white hover:bg-green-50 text-gray-600"
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getTabClassName = (tabName: TabName) =>
    `flex-1 py-4 px-4 font-semibold transition-colors text-base md:text-lg ${
      activeTab === tabName
        ? "bg-white text-green-600 border-b-2 border-green-600"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex bg-gray-50 border-b border-gray-200">
        <button
          className={getTabClassName("desc")}
          onClick={() => setActiveTab("desc")}
        >
          Mô tả sản phẩm
        </button>
        <button
          className={getTabClassName("info")}
          onClick={() => setActiveTab("info")}
        >
          Thông tin sản phẩm
        </button>
        <button
          className={getTabClassName("reviews")}
          onClick={() => setActiveTab("reviews")}
        >
          Đánh giá ({totalReviews})
        </button>
      </div>
      <div className="p-6 lg:p-10">{renderTabContent()}</div>
    </div>
  );
};

export default ProductTabs;