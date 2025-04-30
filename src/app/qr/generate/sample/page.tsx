
'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, QrCode, Asterisk } from 'lucide-react';
import { generateUniqueQRCodeData, generateFallbackCode } from '@/lib/qrcode';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function GenerateSampleQRPage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [fallbackCode, setFallbackCode] = useState<string>('');
  const [uniqueId, setUniqueId] = useState<string>('');
  const { toast } = useToast();

  const generateCodes = async () => {
    const newUniqueId = generateUniqueQRCodeData('sample');
    const newFallbackCode = generateFallbackCode();
    setUniqueId(newUniqueId);
    setFallbackCode(newFallbackCode);

    try {
      const url = await QRCode.toDataURL(newUniqueId, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.9,
          margin: 1,
           color: {
              dark:"#1B5E20",
              light:"#F5F5DC"
          }
      });
      setQrCodeDataUrl(url);
      return { success: true, uniqueId: newUniqueId, fallbackCode: newFallbackCode };
    } catch (err) {
      console.error('Error generating QR code:', err);
      setQrCodeDataUrl('');
      return { success: false, error: err };
    }
  };

   useEffect(() => {
    // Generate initial codes without toast
    generateCodes();
  }, []);

  const handleGenerate = async () => {
    toast({ title: 'Generating Codes', description: 'Creating new QR and fallback codes...' });
    const result = await generateCodes();
    if (result.success) {
        toast({
            title: 'Codes Regenerated',
            description: `New Unique ID: ${result.uniqueId}`,
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Generating QR Code',
            description: 'Could not generate QR code. Please try again.',
        });
    }
  };

   const handlePrint = () => {
     toast({ title: 'Printing', description: 'Opening print dialog...' });
     window.print();
   };

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Sprout className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Generate Soil Sample QR</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate QR Code for Soil Sample</CardTitle>
            <CardDescription>Create a unique QR code and fallback code for a new soil sample.</CardDescription>
          </CardHeader>
           <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {qrCodeDataUrl ? (
                 <Image
                  src={qrCodeDataUrl}
                  alt="Soil Sample QR Code"
                  width={256}
                  height={256}
                  className="border rounded-md shadow-md"
                />
              ) : (
                <div className="w-64 h-64 bg-muted rounded-md flex items-center justify-center border border-dashed">
                  <p className="text-muted-foreground">Generating QR...</p>
                </div>
              )}
               <p className="text-xs text-muted-foreground">Attach this code to the sample bag.</p>
            </div>

             <div className="space-y-2">
                <Label htmlFor="fallbackCode" className="flex items-center gap-1">
                     <Asterisk className="h-4 w-4 text-muted-foreground" /> Manual Fallback Code
                 </Label>
                <Input id="fallbackCode" value={fallbackCode} readOnly className="text-lg font-mono tracking-widest text-center bg-secondary" />
                 <p className="text-xs text-muted-foreground">Write this code on the bag if printing fails.</p>
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
