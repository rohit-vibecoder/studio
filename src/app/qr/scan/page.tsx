
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScanLine, CameraOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Placeholder component for a real QR scanning library
const QrScanner = ({ onScanSuccess, onScanError, active }: { onScanSuccess: (decodedText: string) => void, onScanError: (errorMessage: string) => void, active: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
    }
  }, []);

  const startCameraStream = useCallback(async () => {
      setIsInitializing(true);
      setHasCameraPermission(undefined); // Reset permission state on retry
       if (!active) {
           stopCameraStream();
           setIsInitializing(false);
           return;
       }
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error('Camera API not supported by this browser.');
        }
        // Ensure previous stream is stopped before requesting a new one
        stopCameraStream();

        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); // Prefer back camera
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(err => console.error("Video play failed:", err));

          // Simulate scanning after a delay for demo purposes
          scanTimeoutRef.current = setTimeout(() => {
             if (!active) return; // Check if still active before calling success
             const simulatedScanData = `simulated-${Date.now()}`;
             onScanSuccess(simulatedScanData);
             // Toast is handled in the parent now
          }, 3000); // Simulate scan after 3 seconds
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
        } else if (error.name === 'NotReadableError') {
            description = 'Camera might be in use by another application.';
        }
        toast({
          variant: 'destructive',
          title: 'Camera Access Issue',
          description: description,
        });
        onScanError(error.message || 'Could not access camera.');
      } finally {
          setIsInitializing(false);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onScanError, onScanSuccess, stopCameraStream, toast]);


  useEffect(() => {
    if (active) {
      startCameraStream();
    } else {
      stopCameraStream();
    }

     // Cleanup function
     return () => {
       stopCameraStream();
     };
  }, [active, startCameraStream, stopCameraStream]);

  return (
    <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden bg-muted shadow-inner">
       {/* Always render video tag */}
       <video ref={videoRef} className={`w-full h-full object-cover ${!active || hasCameraPermission === false ? 'hidden' : ''}`} autoPlay muted playsInline />

       {/* Overlay for visual scanning effect (optional) */}
       {active && hasCameraPermission === true && !isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-px bg-red-500 animate-scan-line"></div>
            </div>
       )}


      {/* Show alert only if permission is explicitly denied or on error */}
      {active && hasCameraPermission === false && !isInitializing && (
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
       {active && isInitializing && (
         <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Initializing Camera...</p>
         </div>
       )}
        {/* Placeholder when inactive */}
        {!active && !scannedData && (
             <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground">
                 <ScanLine className="h-10 w-10 mb-2" />
                 <p>Scanning Paused</p>
             </div>
        )}


       <style jsx>{`
          @keyframes scan-line {
              0% { transform: translateY(-50%); opacity: 0.5; }
              50% { transform: translateY(50%); opacity: 1; }
              100% { transform: translateY(-50%); opacity: 0.5; }
          }
          .animate-scan-line {
              animation: scan-line 1.5s infinite ease-in-out;
          }
       `}</style>
    </div>
  );
};

// Global variable to hold scanned data (for demonstration purposes)
let scannedData: string | null = null;

export default function ScanQRPage() {
  const [currentScannedData, setCurrentScannedData] = useState<string | null>(scannedData);
  const [manualCode, setManualCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For manual submit loading
  const { toast } = useToast();

  // Function to process the scanned/entered code
  const processCode = (code: string) => {
    console.log("Processing code:", code);
    // --- TODO: Implement actual processing logic here ---
    // 1. Validate the code format (e.g., check prefix 'truck-' or 'sample-' or manual format)
    // 2. Look up the code in your database (Firestore, etc.)
    // 3. Based on the type and lookup result:
    //    - Navigate to the appropriate details page (e.g., /truck/[id], /sample/[id])
    //    - Or display relevant information directly on this page
    // 4. Handle cases where the code is not found or invalid
    // -----------------------------------------------------

    // For now, just display success and stop scanning
    scannedData = code; // Update global state
    setCurrentScannedData(code);
    setError(null);
    setIsScanning(false);
    setIsLoading(false);
    toast({
      title: 'Code Processed Successfully!',
      description: `Code: ${code}. (Processing logic placeholder)`,
      variant: 'default',
    });
  };


  const handleScanSuccess = (decodedText: string) => {
    if (!isScanning) return; // Prevent processing if scanning was stopped
    processCode(decodedText);
  };

  const handleScanError = (errorMessage: string) => {
    if (!isScanning) return; // Ignore errors if scanning stopped
    // Don't set general error state for camera permission issues handled by QrScanner component
    if (!errorMessage.includes('permission') && !errorMessage.includes('camera') && !errorMessage.includes('supported')) {
        setError(`Scan Error: ${errorMessage}`);
        // Optionally toast non-permission errors
         toast({
            variant: 'destructive',
            title: 'QR Scan Error',
            description: errorMessage.length > 50 ? 'Could not read QR code.' : errorMessage,
         });
    }
    // Keep scanning active on error unless it's a fatal camera issue
  };

   const handleManualSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null); // Clear previous errors
     const trimmedCode = manualCode.trim().toUpperCase();

     if (trimmedCode.length !== 6) {
       setError('Manual code must be 6 characters long.');
       toast({
           variant: 'destructive',
           title: 'Invalid Manual Code',
           description: 'Please enter a 6-character code.',
       });
       return;
     }

     setIsLoading(true);
     setIsScanning(false); // Stop camera scanning when submitting manually

     // Simulate API call or processing delay
     await new Promise(resolve => setTimeout(resolve, 500));

     processCode(`manual-${trimmedCode}`);
   };

   const handleRescan = () => {
     scannedData = null; // Reset global state
     setCurrentScannedData(null);
     setError(null);
     setManualCode('');
     setIsLoading(false);
     setIsScanning(true); // Restart scanning
     toast({
        title: 'Ready to Scan',
        description: 'Point your camera at a new QR code.'
     })
   }

   // Effect to reset component state if global scannedData is cleared elsewhere
    useEffect(() => {
        setCurrentScannedData(scannedData);
        if (!scannedData) {
            setIsScanning(true); // Ensure scanning is active if no data is set
        }
    }, []);


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

            {!currentScannedData && (
               <>
                 {isScanning && <p className="text-center text-sm text-muted-foreground">Point your camera at the QR code.</p>}
                 <QrScanner
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                    active={isScanning}
                 />
               </>
            )}

             {currentScannedData && (
                 <Alert variant="default" className="bg-green-50 border-green-200">
                   <CheckCircle className="h-5 w-5 text-green-600" />
                   <AlertTitle className="text-green-800">Code Processed</AlertTitle>
                   <AlertDescription className="text-green-700 space-y-2">
                     <div>Successfully processed code: <span className="font-mono break-all bg-green-100 px-1 rounded">{currentScannedData}</span></div>
                      {/* Add button to trigger actual action based on the code */}
                      {/* <Button size="sm" className="mt-2">View Details</Button> */}
                      <Button variant="link" size="sm" onClick={handleRescan} className="p-0 h-auto text-green-700 hover:text-green-900">
                        Scan another code
                      </Button>
                   </AlertDescription>
                 </Alert>
              )}


             {!currentScannedData && error && (
                 <Alert variant="destructive">
                     <AlertCircle className="h-5 w-5"/>
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                 </Alert>
             )}

             {/* Show rescan button if an error occurred AND we are not actively scanning */}
             {!isScanning && !currentScannedData && (
                  <Button onClick={handleRescan} variant="outline">
                     <ScanLine className="mr-2 h-4 w-4" /> Retry Scan
                  </Button>
             )}


             <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">OR</span>
             </div>


            <form onSubmit={handleManualSubmit} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="manualCode">Enter 6-Character Fallback Code</Label>
                <Input
                    id="manualCode"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    maxLength={6}
                    placeholder="ABCXYZ"
                    className="text-center font-mono text-lg tracking-widest uppercase"
                    disabled={!!currentScannedData || isLoading} // Disable if scan was successful or loading
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoCorrect="off"
                />
               </div>
               <Button type="submit" className="w-full sm:w-auto" disabled={!!currentScannedData || isLoading || manualCode.trim().length !== 6}>
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {isLoading ? 'Processing...' : 'Submit Manual Code'}
               </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
