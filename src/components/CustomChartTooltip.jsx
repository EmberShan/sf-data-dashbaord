import React from 'react';

// CustomChartTooltip.jsx
// Tooltip component for main chart, showing group value, product images, and summary stats for the hovered group.

const yKeyLabels = {
  quantity: 'PO Quantities',
  cost: 'Cost',
  margin: 'Margin',
  price: 'Price',
};

const CustomChartTooltip = ({ active, payload, label, yKey = 'quantity' }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { avgPrice, avgCost, products, quantity, cost, margin, price } = payload[0].payload;
    const topProducts = Array.isArray(products) ? products.slice(0, 3) : [];
    let value = payload[0].payload[yKey];
    let valueLabel = yKeyLabels[yKey] || yKey;
    let valueDisplay = value;
    if (yKey === 'cost' || yKey === 'price') valueDisplay = `$${Number(value).toFixed(2)}`;
    if (yKey === 'margin') valueDisplay = `${Number(value).toFixed(1)}%`;
    return (
      <div className="bg-white p-4 rounded shadow border border-light-border min-w-[220px]">
        <div className="text-text-color mb-1 font-semibold">{label}</div>
        <div className="text-text-color text-base mb-2">
          {valueLabel}: {valueDisplay}
        </div>
        <div className="text-xs mb-2 text-text-color border-t border-light-border pt-2">Click to view products in detail</div>
        <div className="flex gap-2">
          {topProducts.map((prod, idx) => (
            <img
              key={prod.product_id || idx}
              src={prod.image_url ? prod.image_url.replace('public/', '/') : ''}
              alt={prod.name || ''}
              className="w-16 h-16 object-cover rounded border border-light-border"
              style={{ background: '#F9FBFC' }}
            />
          ))}
        </div>
        {yKey === 'quantity' && quantity !== undefined && (
          <div className="text-text-color text-sm font-semibold mt-4">Total Sold: {quantity}</div>
        )}
        {avgPrice !== undefined && (
          <div className="text-text-color text-sm font-semibold">Avg Price: ${Number(avgPrice).toFixed(2)}</div>
        )}
        {avgCost !== undefined && (
          <div className="text-text-color text-sm font-semibold">Avg Cost: ${Number(avgCost).toFixed(2)}</div>
        )}
      </div>
    );
  }
  return null;
};

export default CustomChartTooltip; 