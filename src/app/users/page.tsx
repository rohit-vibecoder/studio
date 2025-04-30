
'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Users className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">User Management</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>Add, edit, or remove user accounts and manage roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>User list and management tools will be available here.</p>
             <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                User Management Interface Coming Soon
             </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
