import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

const MainChart = ({ chartType, chartData, handleBarOrDotClick, activeTooltipIndex, setActiveTooltipIndex }) => (
  <div className="flex-1 min-w-0 bg-[#F9FBFC] rounded-lg border border-[#DDE9F3] p-4 mr-0 lg:mr-2 mb-4 lg:mb-0 flex flex-col justify-center" style={{ height: "450px" }}>
    <ResponsiveContainer width="100%" height="100%">
      {chartType === "bar" ? (
        <BarChart
          data={chartData}
          onMouseMove={state => setActiveTooltipIndex(state && state.activeTooltipIndex != null ? state.activeTooltipIndex : null)}
          onMouseLeave={() => setActiveTooltipIndex(null)}
          onClick={() => {
            if (activeTooltipIndex != null) handleBarOrDotClick(chartData[activeTooltipIndex]);
          }}
        >
          <CartesianGrid stroke="#EAEAEA" />
          <XAxis dataKey="x" stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 14 }} />
          <YAxis stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 14 }} />
          <Tooltip content={<CustomChartTooltip yKey="quantity" />} cursor={{ fill: "#E6F0F8" }} />
          <Bar dataKey="quantity" fill="#C4E7FF" className="cursor-pointer" />
        </BarChart>
      ) : (
        <LineChart
          data={chartData}
          onMouseMove={state => setActiveTooltipIndex(state && state.activeTooltipIndex != null ? state.activeTooltipIndex : null)}
          onMouseLeave={() => setActiveTooltipIndex(null)}
          onClick={() => {
            if (activeTooltipIndex != null) handleBarOrDotClick(chartData[activeTooltipIndex]);
          }}
        >
          <CartesianGrid stroke="#EAEAEA" />
          <XAxis dataKey="x" stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 14 }} />
          <YAxis stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 14 }} />
          <Tooltip content={<CustomChartTooltip yKey="quantity" />} cursor={{ fill: "#E6F0F8" }} />
          <Line type="monotone" dataKey="quantity" stroke="#C4E7FF" strokeWidth={3} activeDot={{ r: 8, style: { cursor: "pointer" } }} />
        </LineChart>
      )}
    </ResponsiveContainer>
  </div>
);

export default MainChart; 