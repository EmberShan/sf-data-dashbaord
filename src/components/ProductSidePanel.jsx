import React from "react";

const COLUMN_MAP = {
  image_url: "Image",
  product_id: "Style Number",
  margin: "Margin",
  cost: "Cost",
  price: "Price",
  season: "Season",
  product_line: "Line",
  quantity_sold: "Quantities",
  name: "Name",
  color: "Color",
  fabric: "Fabric",
  type: "Type",
  buyer: "Buyer",
  date_added: "Date Added",
  available_sizes: "Sizes",
};

const COLUMN_ORDER = [
  "image_url",
  "product_id",
  "margin",
  "cost",
  "season",
  "product_line",
  "quantity_sold",
];

function getMargin(product) {
  if (product.price && product.cost) {
    return Math.round(((product.price - product.cost) / product.price) * 100);
  }
  return "";
}

function formatValue(key, value, product) {
  if (key === "image_url") {
    return (
      <img
        src={value.replace("public/", "/")}
        alt={product.name || product.product_id}
        className="w-14 h-14 object-contain mx-auto"
        style={{ background: "#F9FBFC", borderRadius: 6 }}
      />
    );
  }
  if (key === "margin") {
    return product.price && product.cost ? `${getMargin(product)}%` : "";
  }
  if (key === "cost" || key === "price") {
    return value ? `$${Number(value).toLocaleString()}` : "";
  }
  if (key === "quantity_sold") {
    return value ? Number(value).toLocaleString() : "";
  }
  if (key === "season") {
    return value
      ? value
          .replace("Spring", "SP")
          .replace("Summer", "SU")
          .replace("Fall", "FW")
          .replace("Winter", "FW")
          .replace("Holiday", "HOL")
      : "";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value;
}

const ProductSidePanel = ({ open, onClose, products, filterLabel }) => {
  if (!open) return null;
  if (!products || products.length === 0) {
    return (
      <aside className="fixed top-16 right-0 w-[40vw] h-[calc(100vh-4rem)] bg-white border-l border-[#E9EDEF] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E9EDEF]">
          <span className="text-[#215273] font-semibold text-lg">
            Product View
          </span>
        </div>
        <div className="p-6 text-[#A3B3BF]">No products found.</div>
      </aside>
    );
  }
  const first = products[0];
  const columns = COLUMN_ORDER.filter((key) => key in first);
  return (
    <aside className="fixed top-16 right-0 w-[40vw] h-[calc(100vh-4rem)] bg-white border-l border-[#E9EDEF] flex flex-col">
      <div className="flex flex-col justify-between w-full border-b border-[#E9EDEF] p-4">
        <div className="font-medium text-base">Product View</div>
        <div className="text-[#3398FF] font-medium text-base">
          {filterLabel}
        </div>
      </div>

      <div className="overflow-x-auto flex-1 p-6">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-[#F9FBFC]">
              {columns.map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-[#215273] font-semibold text-base text-left whitespace-nowrap border-b border-[#E9EDEF]"
                >
                  {COLUMN_MAP[key] || key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => (
              <tr
                key={prod.product_id || idx}
                className="bg-white hover:bg-[#F5F8FA]"
              >
                {columns.map((key) => (
                  <td
                    key={key}
                    className="px-4 py-2 text-[#215273] text-base border-b border-[#E9EDEF] align-middle whitespace-nowrap"
                  >
                    {formatValue(
                      key,
                      key === "margin" ? getMargin(prod) : prod[key],
                      prod
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
};

export default ProductSidePanel;
