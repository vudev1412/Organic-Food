import { useState } from "react";
import cachua from "../assets/jpg/ca-chua-beef-huu-co.jpg";
import cachua1 from "../assets/jpg/cachua1.jpg";
import cachua2 from "../assets/jpg/cachua2.jpg";
import cachua3 from "../assets/jpg/cachua3.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ProductDetai = () => {
  const images = [cachua, cachua1, cachua2, cachua3];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };
  return (
    <>
      <div className="flex p-8 justify-center gap-6 ">
        <div className="flex flex-col items-center gap-4">
          {/* Main image */}
          <div className="relative w-[500px] h-[400px]">
            <img
              src={selectedImage}
              alt="Main"
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Thumbnails nằm dưới */}
          <div className="flex justify-center gap-3 flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-28 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                  selectedImage === img
                    ? "border-black scale-105"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="">
            <h6>Cà chua bee hữu cơ</h6>
          </div>
          <div className="">
            <span className="text-[red]">40.000đ</span>
          </div>
          <div className="">
            <h6>Mô tả sản phẩm:</h6>
            <p>
              Cà chua beef hướng hữu cơ là giống cà chua cao cấp khác hẳn cà
              chua thông thường ở điểm quả cà chua to, chắc, ít hạt, cơm dày. Cà
              chua beef cung cấp một lượng Vitamin A, C, K tuyệt vời. Những chất
              này có tác dụng giúp tăng cường thị lực, phòng bệnh quáng gà.
              Ngoài ra, cà chua beef hữu cơ còn là loại thực phẩm giúp kiểm soát
              lượng đường trong máu, có canxi hỗ trợ cho xương chắc khỏe. Cà
              chua là loại thực phẩm được sử dụng phổ biến trong mỗi bữa ăn cũng
              như trong làm đẹp của chị em phụ nữ. Tuy nhiên để đảm bảo an toàn
              thì chúng ta nên chọn cà chua beef hướng hữu cơ hoặc cà chua bi
              hướng hữu cơ. Thành phần dinh dưỡng của cà chua beef hướng hữu cơ:
              Cà chua beef là nguồn cung cấp vitamin A, C, K, Các chất
              carotenoid và bioflavonoid, chất xơ... Quy trình sản xuất cà chua
              beef hướng hữu cơ: Cà chua beef hướng hữu cơ được trồng bởi trang
              trại rau organicfood.vn theo phương pháp hữu cơ, đảm bảo không sử
              dụng thuốc trừ sâu, thuốc kích thích, phân bón hóa học hay bất kì
              chất độc hại nào.
            </p>
          </div>
          <div className="">
            <h6>Số lượng:</h6>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-28">
              <button
                onClick={handleDecrease}
                className="w-9 h-7 flex items-center justify-center text-xl border-r border-gray-300 hover:bg-gray-100"
              >
                -
              </button>

              <div className="w-10 text-center select-none">{quantity}</div>

              <button
                onClick={handleIncrease}
                className="w-9 h-7 flex items-center justify-center text-xl border-l border-gray-300 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex justify-center mt-10 w-[250px]">
              <span className="view-more !rounded-[10px] w-full text-center">
                Thêm vào giỏ hàng
              </span>
            </div>
            <div className=" flex justify-center mt-10 w-[250px]">
              <span className="view-more !rounded-[10px] w-full text-center">
                Thanh toán
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="mb-9">
          <h5>Sản phẩm liên quan</h5>
        </div>
        <div className="flex flex-wrap gap-6  ">
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
              <Link to={"/chi-tiet"}>
                <h6 className="font-medium">Cà chua bee hữu cơ</h6>
              </Link>
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
              <Link to={"/chi-tiet"}>
                <h6 className="font-medium">Cà chua bee hữu cơ</h6>
              </Link>
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
              <Link to={"/chi-tiet"}>
                <h6 className="font-medium">Cà chua bee hữu cơ</h6>
              </Link>
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
              <Link to={"/chi-tiet"}>
                <h6 className="font-medium">Cà chua bee hữu cơ</h6>
              </Link>
              <span className="text-red-500 font-semibold">40.000đ</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetai;
