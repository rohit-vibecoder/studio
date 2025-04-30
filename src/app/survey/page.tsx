
'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function SurveyPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <ClipboardList className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Field Survey</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Conduct Field Surveys</CardTitle>
            <CardDescription>Record site conditions, observations, and measurements.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Field survey forms and data entry interface will be here.</p>
             <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                Survey Forms & Data Collection Coming Soon
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
