
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScanLine, CameraOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Placeholder for a real QR scanning library
// In a real app, you would integrate a library like 'html5-qrcode' or 'react-qr-reader'
const QrScannerPlaceholder = ({ onScanSuccess, onScanError }: { onScanSuccess: (decodedText: string) => void, onScanError: (errorMessage: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error('Camera API not supported by this browser.');
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); // Prefer back camera
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Simulate scanning after a delay for demo purposes
          setTimeout(() => {
             // In a real app, the library's callback would provide the scanned data
             const simulatedScanData = `simulated-${Date.now()}`;
             onScanSuccess(simulatedScanData);
             toast({
                title: "Simulated Scan Success",
                description: `Data: ${simulatedScanData}`,
             });
          }, 5000); // Simulate scan after 5 seconds
        }
      } catch (error: any) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        let description = 'Please enable camera permissions in your browser settings.';
        if (error.name === 'NotAllowedError') {
            description = 'Camera access was denied. Please allow access in your browser settings.';
        } else if (error.message.includes('not supported')) {
            description = error.message;
        } else if (error.name === 'NotFoundError') {
             description = 'No camera found on this device.';
        }
        toast({
          variant: 'destructive',
          title: 'Camera Access Issue',
          description: description,
        });
        onScanError(error.message || 'Could not access camera.');
      }
    };

    getCameraPermission();

     // Cleanup function to stop the camera stream when the component unmounts
     return () => {
       if (stream) {
         stream.getTracks().forEach(track => track.stop());
       }
       if (videoRef.current) {
            videoRef.current.srcObject = null;
       }
     };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencies are handled internally for the simulation

  return (
    <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden bg-muted shadow-inner">
       {/* Always render video tag to prevent race condition */}
       <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

       {/* Overlay for visual scanning effect (optional) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-2/3 h-px bg-red-500 animate-scan-line"></div>
        </div>

       {/* Show alert only if permission is explicitly denied or on error */}
      {hasCameraPermission === false && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <Alert variant="destructive" className="w-full">
                  <CameraOff className="h-5 w-5" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Could not access the camera. Please check permissions or ensure a camera is connected.
                  </AlertDescription>
            </Alert>
        </div>
      )}
       {/* Loading/Initializing state */}
       {hasCameraPermission === undefined && (
         <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <p className="text-white">Initializing Camera...</p>
         </div>
       )}

       <style jsx>{`
          @keyframes scan-line {
              0% { transform: translateY(-50%); opacity: 0.5; }
              50% { transform: translateY(50%); opacity: 1; }
              100% { transform: translateY(-50%); opacity: 0.5; }
          }
          .animate-scan-line {
              animation: scan-line 2s infinite ease-in-out;
          }
       `}</style>
    </div>
  );
};


export default function ScanQRPage() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(true); // Start with scanning active
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScanSuccess = (decodedText: string) => {
    setScannedData(decodedText);
    setError(null);
    setIsScanning(false); // Stop scanning simulation on success
    toast({
      title: 'QR Code Scanned Successfully!',
      description: `Data: ${decodedText}`,
      variant: 'default', // Use default for success
    });
    // TODO: Process the scanned data (e.g., look up in database)
  };

  const handleScanError = (errorMessage: string) => {
    setError(`Scan Error: ${errorMessage}`);
    setScannedData(null);
    // Don't automatically stop scanning on error, user might retry
    // setIsScanning(false);
    // Toast is handled within the placeholder component for permission issues
    if (!errorMessage.includes('permission') && !errorMessage.includes('camera')) {
         toast({
            variant: 'destructive',
            title: 'QR Scan Error',
            description: errorMessage.length > 50 ? 'Could not read QR code.' : errorMessage,
         });
    }

  };

   const handleManualSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (manualCode.trim().length === 6) {
        setScannedData(`manual-${manualCode.toUpperCase()}`);
        setError(null);
        setIsScanning(false); // Stop scanning if manual code is entered
        toast({
         title: 'Manual Code Submitted',
         description: `Code: ${manualCode.toUpperCase()}`,
        });
       // TODO: Process the manual code
     } else {
        setError('Manual code must be 6 characters long.');
        toast({
            variant: 'destructive',
            title: 'Invalid Manual Code',
            description: 'Please enter a 6-character code.',
        });
     }
   };

   const handleRescan = () => {
     setScannedData(null);
     setError(null);
     setManualCode('');
     setIsScanning(true); // Restart scanning
   }

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <ScanLine className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Scan QR Code</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Scan or Enter Code</CardTitle>
            <CardDescription>Scan a QR code using your device camera or enter the 6-character fallback code manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {isScanning && !scannedData && (
               <>
                 <p className="text-center text-sm text-muted-foreground">Point your camera at the QR code.</p>
                 <QrScannerPlaceholder
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                 />
               </>
            )}

             {scannedData && (
                 <Alert variant="default" className="bg-green-50 border-green-200">
                   <CheckCircle className="h-5 w-5 text-green-600" />
                   <AlertTitle className="text-green-800">Scan/Input Successful</AlertTitle>
                   <AlertDescription className="text-green-700">
                     Successfully processed code: <span className="font-mono break-all">{scannedData}</span>
                      <Button variant="link" size="sm" onClick={handleRescan} className="ml-2 p-0 h-auto text-green-700 hover:text-green-900">Scan another</Button>
                   </AlertDescription>
                 </Alert>
              )}


             {!isScanning && !scannedData && error && (
                 <Alert variant="destructive">
                     <AlertCircle className="h-5 w-5"/>
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                 </Alert>
             )}

             {/* Show rescan button if an error occurred but we are not actively scanning */}
             {!isScanning && error && (
                  <Button onClick={handleRescan} variant="outline">
                     <ScanLine className="mr-2 h-4 w-4" /> Retry Scan
                  </Button>
             )}


             <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">OR</span>
             </div>


            <form onSubmit={handleManualSubmit} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="manualCode">Enter 6-Character Fallback Code</Label>
                <Input
                    id="manualCode"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="ABCXYZ"
                    className="text-center font-mono text-lg tracking-widest"
                    disabled={!!scannedData} // Disable if scan was successful
                />
               </div>
               <Button type="submit" className="w-full sm:w-auto" disabled={!!scannedData}>
                    Submit Manual Code
               </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
