import React, { useState, useRef, useEffect } from "react";

// FilterRow.jsx
// A reusable filter row component that displays a dropdown for selecting multiple values.
// Features:
// - Dropdown with search functionality
// - Support for single/multiple selection
// - Visual chips for selected values
// - Color dot support for color filters
// - Keyboard accessibility
// - Close button to remove filter
//
// Props:
// - label: string - The label for the filter (e.g., "Color", "Fabric")
// - options: string[] - Array of available options
// - selectedValues: string[] - Currently selected values
// - setSelectedValues: function - Callback to update selected values
// - colorDot: boolean - Whether to show color dots (for color filter)
// - activeFilters: string[] - Array of active filter types
// - setActiveFilters: function - Callback to update active filters

const FilterRow = ({
  label,
  options,
  selectedValues,
  setSelectedValues,
  colorDot = false,
  activeFilters,
  setActiveFilters,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

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

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );
  const allSelected =
    selectedValues.length === 0 || selectedValues.length === options.length;

  function handleSelectValue(val) {
    if (selectedValues.includes(val)) {
      setSelectedValues(selectedValues.filter((v) => v !== val));
    } else {
      setSelectedValues([...selectedValues, val]);
    }
  }
  function handleRemoveChip(val) {
    setSelectedValues(selectedValues.filter((v) => v !== val));
  }
  function handleSelectAll() {
    setSelectedValues([]); // empty means all
    setDropdownOpen(false);
  }

  let dropdownText = "all";
  if (selectedValues.length === 0 || selectedValues.length === options.length) {
    dropdownText = "all";
  } else if (selectedValues.length === 0) {
    dropdownText = "none selected";
  } else {
    dropdownText = `${selectedValues.length} selected`;
  }

  return (
    <div className="flex items-center gap-4 w-full border border-[#E9EDEF] p-4 mb-[-1px]">
      <span
        className="text-[#215273] font-medium w-[120px] text-left"
        style={{ color: "#215273" }}
      >
        {label}
      </span>
      <div className="relative">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded border border-[#E9EDEF] text-sm font-medium cursor-pointer select-none min-w-[120px] bg-white"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          onClick={() => setDropdownOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setDropdownOpen((v) => !v);
          }}
          style={{ color: "#A3B3BF" }}
        >
          <span className="flex-1">{dropdownText}</span>
          <span
            className={`inline-block transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
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
              className={`px-3 py-1 rounded cursor-pointer font-medium text-[#215273] ${
                allSelected
                  ? "bg-[#E6F0F8] text-[#3398FF]"
                  : "hover:bg-[#F5F8FA]"
              }`}
              onClick={handleSelectAll}
              aria-selected={allSelected}
            >
              All {label.toLowerCase()}
            </div>
            <div className="my-2 border-t border-[#E9EDEF]" />
            <input
              type="text"
              className="w-full px-2 py-1 mb-2 rounded border border-[#E9EDEF] text-[#215273] bg-transparent focus:outline-none"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={`Search ${label.toLowerCase()}`}
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((val) => (
                <div
                  key={val}
                  className={`px-3 py-1 rounded cursor-pointer flex items-center gap-2 ${
                    selectedValues.includes(val)
                      ? "bg-[#E6F0F8] text-[#3398FF]"
                      : "hover:bg-[#F5F8FA] text-[#215273]"
                  }`}
                  onClick={() => handleSelectValue(val)}
                  aria-selected={selectedValues.includes(val)}
                  role="option"
                >
                  {colorDot && (
                    <span
                      className="w-3 h-3 rounded-full border border-[#E9EDEF] mr-2"
                      style={{ background: val.toLowerCase() }}
                    />
                  )}
                  {val}
                  {selectedValues.includes(val) && (
                    <span className="ml-auto">✓</span>
                  )}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-2 text-[#A3B3BF]">
                  No {label.toLowerCase()} found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Chips for selected values */}
      <div className="flex flex-wrap gap-2 ml-2 w-full">
        {selectedValues.length > 0 &&
          selectedValues.length < options.length &&
          selectedValues.map((val) => (
            <span
              key={val}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F0F8] text-[#3398FF] text-xs font-medium border border-[#C3E7FE]"
            >
              {val}
              <span
                className="ml-1 cursor-pointer text-[#A3B3BF] hover:text-[#215273]"
                tabIndex={0}
                aria-label={`Remove ${val}`}
                onClick={() => handleRemoveChip(val)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleRemoveChip(val);
                }}
              >
                ×
              </span>
            </span>
          ))}
      </div>
      <span
        className="ml-auto cursor-pointer text-[#A3B3BF] hover:text-[#215273] text-xl"
        tabIndex={0}
        aria-label={`Remove ${label} filter`}
        onClick={() => {
          setSelectedValues([]);
          setActiveFilters(activeFilters.filter(f => f !== label));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedValues([]);
            setActiveFilters(activeFilters.filter(f => f !== label));
          }
        }}
      >
        ×
      </span>
    </div>
  );
};

export default FilterRow; 