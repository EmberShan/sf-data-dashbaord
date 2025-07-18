import React, { useState, useRef, useEffect } from "react";
import catalogueData from "../data/catalogue.js";
import Modal from "./Modal";
import MainChart from "./MainChart";
import MarginPieChart from "./MarginPieChart";
import BuyerRankingChart from "./BuyerRankingChart";
import FilterRow from "./FilterRow";
import ConfirmationModal from "./ConfirmationModal";
import ProductSidePanel from "./ProductSidePanel";

// ChartCard.jsx
// Main dashboard card component. Manages chart display, filter controls, and filter logic for shirt inventory data visualization.
// Features:
// - Interactive chart display with multiple chart types (bar, line)
// - Advanced filtering system with multiple filter types
// - Date range selection with custom and preset options
// - Product line grouping and analysis
// - Margin and buyer ranking visualization
// - Responsive design with expandable sections
// - Keyboard accessibility
// - Modal view for detailed product information

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
  catalogueData.clothing_inventory.forEach((seasonObj) => {
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

function getFilteredProducts({
  dateRangeType,
  dateRangeValue,
  customStart,
  customEnd,
  useCustom,
  selectedColors,
  selectedFabrics,
  selectedSeasons,
  selectedLines,
  selectedBuyers,
}) {
  const allProducts = getAllProducts();
  let filtered = [];
  if (useCustom) {
    filtered = filterProductsByDate(allProducts, customStart, customEnd);
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
    filtered = filterProductsByDate(allProducts, start, now);
  }
  // Color filter
  if (selectedColors && selectedColors.length > 0) {
    filtered = filtered.filter((p) =>
      Array.isArray(p.color)
        ? p.color.some((c) => selectedColors.includes(c))
        : selectedColors.includes(p.color)
    );
  }
  // Fabric filter
  if (selectedFabrics && selectedFabrics.length > 0) {
    filtered = filtered.filter((p) =>
      Array.isArray(p.fabric)
        ? p.fabric.some((f) => selectedFabrics.includes(f))
        : selectedFabrics.includes(p.fabric)
    );
  }
  // Season filter
  if (selectedSeasons && selectedSeasons.length > 0) {
    filtered = filtered.filter((p) => selectedSeasons.includes(p.season));
  }
  // Line filter
  if (selectedLines && selectedLines.length > 0) {
    filtered = filtered.filter((p) => selectedLines.includes(p.product_line));
  }
  // Buyer filter
  if (selectedBuyers && selectedBuyers.length > 0) {
    filtered = filtered.filter((p) => selectedBuyers.includes(p.buyer));
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
  selectedFabrics,
  selectedSeasons,
  selectedLines,
  selectedBuyers,
}) {
  let allProducts = [];
  catalogueData.clothing_inventory.forEach((seasonObj) => {
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
    filteredProducts = filteredProducts.filter((p) =>
      Array.isArray(p.color)
        ? p.color.some((c) => selectedColors.includes(c))
        : selectedColors.includes(p.color)
    );
  }
  // Fabric filter
  if (selectedFabrics && selectedFabrics.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      Array.isArray(p.fabric)
        ? p.fabric.some((f) => selectedFabrics.includes(f))
        : selectedFabrics.includes(p.fabric)
    );
  }
  // Season filter
  if (selectedSeasons && selectedSeasons.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedSeasons.includes(p.season)
    );
  }
  // Line filter
  if (selectedLines && selectedLines.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedLines.includes(p.product_line)
    );
  }
  // Buyer filter
  if (selectedBuyers && selectedBuyers.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedBuyers.includes(p.buyer)
    );
  }
  // Group by viewBy, with special handling for color and fabric
  let groups = {};
  if (viewBy === "color") {
    filteredProducts.forEach((p) => {
      p.color.forEach((color) => {
        if (!groups[color]) groups[color] = [];
        groups[color].push(p);
      });
    });
  } else if (viewBy === "fabric") {
    filteredProducts.forEach((p) => {
      if (Array.isArray(p.fabric)) {
        p.fabric.forEach((fabric) => {
          if (!groups[fabric]) groups[fabric] = [];
          groups[fabric].push(p);
        });
      } else if (p.fabric) {
        if (!groups[p.fabric]) groups[p.fabric] = [];
        groups[p.fabric].push(p);
      }
    });
  } else {
    const groupKey =
      viewBy === "year"
        ? (p) => new Date(p.date_added).getFullYear()
        : viewBy === "quarter"
        ? (p) =>
            `Q${
              Math.floor(new Date(p.date_added).getMonth() / 3) + 1
            } ${new Date(p.date_added).getFullYear()}`
        : viewBy === "month"
        ? (p) =>
            `${new Date(p.date_added).getMonth() + 1}/${new Date(
              p.date_added
            ).getFullYear()}`
        : viewBy === "line"
        ? (p) => p.product_line
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

  // State for all filter rows
  const [activeFilters, setActiveFilters] = useState([]); // e.g. ["Color", "Fabric"]
  const [selectedColors, setSelectedColors] = useState([]); // empty = all
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedLines, setSelectedLines] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);

  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelProducts, setSidePanelProducts] = useState([]);
  const [sidePanelFilterLabel, setSidePanelFilterLabel] = useState("");
  const [selectedBar, setSelectedBar] = useState(null); // for highlight

  const chartData = getChartData({
    viewBy: mainChartCategory,
    dateRangeType: useCustom ? "custom" : dateRangeType,
    dateRangeValue,
    customStart,
    customEnd,
    selectedColors,
    selectedFabrics,
    selectedSeasons,
    selectedLines,
    selectedBuyers,
  });

  // --- Margin chart data (now inside component) ---
  const marginChartData = chartData.map((d) => ({
    x: d.x,
    margin:
      d.avgPrice && d.avgCost
        ? Number((((d.avgPrice - d.avgCost) / d.avgPrice) * 100).toFixed(1))
        : 0,
  }));

  // --- Pie chart data for average margin (FIXED) ---
  const filteredProducts = getFilteredProducts({
    dateRangeType,
    dateRangeValue,
    customStart,
    customEnd,
    useCustom,
    selectedColors,
    selectedFabrics,
    selectedSeasons,
    selectedLines,
    selectedBuyers,
  });
  const avgPrice =
    filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0) /
        filteredProducts.length
      : 0;
  const avgCost =
    filteredProducts.length > 0
      ? filteredProducts.reduce((sum, p) => sum + (p.cost || 0), 0) /
        filteredProducts.length
      : 0;
  const pieData = [
    { name: "avg cost", value: avgCost },
    { name: "margin", value: Math.max(avgPrice - avgCost, 0) },
  ];
  const pieColors = ["#E6F0F8", "#C4E7FF"];

  // --- Buyer ranking chart data (now inside component) ---
  let allFilteredProducts = [];
  catalogueData.clothing_inventory.forEach((seasonObj) => {
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
          inRange = date >= start && date <= now;
        }
        // Color filter
        let colorMatch = true;
        if (selectedColors && selectedColors.length > 0) {
          colorMatch = Array.isArray(product.color)
            ? product.color.some((c) => selectedColors.includes(c))
            : selectedColors.includes(product.color);
        }
        // Fabric filter
        let fabricMatch = true;
        if (selectedFabrics && selectedFabrics.length > 0) {
          fabricMatch = Array.isArray(product.fabric)
            ? product.fabric.some((f) => selectedFabrics.includes(f))
            : selectedFabrics.includes(product.fabric);
        }
        // Season filter
        let seasonMatch = true;
        if (selectedSeasons && selectedSeasons.length > 0) {
          seasonMatch = selectedSeasons.includes(seasonObj.season);
        }
        // Line filter
        let lineMatch = true;
        if (selectedLines && selectedLines.length > 0) {
          lineMatch = selectedLines.includes(line.name);
        }
        // Buyer filter
        let buyerMatch = true;
        if (selectedBuyers && selectedBuyers.length > 0) {
          buyerMatch = selectedBuyers.includes(product.buyer);
        }
        if (
          inRange &&
          colorMatch &&
          fabricMatch &&
          seasonMatch &&
          lineMatch &&
          buyerMatch
        ) {
          allFilteredProducts.push({
            ...product,
            season: seasonObj.season,
            product_line: line.name
          });
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

  // Helper: get all filtered products for Product View
  const getAllFilteredProducts = () => {
    return getFilteredProducts({
      dateRangeType,
      dateRangeValue,
      customStart,
      customEnd,
      useCustom,
      selectedColors,
      selectedFabrics,
      selectedSeasons,
      selectedLines,
      selectedBuyers,
    });
  };

  // Chart click handler (bar/dot)
  const handleBarOrDotClick = (data) => {
    // If already selected, clear filter and highlight
    if (selectedBar && selectedBar === (data.x || data.season || "")) {
      setSidePanelProducts(getAllFilteredProducts());
      setSidePanelFilterLabel("");
      setSelectedBar(null);
      return;
    }
    setSidePanelProducts(data.products || []);
    setSidePanelFilterLabel(data.x || data.season || "");
    setSidePanelOpen(true);
    setSelectedBar(data.x || data.season || "");
  };

  // Product View button handler (toggle)
  const handleProductViewClick = () => {
    if (sidePanelOpen) {
      setSidePanelOpen(false);
      setSelectedBar(null);
    } else {
      setSidePanelOpen(true);
    }
  };

  // Update side panel products live when filters change and no bar/dot is selected
  useEffect(() => {
    if (sidePanelOpen && !sidePanelFilterLabel) {
      setSidePanelProducts(getAllFilteredProducts());
    }
    // eslint-disable-next-line
  }, [sidePanelOpen, dateRangeType, dateRangeValue, customStart, customEnd, useCustom, selectedColors, selectedFabrics, selectedSeasons, selectedLines, selectedBuyers]);

  // Track hovered/active index for tooltip
  const [activeTooltipIndex, setActiveTooltipIndex] = useState(null);

  // Add filter dropdown logic
  const [addFilterDropdownOpen, setAddFilterDropdownOpen] = useState(false);
  const addFilterRef = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (addFilterRef.current && !addFilterRef.current.contains(e.target)) {
        setAddFilterDropdownOpen(false);
      }
    }
    if (addFilterDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [addFilterDropdownOpen]);

  // Helper function to check if any filter is not "all selected"
  const hasPartialFilters = () => {
    return (
      (selectedColors.length > 0 && selectedColors.length < getAllColors().length) ||
      (selectedFabrics.length > 0 && selectedFabrics.length < getAllFabrics().length) ||
      (selectedSeasons.length > 0 && selectedSeasons.length < getAllSeasons().length) ||
      (selectedLines.length > 0 && selectedLines.length < getAllLines().length) ||
      (selectedBuyers.length > 0 && selectedBuyers.length < getAllBuyers().length)
    );
  };

  function clearAllFilters() {
    setActiveFilters([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedSeasons([]);
    setSelectedLines([]);
    setSelectedBuyers([]);
    setDateRangeType("year");
    setDateRangeValue(1);
    setUseCustom(false);
    const now = new Date();
    const start = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );
    setCustomStart(start);
    setCustomEnd(now);
  }

  // Helper to get all unique colors from the filtered data
  const getAllColors = () => {
    const filteredProducts = getFilteredProducts({
      dateRangeType,
      dateRangeValue,
      customStart,
      customEnd,
      useCustom,
      selectedColors: [], // Empty to get all colors
      selectedFabrics: selectedFabrics,
      selectedSeasons: selectedSeasons,
      selectedLines: selectedLines,
      selectedBuyers: selectedBuyers,
    });
    const colorSet = new Set();
    filteredProducts.forEach((p) => {
      if (Array.isArray(p.color)) {
        p.color.forEach((c) => colorSet.add(c));
      } else if (p.color) {
        colorSet.add(p.color);
      }
    });
    return Array.from(colorSet).sort();
  };

  // Helper to get all unique fabrics from the filtered data
  const getAllFabrics = () => {
    const filteredProducts = getFilteredProducts({
      dateRangeType,
      dateRangeValue,
      customStart,
      customEnd,
      useCustom,
      selectedColors: selectedColors,
      selectedFabrics: [], // Empty to get all fabrics
      selectedSeasons: selectedSeasons,
      selectedLines: selectedLines,
      selectedBuyers: selectedBuyers,
    });
    const fabricSet = new Set();
    filteredProducts.forEach((p) => {
      if (Array.isArray(p.fabric)) {
        p.fabric.forEach((f) => fabricSet.add(f));
      } else if (p.fabric) {
        fabricSet.add(p.fabric);
      }
    });
    return Array.from(fabricSet).sort();
  };

  // Helper to get all unique seasons from the filtered data
  const getAllSeasons = () => {
    const filteredProducts = getFilteredProducts({
      dateRangeType,
      dateRangeValue,
      customStart,
      customEnd,
      useCustom,
      selectedColors: selectedColors,
      selectedFabrics: selectedFabrics,
      selectedSeasons: [], // Empty to get all seasons
      selectedLines: selectedLines,
      selectedBuyers: selectedBuyers,
    });
    const seasonSet = new Set();
    filteredProducts.forEach((p) => {
      if (p.season) seasonSet.add(p.season);
    });
    return Array.from(seasonSet).sort();
  };

  // Helper to get all unique product lines from the filtered data
  const getAllLines = () => {
    const filteredProducts = getFilteredProducts({
      dateRangeType,
      dateRangeValue,
      customStart,
      customEnd,
      useCustom,
      selectedColors: selectedColors,
      selectedFabrics: selectedFabrics,
      selectedSeasons: selectedSeasons,
      selectedLines: [], // Empty to get all lines
      selectedBuyers: selectedBuyers,
    });
    const lineSet = new Set();
    filteredProducts.forEach((p) => {
      if (p.product_line) lineSet.add(p.product_line);
    });
    return Array.from(lineSet).sort();
  };

  // Helper to get all unique buyers from the filtered data
  const getAllBuyers = () => {
    const filteredProducts = getFilteredProducts({
      dateRangeType,
      dateRangeValue,
      customStart,
      customEnd,
      useCustom,
      selectedColors: selectedColors,
      selectedFabrics: selectedFabrics,
      selectedSeasons: selectedSeasons,
      selectedLines: selectedLines,
      selectedBuyers: [], // Empty to get all buyers
    });
    const buyerSet = new Set();
    filteredProducts.forEach((p) => {
      if (p.buyer) buyerSet.add(p.buyer);
    });
    return Array.from(buyerSet).sort();
  };

  // Helper: create a human-readable filter summary
  const getFilterSummary = () => {
    const parts = [];
    // Date range
    if (useCustom) {
      parts.push(`Date: ${customStart.toISOString().slice(0, 10)} to ${customEnd.toISOString().slice(0, 10)}`);
    } else {
      parts.push(`Date: Past ${dateRangeValue} ${dateRangeType}${dateRangeValue > 1 ? 's' : ''}`);
    }
    // Filters
    if (selectedColors.length > 0) parts.push(`Color: ${selectedColors.join(', ')}`);
    if (selectedFabrics.length > 0) parts.push(`Fabric: ${selectedFabrics.join(', ')}`);
    if (selectedSeasons.length > 0) parts.push(`Season: ${selectedSeasons.join(', ')}`);
    if (selectedLines.length > 0) parts.push(`Line: ${selectedLines.join(', ')}`);
    if (selectedBuyers.length > 0) parts.push(`Buyer: ${selectedBuyers.join(', ')}`);
    return parts.join(' | ');
  };

  return (
    <div
      className={`rounded-xl mx-auto p-8 mb-8 chart-card transition-all duration-300 ${sidePanelOpen ? 'ml-12 mr-[40vw]' : 'w-[80vw] mx-auto'}`}
    >
      <ProductSidePanel
        open={sidePanelOpen}
        onClose={() => {
          setSidePanelOpen(false);
          setSelectedBar(null);
        }}
        products={sidePanelProducts}
        filterLabel={
          sidePanelFilterLabel
            ? `${getFilterSummary()}${getFilterSummary() && sidePanelFilterLabel ? ' | ' : ''}${sidePanelFilterLabel ? `Filtered by: ${sidePanelFilterLabel}` : ''}`
            : getFilterSummary()
        }
      />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 text-text-color font-semibold text-lg relative truncate">
            {editingTitle ? (
              <div className="relative w-full">
                <input
                  className="font-semibold text-lg text-text-color outline-none "
                  value={chartTitle}
                  autoFocus
                  onChange={(e) => setChartTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingTitle(false);
                  }}
                  style={{ minWidth: 120 }}
                />
                <span className="block h-0.5 bg-[#3398FF] scale-x-100 transition-transform origin-left duration-200 mt-1 rounded-full" />
              </div>
            ) : (
              <span
                className="cursor-pointer group inline-block w-full relative truncate"
                onClick={() => setEditingTitle(true)}
                title="Click to edit title"
              >
                {chartTitle}
                <span className="block h-0.5 bg-[#3398FF] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1 rounded-full" />
              </span>
            )}
          </div>
          {/* Product View Button */}
          <div
            className="flex items-center gap-2 px-2 py-1 rounded hover:cursor-pointer whitespace-nowrap ml-20"
            onClick={handleProductViewClick}
            title="Product View"
          >
            {/* product view icon */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="9" y="2" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="16" y="2" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="2" y="9" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="9" y="9" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="16" y="9" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="2" y="16" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="9" y="16" width="4" height="4" rx="1" fill="#3398FF"/>
              <rect x="16" y="16" width="4" height="4" rx="1" fill="#3398FF"/>
            </svg>
            <span className="text-[#3398FF] font-sm whitespace-nowrap">Product View</span>
          </div>
        </div>
      </div>
      {/* Chart settings summary */}
      <div className="mb-6 text-sm font-medium" style={{ color: "#215273" }}>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Date Range */}
          <span className="flex items-center gap-1">
            <img src="/calendar.svg" alt="" className="w-4 h-4" />
        {useCustom
              ? `${customStart.toISOString().slice(0, 10)} to ${customEnd
              .toISOString()
              .slice(0, 10)}`
          : `Past ${dateRangeValue} ${
              dateRangeTypes.find((d) => d.value === dateRangeType)?.label
            }${dateRangeValue > 1 ? "s" : ""}`}
          </span>

          {/* Active Filters */}
          {selectedColors.length > 0 && selectedColors.length < getAllColors().length && (
            <span className="flex items-center gap-1">
              <img src="/filter.svg" alt="" className="w-4 h-4" />
              {selectedColors.length === 1 
                ? selectedColors[0]
                : `${selectedColors.length} colors`}
          </span>
          )}
          {selectedFabrics.length > 0 && selectedFabrics.length < getAllFabrics().length && (
            <span className="flex items-center gap-1">
              <img src="/filter.svg" alt="" className="w-4 h-4" />
              {selectedFabrics.length === 1 
                ? selectedFabrics[0]
                : `${selectedFabrics.length} fabrics`}
            </span>
          )}
          {selectedSeasons.length > 0 && selectedSeasons.length < getAllSeasons().length && (
            <span className="flex items-center gap-1">
              <img src="/filter.svg" alt="" className="w-4 h-4" />
              {selectedSeasons.length === 1 
                ? selectedSeasons[0]
                : `${selectedSeasons.length} seasons`}
          </span>
          )}
          {selectedLines.length > 0 && selectedLines.length < getAllLines().length && (
            <span className="flex items-center gap-1">
              <img src="/filter.svg" alt="" className="w-4 h-4" />
              {selectedLines.length === 1 
                ? selectedLines[0]
                : `${selectedLines.length} lines`}
            </span>
          )}
          {selectedBuyers.length > 0 && selectedBuyers.length < getAllBuyers().length && (
            <span className="flex items-center gap-1">
              <img src="/filter.svg" alt="" className="w-4 h-4" />
              {selectedBuyers.length === 1 
                ? selectedBuyers[0]
                : `${selectedBuyers.length} buyers`}
            </span>
          )}
          </div>
        </div>

      {/* Filter row */}
      <div className="mb-6 bg-white">
            {/* Date range row (always present) */}
        <div className="flex flex-wrap items-center gap-4 border border-[#E9EDEF] p-4 my-[-1px] rounded-t-md">
              <span
                className="text-text-color font-medium w-[90px] text-left"
                style={{ color: "#215273" }}
              >
                Date Range
              </span>
              {/* Start date input with calendar icon */}
              <div className="relative flex items-center">
                <div className="relative w-full">
                  <input
                    type="date"
                    className="w-full px-1 py-0.5 rounded border border-[#E9EDEF] bg-transparent text-text-color focus:outline-none"
                    value={customStart.toISOString().slice(0, 10)}
                    onChange={(e) => {
                      setCustomStart(new Date(e.target.value));
                      setUseCustom(true);
                    }}
                    style={{ minWidth: 120 }}
                  />
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-7 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.previousSibling.showPicker();
                    }}
                  />
                </div>
              </div>
              <span style={{ color: "#215273" }}>to</span>
              {/* End date input with calendar icon */}
              <div className="relative flex items-center">
                <div className="relative w-full">
                  <input
                    type="date"
                    className="w-full px-1 py-0.5 rounded border border-[#E9EDEF] bg-transparent text-text-color focus:outline-none"
                    value={customEnd.toISOString().slice(0, 10)}
                    onChange={(e) => {
                      setCustomEnd(new Date(e.target.value));
                      setUseCustom(true);
                    }}
                    style={{ minWidth: 120 }}
                  />
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-7 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.previousSibling.showPicker();
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 ml-2 flex-wrap">
                {[
                  { label: "Past Month", type: "month", value: 1 },
                  { label: "Past Quarter", type: "quarter", value: 1 },
                  { label: "Past Year", type: "year", value: 1 },
                  { label: "Past 5 Year", type: "year", value: 5 },
                ].map((opt) => {
                  const isActive =
                    !useCustom &&
                    dateRangeType === opt.type &&
                    dateRangeValue === opt.value;
                  return (
                    <div
                      key={opt.label}
                      className={`px-3 py-1 rounded border border-[#E9EDEF] text-sm font-medium cursor-pointer select-none transition-colors ${
                        isActive
                          ? "bg-[#DCF1FF] text-[#3398FF]"
                          : "bg-[#F4F6F7] text-text-color hover:bg-[#F5F8FA]"
                      }`}
                      onClick={() => {
                        setDateRangeType(opt.type);
                        setDateRangeValue(opt.value);
                        setUseCustom(false);
                        // Set customStart/customEnd to match quick range
                        const now = new Date();
                        let start;
                        if (opt.type === "year") {
                          start = new Date(
                            now.getFullYear() - opt.value,
                            now.getMonth(),
                            now.getDate()
                          );
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
        {/* Top controls row: Add Filter, Filter, Clear All Filters */}
        <div
          className={`flex items-center gap-2 border border-[#E9EDEF] p-4 relative w-full mb-[-1px]${activeFilters.length === 0 ? ' rounded-b-md' : ''}`}
        >
          <img src="/add-blue.svg" alt="Filter" className="w-4 h-4" />
          <span
            className="text-[#3398FF] font-medium cursor-pointer select-none"
            onClick={() => { setAddFilterDropdownOpen((v) => !v); if (!expanded) onToggleExpand(); }}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setAddFilterDropdownOpen((v) => !v); if (!expanded) onToggleExpand(); } }}
          >
            Add filter
          </span>
          {addFilterDropdownOpen && (
            <div
              ref={addFilterRef}
              className="absolute left-0 top-full w-48 bg-white border border-[#E9EDEF] rounded shadow-lg z-50"
            >
              <div
                className="px-4 py-2 hover:bg-[#F5F8FA] cursor-pointer text-text-color font-semibold border-b border-[#E9EDEF]"
                onClick={() => {
                  const all = ["Color", "Fabric", "Season", "Line", "Buyer"];
                  setActiveFilters([
                    ...activeFilters,
                    ...all.filter((f) => !activeFilters.includes(f)),
                  ]);
                  setAddFilterDropdownOpen(false);
                }}
              >
                All filters
              </div>
              {["Color", "Fabric", "Season", "Line", "Buyer"]
                .filter((f) => !activeFilters.includes(f))
                .map((f) => (
                  <div
                    key={f}
                    className="px-4 py-2 hover:bg-[#F5F8FA] cursor-pointer text-text-color"
                    onClick={() => {
                      setActiveFilters([...activeFilters, f]);
                      setAddFilterDropdownOpen(false);
                    }}
                  >
                    {f}
                  </div>
                ))}
              {activeFilters.length === 5 && (
                <div className="px-4 py-2 text-[#A3B3BF]">
                  All filters added
                </div>
              )}
            </div>
          )}
          {/* Filter button */}
          <span
            className="flex items-center gap-1 ml-4 text-[#3398FF] font-medium cursor-pointer select-none"
            onClick={onToggleExpand}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onToggleExpand();
            }}
          >
            <img src="/filter-blue.svg" alt="Filter" className="w-5 h-5 mr-1" />
            {expanded 
              ? `Hide filter (${[
                  selectedColors.length > 0 && selectedColors.length < getAllColors().length,
                  selectedFabrics.length > 0 && selectedFabrics.length < getAllFabrics().length,
                  selectedSeasons.length > 0 && selectedSeasons.length < getAllSeasons().length,
                  selectedLines.length > 0 && selectedLines.length < getAllLines().length,
                  selectedBuyers.length > 0 && selectedBuyers.length < getAllBuyers().length
                ].filter(Boolean).length})` 
              : `Show filter (${[
                  selectedColors.length > 0 && selectedColors.length < getAllColors().length,
                  selectedFabrics.length > 0 && selectedFabrics.length < getAllFabrics().length,
                  selectedSeasons.length > 0 && selectedSeasons.length < getAllSeasons().length,
                  selectedLines.length > 0 && selectedLines.length < getAllLines().length,
                  selectedBuyers.length > 0 && selectedBuyers.length < getAllBuyers().length
                ].filter(Boolean).length})`}
          </span>
          <div className="ml-auto">
            <span
              className={`font-medium cursor-pointer select-none transition-colors ${
                activeFilters.length === 0
                  ? "text-[#A3B3BF] cursor-not-allowed"
                  : "text-[#A3B3BF] hover:text-[#3398FF]"
              }`}
              onClick={() => {
                if (activeFilters.length > 0) {
                  if (hasPartialFilters()) {
                    setShowClearConfirmation(true);
                  } else {
                    clearAllFilters();
                  }
                }
              }}
              tabIndex={activeFilters.length === 0 ? -1 : 0}
              onKeyDown={(e) => {
                if (activeFilters.length > 0 && (e.key === "Enter" || e.key === " ")) {
                  if (hasPartialFilters()) {
                    setShowClearConfirmation(true);
                  } else {
                    clearAllFilters();
                  }
                }
              }}
            >
              Clear all filters
            </span>
          </div>
        </div>

        {expanded && (
          <div className="rounded-lg flex flex-col">
            
            {/* Conditionally render filter rows */}
            {activeFilters.includes("Color") && (
              <FilterRow
                label="Color"
                options={getAllColors()}
                selectedValues={selectedColors}
                setSelectedValues={setSelectedColors}
                colorDot
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                isLast={activeFilters[activeFilters.length - 1] === "Color"}
              />
            )}
            {activeFilters.includes("Fabric") && (
              <FilterRow
                label="Fabric"
                options={getAllFabrics()}
                selectedValues={selectedFabrics}
                setSelectedValues={setSelectedFabrics}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                isLast={activeFilters[activeFilters.length - 1] === "Fabric"}
              />
            )}
            {activeFilters.includes("Season") && (
              <FilterRow
                label="Season"
                options={getAllSeasons()}
                selectedValues={selectedSeasons}
                setSelectedValues={setSelectedSeasons}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                isLast={activeFilters[activeFilters.length - 1] === "Season"}
              />
            )}
            {activeFilters.includes("Line") && (
              <FilterRow
                label="Line"
                options={getAllLines()}
                selectedValues={selectedLines}
                setSelectedValues={setSelectedLines}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                isLast={activeFilters[activeFilters.length - 1] === "Line"}
              />
            )}
            {activeFilters.includes("Buyer") && (
              <FilterRow
                label="Buyer"
                options={getAllBuyers()}
                selectedValues={selectedBuyers}
                setSelectedValues={setSelectedBuyers}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                isLast={activeFilters[activeFilters.length - 1] === "Buyer"}
              />
            )}
          </div>
        )}
      </div>
      {/* Chart */}
      <div className="w-full flex flex-col lg:flex-row gap-4">
        {/* Main chart */}
        <div className="flex-1 min-w-0">
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
            chartHeight={550}
            selectedBar={selectedBar}
          />
        </div>
        {/* Two smaller charts */}
        <div className="flex flex-row lg:flex-col gap-4 lg:w-[320px] lg:min-w-[220px] lg:max-w-[340px]">
          {/* Avg Margin Pie Chart */}
          <div className="flex-1 min-h-[100px] lg:h-[200px]">
            <MarginPieChart
              avgPrice={avgPrice}
              avgCost={avgCost}
              pieData={pieData}
              pieColors={pieColors}
              height={200}
            />
          </div>
          {/* Buyer ranking */}
          <div className="flex-1 min-h-[100px] lg:h-[341px]">
            <BuyerRankingChart buyerRanking={buyerRanking} height={341} />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={clearAllFilters}
        title="Clear All Filters"
        message="You have selected specific values in some filters. Are you sure you want to clear all filters?"
        confirmText="Clear All"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ChartCard;
