import React from 'react';

const CustomChartTooltip = ({ active, payload, label, yKey = 'quantity' }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { avgPrice, avgCost, products, quantity } = payload[0].payload;
    const topProducts = products.slice(0, 3);
    return (
      <div className="bg-white p-4 rounded shadow border border-[#DDE9F3] min-w-[220px]">
        <div className="text-[#215273] mb-1 font-semibold">{label}</div>

        <div className="text-xs mb-2 text-[#215273]">Click to view products in detail</div>
        <div className="flex gap-2 mb-1">
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