import ProductLeft from "../../components/section/product/product.left";
import ProductRight from "../../components/section/product/product.right";


const ProductPage = () => {
  return (
    <div className="flex px-[40px] mt-[40px]">
      <div className="w-1/3">
        <ProductLeft />
      </div>
      <div className="w-2/3">
        <ProductRight />
      </div>
    </div>
  );
};

export default ProductPage;
