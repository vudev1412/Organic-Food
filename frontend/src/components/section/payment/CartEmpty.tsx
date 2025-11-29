import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Giỏ hàng trống
        </h1>
        <p className="text-gray-600 mb-8">
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
        </p>
        <Link
          to="/san-pham"
          className="inline-flex items-center gap-2 !bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:!bg-green-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
