import "./home.scss";
import cachua from "../../../assets/jpg/ca-chua-beef-huu-co.jpg";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
const OurProduct = () => {
  return (
    <section className="mt-[50px]">
      <div className="flex justify-center">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm của chúng tôi</h1>
      </div>
      <div className="flex justify-center gap-8">
        <div className="home-category">Tất cả</div>
        <div className="home-category">Rau củ</div>
        <div className="home-category">Trái cây</div>
      </div>
      <div className="flex flex-wrap gap-6 justify-center ">
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
      <div className=" flex justify-center mt-10">
        <span className="view-more">
          Xem thêm sản phẩm <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </div>
    </section>
  );
};

export default OurProduct;
