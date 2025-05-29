import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import shirtData from '../data/shirts.js';

// Calculate average price per season
function getSeasonAvgPriceData() {
  return shirtData.clothing_inventory.map(seasonObj => {
    let total = 0;
    let count = 0;
    seasonObj.product_lines.forEach(line => {
      line.products.forEach(product => {
        total += product.price;
        count++;
      });
    });
    return {
      season: seasonObj.season,
      avgPrice: count ? (total / count) : 0
    };
  });
}

const chartData = getSeasonAvgPriceData();

const ChartCard = () => {
  return (
    <div className="bg-white rounded-xl border border-[#DDE9F3] p-12 mb-8 mx-auto" style={{ width: '80vw', maxWidth: 1200 }}>
      <div className="text-[#3398FF] font-semibold text-lg mx-8 mb-16">Average Price by Season</div>
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#EAEAEA" />
            <XAxis dataKey="season" stroke="#A3B3BF" tick={{ fill: '#A3B3BF', fontSize: 14 }} />
            <YAxis stroke="#A3B3BF" tick={{ fill: '#A3B3BF', fontSize: 14 }} />
            <Tooltip contentStyle={{ color: '#215273', background: '#fff', border: '1px solid #EAEAEA' }} labelStyle={{ color: '#A3B3BF' }} />
            <Bar dataKey="avgPrice" fill="#C4E7FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
