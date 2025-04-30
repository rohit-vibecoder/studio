
'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function SupplyPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Package className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Supply Coordination</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Supplies</CardTitle>
            <CardDescription>Track inventory, orders, and deliveries.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Supply coordination specific forms and data will go here.</p>
            {/* Placeholder for future content */}
             <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                Supply Management Features Coming Soon
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
