import { Customer, columns } from "./columns";
import { DataTable } from "./data-table";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/shadcn/ui/card";
import { ChartContainer } from "@/shadcn/ui/chart";
import { Separator } from "@/shadcn/ui/separator";
import Topcard from "./Topcard";

import { getCustomers } from "./CustomerActions"; // Assuming you have this function to fetch customers

async function getData(): Promise<Customer[]> {
  try {
    const data = await getCustomers();
    return data ?? []; // Return an empty array if data is undefined
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    return []; // Ensure an empty array is returned in case of an error
  }
}
export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between">
        <Topcard
          title="Total Customers"
          description="Total number of customers"
          value={data.length.toString()}
          unit="customers"
          data={[
            { date: "2024-01-01", count: 1000 },
            { date: "2024-01-02", count: 1200 },
            { date: "2024-01-03", count: 1500 },
            { date: "2024-01-04", count: 2000 },
            { date: "2024-01-05", count: 2500 },
            { date: "2024-01-06", count: 3000 },
            { date: "2024-01-07", count: 3500 },
          ]}
          dataKey="count"
          colorVar="--chart-1"
        />
        <Topcard
          title="Total Active Customers"
          description="Number of active customers"
          value="2,500" // Replace this with actual data if available
          unit="active"
          data={[
            { date: "2024-01-01", count: 500 },
            { date: "2024-01-02", count: 700 },
            { date: "2024-01-03", count: 900 },
            { date: "2024-01-04", count: 1200 },
            { date: "2024-01-05", count: 1500 },
            { date: "2024-01-06", count: 2000 },
            { date: "2024-01-07", count: 2500 },
          ]}
          dataKey="count"
          colorVar="--chart-2"
        />
        <Topcard
          title="Total Inactive Customers"
          description="Number of inactive customers"
          value="1,000" // Replace this with actual data if available
          unit="inactive"
          data={[
            { date: "2024-01-01", count: 300 },
            { date: "2024-01-02", count: 400 },
            { date: "2024-01-03", count: 500 },
            { date: "2024-01-04", count: 600 },
            { date: "2024-01-05", count: 700 },
            { date: "2024-01-06", count: 800 },
            { date: "2024-01-07", count: 1000 },
          ]}
          dataKey="count"
          colorVar="--chart-3"
        />
      </div>
      <div className="bg-slate-100">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
