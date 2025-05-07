'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, BarChart2, Construction } from 'lucide-react';

export default function CarbonPage() {
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
            <CardDescription>View reports and analysis based on collected data.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="mt-4 p-6 border border-dashed rounded-md text-center text-muted-foreground bg-muted/50">
                <BarChart2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="mb-2 font-semibold">Carbon Analysis Reports are Under Development</p>
                <p className="text-sm">Comprehensive carbon analysis reports, charts, and data visualizations based on collected application and lab data will be displayed here.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
