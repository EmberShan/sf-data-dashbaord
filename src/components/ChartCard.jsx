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

const FILTER_OPTIONS = [
  { key: "season", label: "Season/Line" },
  { key: "color", label: "Color" },
  { key: "fabric", label: "Fabric" },
  { key: "status", label: "Status" },
];

const STATUS_OPTIONS = [
  { value: "Design ready", label: "Design ready" },
  { value: "Approved", label: "Approved" },
  { value: "In production", label: "In production" },
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

function getFilteredProducts({ dateRangeType, dateRangeValue, customStart, customEnd, useCustom }) {
  const allProducts = getAllProducts();
  if (useCustom) {
    return filterProductsByDate(allProducts, customStart, customEnd);
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
    return filterProductsByDate(allProducts, start, now);
  }
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
  // Add new state for main chart controls
  const [mainChartTitle, setMainChartTitle] = useState(chartTitle);
  const [editingMainChartTitle, setEditingMainChartTitle] = useState(false);
  const [mainChartType, setMainChartType] = useState(chartType);
  const [mainChartViewBy, setMainChartViewBy] = useState("quantity"); // PO Quantities, cost, margin, price
  const [mainChartCategory, setMainChartCategory] = useState("season"); // season, line, color, fabric, type

  const [editingTitle, setEditingTitle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalLabel, setModalLabel] = useState("");

  // Advanced filter state
  const [activeFilters, setActiveFilters] = useState([]); // e.g. ["season", "color"]
  const [filterValues, setFilterValues] = useState({
    season: [],
    color: [],
    fabric: [],
    status: [],
  });
  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const addFilterRef = useRef(null);

  // Helper: get all unique values for dropdowns
  const allProducts = getAllProducts();
  const allSeasons = Array.from(new Set(allProducts.map(p => p.season)));
  const allLines = Array.from(new Set(allProducts.map(p => p.product_line)));
  const allColors = Array.from(new Set(allProducts.flatMap(p => p.color)));
  const allFabrics = Array.from(new Set(allProducts.map(p => p.fabric)));

  // --- Filtering logic ---
  function getFilteredProductsAdv({ dateRangeType, dateRangeValue, customStart, customEnd, useCustom, filterValues, activeFilters }) {
    let products = getFilteredProducts({ dateRangeType, dateRangeValue, customStart, customEnd, useCustom });
    // Season/Line
    if (activeFilters.includes("season") && filterValues.season.length > 0) {
      products = products.filter(p => filterValues.season.includes(p.season) || filterValues.season.includes(p.product_line));
    }
    // Color
    if (activeFilters.includes("color") && filterValues.color.length > 0) {
      products = products.filter(p => p.color.some(c => filterValues.color.includes(c)));
    }
    // Fabric
    if (activeFilters.includes("fabric") && filterValues.fabric.length > 0) {
      products = products.filter(p => filterValues.fabric.includes(p.fabric));
    }
    // Status
    if (activeFilters.includes("status") && filterValues.status.length > 0) {
      products = products.filter(p => filterValues.status.includes(p.status));
    }
    return products;
  }

  // --- UI handlers ---
  function handleAddFilter(key) {
    setActiveFilters(f => [...f, key]);
    setAddFilterOpen(false);
  }
  function handleRemoveFilter(key) {
    setActiveFilters(f => f.filter(k => k !== key));
    setFilterValues(v => ({ ...v, [key]: [] }));
  }
  function handleSelectValue(key, value) {
    setFilterValues(v => ({ ...v, [key]: v[key].includes(value) ? v[key].filter(x => x !== value) : [...v[key], value] }));
  }
  function handleRemoveChip(key, value) {
    setFilterValues(v => ({ ...v, [key]: v[key].filter(x => x !== value) }));
  }
  function handleClearAllFilters() {
    setActiveFilters([]);
    setFilterValues({ season: [], color: [], fabric: [], status: [] });
  }

  // --- Filtering for charts ---
  const filteredProducts = getFilteredProductsAdv({ dateRangeType, dateRangeValue, customStart, customEnd, useCustom, filterValues, activeFilters });

  // --- Chart data ---
  const chartData = getChartData({
    viewBy: mainChartCategory,
    dateRangeType: useCustom ? "custom" : dateRangeType,
    dateRangeValue,
    customStart,
    customEnd,
    filteredProducts, // pass for advanced filtering
  });

  // --- Margin chart data (now inside component) ---
  const marginChartData = chartData.map((d) => ({
    x: d.x,
    margin: d.avgPrice && d.avgCost ? Number(((d.avgPrice - d.avgCost) / d.avgPrice * 100).toFixed(1)) : 0,
  }));

  // --- Pie chart data for average margin (FIXED) ---
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
        if (inRange) {
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
        <div className="bg-white rounded-xl border border-[#E9EDEF] p-0 mb-8 w-full overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E9EDEF' }}>
                <th colSpan={5} className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center gap-1 text-[#3398FF] font-medium cursor-pointer select-none"
                      onClick={() => setExpanded(false)}
                    >
                      <img src="/filter.svg" alt="Hide Filters" className="w-5 h-5" />
                      Hide Filters
                    </div>
                    <div
                      className="flex items-center gap-1 text-[#3398FF] font-medium cursor-pointer select-none relative"
                      onClick={() => setAddFilterOpen(v => !v)}
                    >
                      <img src="/add.svg" alt="Add Filter" className="w-5 h-5" />
                      Add Filter
                      {addFilterOpen && (
                        <div className="absolute left-0 top-8 z-20 bg-white border border-[#E9EDEF] rounded shadow p-2 min-w-[160px]">
                          {FILTER_OPTIONS.filter(f => !activeFilters.includes(f.key)).map(opt => (
                            <div key={opt.key} className="px-2 py-1 hover:bg-[#F9FBFC] cursor-pointer rounded" onClick={() => handleAddFilter(opt.key)}>{opt.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className="ml-auto text-[#A3B3BF] font-medium cursor-pointer hover:text-[#3398FF] select-none"
                      onClick={handleClearAllFilters}
                    >
                      Clear all filters
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Date Range Row */}
              <tr className="border-b" style={{ borderColor: '#E9EDEF' }}>
                <td className="p-4 w-[160px] text-[#215273] font-medium">Date Range</td>
                <td colSpan={4} className="p-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="date"
                      className="px-2 py-1 rounded border border-[#E9EDEF] bg-white text-[#215273]"
                      value={customStart.toISOString().slice(0, 10)}
                      onChange={e => setCustomStart(new Date(e.target.value))}
                    />
                    <span className="mx-1 text-[#A3B3BF]">to</span>
                    <input
                      type="date"
                      className="px-2 py-1 rounded border border-[#E9EDEF] bg-white text-[#215273]"
                      value={customEnd.toISOString().slice(0, 10)}
                      onChange={e => setCustomEnd(new Date(e.target.value))}
                    />
                    {/* Quick select buttons */}
                    <div className="flex gap-1 ml-4">
                      {[
                        { label: 'Past Month', months: 1 },
                        { label: 'Past Quarter', months: 3 },
                        { label: 'Past Year', months: 12 },
                        { label: 'Past 5 Year', months: 60 },
                      ].map(opt => (
                        <span
                          key={opt.label}
                          className="px-3 py-1 rounded bg-[#F5F8FA] border border-[#E9EDEF] text-[#3398FF] font-medium cursor-pointer hover:bg-[#E6F0F8] select-none"
                          onClick={() => {
                            const now = new Date();
                            const start = new Date(now);
                            start.setMonth(now.getMonth() - opt.months);
                            setCustomStart(start);
                            setCustomEnd(now);
                          }}
                        >
                          {opt.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
              {/* Season/Line Row */}
              {activeFilters.includes('season') && (
                <tr className="border-b" style={{ borderColor: '#E9EDEF' }}>
                  <td className="p-4 text-[#215273] font-medium">Season/Line</td>
                  <td colSpan={4} className="p-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative">
                        <input
                          type="text"
                          className="px-2 py-1 rounded border border-[#E9EDEF] bg-white text-[#215273] w-[180px]"
                          placeholder="Search a season..."
                          value={filterValues.seasonSearch || ''}
                          onChange={e => setFilterValues(v => ({ ...v, seasonSearch: e.target.value }))}
                        />
                        {/* Dropdown for search results */}
                        {filterValues.seasonSearch && (
                          <div className="absolute z-10 mt-1 bg-white border border-[#E9EDEF] rounded shadow p-2 min-w-[180px] max-h-48 overflow-y-auto">
                            {allSeasons.filter(s => s.toLowerCase().includes(filterValues.seasonSearch.toLowerCase())).map(season => (
                              <div
                                key={season}
                                className="px-2 py-1 hover:bg-[#F9FBFC] cursor-pointer rounded"
                                onClick={() => {
                                  setFilterValues(v => ({ ...v, season: [...v.season, { season, lines: [] }], seasonSearch: '' }));
                                }}
                              >
                                {season}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Chips for selected seasons/lines */}
                      {filterValues.season.map((s, idx) => (
                        <div key={s.season} className="flex items-center bg-[#E6F0F8] text-[#3398FF] rounded-full px-3 py-1 mr-1">
                          <span
                            className="cursor-pointer font-medium"
                            onClick={() => setFilterValues(v => ({ ...v, season: v.season.map((ss, i) => i === idx ? { ...ss, showLines: !ss.showLines } : ss) }))}
                          >
                            {s.season}
                            {s.lines && s.lines.length > 0 && '/' + s.lines.join('/')}
                          </span>
                          <span
                            className="ml-2 text-[#A3B3BF] cursor-pointer hover:text-[#3398FF]"
                            onClick={() => setFilterValues(v => ({ ...v, season: v.season.filter((_, i) => i !== idx) }))}
                          >
                            &times;
                          </span>
                          {/* Dropdown for lines under this season */}
                          {s.showLines && (
                            <div className="absolute z-20 mt-8 bg-white border border-[#E9EDEF] rounded shadow p-2 min-w-[180px]">
                              <div className="px-2 py-1 border-b border-[#E9EDEF]">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={s.lines.length === allLines.filter(l => l.startsWith(s.season)).length}
                                    onChange={e => {
                                      setFilterValues(v => ({
                                        ...v,
                                        season: v.season.map((ss, i) => i === idx ? {
                                          ...ss,
                                          lines: e.target.checked ? allLines.filter(l => l.startsWith(s.season)) : []
                                        } : ss)
                                      }));
                                    }}
                                  />
                                  All lines
                                </label>
                              </div>
                              {allLines.filter(l => l.startsWith(s.season)).map(line => (
                                <div key={line} className="px-2 py-1 hover:bg-[#F9FBFC] cursor-pointer rounded flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={s.lines.includes(line)}
                                    onChange={() => {
                                      setFilterValues(v => ({
                                        ...v,
                                        season: v.season.map((ss, i) => i === idx ? {
                                          ...ss,
                                          lines: ss.lines.includes(line) ? ss.lines.filter(l => l !== line) : [...ss.lines, line]
                                        } : ss)
                                      }));
                                    }}
                                  />
                                  <span>{line.replace(s.season + '/', '')}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {/* Color Row */}
              {activeFilters.includes('color') && (
                <tr className="border-b" style={{ borderColor: '#E9EDEF' }}>
                  <td className="p-4 text-[#215273] font-medium">Color</td>
                  <td colSpan={4} className="p-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative">
                        <input
                          type="text"
                          className="px-2 py-1 rounded border border-[#E9EDEF] bg-white text-[#215273] w-[180px]"
                          placeholder="Search a color..."
                          value={filterValues.colorSearch || ''}
                          onChange={e => setFilterValues(v => ({ ...v, colorSearch: e.target.value }))}
                        />
                        {filterValues.colorSearch && (
                          <div className="absolute z-10 mt-1 bg-white border border-[#E9EDEF] rounded shadow p-2 min-w-[180px] max-h-48 overflow-y-auto">
                            {allColors.filter(c => c.toLowerCase().includes(filterValues.colorSearch.toLowerCase())).map(color => (
                              <div
                                key={color}
                                className="px-2 py-1 hover:bg-[#F9FBFC] cursor-pointer rounded"
                                onClick={() => setFilterValues(v => ({ ...v, color: [...v.color, color], colorSearch: '' }))}
                              >
                                {color}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {filterValues.color.map((color, idx) => (
                        <div key={color} className="flex items-center bg-[#E6F0F8] text-[#3398FF] rounded-full px-3 py-1 mr-1">
                          <span>{color}</span>
                          <span
                            className="ml-2 text-[#A3B3BF] cursor-pointer hover:text-[#3398FF]"
                            onClick={() => setFilterValues(v => ({ ...v, color: v.color.filter((_, i) => i !== idx) }))}
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {/* Fabric Row */}
              {activeFilters.includes('fabric') && (
                <tr className="border-b" style={{ borderColor: '#E9EDEF' }}>
                  <td className="p-4 text-[#215273] font-medium">Fabric</td>
                  <td colSpan={4} className="p-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative">
                        <input
                          type="text"
                          className="px-2 py-1 rounded border border-[#E9EDEF] bg-white text-[#215273] w-[180px]"
                          placeholder="Search a fabric..."
                          value={filterValues.fabricSearch || ''}
                          onChange={e => setFilterValues(v => ({ ...v, fabricSearch: e.target.value }))}
                        />
                        {filterValues.fabricSearch && (
                          <div className="absolute z-10 mt-1 bg-white border border-[#E9EDEF] rounded shadow p-2 min-w-[180px] max-h-48 overflow-y-auto">
                            {allFabrics.filter(f => f.toLowerCase().includes(filterValues.fabricSearch.toLowerCase())).map(fabric => (
                              <div
                                key={fabric}
                                className="px-2 py-1 hover:bg-[#F9FBFC] cursor-pointer rounded"
                                onClick={() => setFilterValues(v => ({ ...v, fabric: [...v.fabric, fabric], fabricSearch: '' }))}
                              >
                                {fabric}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {filterValues.fabric.map((fabric, idx) => (
                        <div key={fabric} className="flex items-center bg-[#E6F0F8] text-[#3398FF] rounded-full px-3 py-1 mr-1">
                          <span>{fabric}</span>
                          <span
                            className="ml-2 text-[#A3B3BF] cursor-pointer hover:text-[#3398FF]"
                            onClick={() => setFilterValues(v => ({ ...v, fabric: v.fabric.filter((_, i) => i !== idx) }))}
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {/* Status Row */}
              {activeFilters.includes('status') && (
                <tr className="border-b" style={{ borderColor: '#E9EDEF' }}>
                  <td className="p-4 text-[#215273] font-medium">Status</td>
                  <td colSpan={4} className="p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                      {STATUS_OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterValues.status.includes(opt.value)}
                            onChange={() => handleSelectValue('status', opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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