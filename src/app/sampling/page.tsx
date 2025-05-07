'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sprout, Construction, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
             <div className="mt-4 p-6 border border-dashed rounded-md text-center text-muted-foreground bg-muted/50">
                <Construction className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="mb-2 font-semibold">Soil Sample Logging Features are Under Development</p>
                <p className="text-sm mb-4">An interface for recording comprehensive soil sample data (including GPS, depth, and notes) and managing sample IDs will be implemented here.</p>
                <Link href="/qr/generate/sample" passHref>
                    <Button variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate Sample QR Code Now
                    </Button>
                </Link>
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
