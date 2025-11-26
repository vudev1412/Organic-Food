// File path: /src/components/section/product-detail/ProductImageGallery.tsx

import React from "react";

interface ProductImageGalleryProps {
  productName: string;
  selectedImage: string;
  images: string[]; // Danh sách ảnh (từ mock hoặc API)
  onSelectImage: (image: string) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  productName,
  selectedImage,
  images,
  onSelectImage,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-2xl bg-white group flex items-center justify-center">
        <img
          src={selectedImage}
          alt={productName}
          className="max-w-[70%] max-h-[90%] object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex justify-center gap-3 flex-wrap">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            onClick={() => onSelectImage(img)}
            className={`w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
              selectedImage === img
                ? "border-green-600 ring-2 ring-green-200 scale-105"
                : "border-gray-200 hover:border-green-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
