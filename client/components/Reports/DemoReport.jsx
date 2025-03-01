import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart2,
} from "lucide-react";

// Sample Data
const stockRecommendations = [
  {
    symbol: "AAPL",
    price: 180.5,
    peRatio: 28,
    revenueGrowth: 8,
    keyMetrics: "Services revenue: $20 billion (+12% YoY)",
    rationale: "Strong growth in services segment",
  },
  {
    symbol: "MSFT",
    price: 330.25,
    peRatio: 32,
    revenueGrowth: 15,
    keyMetrics: "Cloud revenue: $25 billion (+22% YoY)",
    rationale: "Dominance in cloud computing",
  },
];

const realtimeStocks = [
  {
    symbol: "AAPL",
    price: 180.5,
    change: 1.5,
    marketCap: "$2.8 trillion",
  },
  {
    symbol: "MSFT",
    price: 330.25,
    change: 2.0,
    marketCap: "$2.5 trillion",
  },
];

const growthData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1400 },
  { month: "Mar", revenue: 1300 },
  { month: "Apr", revenue: 1500 },
  { month: "May", revenue: 1700 },
];

// Components
const CustomCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center">
        {Icon && <Icon className="mr-2 text-purple-600" size={20} />}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CustomTable = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      {children}
    </table>
  </div>
);

const DemoReport = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      <CustomCard title="Executive Summary" icon={TrendingUp}>
        <div className="px-4 pb-4 text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
          maiores explicabo ut quas ipsum nemo accusamus aut, veritatis natus,
          iure maxime. Atque veniam itaque delectus fuga omnis commodi
          reprehenderit! Id? Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Dolores amet similique possimus obcaecati laboriosam nemo
          dignissimos consequatur cum id tenetur illum tempora sequi ipsum
          sapiente, dolorem harum ea esse. Incidunt!
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">Sector Growth</h3>
            <p className="text-2xl font-bold text-purple-600">12% YoY</p>
            <p className="text-sm text-gray-600">Q3 2023</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Cloud Services</h3>
            <p className="text-2xl font-bold text-blue-600">$250B</p>
            <p className="text-sm text-gray-600">+25% from Q2</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">AI Revenue</h3>
            <p className="text-2xl font-bold text-green-600">$50B</p>
            <p className="text-sm text-gray-600">30% Growth</p>
          </div>
        </div>
      </CustomCard>

      <CustomCard title="Revenue Growth Trend" icon={BarChart2}>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CustomCard>

      <CustomCard title="Stock Recommendations" icon={DollarSign}>
        <CustomTable
          headers={[
            "Stock",
            "Price",
            "P/E Ratio",
            "Growth (YoY)",
            "Key Metrics",
            "Rationale",
          ]}
        >
          <tbody className="bg-white divide-y divide-gray-200">
            {stockRecommendations.map((stock) => (
              <tr key={stock.symbol}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {stock.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${stock.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {stock.peRatio}x
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {stock.revenueGrowth}%
                </td>
                <td className="px-6 py-4">{stock.keyMetrics}</td>
                <td className="px-6 py-4">{stock.rationale}</td>
              </tr>
            ))}
          </tbody>
        </CustomTable>
      </CustomCard>

      <CustomCard title="Real-time Stock Prices" icon={AlertTriangle}>
        <CustomTable headers={["Stock", "Price", "Change (%)", "Market Cap"]}>
          <tbody className="bg-white divide-y divide-gray-200">
            {realtimeStocks.map((stock) => (
              <tr key={stock.symbol}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {stock.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${stock.price}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap ${
                    stock.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {stock.marketCap}
                </td>
              </tr>
            ))}
          </tbody>
        </CustomTable>
      </CustomCard>
    </div>
  );
};

export default DemoReport;