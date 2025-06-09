import React from "react";

// ProductCard.jsx
// Card component for displaying a single shirt product's image and details.

export default function ProductCard({ product, season, productLine }) {
  return (
    <div className="w-[190px] bg-white border border-light-border rounded-lg p-2 flex flex-col items-center relative">
      <div className="w-[180px] h-[180px] bg-[#ddd] rounded mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url}
          alt={`${product.name} in ${product.color.join(' and ')}`}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          {/* <div className="w-8 h-8 rounded-full bg-[#6C7A89] text-white flex items-center justify-center font-semibold text-lg">
            {product.color[0][0]}
          </div> */}
          <div>
            <div className="font-semibold text-base text-[#222]">{product.name}</div>
            <div className="text-xs text-[#6C7A89]">{productLine}</div>
            <div className="text-xs text-[#6C7A89]">{season}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
