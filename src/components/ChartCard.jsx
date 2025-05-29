import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import shirtData from '../data/shirts.js';
import CustomChartTooltip from './CustomChartTooltip';

// Calculate average price and cost per season, and keep product references
function getSeasonAvgPriceData() {
  return shirtData.clothing_inventory.map(seasonObj => {
    let totalPrice = 0;
    let totalCost = 0;
    let count = 0;
    let products = [];
    seasonObj.product_lines.forEach(line => {
      line.products.forEach(product => {
        totalPrice += product.price;
        totalCost += product.cost;
        count++;
        products.push(product);
      });
    });
    return {
      season: seasonObj.season,
      avgPrice: count ? (totalPrice / count) : 0,
      avgCost: count ? (totalCost / count) : 0,
      products
    };
  });
}

const chartData = getSeasonAvgPriceData();

const ChartCard = () => {
  return (
    <div className="bg-white rounded-xl border border-[#DDE9F3] p-12 mb-8 mx-auto" style={{ width: '80vw', maxWidth: 1200 }}>
      <div className="text-[#215273] font-semibold text-lg mb-12">Average Price by Season</div>
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#EAEAEA" />
            <XAxis dataKey="season" stroke="#A3B3BF" tick={{ fill: '#A3B3BF', fontSize: 14 }} />
            <YAxis stroke="#A3B3BF" tick={{ fill: '#A3B3BF', fontSize: 14 }} />
            <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#E6F0F8' }} />
            <Bar dataKey="avgPrice" fill="#C4E7FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
