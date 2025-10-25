import Carousel from "react-bootstrap/Carousel";
import slider1 from "../../../assets/jpg/rev-slider_h4-1.jpg";
import slider2 from "../../../assets/jpg/rev-slider_h4-2.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageSlider = () => {
  return (
    <section className="">
      <Carousel
        data-bs-theme="dark"
        interval={3000}
        className="[&_.carousel-control-prev-icon]:filter [&_.carousel-control-prev-icon]:invert [&_.carousel-control-next-icon]:filter [&_.carousel-control-next-icon]:invert"
      >
        <Carousel.Item>
          <img
            className="d-block w-100 h-[500px] object-cover"
            src={slider1}
            alt="First slide"
          />
          {/* <Carousel.Caption>
            <h5 className="text-white text-xl font-bold drop-shadow-lg">
              First slide label
            </h5>
            <p className="text-white drop-shadow-lg">
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </p>
          </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 h-[500px] object-cover"
            src={slider2}
            alt="Second slide"
          />
          {/* <Carousel.Caption>
            <h5 className="text-white text-xl font-bold drop-shadow-lg">
              Second slide label
            </h5>
            <p className="text-white drop-shadow-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </Carousel.Caption> */}
        </Carousel.Item>
      </Carousel>
    </section>
  );
};

export default ImageSlider;
