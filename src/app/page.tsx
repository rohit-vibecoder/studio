'use client';

import Link from 'next/link';
import { SidebarInset } from '@/components/ui/sidebar';
import {
  Button
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Network, ScanLine, Truck, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Placeholder component for main content area specific to the dashboard
function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-primary">Welcome to RockCO2</CardTitle>
          <CardDescription>Your dashboard for carbon sequestration tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select an option from the sidebar or use the quick access buttons to get started.</p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 border-green-600 text-green-700 bg-green-100">
              <Network className="h-4 w-4" />
              <span>Online</span>
            </Badge>
            <span className="text-xs text-muted-foreground">Last sync: Just now</span>
          </div>
          {/* Placeholder for future offline status */}
          {/* <div className="mt-4 flex items-center gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
               <WifiOff className="h-4 w-4 text-red-600" />
               <span>Offline</span>
            </Badge>
             <span className="text-xs text-muted-foreground">Sync pending...</span>
          </div> */}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <Link href="/qr/generate/truck" passHref>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                    <Truck className="mr-2 h-5 w-5 text-primary" />
                    <div>
                        <p className="font-semibold">New Truck Journey</p>
                        <p className="text-xs text-muted-foreground">Generate QR for a truck</p>
                    </div>
                </Button>
             </Link>
             <Link href="/qr/generate/sample" passHref>
                 <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                    <Sprout className="mr-2 h-5 w-5 text-primary" />
                     <div>
                        <p className="font-semibold">New Soil Sample</p>
                        <p className="text-xs text-muted-foreground">Generate QR for a sample</p>
                    </div>
                 </Button>
             </Link>
             <Link href="/qr/scan" passHref>
                 <Button variant="accent" className="w-full justify-start text-left h-auto py-3 bg-accent text-accent-foreground hover:bg-accent/90">
                     <ScanLine className="mr-2 h-5 w-5" />
                     <div>
                        <p className="font-semibold">Scan QR Code</p>
                        <p className="text-xs">Scan or enter code manually</p>
                     </div>
                 </Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold text-primary">Dashboard</h1>
        <Link href="/qr/scan" passHref className="ml-auto">
            <Button variant="outline" size="sm" className="gap-1.5 text-sm">
                <ScanLine className="size-3.5" />
                Scan QR Code
            </Button>
        </Link>
      </header>
      <DashboardContent />
    </SidebarInset>
  );
}
