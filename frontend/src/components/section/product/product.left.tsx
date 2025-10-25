const ProductLeft = () => {
  return (
    <div className="">
      <div className="flex items-center w-[400px] rounded-full border border-gray-300 overflow-hidden">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 px-4 py-2 outline-none text-gray-700"
        />
        <button className=" text-#ccc w-10 h-10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </button>
      </div>
      <div className="mt-[40px]">
        <h5>Danh mục</h5>
        <div className="">
          <div className="">Trái cây</div>
          <div className="">Rau củ</div>
        </div>
      </div>
      <div className="mt-[40px]">
        <h5>Giỏ hàng</h5>
        <span>Giỏ hàng đang trống</span>
      </div>
    </div>
  );
};

export default ProductLeft;
