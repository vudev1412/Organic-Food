import AboutHomePage from "../components/section/home/about";
import BannerDiscount from "../components/section/home/discount";
import ImageSlider from "../components/section/home/image.slider";
import LineHome from "../components/section/home/line";
import OurProduct from "../components/section/home/our.product";

const HomePage = () => {
  return (
    <div className="">
      <ImageSlider />
      <AboutHomePage />
      <OurProduct />
      <BannerDiscount />
      <LineHome />
    </div>
  );
};

export default HomePage;
