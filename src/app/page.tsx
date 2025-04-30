
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
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
import {
  Network,
  ScanLine,
  Truck,
  FlaskConical,
  User,
  Settings,
  Activity,
  Users,
  Sprout,
  Database,
  Package,
  ClipboardList
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Placeholder component for main content
function MainContentArea() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to RockCO2</CardTitle>
          <CardDescription>Your dashboard for carbon sequestration tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select an option from the sidebar to get started.</p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Network className="h-4 w-4 text-green-600" />
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
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader className="items-center gap-2">
             <Sprout className="h-6 w-6 text-primary" />
             <span className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">RockCO2</span>
             <SidebarTrigger className="ml-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
               <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Supply Coordination" isActive>
                    <Package />
                    <span>Supply Coordination</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Field Survey">
                    <ClipboardList />
                    <span>Field Survey</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Application Operations">
                    <Truck />
                    <span>Application Ops</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Soil Sampling">
                    <Sprout />
                    <span>Soil Sampling</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Lab Analysis">
                    <FlaskConical />
                    <span>Lab Analysis</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Carbon Analysis">
                    <Activity />
                    <span>Carbon Analysis</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton tooltip="QR Code Management">
                    <ScanLine />
                    <span>QR Codes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

             <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Quick Access</SidebarGroupLabel>
               <SidebarMenu>
                 <SidebarMenuItem>
                   <SidebarMenuButton tooltip="Create Truck Journey QR">
                      <Truck />
                      <span>New Truck Journey</span>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton tooltip="Create Soil Sample QR">
                     <Sprout />
                      <span>New Soil Sample</span>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton tooltip="Scan QR Code">
                     <ScanLine />
                     <span>Scan Code</span>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               </SidebarMenu>
             </SidebarGroup>

          </SidebarContent>
          <SidebarFooter className="mt-auto">
             <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Offline Status">
                   <Network /> {/* Placeholder, could change based on status */}
                   <div className="flex flex-1 justify-between items-center">
                      <span>Sync Status</span>
                      <Badge variant="secondary" className="group-data-[collapsible=icon]:hidden">Online</Badge>
                   </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Admin Settings">
                  <Settings />
                  <span>Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton tooltip="Manage Users">
                  <Users />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
           <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
              <h1 className="text-xl font-semibold text-primary">Dashboard</h1>
              <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm">
                <ScanLine className="size-3.5" />
                Scan QR Code
              </Button>
            </header>
          <MainContentArea />
        </SidebarInset>
      </div>
  );
}
