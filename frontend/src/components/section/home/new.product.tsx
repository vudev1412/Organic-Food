import "./home.scss";
import cachua from "../../../assets/jpg/ca-chua-beef-huu-co.jpg";
import ProductCard from "../../common/product.card";
const NewProduct = () => {
  return (
    <section className="mt-[50px]">
      <div className="flex justify-center mb-3">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm mới về</h1>
      </div>
      <div className="flex flex-wrap gap-6 justify-center ">
        <ProductCard
          imageUrl={cachua}
          altText="Cà chua bee hữu cơ"
          name="Cà chua bee hữu cơ"
          price={85000}
          slug="ca-chua-bee-huu-co"
          discount={{ type: "percent", value: 20 }}
          onAddToCart={() => console.log("them vào giỏ Cà chua bee")}
        />
        <ProductCard
          imageUrl={cachua}
          altText="Cà chua bee hữu cơ"
          name="Cà chua bee hữu cơ"
          price={85000}
          slug="ca-chua-bee-huu-co" // Thêm slug
          discount={{ type: "percent", value: 20 }}
          onAddToCart={() => console.log("them vào giỏ Cà chua bee")}
        />
        <ProductCard
          imageUrl={cachua}
          altText="Cà chua bee hữu cơ"
          name="Cà chua bee hữu cơ"
          price={85000}
          slug="ca-chua-bee-huu-co" // Thêm slug
          discount={{ type: "percent", value: 20 }}
          onAddToCart={() => console.log("them vào giỏ Cà chua bee")}
        />
        <ProductCard
          imageUrl={cachua}
          altText="Cà chua bee hữu cơ"
          name="Cà chua bee hữu cơ"
          price={85000}
          slug="ca-chua-bee-huu-co" // Thêm slug
          discount={{ type: "percent", value: 20 }}
          onAddToCart={() => console.log("them vào giỏ Cà chua bee")}
        />
      </div>
    </section>
  );
};

export default NewProduct;
