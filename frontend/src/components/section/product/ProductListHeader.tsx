import React from "react";
import SortDropdown from "./SortDropdown";

interface ProductListHeaderProps {
  onSortChange: (sortOption: string) => void;
  tilte: string;
}

const ProductListHeader = ( 
  { onSortChange ,tilte}: ProductListHeaderProps,
  
) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h2 className="text-xl font-semibold text-gray-800">{tilte}</h2>
      <SortDropdown onSortChange={onSortChange} />
    </div>
  );
};

export default ProductListHeader;
