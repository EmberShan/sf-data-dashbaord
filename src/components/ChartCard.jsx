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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import shirtData from "../data/shirts.js";
import CustomChartTooltip from "./CustomChartTooltip";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import MainChart from "./MainChart";
import MarginPieChart from "./MarginPieChart";
import BuyerRankingChart from "./BuyerRankingChart";

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

function getAllProducts() {
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
  return allProducts;
}

function getFilteredProducts({ dateRangeType, dateRangeValue, customStart, customEnd, useCustom, selectedColors }) {
  const allProducts = getAllProducts();
  let filtered = [];
  if (useCustom) {
    filtered = filterProductsByDate(allProducts, customStart, customEnd);
  } else {
    const now = new Date();
    let start;
    if (dateRangeType === "year") {
      start = new Date(now.getFullYear() - dateRangeValue, now.getMonth(), now.getDate());
    } else if (dateRangeType === "quarter") {
      start = new Date(now);
      start.setMonth(now.getMonth() - 3 * dateRangeValue);
    } else if (dateRangeType === "month") {
      start = new Date(now);
      start.setMonth(now.getMonth() - dateRangeValue);
    }
    filtered = filterProductsByDate(allProducts, start, now);
  }
  // Color filter
  if (selectedColors && selectedColors.length > 0) {
    filtered = filtered.filter(p => Array.isArray(p.color) ? p.color.some(c => selectedColors.includes(c)) : selectedColors.includes(p.color));
  }
  return filtered;
}

function getChartData({
  viewBy,
  dateRangeType,
  dateRangeValue,
  customStart,
  customEnd,
  selectedColors,
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
  // Color filter
  if (selectedColors && selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(p => Array.isArray(p.color) ? p.color.some(c => selectedColors.includes(c)) : selectedColors.includes(p.color));
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

// --- Helper: Aggregate buyer data from filtered products ---
function getBuyerRanking(products) {
  const buyerMap = {};
  products.forEach((p) => {
    if (!buyerMap[p.buyer]) buyerMap[p.buyer] = 0;
    buyerMap[p.buyer] += p.quantity_sold || 0;
  });
  // Convert to array and sort descending
  return Object.entries(buyerMap)
    .map(([buyer, quantity]) => ({ buyer, quantity }))
    .sort((a, b) => b.quantity - a.quantity);
}

// Helper to get all unique colors from the data
function getAllColors() {
  const allProducts = getAllProducts();
  const colorSet = new Set();
  allProducts.forEach((p) => {
    if (Array.isArray(p.color)) {
      p.color.forEach((c) => colorSet.add(c));
    } else if (p.color) {
      colorSet.add(p.color);
    }
  });
  return Array.from(colorSet).sort();
}

function ColorFilterRow({ selectedColors, setSelectedColors }) {
  const allColors = getAllColors();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Filtered color options
  const filteredColors = allColors.filter((c) => c.toLowerCase().includes(search.toLowerCase()));
  const allSelected = selectedColors.length === 0 || selectedColors.length === allColors.length;

  function handleSelectColor(color) {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  }
  function handleRemoveChip(color) {
    setSelectedColors(selectedColors.filter((c) => c !== color));
  }
  function handleSelectAll() {
    setSelectedColors([]); // empty means all
    setDropdownOpen(false);
  }

  let dropdownText = "all";
  if (selectedColors.length === 0 || selectedColors.length === allColors.length) {
    dropdownText = "all";
  } else if (selectedColors.length === 0) {
    dropdownText = "none selected";
  } else {
    dropdownText = `${selectedColors.length} selected`;
  }

  return (
    <div className="flex items-center gap-4 w-full border border-[#E9EDEF] p-4">
      <span className="text-caption font-medium w-[90px] text-left">Color</span>
      <div className="relative">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded border border-[#E9EDEF] text-sm font-medium cursor-pointer select-none min-w-[120px] bg-white"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          onClick={() => setDropdownOpen((v) => !v)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setDropdownOpen((v) => !v); }}
        >
          <span>{dropdownText}</span>
          <span className={`inline-block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
        </div>
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute left-0 z-50 mt-2 w-64 bg-white border border-[#E9EDEF] rounded shadow-lg p-2"
            style={{ minWidth: 220 }}
            role="listbox"
            tabIndex={-1}
          >
            <div
              className={`px-3 py-1 rounded cursor-pointer font-medium text-[#215273] ${allSelected ? 'bg-[#E6F0F8] text-[#3398FF]' : 'hover:bg-[#F5F8FA]'}`}
              onClick={handleSelectAll}
              aria-selected={allSelected}
            >
              All colors
            </div>
            <div className="my-2 border-t border-[#E9EDEF]" />
            <input
              type="text"
              className="w-full px-2 py-1 mb-2 rounded border border-[#E9EDEF] text-[#215273] bg-transparent focus:outline-none"
              placeholder="Search colors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search colors"
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredColors.map((color) => (
                <div
                  key={color}
                  className={`px-3 py-1 rounded cursor-pointer flex items-center gap-2 ${selectedColors.includes(color) ? 'bg-[#E6F0F8] text-[#3398FF]' : 'hover:bg-[#F5F8FA] text-[#215273]'}`}
                  onClick={() => handleSelectColor(color)}
                  aria-selected={selectedColors.includes(color)}
                  role="option"
                >
                  <span className="w-3 h-3 rounded-full border border-[#E9EDEF] mr-2" style={{ background: color.toLowerCase() }} />
                  {color}
                  {selectedColors.includes(color) && <span className="ml-auto">✓</span>}
                </div>
              ))}
              {filteredColors.length === 0 && (
                <div className="px-3 py-2 text-[#A3B3BF]">No colors found</div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Chips for selected colors */}
      <div className="flex flex-wrap gap-2 ml-2">
        {selectedColors.length > 0 && selectedColors.length < allColors.length && selectedColors.map((color) => (
          <span
            key={color}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F0F8] text-[#3398FF] text-xs font-medium border border-[#C3E7FE]"
          >
            {color}
            <span
              className="ml-1 cursor-pointer text-[#A3B3BF] hover:text-[#215273]"
              tabIndex={0}
              aria-label={`Remove ${color}`}
              onClick={() => handleRemoveChip(color)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRemoveChip(color); }}
            >
              ×
            </span>
          </span>
        ))}
      </div>
    </div>
  );
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
  // Add new state for main chart controls (move above chartData)
  const [mainChartTitle, setMainChartTitle] = useState(chartTitle);
  const [editingMainChartTitle, setEditingMainChartTitle] = useState(false);
  const [mainChartType, setMainChartType] = useState(chartType);
  const [mainChartViewBy, setMainChartViewBy] = useState("quantity"); // PO Quantities, cost, margin, price
  const [mainChartCategory, setMainChartCategory] = useState("season"); // season, line, color, fabric, type

  const [editingTitle, setEditingTitle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalLabel, setModalLabel] = useState("");

  const [selectedColors, setSelectedColors] = useState([]); // empty = all

  const chartData = getChartData({
    viewBy: mainChartCategory,
    dateRangeType: useCustom ? "custom" : dateRangeType,
    dateRangeValue,
    customStart,
    customEnd,
    selectedColors,
  });

  // --- Margin chart data (now inside component) ---
  const marginChartData = chartData.map((d) => ({
    x: d.x,
    margin: d.avgPrice && d.avgCost ? Number(((d.avgPrice - d.avgCost) / d.avgPrice * 100).toFixed(1)) : 0,
  }));

  // --- Pie chart data for average margin (FIXED) ---
  const filteredProducts = getFilteredProducts({ dateRangeType, dateRangeValue, customStart, customEnd, useCustom, selectedColors });
  const avgPrice = filteredProducts.length > 0 ? filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0) / filteredProducts.length : 0;
  const avgCost = filteredProducts.length > 0 ? filteredProducts.reduce((sum, p) => sum + (p.cost || 0), 0) / filteredProducts.length : 0;
  const pieData = [
    { name: "avg cost", value: avgCost },
    { name: "margin", value: Math.max(avgPrice - avgCost, 0) },
  ];
  const pieColors = ["#C4E7FF", "#E6F0F8"];

  // --- Buyer ranking chart data (now inside component) ---
  let allFilteredProducts = [];
  shirtData.clothing_inventory.forEach((seasonObj) => {
    seasonObj.product_lines.forEach((line) => {
      line.products.forEach((product) => {
        // Apply the same date filtering as getChartData
        const date = new Date(product.date_added);
        let inRange = false;
        if (useCustom) {
          inRange = date >= customStart && date <= customEnd;
        } else {
          const now = new Date();
          let start;
          if (dateRangeType === "year") {
            start = new Date(now.getFullYear() - dateRangeValue, now.getMonth(), now.getDate());
          } else if (dateRangeType === "quarter") {
            start = new Date(now);
            start.setMonth(now.getMonth() - 3 * dateRangeValue);
          } else if (dateRangeType === "month") {
            start = new Date(now);
            start.setMonth(now.getMonth() - dateRangeValue);
          }
          inRange = date >= start && date <= now;
        }
        // Color filter
        let colorMatch = true;
        if (selectedColors && selectedColors.length > 0) {
          colorMatch = Array.isArray(product.color) ? product.color.some(c => selectedColors.includes(c)) : selectedColors.includes(product.color);
        }
        if (inRange && colorMatch) {
          allFilteredProducts.push(product);
        }
      });
    });
  });
  const buyerRanking = getBuyerRanking(allFilteredProducts);

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
          ? `Custom: ${customStart.toISOString().slice(0, 10)} to ${customEnd.toISOString().slice(0, 10)}`
          : `Past ${dateRangeValue} ${dateRangeTypes.find(d => d.value === dateRangeType)?.label}${dateRangeValue > 1 ? 's' : ''}`
        }
      </div>
      {expanded && (
        <div className="rounded-lg mb-6 flex flex-col">
          <div className="flex flex-wrap items-center gap-4 border border-[#E9EDEF] p-4 mb-[-1px]">
            <span className="text-caption font-medium w-[90px] text-left">Date Range</span>
            <input
              type="date"
              className="px-1 py-0.5 rounded border border-[#E9EDEF] bg-transparent text-[#215273] focus:outline-none"
              value={customStart.toISOString().slice(0, 10)}
              onChange={e => {
                setCustomStart(new Date(e.target.value));
                setUseCustom(true);
              }}
            />
            <span>to</span>
            <input
              type="date"
              className="px-1 py-0.5 rounded border border-[#E9EDEF] bg-transparent text-[#215273] focus:outline-none"
              value={customEnd.toISOString().slice(0, 10)}
              onChange={e => {
                setCustomEnd(new Date(e.target.value));
                setUseCustom(true);
              }}
            />
            <div className="flex gap-2 ml-2 flex-wrap">
              {[
                { label: "Past Month", type: "month", value: 1 },
                { label: "Past Quarter", type: "quarter", value: 1 },
                { label: "Past Year", type: "year", value: 1 },
                { label: "Past 5 Year", type: "year", value: 5 },
              ].map(opt => {
                const isActive = !useCustom && dateRangeType === opt.type && dateRangeValue === opt.value;
                return (
                  <div
                    key={opt.label}
                    className={`px-3 py-1 rounded border border-[#E9EDEF] text-sm font-medium cursor-pointer select-none transition-colors ${isActive ? 'bg-[#E6F0F8] text-[#3398FF] border-[#C3E7FE]' : 'bg-transparent text-[#215273] hover:bg-[#F5F8FA]'}`}
                    onClick={() => {
                      setDateRangeType(opt.type);
                      setDateRangeValue(opt.value);
                      setUseCustom(false);
                      // Set customStart/customEnd to match quick range
                      const now = new Date();
                      let start;
                      if (opt.type === "year") {
                        start = new Date(now.getFullYear() - opt.value, now.getMonth(), now.getDate());
                      } else if (opt.type === "quarter") {
                        start = new Date(now);
                        start.setMonth(now.getMonth() - 3 * opt.value);
                      } else if (opt.type === "month") {
                        start = new Date(now);
                        start.setMonth(now.getMonth() - opt.value);
                      }
                      setCustomStart(start);
                      setCustomEnd(now);
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>
          <ColorFilterRow selectedColors={selectedColors} setSelectedColors={setSelectedColors} />
        </div>
      )}
      {/* Chart */}
      <div className="w-full flex flex-row">
        {/* Left: Main chart */}
        <MainChart
          chartType={mainChartType}
          setChartType={setMainChartType}
          chartTitle={mainChartTitle}
          setChartTitle={setMainChartTitle}
          editingTitle={editingMainChartTitle}
          setEditingTitle={setEditingMainChartTitle}
          viewBy={mainChartViewBy}
          setViewBy={setMainChartViewBy}
          categoryBy={mainChartCategory}
          setCategoryBy={setMainChartCategory}
          chartData={chartData}
          handleBarOrDotClick={handleBarOrDotClick}
          activeTooltipIndex={activeTooltipIndex}
          setActiveTooltipIndex={setActiveTooltipIndex}
        />
        {/* Right: Two stacked charts */}
        <div className="flex flex-col gap-2 w-[320px] min-w-[220px] max-w-[340px] h-[450px] overflow-y-auto">
          {/* Top: Avg Margin Pie Chart */}
          <MarginPieChart avgPrice={avgPrice} avgCost={avgCost} pieData={pieData} pieColors={pieColors} />
          {/* Bottom: Buyer ranking */}
          <BuyerRankingChart buyerRanking={buyerRanking} />
        </div>
      </div>
    </div>
  );
};

export default ChartCard;