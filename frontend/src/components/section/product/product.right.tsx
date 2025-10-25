import { Select, Space } from "antd";
import cachua from "../../../assets/jpg/ca-chua-beef-huu-co.jpg";

const ProductRight = () => {
  return (
    <div className="">
      <div className="flex justify-end">
        <Space wrap>
          <Select
            defaultValue="Sắp xếp mặc định"
            style={{ width: 170 }}
            // onChange={handleChange}
            options={[
              { value: "new", label: "Mới nhất" },
              { value: "thap", label: "Giá thấp đến cao" },
              { value: "cao", label: "Giá cao đến thấp" },
            ]}
          />
        </Space>
      </div>
      <div className="flex flex-wrap gap-6 justify-center mt-[40px]">
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
        <div className="product w-[300px] shadow-md">
          <div className="image-box relative w-[300px] h-[300px] overflow-hidden">
            <img
              src={cachua}
              alt="Cà chua bee hữu cơ"
              className="w-full h-full object-cover"
            />
            <div className="add-to-cart absolute inset-0 flex items-center justify-center opacity-0">
              <span className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                Thêm vào giỏ hàng
              </span>
            </div>
          </div>

          <div className="text-center mt-2  p-4">
            <h6 className="font-medium">Cà chua bee hữu cơ</h6>
            <span className="text-red-500 font-semibold">40.000đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRight;
