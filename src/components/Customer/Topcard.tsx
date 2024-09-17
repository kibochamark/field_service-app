import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
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
    <div className="md:grid grid-cols-3 gap-4 space-y-4 md:space-y-0 my-4">
      <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers Available
            </CardTitle>
            {/* <DollarSign className="h-4 text-primary600 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-primary600 font-bold">{customersinfo.number_of_customers}
            </div>
            <p className="text-xs text-muted-foreground">
              in the last 1 minute
            </p>
          </CardContent>
        </Card>
       <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            {/* <DollarSign className="h-4 text-primary600 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600 font-bold">{customersinfo.number_of_active_customers}
            </div>
            <p className="text-xs text-muted-foreground">
              in the last minute
            </p>
          </CardContent>
        </Card>
       <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              InActive Customers
            </CardTitle>
            {/* <DollarSign className="h-4 text-primary600 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-200 font-bold">{customersinfo.number_of_inactive_customers}

            </div>
            <p className="text-xs text-muted-foreground">
              in the last 1 minute
            </p>
          </CardContent>
        </Card>
       
    </div>
  );
}

export default Topcard;
