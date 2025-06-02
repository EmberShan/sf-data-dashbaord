import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// MarginPieChart.jsx
// Displays a pie chart visualizing average margin, cost, and price for filtered shirt data.
const MarginPieChart = ({ avgPrice, avgCost, pieData, pieColors, height = 220 }) => (
  <div className="bg-[#F9FBFC] rounded-lg border border-[#DDE9F3] p-4 h-full flex flex-col">
    <div className="text-[#215273] font-semibold text-base">Average Margin</div>
    <div className="flex flex-row items-center flex-1">
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 'min(160px, 70%)', height: 'min(160px, 70%)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius="60%"
              outerRadius="80%"
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
              x="50%"
              y="51%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="28"
              fontWeight="600"
              fill="#215273"
            >
              {avgPrice && avgPrice > 0 ? `${Math.round(((avgPrice - avgCost) / avgPrice) * 100)}%` : '0%'}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col justify-center gap-1 flex-1">
        <div className="text-[#215273] text-sm">Total avg cost: ${avgCost.toFixed(1)}</div>
        <div className="text-[#215273] text-sm">Total avg price: ${avgPrice.toFixed(1)}</div>
      </div>
    </div>
  </div>
);

export default MarginPieChart; 