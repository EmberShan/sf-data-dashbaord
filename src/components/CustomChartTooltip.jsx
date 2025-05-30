import React from 'react';

const yKeyLabels = {
  quantity: 'PO Quantities',
  cost: 'Cost',
  margin: 'Margin',
  price: 'Price',
};

const CustomChartTooltip = ({ active, payload, label, yKey = 'quantity' }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { avgPrice, avgCost, products, quantity, cost, margin, price } = payload[0].payload;
    const topProducts = products.slice(0, 3);
    let value = payload[0].payload[yKey];
    let valueLabel = yKeyLabels[yKey] || yKey;
    let valueDisplay = value;
    if (yKey === 'cost' || yKey === 'price') valueDisplay = `$${Number(value).toFixed(2)}`;
    if (yKey === 'margin') valueDisplay = `${Number(value).toFixed(1)}%`;
    return (
      <div className="bg-white p-4 rounded shadow border border-[#DDE9F3] min-w-[220px]">
        <div className="text-[#215273] mb-1 font-semibold">{label}</div>
        <div className="text-[#215273] text-base mb-2">
          {valueLabel}: {valueDisplay}
        </div>
        <div className="text-xs mb-2 text-[#215273] border-t border-[#DDE9F3] pt-2">Click to view products in detail</div>
        <div className="flex gap-2">
          {topProducts.map((prod, idx) => (
            <img
              key={prod.product_id}
              src={prod.image_url.replace('public/', '/')}
              alt={prod.name}
              className="w-16 h-16 object-cover rounded border border-[#DDE9F3]"
              style={{ background: '#F9FBFC' }}
            />
          ))}
        </div>
        {yKey === 'quantity' && (
          <div className="text-[#215273] text-sm font-semibold mt-4">Total Sold: {quantity}</div>
        )}
        <div className="text-[#215273] text-sm font-semibold">Avg Price: ${avgPrice.toFixed(2)}</div>
        <div className="text-[#215273] text-sm font-semibold">Avg Cost: ${avgCost.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

export default CustomChartTooltip; 