// File path: /src/components/section/home/image.slider.tsx

import Carousel from "react-bootstrap/Carousel";
import slider1 from "../../../assets/jpg/rev-slider_h4-1.jpg";
import slider2 from "../../../assets/jpg/rev-slider_h4-2.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageSlider = () => {
  return (
    <section className="">
      <Carousel
        interval={3000}
        className="[&_.carousel-indicators_button]:!bg-white [&_.carousel-indicators_button]:!opacity-100"
      >
        <Carousel.Item>
          <img
            className="d-block w-100 h-[500px] object-cover"
            src={slider1}
            alt="First slide"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 h-[500px] object-cover"
            src={slider2}
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
    </section>
  );
};

export default ImageSlider;
