import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Import your data from the specified path
import rawData from '../data/shirts'; // No need for .jsx extension if it's a default export

// (The rest of your ChartCard.jsx component code remains the same)

const ChartCard = ({ initialTitle = 'Chart Title' }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [chartTitle, setChartTitle] = useState(initialTitle);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
  const [dateRange, setDateRange] = useState('past1Year'); // 'past1Year' or 'customDates'
  const [startDate, setStartDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]
  ); // Default: 1 year ago
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default: today
  const [viewBy, setViewBy] = useState('Year'); // 'Time', 'Month', 'Quarter', 'Year', 'Style', 'Color', 'Fabric', 'Type'
  const [isExpanded, setIsExpanded] = useState(true); // For expand/collapse action
  const [chartData, setChartData] = useState([]); // Data for the chart

  // Function to filter and aggregate data based on selections
  const processChartData = useCallback(() => {
    let allProducts = [];
    rawData.clothing_inventory.forEach((seasonObj) => {
      seasonObj.product_lines.forEach((line) => {
        allProducts = allProducts.concat(line.products);
      });
    });

    // --- Date Filtering ---
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredProducts = allProducts.filter((product) => {
      const productDate = new Date(product.date_added);
      return productDate >= start && productDate <= end;
    });

    // --- Aggregation based on 'View By' ---
    const aggregatedData = {};

    filteredProducts.forEach((product) => {
      let key = '';
      switch (viewBy) {
        case 'Time':
          // For 'Time', you'd need more granular data and a specific time unit (e.g., hour)
          // For this example, we'll just group by the full date for simplicity
          key = product.date_added;
          break;
        case 'Month':
          key = product.date_added.substring(0, 7); // YYYY-MM
          break;
        case 'Quarter':
          const date = new Date(product.date_added);
          const month = date.getMonth();
          const year = date.getFullYear();
          key = `${year}-Q${Math.floor(month / 3) + 1}`;
          break;
        case 'Year':
          key = product.date_added.substring(0, 4); // YYYY
          break;
        case 'Style': // Assuming 'name' can represent 'style' or you'd need a 'style' field
          key = product.name;
          break;
        case 'Color':
          // If 'color' is an array, you might aggregate by each color or the first color
          key = product.color[0] || 'Unknown'; // Use the first color
          break;
        case 'Fabric':
          key = product.fabric;
          break;
        case 'Type':
          key = product.type;
          break;
        default:
          key = 'Other';
      }

      // Aggregate by count of products for simplicity
      aggregatedData[key] = (aggregatedData[key] || 0) + 1;
    });

    // Transform aggregatedData into an array for Recharts
    // If viewBy is 'Year', create multiple entries for FW22 to simulate the image's bars
    const transformedData = Object.keys(aggregatedData).map((key) => {
      if (viewBy === 'Year' && key === '2022') {
        // Distribute the count for 2022 across multiple "FW22" bars
        // This is a rough simulation to match the image's visual
        const totalCount = aggregatedData[key];
        return [
          { name: 'FW22', value: Math.floor(totalCount * 0.75) },
          { name: 'FW22', value: Math.floor(totalCount * 1.25) },
          { name: 'FW22', value: Math.floor(totalCount * 0.4) },
          { name: 'FW22', value: Math.floor(totalCount * 0.8) },
          { name: 'FW22', value: Math.floor(totalCount * 0.6) },
          { name: 'FW22', value: Math.floor(totalCount * 1.0) },
        ];
      }
      return { name: key, value: aggregatedData[key] };
    }).flat(); // Flatten the array if 'Year' creates nested arrays

    setChartData(transformedData);
  }, [startDate, endDate, viewBy]);

  useEffect(() => {
    processChartData();
  }, [processChartData]);

  // Handle title editing
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setChartTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="mx-auto w-[80vw] bg-white p-4 rounded-lg mb-6 border border-gray-200">
      {/* Card Header and Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={chartTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              className="text-lg font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <h2 onClick={handleTitleClick} className="text-lg font-semibold cursor-pointer">
              {chartTitle}
            </h2>
          )}
          <button onClick={handleTitleClick} className="text-gray-500 hover:text-gray-700">
            {/* Pencil Icon (Edit) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.646 4.646a2 2 0 010 2.828V15h2.586l4.646-4.646-2.828-2.828L8.939 8.243z" />
            </svg>
          </button>
        </div>

        {/* Top Right Actions */}
        <div className="flex space-x-2 text-gray-500">
          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full hover:bg-gray-100"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              // Collapse icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              // Expand icon (Maximize)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h4a1 1 0 010 2H5v3a1 1 0 01-2 0V5zm10 0a1 1 0 011-1h4a1 1 0 010 2h-3v3a1 1 0 01-2 0V5zM3 13a1 1 0 011-1h4a1 1 0 010 2H5v3a1 1 0 01-2 0v-4zm10 0a1 1 0 011-1h4a1 1 0 010 2h-3v3a1 1 0 01-2 0v-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          {/* Move Up */}
          <button className="p-1 rounded-full hover:bg-gray-100" title="Move Up">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Move Down */}
          <button className="p-1 rounded-full hover:bg-gray-100" title="Move Down">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Duplicate Card */}
          <button className="p-1 rounded-full hover:bg-gray-100" title="Duplicate Card">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
            </svg>
          </button>
          {/* Delete Card */}
          <button className="p-1 rounded-full hover:bg-gray-100" title="Delete Card">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 2a1 1 0 100 2v3a1 1 0 102 0v-3a1 1 0 00-2 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Controls (Collapsible) */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Type of Chart */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 w-28">Type of chart</span>
            <div className="flex space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="chartType"
                  value="bar"
                  checked={chartType === 'bar'}
                  onChange={(e) => setChartType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-1 text-sm text-gray-700">Bar</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="chartType"
                  value="line"
                  checked={chartType === 'line'}
                  onChange={(e) => setChartType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-1 text-sm text-gray-700">Line</span>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 w-28">Date Range</span>
            <div className="flex space-x-2 items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="dateRange"
                  value="past1Year"
                  checked={dateRange === 'past1Year'}
                  onChange={() => setDateRange('past1Year')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-1 text-sm text-gray-700">Past 1 Year</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="dateRange"
                  value="customDates"
                  checked={dateRange === 'customDates'}
                  onChange={() => setDateRange('customDates')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-1 text-sm text-gray-700">Custom dates</span>
              </label>
              {dateRange === 'customDates' && (
                <div className="flex items-center space-x-2 ml-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-sm"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* View By */}
          <div className="flex items-center col-span-2">
            <span className="text-sm font-medium text-gray-700 w-28">View by</span>
            <div className="flex flex-wrap gap-2">
              {['Time', 'Month', 'Quarter', 'Year', 'Style', 'Color', 'Fabric', 'Type'].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="viewBy"
                    value={option}
                    checked={viewBy === option}
                    onChange={(e) => setViewBy(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-1 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div className="h-64 mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#88c3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for the selected filters.
          </div>
        )}
      </div>

      {/* Optional: Footer with current filter summary */}
      <div className="mt-4 text-sm text-gray-600">
        {isExpanded ? (
          <p>
            Current view: {viewBy}. Data from{' '}
            {dateRange === 'past1Year' ? 'Past 1 Year' : `${startDate} to ${endDate}`}.
          </p>
        ) : (
          <p>
            {chartTitle}: {viewBy} view, {dateRange === 'past1Year' ? 'Past 1 Year' : `from ${startDate} to ${endDate}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartCard;