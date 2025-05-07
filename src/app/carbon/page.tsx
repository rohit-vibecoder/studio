'use client';

import React, { useEffect, useState } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, BarChart2, LineChart, PieChart, AlertTriangle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, BarChart as ReBarChart, Line, LineChart as ReLineChart, Pie, PieChart as RePieChart, Cell } from 'recharts';


const generateRandomData = (numPoints: number, minVal: number, maxVal: number) => {
  return Array.from({ length: numPoints }, () => Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
};


const chartConfig = {
  sequestration: {
    label: "CO2 Sequestered (tons)",
    color: "hsl(var(--chart-1))",
  },
  baseline: {
    label: "Baseline (tons)",
    color: "hsl(var(--chart-2))",
  },
  pH: {
    label: "Soil pH",
    color: "hsl(var(--chart-3))",
  },
  organicCarbon: {
    label: "Organic Carbon (%)",
    color: "hsl(var(--chart-4))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

const PIE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];


export default function CarbonPage() {
  const [isClient, setIsClient] = useState(false);
  const [sampleBarChartData, setSampleBarChartData] = useState<any[]>([]);
  const [sampleLineChartData, setSampleLineChartData] = useState<any[]>([]);
  const [samplePieChartData, setSamplePieChartData] = useState<any[]>([]);


  useEffect(() => {
    setIsClient(true);
    // Generate data on client to avoid hydration mismatch with Math.random()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setSampleBarChartData(
        months.slice(0,6).map(month => ({
            month,
            sequestration: Math.floor(Math.random() * 1000) + 500,
            baseline: Math.floor(Math.random() * 500) + 200 
        }))
    );

    setSampleLineChartData([
      { year: '2020', pH: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1), organicCarbon: (Math.random() * (3.0 - 1.5) + 1.5).toFixed(1) },
      { year: '2021', pH: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1), organicCarbon: (Math.random() * (3.0 - 1.5) + 1.5).toFixed(1) },
      { year: '2022', pH: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1), organicCarbon: (Math.random() * (3.0 - 1.5) + 1.5).toFixed(1) },
      { year: '2023', pH: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1), organicCarbon: (Math.random() * (3.0 - 1.5) + 1.5).toFixed(1) },
      { year: '2024', pH: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1), organicCarbon: (Math.random() * (3.0 - 1.5) + 1.5).toFixed(1) },
    ].map(d => ({...d, pH: parseFloat(d.pH), organicCarbon: parseFloat(d.organicCarbon) })));
    

    setSamplePieChartData([
      { name: 'Field A', value: Math.floor(Math.random() * 500) + 100 },
      { name: 'Field B', value: Math.floor(Math.random() * 500) + 100 },
      { name: 'Field C', value: Math.floor(Math.random() * 500) + 100 },
      { name: 'Field D', value: Math.floor(Math.random() * 500) + 100 },
    ]);

  }, []);
  
  // Render placeholder or nothing until client-side hydration completes
  if (!isClient) {
    return (
       <SidebarInset>
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <Activity className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-xl font-semibold text-primary">Carbon Analysis</h1>
        </header>
         <div className="flex flex-1 items-center justify-center p-4 md:p-8">
             <Card className="w-full max-w-md">
                 <CardContent className="p-6 text-center">
                     <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                     <p className="text-muted-foreground">Loading analysis data...</p>
                 </CardContent>
             </Card>
         </div>
      </SidebarInset>
    );
  }


  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Activity className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Carbon Analysis</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Carbon Sequestration</CardTitle>
            <CardDescription>View reports and analysis based on collected data. (Illustrative Data)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground bg-muted/50">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="mb-1 font-semibold">Data & Calculations are Illustrative</p>
                <p className="text-xs">The charts below use randomly generated placeholder data. Actual carbon sequestration calculations require complex models and verified data inputs.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart2 className="h-5 w-5 text-primary" /> Monthly Carbon Sequestration
                </CardTitle>
                <CardDescription>Estimated CO2 sequestered vs. baseline over recent months.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <ReBarChart accessibilityLayer data={sampleBarChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="sequestration" fill="var(--color-sequestration)" radius={4} />
                    <Bar dataKey="baseline" fill="var(--color-baseline)" radius={4} />
                  </ReBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <LineChart className="h-5 w-5 text-primary" /> Soil Health Trends
                </CardTitle>
                <CardDescription>Yearly changes in Soil pH and Organic Carbon content.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <ReLineChart accessibilityLayer data={sampleLineChartData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                     <YAxis yAxisId="left" label={{ value: 'pH', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--foreground))' }, dy: 40 }} stroke="var(--color-pH)" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                     <YAxis yAxisId="right" label={{ value: 'OC %', angle: -90, position: 'insideRight', style: { textAnchor: 'middle', fill: 'hsl(var(--foreground))' }, dy: -40 }} orientation="right" stroke="var(--color-organicCarbon)" domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                     <ChartLegend content={<ChartLegendContent />} />
                    <Line yAxisId="left" type="monotone" dataKey="pH" stroke="var(--color-pH)" strokeWidth={2} dot={true} />
                    <Line yAxisId="right" type="monotone" dataKey="organicCarbon" stroke="var(--color-organicCarbon)" strokeWidth={2} dot={true} />
                  </ReLineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-primary" /> Sequestration by Field (Example)
                    </CardTitle>
                    <CardDescription>Distribution of total estimated sequestration across different fields.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex items-center justify-center">
                     <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                        <RePieChart accessibilityLayer>
                           <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                           <Pie data={samplePieChartData} dataKey="value" nameKey="name" label>
                             {samplePieChartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                             ))}
                           </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </RePieChart>
                     </ChartContainer>
                 </CardContent>
            </Card>

          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
