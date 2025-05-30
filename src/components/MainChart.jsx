import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

const chartTypes = [
  { value: "bar", label: "bar" },
  { value: "line", label: "line" },
];
const yAxisOptions = [
  { value: "quantity", label: "PO Quantities" },
  { value: "cost", label: "Cost" },
  { value: "margin", label: "Margin" },
  { value: "price", label: "Price" },
];
const xAxisOptions = [
  { value: "season", label: "Season" },
  { value: "line", label: "Line" },
  { value: "color", label: "Color" },
  { value: "fabric", label: "Fabric" },
  { value: "type", label: "Type" },
];

const MainChart = ({
  chartType,
  setChartType,
  chartTitle,
  setChartTitle,
  editingTitle,
  setEditingTitle,
  viewBy,
  setViewBy,
  categoryBy,
  setCategoryBy,
  chartData,
  handleBarOrDotClick,
  activeTooltipIndex,
  setActiveTooltipIndex,
}) => {
  // Compute yKey for chart
  let yKey = viewBy;
  // For margin, calculate margin % for each group
  let displayData = chartData;
  if (viewBy === "margin") {
    displayData = chartData.map((d) => ({
      ...d,
      margin:
        d.avgPrice && d.avgCost
          ? Number(((d.avgPrice - d.avgCost) / d.avgPrice) * 100)
          : 0,
    }));
  } else if (viewBy === "cost") {
    displayData = chartData.map((d) => ({ ...d, cost: d.avgCost }));
  } else if (viewBy === "price") {
    displayData = chartData.map((d) => ({ ...d, price: d.avgPrice }));
  }

  // X axis key is always 'x' (already grouped by categoryBy in chartData)

  return (
    <div
      className="flex-1 min-w-0 bg-[#F9FBFC] rounded-lg border border-[#DDE9F3] p-4 mr-0 lg:mr-2 mb-4 lg:mb-0 flex flex-col justify-center"
      style={{ height: "450px" }}
    >
      {/* Editable title */}
      <div className="text-[#215273] font-semibold text-lg flex-1 min-w-[180px] relative">
        {editingTitle ? (
          <div className="relative">
            <input
              className="font-semibold text-lg outline-none"
              value={chartTitle}
              autoFocus
              onChange={(e) => setChartTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditingTitle(false);
              }}
              style={{ minWidth: 100, color: "#215273" }}
            />
            <span className="block h-0.5 bg-[#3398FF] scale-x-100 transition-transform origin-left duration-200 mt-1 rounded-full" />
          </div>
        ) : (
          <span
            className="cursor-pointer group inline-block relative"
            onClick={() => setEditingTitle(true)}
            title="Click to edit title"
            style={{ color: "#215273" }}
          >
            {chartTitle}
            <span className="block h-0.5 bg-[#3398FF] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1 rounded-full" />
          </span>
        )}
      </div>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mt-2 mb-6">
        
        {/* View by (y-axis) */}
        <div className="flex items-center gap-2">
          <span className="text-[#215273] font-medium">Rank</span>
          <select
            className="bg-[#E6F0F8] text-[#3398FF] rounded px-2 py-1"
            value={viewBy}
            onChange={(e) => setViewBy(e.target.value)}
          >
            {yAxisOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {/* Categorized by (x-axis) */}
        <div className="flex items-center gap-2">
          <span className="text-[#215273] font-medium">Categorized by</span>
          <select
            className="bg-[#E6F0F8] text-[#3398FF] rounded px-2 py-1"
            value={categoryBy}
            onChange={(e) => setCategoryBy(e.target.value)}
          >
            {xAxisOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Chart type */}
        <div className="flex items-center gap-2">
          <span className="text-[#215273] font-medium"> in a </span>
          <select
            className="bg-[#E6F0F8] text-[#3398FF] rounded px-2 py-1"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {chartTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="text-[#215273] font-medium"> chart </span>
        </div>
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart
            data={displayData}
            onMouseMove={(state) =>
              setActiveTooltipIndex(
                state && state.activeTooltipIndex != null
                  ? state.activeTooltipIndex
                  : null
              )
            }
            onMouseLeave={() => setActiveTooltipIndex(null)}
            onClick={() => {
              if (activeTooltipIndex != null)
                handleBarOrDotClick(displayData[activeTooltipIndex]);
            }}
          >
            <CartesianGrid stroke="#EAEAEA" />
            <XAxis
              dataKey="x"
              stroke="#A3B3BF"
              tick={{ fill: "#7C93A3", fontSize: 14 }}
            />
            <YAxis stroke="#A3B3BF" tick={{ fill: "#7C93A3", fontSize: 14 }} />
            <Tooltip
              content={<CustomChartTooltip yKey={yKey} />}
              cursor={{ fill: "#E6F0F8" }}
            />
            <Bar dataKey={yKey} fill="#C4E7FF" className="cursor-pointer" />
          </BarChart>
        ) : (
          <LineChart
            data={displayData}
            onMouseMove={(state) =>
              setActiveTooltipIndex(
                state && state.activeTooltipIndex != null
                  ? state.activeTooltipIndex
                  : null
              )
            }
            onMouseLeave={() => setActiveTooltipIndex(null)}
            onClick={() => {
              if (activeTooltipIndex != null)
                handleBarOrDotClick(displayData[activeTooltipIndex]);
            }}
          >
            <CartesianGrid stroke="#EAEAEA" />
            <XAxis
              dataKey="x"
              stroke="#A3B3BF"
              tick={{ fill: "#A3B3BF", fontSize: 14 }}
            />
            <YAxis stroke="#A3B3BF" tick={{ fill: "#A3B3BF", fontSize: 14 }} />
            <Tooltip
              content={<CustomChartTooltip yKey={yKey} />}
              cursor={{ fill: "#E6F0F8" }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#C4E7FF"
              strokeWidth={3}
              activeDot={{ r: 8, style: { cursor: "pointer" } }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MainChart;
