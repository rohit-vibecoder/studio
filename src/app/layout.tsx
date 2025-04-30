
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar'; // Import the new Sidebar component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RockCO2',
  description: 'Carbon sequestration tracking application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar /> {/* Use the AppSidebar component */}
            {children} {/* Page content will be rendered here */}
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
