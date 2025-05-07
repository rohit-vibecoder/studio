'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Truck, Construction } from 'lucide-react';

export default function ApplicationPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Truck className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Application Operations</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Application Operations</CardTitle>
            <CardDescription>Track rock dust application details, equipment, and personnel.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="mt-4 p-6 border border-dashed rounded-md text-center text-muted-foreground bg-muted/50">
                <Construction className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="mb-2 font-semibold">Application Logging Features are Under Development</p>
                <p className="text-sm">Forms for logging application activities, equipment usage, personnel assignments, and associated data will be implemented here shortly.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
