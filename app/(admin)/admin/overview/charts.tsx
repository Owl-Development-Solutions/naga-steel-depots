"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from "recharts";

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentSales = payload[0].value;
      const currentIndex = salesData.findIndex(item => item.month === label);
      const previousSales = currentIndex > 0 ? salesData[currentIndex - 1].totalSales : 0;
      const isLowSales = currentSales < previousSales;
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className={`text-sm font-medium ${isLowSales ? 'text-red-600' : 'text-blue-600'}`}>
            Sales: ₱{currentSales.toLocaleString()}
          </p>
          {currentIndex > 0 && previousSales > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {isLowSales ? '↓' : '↑'} vs previous month: {Math.abs(((currentSales - previousSales) / previousSales * 100)).toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Process data to determine bar colors
  const processedData = salesData.map((item, index) => {
    const previousSales = index > 0 ? salesData[index - 1].totalSales : 0;
    const isLowSales = item.totalSales < previousSales;
    
    return {
      ...item,
      isLowSales,
      percentageChange: index > 0 && previousSales > 0 ? ((item.totalSales - previousSales) / previousSales * 100) : 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={processedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* Grid lines for better readability */}
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e5e7eb" 
          vertical={false}
        />
        
        {/* X-axis styling */}
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#6b7280' }}
        />
        
        {/* Y-axis styling */}
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#6b7280' }}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        
        {/* Professional tooltip */}
        <Tooltip content={<CustomTooltip />} />
        
        {/* Gradient definitions for different states */}
        <defs>
          {/* Blue gradient for normal/higher sales */}
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
          </linearGradient>
          
          {/* Red gradient for low sales */}
          <linearGradient id="lowSalesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
          </linearGradient>
        </defs>
        
        {/* Enhanced bar styling with dynamic colors */}
        <Bar
          dataKey="totalSales"
          radius={[8, 8, 0, 0]}
          maxBarSize={60}
        >
          {processedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.isLowSales ? "url(#lowSalesGradient)" : "url(#salesGradient)"} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
