import React, { useState } from "react";
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
import shirtData from "../data/shirts.js";
import CustomChartTooltip from "./CustomChartTooltip";
import ProductCard from "./ProductCard";
import Modal from "./Modal";

const chartTypes = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
];

const viewByOptions = [
  { value: "year", label: "Year" },
  { value: "quarter", label: "Quarter" },
  { value: "month", label: "Month" },
  { value: "line", label: "Product Line" },
  { value: "color", label: "Color" },
  { value: "fabric", label: "Fabric" },
  { value: "type", label: "Type" },
];

const dateRangeTypes = [
  { value: "year", label: "Year" },
  { value: "quarter", label: "Quarter" },
  { value: "month", label: "Month" },
];

function filterProductsByDate(products, start, end) {
  return products.filter((product) => {
    const date = new Date(product.date_added);
    return date >= start && date <= end;
  });
}

function getChartData({
  viewBy,
  dateRangeType,
  dateRangeValue,
  customStart,
  customEnd,
}) {
  let allProducts = [];
  shirtData.clothing_inventory.forEach((seasonObj) => {
    seasonObj.product_lines.forEach((line) => {
      line.products.forEach((product) => {
        allProducts.push({
          ...product,
          season: seasonObj.season,
          product_line: line.name,
        });
      });
    });
  });

  let filteredProducts = allProducts;
  if (dateRangeType === "custom") {
    filteredProducts = filterProductsByDate(
      allProducts,
      customStart,
      customEnd
    );
  } else {
    const now = new Date();
    let start;
    if (dateRangeType === "year") {
      start = new Date(
        now.getFullYear() - dateRangeValue,
        now.getMonth(),
        now.getDate()
      );
    } else if (dateRangeType === "quarter") {
      start = new Date(now);
      start.setMonth(now.getMonth() - 3 * dateRangeValue);
    } else if (dateRangeType === "month") {
      start = new Date(now);
      start.setMonth(now.getMonth() - dateRangeValue);
    }
    filteredProducts = filterProductsByDate(allProducts, start, now);
  }

  // Group by viewBy, with special handling for color
  let groups = {};
  if (viewBy === "color") {
    filteredProducts.forEach((p) => {
      p.color.forEach((color) => {
        if (!groups[color]) groups[color] = [];
        groups[color].push(p);
      });
    });
  } else {
    const groupKey =
      viewBy === "year"
        ? (p) => new Date(p.date_added).getFullYear()
        : viewBy === "quarter"
        ? (p) =>
            `Q${Math.floor(new Date(p.date_added).getMonth() / 3) + 1} ${new Date(
              p.date_added
            ).getFullYear()}`
        : viewBy === "month"
        ? (p) =>
            `${new Date(p.date_added).getMonth() + 1}/${new Date(
              p.date_added
            ).getFullYear()}`
        : viewBy === "line"
        ? (p) => p.product_line
        : viewBy === "fabric"
        ? (p) => p.fabric
        : viewBy === "type"
        ? (p) => p.type
        : (p) => p.season;
    filteredProducts.forEach((p) => {
      const key = groupKey(p);
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
  }

  return Object.entries(groups).map(([key, products]) => ({
    x: key,
    quantity: products.reduce((sum, p) => sum + (p.quantity_sold || 0), 0),
    avgPrice:
      products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length,
    avgCost:
      products.reduce((sum, p) => sum + (p.cost || 0), 0) / products.length,
    products,
  }));
}

const ChartCard = ({
  chartType,
  setChartType,
  viewBy,
  setViewBy,
  dateRangeType,
  setDateRangeType,
  dateRangeValue,
  setDateRangeValue,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  useCustom,
  setUseCustom,
  chartTitle,
  setChartTitle,
  expanded,
  onToggleExpand,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalLabel, setModalLabel] = useState("");

  const chartData = getChartData({
    viewBy,
    dateRangeType: useCustom ? "custom" : dateRangeType,
    dateRangeValue,
    customStart,
    customEnd,
  });

  // Group products by product line for modal
  function groupByProductLine(products, colorGroup) {
    const lines = {};
    products.forEach((p) => {
      // If colorGroup is set, only include products that have that color
      if (!colorGroup || (p.color && p.color.includes(colorGroup))) {
        if (!lines[p.product_line]) lines[p.product_line] = [];
        lines[p.product_line].push(p);
      }
    });
    return lines;
  }

  // Chart click handler
  const handleBarOrDotClick = (data) => {
    setModalProducts(data.products || []);
    setModalLabel(data.x || data.season || "");
    setModalOpen(true);
  };

  // Track hovered/active index for tooltip
  const [activeTooltipIndex, setActiveTooltipIndex] = useState(null);

  return (
    <div
      className="bg-white rounded-xl border border-[#DDE9F3] p-8 mb-8 mx-auto"
      style={{ width: "80vw", maxWidth: 1200 }}
    >
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} label={modalLabel} products={modalProducts} viewBy={viewBy} groupByProductLine={groupByProductLine} />
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#215273] font-semibold text-lg w-1/2 relative">
          {editingTitle ? (
            <div className="relative w-full">
              <input
                className="font-semibold text-lg text-[#215273] bg-white outline-none w-full"
                value={chartTitle}
                autoFocus
                onChange={e => setChartTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingTitle(false); }}
                style={{ minWidth: 120 }}
              />
              <span className="block h-0.5 bg-[#3398FF] scale-x-100 transition-transform origin-left duration-200 mt-1 rounded-full" />
            </div>
          ) : (
            <span
              className="cursor-pointer group inline-block w-full relative"
              onClick={() => setEditingTitle(true)}
              title="Click to edit title"
            >
              {chartTitle}
              <span className="block h-0.5 bg-[#3398FF] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1 rounded-full" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-6 ml-4">
          <div className="hover:opacity-80 cursor-pointer" onClick={onToggleExpand}>
            <img
              src="/filter.svg"
              alt="Filter"
              className="w-6 h-6"
              style={{
                filter: expanded
                  ? 'invert(62%) sepia(98%) saturate(749%) hue-rotate(176deg) brightness(101%) contrast(101%)' // #3398FF
                  : 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' // #A3B3BF
              }}
            />
          </div>
          <div className={`hover:opacity-80 cursor-pointer${isFirst ? ' opacity-30 pointer-events-none' : ''}`} onClick={isFirst ? undefined : onMoveUp}>
            <img src="/up.svg" alt="Move Up" className="w-6 h-6" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
          </div>
          <div className={`hover:opacity-80 cursor-pointer${isLast ? ' opacity-30 pointer-events-none' : ''}`} onClick={isLast ? undefined : onMoveDown}>
            <img src="/down.svg" alt="Move Down" className="w-6 h-6" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
          </div>
          <div className="hover:opacity-80 cursor-pointer" onClick={onDuplicate}>
            <img src="/duplicate.svg" alt="Duplicate" className="w-6 h-6" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
          </div>
          <div className="hover:opacity-80 cursor-pointer" onClick={onDelete}>
            <img src="/delete.svg" alt="Delete" className="w-6 h-6" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
          </div>
        </div>
      </div>
      {/* Chart settings summary */}
      <div className="mb-6 text-sm font-medium" style={{ color: '#215273' }}>
        {useCustom
          ? `Custom: ${customStart.toISOString().slice(0, 10)} to ${customEnd.toISOString().slice(0, 10)}, View by ${viewByOptions.find(v => v.value === viewBy)?.label || viewBy}`
          : `Past ${dateRangeValue} ${dateRangeTypes.find(d => d.value === dateRangeType)?.label}${dateRangeValue > 1 ? 's' : ''}, View by ${viewByOptions.find(v => v.value === viewBy)?.label || viewBy}`
        }
      </div>
      {expanded && (
        <div className="bg-[#F9FBFC] rounded-lg p-4 mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-caption font-medium">Type of chart</span>
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
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption font-medium">Date Range</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={!useCustom}
                onChange={() => setUseCustom(false)}
              />
              <span>Past</span>
              <input
                type="number"
                min={1}
                className={`w-12 px-1 py-0.5 rounded border border-[#E6F0F8] ${!useCustom ? 'bg-[#E6F0F8] text-[#3398FF]' : 'bg-white text-[#A3B3BF]'}`}
                value={dateRangeValue}
                onChange={(e) => setDateRangeValue(Number(e.target.value))}
                onFocus={() => setUseCustom(false)}
              />
              <select
                className={`rounded px-2 py-1 border-none ${!useCustom ? 'bg-[#E6F0F8] text-[#3398FF]' : 'bg-white text-[#A3B3BF]'}`}
                value={dateRangeType}
                onChange={(e) => setDateRangeType(e.target.value)}
                onFocus={() => setUseCustom(false)}
              >
                {dateRangeTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1 ml-4">
              <input
                type="radio"
                checked={useCustom}
                onChange={() => setUseCustom(true)}
              />
              <span>Custom dates</span>
              <input
                type="date"
                className={`px-1 py-0.5 rounded border border-[#E6F0F8] ${useCustom ? 'bg-[#E6F0F8] text-[#3398FF]' : 'bg-white text-[#A3B3BF]'}`}
                value={customStart.toISOString().slice(0, 10)}
                onChange={(e) => setCustomStart(new Date(e.target.value))}
                onFocus={() => setUseCustom(true)}
              />
              <span>to</span>
              <input
                type="date"
                className={`px-1 py-0.5 rounded border border-[#E6F0F8] ${useCustom ? 'bg-[#E6F0F8] text-[#3398FF]' : 'bg-white text-[#A3B3BF]'}`}
                value={customEnd.toISOString().slice(0, 10)}
                onChange={(e) => setCustomEnd(new Date(e.target.value))}
                onFocus={() => setUseCustom(true)}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-caption font-medium">View by</span>
            <div className="flex gap-2 flex-wrap">
              {viewByOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`hover:cursor-pointer px-3 py-1 rounded font-medium border ${
                    viewBy === opt.value
                      ? "bg-[#E6F0F8] text-[#3398FF] border-[#C3E7FE]"
                      : "bg-white text-caption border-[#E6F0F8]"
                  }`}
                  onClick={() => setViewBy(opt.value)}
                  type="button"
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Chart */}
      <div style={{ width: "100%", height: "350px" }} className="cursor-pointer">
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
              <XAxis
                dataKey="x"
                stroke="#A3B3BF"
                tick={{ fill: "#A3B3BF", fontSize: 14 }}
              />
              <YAxis
                stroke="#A3B3BF"
                tick={{ fill: "#A3B3BF", fontSize: 14 }}
              />
              <Tooltip
                content={<CustomChartTooltip yKey="quantity" />}
                cursor={{ fill: "#E6F0F8" }}
              />
              <Bar
                dataKey="quantity"
                fill="#C4E7FF"
                className="cursor-pointer"
              />
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
              <XAxis
                dataKey="x"
                stroke="#A3B3BF"
                tick={{ fill: "#A3B3BF", fontSize: 14 }}
              />
              <YAxis
                stroke="#A3B3BF"
                tick={{ fill: "#A3B3BF", fontSize: 14 }}
              />
              <Tooltip
                content={<CustomChartTooltip yKey="quantity" />}
                cursor={{ fill: "#E6F0F8" }}
              />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="#C4E7FF"
                strokeWidth={3}
                activeDot={{ r: 8, style: { cursor: "pointer" } }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
