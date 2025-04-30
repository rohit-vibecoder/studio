
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Button
} from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Network,
  ScanLine,
  Truck,
  FlaskConical,
  Settings,
  Activity,
  Users,
  Sprout,
  Package,
  ClipboardList,
  Home,
} from 'lucide-react';

// Define navigation items
const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: Home, tooltip: 'Dashboard Home' },
  { href: '/supply', label: 'Supply Coordination', icon: Package, tooltip: 'Supply Coordination' },
  { href: '/survey', label: 'Field Survey', icon: ClipboardList, tooltip: 'Field Survey' },
  { href: '/application', label: 'Application Ops', icon: Truck, tooltip: 'Application Operations' },
  { href: '/sampling', label: 'Soil Sampling', icon: Sprout, tooltip: 'Soil Sampling' },
  { href: '/lab', label: 'Lab Analysis', icon: FlaskConical, tooltip: 'Lab Analysis' },
  { href: '/carbon', label: 'Carbon Analysis', icon: Activity, tooltip: 'Carbon Analysis' },
];

const quickAccessItems = [
   { href: '/qr/generate/truck', label: 'New Truck Journey', icon: Truck, tooltip: 'Create Truck Journey QR' },
   { href: '/qr/generate/sample', label: 'New Soil Sample', icon: Sprout, tooltip: 'Create Soil Sample QR' },
   { href: '/qr/scan', label: 'Scan Code', icon: ScanLine, tooltip: 'Scan QR Code' },
]

const footerNavItems = [
    { href: '/admin', label: 'Admin', icon: Settings, tooltip: 'Admin Settings' },
    { href: '/users', label: 'Users', icon: Users, tooltip: 'Manage Users' },
];


export default function AppSidebar() {
  const pathname = usePathname();

  // Function to determine if a link is active
  const isActive = (href: string) => {
    // Handle exact match for dashboard, prefix match for others
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
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
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                 <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton tooltip={item.tooltip} isActive={isActive(item.href)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Quick Access</SidebarGroupLabel>
          <SidebarMenu>
             {quickAccessItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                 <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton tooltip={item.tooltip} isActive={isActive(item.href)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Non-interactive status display */}
            <SidebarMenuButton tooltip="Offline Status" disabled>
              <Network /> {/* Placeholder, could change based on status */}
              <div className="flex flex-1 justify-between items-center">
                <span>Sync Status</span>
                <Badge variant="secondary" className="group-data-[collapsible=icon]:hidden">Online</Badge>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
           {footerNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                 <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton tooltip={item.tooltip} isActive={isActive(item.href)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
