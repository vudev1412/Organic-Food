// File path: /src/components/section/home/about.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import image from "../../../assets/jpg/image1-h4.jpg";
import {
  faCartPlus,
  faBagShopping,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
const AboutHomePage = () => {
  return (
    <section className="p-10 ">
      <div className="flex">
        <div className="w-1/2">
          <img src={image} alt="" />
        </div>
        <div className="w-1/2 flex items-center">
          <div className="">
            <h1 style={{ color: "#0a472e" }}>
              Cửa hàng tốt cho sức khỏe của mọi người
            </h1>
            <p>
              Mua các sản phẩm tự nhiên, bền vững và không hóa chất từ ​​các nhà
              cung cấp địa phương trên khắp cả nước. Chúng tôi là một cộng đồng
              vững mạnh với hơn 100.000 khách hàng và hơn 600 người bán hàng,
              những người luôn khao khát trở thành người tốt, làm điều tốt và
              lan tỏa những điều tốt đẹp. Chúng tôi là một thị trường dân chủ,
              tự chủ, hai chiều, phát triển mạnh mẽ dựa trên niềm tin và được
              xây dựng dựa trên cộng đồng và nội dung chất lượng.
            </p>
          </div>
        </div>
      </div>
      <div className=" mt-[30px] relative">
        <div className="flex justify-between">
          <div className="px-20 w-1/3">
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: 30 }} />
            </div>
            <div className="mt-[20px] text-center">
              <h5 style={{ color: "#0a472e" }}>Chọn gói sản phẩm ban đầu</h5>
              <span>Giữ, thêm hoặc bớt sản phẩm theo ý bạn.</span>
            </div>
          </div>
          <div className="px-20 w-1/3">
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faBagShopping} style={{ fontSize: 30 }} />
            </div>

            <div className="mt-[20px] text-center">
              <h5 style={{ color: "#0a472e" }}>Mua sắm thực phẩm</h5>
              <span>
                Thêm vào các nhu yếu phẩm, những món quen thuộc trong căn bếp
                của bạn mỗi tuần.
              </span>
            </div>
          </div>
          <div className="px-20 w-1/3">
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faTruckFast} style={{ fontSize: 30 }} />
            </div>
            <div className="mt-[20px] text-center">
              <h5 style={{ color: "#0a472e" }}>
                Giao tận nơi – tận hưởng trọn vẹn.
              </h5>
              <span>
                Tiết kiệm thời gian đi chợ và thưởng thức những bữa ăn ngon.
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -top-[70px] right-[400px]">
          <svg
            width="200"
            height="100"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 80 C80 10, 120 10, 190 80"
              stroke="#B7C34D"
              strokeWidth="2"
              strokeDasharray="6,6"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="#B7C34D" />
              </marker>
            </defs>
          </svg>
        </div>
        <div className="top-[20px] absolute left-[370px]">
          <svg
            width="200"
            height="100"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20 C80 90, 120 90, 190 20"
              stroke="#B7C34D"
              strokeWidth="2"
              strokeDasharray="6,6"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="#B7C34D" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AboutHomePage;
