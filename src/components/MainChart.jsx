import React, { useState, useRef, useEffect } from "react";
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
  Cell,
} from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";
import { createPortal } from "react-dom";

// Custom tick component for wrapping long labels
const CustomTick = ({ x, y, payload, width, data }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const textRef = useRef(null);

  // Calculate max characters that can fit in the bar width
  const barWidth = width / data.length;
  const maxChars = Math.floor(barWidth / 8); // Approximate character width of 8px

  const text = payload.value.length > maxChars ? payload.value.slice(0, maxChars) + '…' : payload.value;
  const isTruncated = payload.value.length > maxChars;

  const handleMouseEnter = (e) => {
    if (isTruncated) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        ref={textRef}
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#7C93A3"
        fontSize={12}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isTruncated ? 'pointer' : 'default' }}
      >
        {text}
      </text>
      {showTooltip && isTruncated && createPortal(
        <div
          className="bg-white p-2 rounded shadow border border-light-border text-text-color text-sm whitespace-nowrap"
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 50,
            pointerEvents: 'none'
          }}
        >
          {payload.value}
        </div>,
        document.body
      )}
    </g>
  );
};

// MainChart.jsx
// Renders the main bar/line chart for the dashboard, with dynamic axes and title, based on props and filters.

const chartTypes = [
  { value: "bar", label: "bar" },
  { value: "line", label: "line" },
  { value: "stackedBar", label: "stackedBar" },
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
  chartHeight = 550,
  selectedBar,
  stackBy,
  stackedBarKeys,
  setStackBy,
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

  // Bar/Line color logic
  const getBarFill = (d) => {
    if (!selectedBar) return "#C4E7FF";
    return (d.x === selectedBar) ? "#C4E7FF" : "#E9EDEF";
  };

  const stackedBarColors = ["#E9F6FF", "#C4E7FF", "#9DD6FF", "#6BB1E4"];

  return (
    <div
      className="flex-1 min-w-0 bg-white rounded-lg border border-light-border p-4 flex flex-col justify-center"
      style={{ height: '100%'}}
    >
      {/* Editable title */}
      <div className="text-text-color font-semibold text-lg flex-1 min-w-[180px] relative">
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
          <span className="text-text-color font-medium">Rank</span>
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
          <span className="text-text-color font-medium">Categorized by</span>
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
          <span className="text-text-color font-medium"> in a </span>
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
          <span className="text-text-color font-medium"> chart </span>
        </div>
        {/* Stack by dropdown for stackedBar */}
        {chartType === "stackedBar" && (
          <div className="flex items-center gap-2">
            <span className="text-text-color font-medium">Stack by</span>
            <select
              className="bg-[#E6F0F8] text-[#3398FF] rounded px-2 py-1"
              value={stackBy || ""}
              onChange={e => setStackBy(e.target.value)}
            >
              <option value="" disabled>Select</option>
              {xAxisOptions.filter(opt => opt.value !== categoryBy).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Chart */}
      <div className="flex-1 min-h-[400px]">
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
                tick={(props) => <CustomTick {...props} data={displayData} />}
                height={30}
                interval={0}
              />
              <YAxis stroke="#A3B3BF" tick={{ fill: "#7C93A3", fontSize: 14 }} />
              <Tooltip
                content={<CustomChartTooltip yKey={yKey} />}
                cursor={{ fill: "#E6F0F8" }}
              />
              <Bar dataKey={yKey} className="cursor-pointer" fill="#C4E7FF">
                {displayData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={getBarFill(entry)} />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === "stackedBar" ? (
            Array.isArray(stackedBarKeys) && stackedBarKeys.length > 0 && Array.isArray(chartData) && chartData.length > 0 ? (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#EAEAEA" />
                <XAxis
                  dataKey={categoryBy}
                  stroke="#A3B3BF"
                  tick={(props) => <CustomTick {...props} data={chartData} />}
                  height={30}
                  interval={0}
                />
                <YAxis stroke="#A3B3BF" tick={{ fill: "#7C93A3", fontSize: 14 }} />
                <Tooltip
                  content={<CustomChartTooltip yKey={stackBy} />}
                  cursor={{ fill: "#E6F0F8" }}
                />
                {stackedBarKeys.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={stackedBarColors[idx % stackedBarColors.length]}
                    isAnimationActive={false}
                    label={({ x, y, width, height, value }) => {
                      if (!value || value === 0 || !height || height < 14) return null;
                      return (
                        <g>
                          <text
                            x={x + width / 2}
                            y={y + height / 2 + 4}
                            textAnchor="middle"
                            fill="#215273"
                            fontSize={10}
                            fontWeight="bold"
                          >
                            {key}
                          </text>
                        </g>
                      );
                    }}
                  />
                ))}
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full text-caption-color text-sm">Select a stack by attribute to display the stacked bar chart.</div>
            )
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
                tick={(props) => <CustomTick {...props} data={displayData} />}
                height={30}
                interval={0}
              />
              <YAxis stroke="#A3B3BF" tick={{ fill: "#7C93A3", fontSize: 14 }} />
              <Tooltip
                content={<CustomChartTooltip yKey={yKey} />}
                cursor={{ fill: "#E6F0F8" }}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#C4E7FF"
                strokeWidth={3}
                activeDot={{
                  r: 8,
                  style: { cursor: "pointer" },
                  fill: (props) => getBarFill(props.payload),
                }}
                dot={{
                  stroke: "#C4E7FF",
                  strokeWidth: 2,
                  fill: (props) => getBarFill(props.payload),
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainChart;
