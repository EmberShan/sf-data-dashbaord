import React from "react";

const cardStyle = {
  width: 190,
  border: "1px solid #CACCCF",
  borderRadius: 8,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  background: "#fff",
  padding: 12,
  margin: 12,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
};

const imageStyle = {
  width: 180,
  height: 180,
  background: "#ddd",
  borderRadius: 4,
  marginBottom: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const avatarStyle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#6C7A89",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  fontSize: 18,
};

const nameStyle = {
  fontWeight: 600,
  fontSize: 16,
};

const subtitleStyle = {
  fontSize: 13,
};

const menuStyle = {
  position: "absolute",
  right: 12,
  color: "#888",
  cursor: "pointer",
};

export default function ProductCard({ product, season, productLine }) {
  return (
    <div style={cardStyle}>
      <div style={imageStyle}>
        <img
          src={product.image_url}
          alt={`${product.name} in ${product.color.join(' and ')}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          {/* <div style={avatarStyle}>
            {product.color[0][0]}
          </div> */}
          <div>
            <div className="text-text" style={nameStyle}>{product.name}</div>
            <div className="text-caption" style={subtitleStyle}>{productLine}</div>
            <div className="text-caption" style={subtitleStyle}>{season}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
