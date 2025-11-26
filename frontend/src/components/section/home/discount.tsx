// File path: /src/components/section/home/discount.tsx

import banner1 from "../../../assets/jpg/h7_banner-1.jpg";
import banner2 from "../../../assets/jpg/h7_banner-2.jpg";
const BannerDiscount = () => {
  return (
    <section className="mt-[50px]">
      <div className="discount flex">
        <div className="">
          <img src={banner1} alt="" />
        </div>
        <div className="">
          <img src={banner2} alt="" />
        </div>
      </div>
    </section>
  );
};

export default BannerDiscount;
