import React, { useState, useEffect, useCallback } from "react";
import ChartCard from "./components/ChartCard";
import Toolbar from "./components/Toolbar";

const App = () => {
  return (
    <div className="min-h-screen bg-[#F9FBFC] w-screen">
      <Toolbar />

      {/* The charts */}
      <main className="w-full pt-32 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChartCard />
        <ChartCard />
      </main>
    </div>
  );
};

export default App;
