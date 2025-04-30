
'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

export default function LabPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <FlaskConical className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Lab Analysis</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Lab Results</CardTitle>
            <CardDescription>Input analysis data for soil samples.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Forms for entering lab analysis results linked to sample IDs.</p>
             <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                Lab Result Entry Coming Soon
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
