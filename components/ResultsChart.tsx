"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    Submitted: 4000,

    Ignored: 2400,
  },
  {
    name: "Feb",
    Submitted: 3000,
    Ignored: 2210,
  },
  {
    name: "Mar",
    Submitted: 2000,
    Ignored: 2290,
  },
  {
    name: "Apr",
    Submitted: 2780,
    Ignored: 2000,
  },
  {
    name: "May",
    Submitted: 1890,
    Ignored: 2181,
  },
  {
    name: "Jun",
    Submitted: 2390,
    Ignored: 2500,
  },
  {
    name: "July",
    Submitted: 3490,
    Ignored: 2100,
  },
  {
    name: "Aug",
    Submitted: 3490,
    Ignored: 2100,
  },
  {
    name: "Sept",
    Submitted: 3490,
    Ignored: 2100,
  },
  {
    name: "Oct",
    Submitted: 3490,
    Ignored: 2100,
  },
  {
    name: "Nov",
    Submitted: 3490,
    Ignored: 2100,
  },
  {
    name: "Dec",
    Submitted: 3490,
    Ignored: 2100,
  },
];

const ResultsChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg justify-between items-center">
          Forms Analytics
        </h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />

          <Line
            type="monotone"
            dataKey="Submitted"
            stroke="#c3ebfa"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="Ignored"
            stroke="#fae27b"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
