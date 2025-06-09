import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// BuyerRankingChart.jsx
// Shows a vertical bar chart of PO quantities by buyer, based on filtered shirt data.

const CustomBuyerTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded border border-light-border bg-white" style={{ color: '#215273' }}>
        <div className="font-semibold">{label}</div>
        <div>PO Quantity: {payload[0].value}</div>
      </div>
    );
  }
  return null;
};

const BuyerRankingChart = ({ buyerRanking, height = 250 }) => (
  <div className="bg-white rounded-lg border border-light-border p-4 h-full flex flex-col">
    <div className="text-text-color font-semibold text-base mb-6">PO quantities by companies</div>
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buyerRanking} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="#EAEAEA" horizontal={false} />
          <XAxis type="number" stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 12 }} hide />
          <YAxis dataKey="buyer" type="category" stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 12 }} width={90} />
          <Tooltip content={<CustomBuyerTooltip />} />
          <Bar dataKey="quantity" fill="#C4E7FF" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BuyerRankingChart; 