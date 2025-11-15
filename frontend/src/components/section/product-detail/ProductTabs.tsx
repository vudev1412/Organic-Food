import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { parseDescription } from "../../../components/common/parseDescription";
import StarRating from "./StarRating";

type TabName = "desc" | "info" | "reviews";

interface ProductTabsProps {
  product: IProductDetail;
  comments: IComment[];
  averageRating: number;
  newComment: string;
  setNewComment: (value: string) => void;
  newRating: number;
  setNewRating: (value: number) => void;
  onReviewSubmit: () => void;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  comments,
  averageRating,
  newComment,
  setNewComment,
  newRating,
  setNewRating,
  onReviewSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>("desc");

  const renderTabContent = () => {
    switch (activeTab) {
      case "desc":
        return (
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: parseDescription(product.description),
            }}
          />
        );
      case "info":
        return (
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1" />
              <span>
                <strong>Đơn vị:</strong> {product.unit}
              </span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1" />
              <span>
                <strong>Xuất xứ:</strong> {product.origin_address}
              </span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1" />
              <span>
                <strong>Ngày sản xuất:</strong>{" "}
                {new Date(product.mfgDate).toLocaleDateString("vi-VN")}
              </span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1" />
              <span>
                <strong>Hạn sử dụng:</strong>{" "}
                {new Date(product.expDate).toLocaleDateString("vi-VN")}
              </span>
            </li>
          </ul>
        );
      case "reviews":
        return (
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
                  <label className="font-medium mb-2 block">Nhận xét:</label>
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
                  onClick={onReviewSubmit}
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
      {/* Tab Headers */}
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
          Đánh giá ({comments.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-10">{renderTabContent()}</div>
    </div>
  );
};

export default ProductTabs;
