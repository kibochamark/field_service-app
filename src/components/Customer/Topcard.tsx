import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent } from "@/shadcn/ui/card";
import { ChartContainer } from "@/shadcn/ui/chart";

interface TopcardProps {
  customersinfo: {
    number_of_active_customers: number;
    number_of_customers: number;
    number_of_inactive_customers: number;
  };
}

const Topcard: React.FC<TopcardProps> = ({ customersinfo }) => {
  // Calculate percentages for RadialBarChart
  const totalCustomers = customersinfo.number_of_customers;
  const data = [
    {
      activity: "Active Customers",
      value: (customersinfo.number_of_active_customers / totalCustomers) * 100,
      fill: "#1E90FF", // DodgerBlue for Active Customers
    },
    {
      activity: "Total Customers",
      value: (totalCustomers / totalCustomers) * 100,
      fill: "#4682B4", // SteelBlue for Total Customers
    },
    {
      activity: "Inactive Customers",
      value: (customersinfo.number_of_inactive_customers / totalCustomers) * 100,
      fill: "#87CEFA", // LightSkyBlue for Inactive Customers
    },
  ];

  return (
    <Card className="max-w-xs">
      <CardContent className="flex gap-4 p-4">
        <div className="grid items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-muted-foreground">Active Customers</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {customersinfo.number_of_active_customers}
            </div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {customersinfo.number_of_customers}
            </div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-muted-foreground">Inactive Customers</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {customersinfo.number_of_inactive_customers}
            </div>
          </div>
        </div>
        <ChartContainer
          config={{
            activeCustomers: {
              label: "Active Customers",
              color: "#1E90FF", // DodgerBlue
            },
            totalCustomers: {
              label: "Total Customers",
              color: "#4682B4", // SteelBlue
            },
            inactiveCustomers: {
              label: "Inactive Customers",
              color: "#87CEFA", // LightSkyBlue
            },
          }}
          className="mx-auto aspect-square w-full max-w-[80%]"
        >
          <RadialBarChart
            margin={{
              left: -10,
              right: -10,
              top: -10,
              bottom: -10,
            }}
            data={data}
            innerRadius="20%"
            barSize={24}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey="value"
              tick={false}
            />
            <RadialBar dataKey="value" background cornerRadius={5} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default Topcard;
