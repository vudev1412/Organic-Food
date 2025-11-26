// File path: /src/pages/client/home.tsx

import AboutHomePage from "../../components/section/home/about";
import BestSellerProduct from "../../components/section/home/best.seller.product";
import BannerDiscount from "../../components/section/home/discount";
import ImageSlider from "../../components/section/home/image.slider";
import LineHome from "../../components/section/home/line";
import NewProduct from "../../components/section/home/new.product";

const HomePage = () => {
  return (
    <div className="">
      <ImageSlider />
      <AboutHomePage />
      <NewProduct />
      <BestSellerProduct />
      <BannerDiscount />
      <LineHome />
    </div>
  );
};

export default HomePage;
