
'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sprout } from 'lucide-react';

export default function SamplingPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Sprout className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Soil Sampling</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Record Soil Samples</CardTitle>
            <CardDescription>Log sample collection details, locations, and generate sample QR codes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Interface for recording soil sample data and managing sample IDs.</p>
             <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                Soil Sample Logging & QR Generation Coming Soon
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
