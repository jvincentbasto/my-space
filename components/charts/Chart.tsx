"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { fileUtils } from "@/lib/fileUtils";

const { calculatePercentage, convertFileSize } = fileUtils;

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

interface ChartProps {
  used: number;
}

export const Chart = (props: ChartProps) => {
  const { used = 0 } = props;

  const chartData = [{ storage: "used", 10: used, fill: "white" }];

  return (
    <Card className="flex items-center rounded-[10px] max-sm:flex-col bg-gray-50 border-0 p-5">
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="w-[200px] xl:w-[250px] aspect-square mx-auto"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={Number(calculatePercentage(used)) + 90}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-blue-200 last:fill-primary"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="storage" background cornerRadius={10} path="" />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-bold"
                        >
                          {used && calculatePercentage(used)
                            ? calculatePercentage(used)
                                .toString()
                                .replace(/^0+/, "")
                            : "0"}
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/70"
                        >
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="flex-1 items-start p-[10px] max-sm:mt-[20px]">
        <CardTitle className="text-[20px] md:text-[30px] lg:text-[40px] leading-[1.2] font-bold text-left max-sm:text-center">
          Available Storage
        </CardTitle>
        <CardDescription className="w-full text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[1.1] text-left max-sm:text-center">
          {used ? convertFileSize(used) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
