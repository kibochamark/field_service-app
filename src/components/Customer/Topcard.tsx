"use client";

import { Bar, BarChart, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { ChartContainer } from "@/shadcn/ui/chart";

interface TopcardProps {
  title: string;
  description: string;
  value: string;
  unit: string;
  data: Array<{ date: string; count: number }>;
  dataKey: string;
  colorVar: string;
}

const Topcard: React.FC<TopcardProps> = ({
  title,
  description,
  value,
  unit,
  data,
  dataKey,
  colorVar,
}) => {
  return (
    <Card className="max-w-xs">
      <CardHeader className="p-4 pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
          {value}
          <span className="text-sm font-normal text-muted-foreground">
            {unit}
          </span>
        </div>
        <ChartContainer
          config={{
            [dataKey]: {
              label: title,
              color: `hsl(var(${colorVar}))`,
            },
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={data}
          >
            <Bar
              dataKey={dataKey}
              fill={`var(${colorVar})`}
              radius={2}
              fillOpacity={0.2}
              activeIndex={data.length - 1}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Topcard;
