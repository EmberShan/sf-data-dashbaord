import React, { useState, useEffect, useCallback } from "react";
import ChartCard from "./components/ChartCard";
import Toolbar from "./components/Toolbar";
import "./App.css";

const App = () => {
  return (
    <div className="min-h-screen bg-blue w-screen">
      <Toolbar />

      {/* The charts */}
      <div className="pt-32 w-full mx-auto flex flex-col justify-center items-center">
        <ChartCard initialTitle="Product Count by Season & Type" />
        <ChartCard />
      </div>
    </div>
  );
};

export default App;
