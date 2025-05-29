import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BuyerRankingChart = ({ buyerRanking }) => (
  <div className="bg-[#F9FBFC] rounded-lg border border-[#DDE9F3] p-4 flex-1 min-h-[180px] max-h-[221px] flex flex-col overflow-y-auto">
    <div className="text-[#215273] font-semibold text-base mb-2">PO quantities by companies</div>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={buyerRanking} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="#EAEAEA" horizontal={false} />
        <XAxis type="number" stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 12 }} hide />
        <YAxis dataKey="buyer" type="category" stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 12 }} width={90} />
        <Tooltip formatter={(v) => v} />
        <Bar dataKey="quantity" fill="#C4E7FF" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BuyerRankingChart; 