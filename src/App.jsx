import React, { useState } from "react";
import ChartCard from "./components/ChartCard";
import Toolbar from "./components/Toolbar";

const defaultChartSettings = () => ({
  chartType: "bar",
  viewBy: "year",
  dateRangeType: "year",
  dateRangeValue: 1,
  customStart: new Date(new Date().getFullYear(), 0, 1),
  customEnd: new Date(),
  useCustom: false,
  chartTitle: "Chart Title",
  expanded: true,
});

const App = () => {
  const [charts, setCharts] = useState([
    defaultChartSettings(),
  ]);

  // Handlers for chart actions
  const handleUpdate = (idx, updates) => {
    setCharts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...updates } : c))
    );
  };

  const handleToggleExpand = (idx) => {
    setCharts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, expanded: !c.expanded } : c))
    );
  };

  const handleDuplicate = (idx) => {
    setCharts((prev) => {
      const newChart = { ...prev[idx], chartTitle: prev[idx].chartTitle + " Copy" };
      const newArr = [...prev];
      newArr.splice(idx, 0, newChart);
      return newArr;
    });
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    setCharts((prev) => {
      const newArr = [...prev];
      [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      return newArr;
    });
  };

  const handleMoveDown = (idx) => {
    if (idx === charts.length - 1) return;
    setCharts((prev) => {
      const newArr = [...prev];
      [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
      return newArr;
    });
  };

  const handleDelete = (idx) => {
    setCharts((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-[#F9FBFC] w-screen">
      <Toolbar />
      <main className="w-full pt-32 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {charts.length === 0 ? (
          <div className="text-center text-[#A3B3BF]">No charts. Add one!</div>
        ) : (
          charts.map((chart, idx) => (
            <ChartCard
              key={idx}
              chartType={chart.chartType}
              setChartType={(v) => handleUpdate(idx, { chartType: v })}
              viewBy={chart.viewBy}
              setViewBy={(v) => handleUpdate(idx, { viewBy: v })}
              dateRangeType={chart.dateRangeType}
              setDateRangeType={(v) => handleUpdate(idx, { dateRangeType: v })}
              dateRangeValue={chart.dateRangeValue}
              setDateRangeValue={(v) => handleUpdate(idx, { dateRangeValue: v })}
              customStart={chart.customStart}
              setCustomStart={(v) => handleUpdate(idx, { customStart: v })}
              customEnd={chart.customEnd}
              setCustomEnd={(v) => handleUpdate(idx, { customEnd: v })}
              useCustom={chart.useCustom}
              setUseCustom={(v) => handleUpdate(idx, { useCustom: v })}
              chartTitle={chart.chartTitle}
              setChartTitle={(v) => handleUpdate(idx, { chartTitle: v })}
              expanded={chart.expanded}
              onToggleExpand={() => handleToggleExpand(idx)}
              onDuplicate={() => handleDuplicate(idx)}
              onMoveUp={() => handleMoveUp(idx)}
              onMoveDown={() => handleMoveDown(idx)}
              onDelete={() => handleDelete(idx)}
              isFirst={idx === 0}
              isLast={idx === charts.length - 1}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default App;
