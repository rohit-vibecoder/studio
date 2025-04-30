
'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, QrCode, Asterisk } from 'lucide-react';
import { generateUniqueQRCodeData, generateFallbackCode } from '@/lib/qrcode';
import Image from 'next/image'; // Use next/image for optimized images

export default function GenerateTruckQRPage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [fallbackCode, setFallbackCode] = useState<string>('');
  const [uniqueId, setUniqueId] = useState<string>('');

  useEffect(() => {
    handleGenerate(); // Generate initial codes on component mount
  }, []);

  const handleGenerate = async () => {
    const newUniqueId = generateUniqueQRCodeData('truck');
    const newFallbackCode = generateFallbackCode();
    setUniqueId(newUniqueId);
    setFallbackCode(newFallbackCode);

    try {
      const url = await QRCode.toDataURL(newUniqueId, {
          errorCorrectionLevel: 'H', // High error correction
          type: 'image/png',
          quality: 0.9,
          margin: 1,
          color: {
              dark:"#1B5E20", // Dark Green
              light:"#F5F5DC" // Light Beige
          }
      });
      setQrCodeDataUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setQrCodeDataUrl(''); // Clear QR code on error
    }
  };

  const handlePrint = () => {
    // Basic print functionality - opens browser print dialog
    window.print();
    // For more advanced printing (e.g., specific element), use libraries like react-to-print
  };

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Truck className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Generate Truck Journey QR</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate QR Code for Truck Journey</CardTitle>
            <CardDescription>Create a unique QR code and fallback code for a new truck journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {qrCodeDataUrl ? (
                 <Image
                  src={qrCodeDataUrl}
                  alt="Truck Journey QR Code"
                  width={256} // Specify desired width
                  height={256} // Specify desired height
                  className="border rounded-md shadow-md"
                />
              ) : (
                <div className="w-64 h-64 bg-muted rounded-md flex items-center justify-center border border-dashed">
                  <p className="text-muted-foreground">Generating QR...</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Scan this code to track the journey.</p>
            </div>

             <div className="space-y-2">
                <Label htmlFor="fallbackCode" className="flex items-center gap-1">
                    <Asterisk className="h-4 w-4 text-muted-foreground" /> Manual Fallback Code
                </Label>
                <Input id="fallbackCode" value={fallbackCode} readOnly className="text-lg font-mono tracking-widest text-center bg-secondary" />
                 <p className="text-xs text-muted-foreground">Enter this code if scanning fails.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="uniqueId">Unique ID (Embedded in QR)</Label>
                <Input id="uniqueId" value={uniqueId} readOnly className="text-sm bg-muted" />
            </div>


            <div className="flex flex-col sm:flex-row gap-2 pt-4">
               <Button onClick={handleGenerate} className="w-full sm:w-auto">
                 <QrCode className="mr-2 h-4 w-4" /> Regenerate Codes
               </Button>
               <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
                 Print Label
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
