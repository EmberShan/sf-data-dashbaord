import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const MarginPieChart = ({ avgPrice, avgCost, pieData, pieColors }) => (
  <div className="bg-[#F9FBFC] rounded-lg border border-[#DDE9F3] p-4 flex-1 min-h-[180px] max-h-[221px] flex flex-col">
    <div className="text-[#215273] font-semibold text-base mb-2">Average Margin</div>
    <div className="flex flex-row items-center h-full">
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 100, height: 100 }}>
        <PieChart width={100} height={100}>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius={32}
            outerRadius={48}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
          >
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={pieColors[idx]} />
            ))}
          </Pie>
          {/* Centered margin percentage label */}
          <text
            x={50}
            y={52}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fontWeight="600"
            fill="#215273"
          >
            {avgPrice && avgPrice > 0 ? `${Math.round(((avgPrice - avgCost) / avgPrice) * 100)}%` : '0%'}
          </text>
        </PieChart>
      </div>
      <div className="flex flex-col justify-center ml-6 gap-1 flex-1">
        <div className="text-[#215273] text-xs mt-2">Total avg cost: ${avgCost.toFixed(1)}</div>
        <div className="text-[#215273] text-xs">Total avg price: ${avgPrice.toFixed(1)}</div>
      </div>
    </div>
  </div>
);

export default MarginPieChart; 