'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Construction } from 'lucide-react';

export default function AdminPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Settings className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Admin Settings</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Application Configuration</CardTitle>
            <CardDescription>Manage application settings and parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 p-6 border border-dashed rounded-md text-center text-muted-foreground bg-muted/50">
                <Construction className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="mb-2 font-semibold">Admin Configuration Panel is Under Development</p>
                <p className="text-sm">Full settings and parameter management capabilities will be available here soon. This section will allow for detailed control over application behavior.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
