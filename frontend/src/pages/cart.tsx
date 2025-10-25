import { CloseOutlined } from "@ant-design/icons";
import cachua from "../assets/jpg/ca-chua-beef-huu-co.jpg";
const Cart = () => {
  return (
    <div className="mb-[40px]">
      <div className="mx-[200px] my-[40px]">
        <h1>Giỏ hàng</h1>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-5 font-semibold text-lg pb-4 mb-6">
            <div></div>
            <div>Sản phẩm</div>
            <div>Giá</div>
            <div>Số lượng</div>
            <div>Tạm tính</div>
          </div>

          <div className="grid grid-cols-5 items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-red-500">
                <CloseOutlined />
              </button>
              <img
                src={cachua}
                alt="Cà chua"
                className="w-16 h-20 object-cover rounded"
              />
            </div>

            <div className="">
              <a href="#" className="text-sky-500 font-medium hover:underline">
                SEO Marketing
              </a>
            </div>

            <div className="text-gray-700">50.000 đ</div>

            <div>
              <input
                type="number"
                defaultValue="1"
                className="w-16 text-center border rounded-full py-1 bg-blue-50 focus:outline-none focus:ring focus:ring-sky-300"
              />
            </div>

            <div className="text-gray-700">50.000 đ</div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className=" border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-sky-300"
              />
              <button className="bg-[#4CAF50] hover:bg-[#3A5B22] text-white px-8 py-2 !rounded-full shadow-lg">
                Áp dụng
              </button>
            </div>

            <div className="flex justify-end  mb-6">
              <button className="bg-[#4CAF50] hover:bg-[#3A5B22] text-white px-4 !py-2 !rounded-full shadow-lg">
                Cập nhật giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end px-[185px]">
        <div className="max-w-[960px] p-8 mt-8 ">
          <h2 className="text-2xl font-bold mb-6">Tổng cộng giỏ hàng</h2>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700">Tạm tính</span>
            <span className="text-red-500 font-semibold">1.050.000 đ</span>
          </div>

          <div className=" py-3">
            <span className="text-gray-700 block mb-2">Vận chuyển</span>
            <p className="text-sm text-gray-600">Free shipping</p>
            <p className="text-sm text-gray-600">
              Các tùy chọn vận chuyển sẽ được cập nhật trong quá trình thanh
              toán.
            </p>
            <a href="#" className="text-sky-500 text-sm hover:underline">
              Tính phí vận chuyển
            </a>
          </div>

          <div className="flex justify-between items-center  py-3">
            <span className="text-lg font-semibold">Tổng</span>
            <span className="text-red-500 font-bold text-lg">1.050.000 đ</span>
          </div>

          <div className="mt-6">
            <button className="w-full bg-[#4CAF50] text-white font-semibold py-3 !rounded-full shadow-lg hover:opacity-90 transition">
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
