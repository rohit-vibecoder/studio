'use client';

import Link from 'next/link';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanLine, Truck, Sprout, History, Construction } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QRCodeManagementPage() {
  const { toast } = useToast();

   const handleGenerateTruckClick = () => {
    toast({ title: "Navigating", description: "Loading Generate Truck QR page..." });
    // Navigation handled by Link component
   };

    const handleGenerateSampleClick = () => {
        toast({ title: "Navigating", description: "Loading Generate Sample QR page..." });
        // Navigation handled by Link component
    };

    const handleScanClick = () => {
        toast({ title: "Navigating", description: "Loading Scan QR Code page..." });
        // Navigation handled by Link component
    };

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <ScanLine className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">QR Code Management</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-md rounded-lg border border-border">
          <CardHeader>
            <CardTitle>Manage QR Codes</CardTitle>
            <CardDescription>Generate new QR codes for tracking or scan existing codes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p>Use the options below to manage QR codes for truck journeys and soil samples.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Link href="/qr/generate/truck" passHref legacyBehavior>
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3 shadow-sm hover:shadow-md transition-shadow duration-200" onClick={handleGenerateTruckClick}>
                        <Truck className="mr-2 h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold">Generate Truck QR</p>
                            <p className="text-xs text-muted-foreground">Create a code for a truck journey.</p>
                        </div>
                    </Button>
                 </Link>
                 <Link href="/qr/generate/sample" passHref legacyBehavior>
                     <Button variant="outline" className="w-full justify-start text-left h-auto py-3 shadow-sm hover:shadow-md transition-shadow duration-200" onClick={handleGenerateSampleClick}>
                        <Sprout className="mr-2 h-5 w-5 text-primary" />
                         <div>
                            <p className="font-semibold">Generate Sample QR</p>
                            <p className="text-xs text-muted-foreground">Create a code for a soil sample.</p>
                        </div>
                     </Button>
                 </Link>
                 <Link href="/qr/scan" passHref legacyBehavior>
                     <Button variant="accent" className="w-full justify-start text-left h-auto py-3 shadow-sm hover:shadow-md transition-shadow duration-200 col-span-1 sm:col-span-2" onClick={handleScanClick}>
                         <ScanLine className="mr-2 h-5 w-5" />
                         <div>
                            <p className="font-semibold">Scan Existing Code</p>
                            <p className="text-xs">Use camera or enter manually.</p>
                         </div>
                     </Button>
                 </Link>
            </div>
              
               <div className="mt-6 p-6 border border-dashed rounded-md text-center text-muted-foreground bg-muted/50">
                   <History className="h-12 w-12 mx-auto mb-4 text-primary" />
                   <p className="mb-2 font-semibold">QR Code History & Lookup is Under Development</p>
                   <p className="text-sm">Features for viewing the history of scanned codes and looking up details associated with specific QR codes will be available here soon.</p>
               </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
