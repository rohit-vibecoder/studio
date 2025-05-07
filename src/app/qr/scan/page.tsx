
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScanLine, CameraOff, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription as UiAlertDescription } from '@/components/ui/alert'; // Renamed to avoid conflict
import { Separator } from '@/components/ui/separator';
import { FormDescription } from '@/components/ui/form'; // Added import for FormDescription

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
      setHasCameraPermission(undefined); 
       if (!active) {
           stopCameraStream();
           setIsInitializing(false);
           return;
       }
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error('Camera API not supported by this browser.');
        }
        stopCameraStream();

        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(err => {
            console.error("Video play failed:", err);
            onScanError("Failed to play video stream.");
          });

          // Simulate scanning after a delay for demo purposes
          scanTimeoutRef.current = setTimeout(() => {
             if (!active || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return; 
             // Generate a more identifiable simulated code
             const type = Math.random() > 0.5 ? 'truck' : 'sample';
             const simulatedScanData = `${type}-${Date.now()}-SIMSCAN`;
             console.log("Simulating scan success with data:", simulatedScanData);
             onScanSuccess(simulatedScanData);
          }, 3000); 
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
  }, [active, stopCameraStream, toast]); // Removed onScanError, onScanSuccess from deps to avoid re-triggering


  useEffect(() => {
    if (active) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
     return () => {
       stopCameraStream();
     };
  }, [active, startCameraStream, stopCameraStream]);

  return (
    <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden bg-muted shadow-inner">
       <video ref={videoRef} className={`w-full h-full object-cover ${!active || hasCameraPermission === false ? 'hidden' : ''}`} autoPlay muted playsInline />
       {active && hasCameraPermission === true && !isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-px bg-red-500 animate-scan-line"></div>
            </div>
       )}
      {active && hasCameraPermission === false && !isInitializing && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <Alert variant="destructive" className="w-full">
                  <CameraOff className="h-5 w-5" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <UiAlertDescription>
                    Could not access the camera. Please check permissions or ensure a camera is connected.
                  </UiAlertDescription>
            </Alert>
        </div>
      )}
       {active && isInitializing && (
         <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Initializing Camera...</p>
         </div>
       )}
        {!active && ( // Show "Scanning Paused" or result from parent
             <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground">
                 <ScanLine className="h-10 w-10 mb-2" />
                 <p>Scanning Paused or Complete</p>
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


export default function ScanQRPage() {
  const [processedCodeInfo, setProcessedCodeInfo] = useState<{ code: string; type: string; message: string } | null>(null);
  const [manualCode, setManualCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(true); // Start with scanning active
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const identifyCodeType = (code: string): { type: string; message: string } => {
    if (code.startsWith('truck-')) {
      return { type: 'Truck Journey', message: 'Truck Journey code identified.' };
    }
    if (code.startsWith('sample-')) {
      return { type: 'Soil Sample', message: 'Soil Sample code identified.' };
    }
    if (code.startsWith('manual-')) {
      return { type: 'Manual Fallback', message: 'Manual fallback code entered.' };
    }
    if (code.length === 6 && /^[A-Z0-9]+$/.test(code.toUpperCase())) {
        return { type: 'Manual Fallback (Assumed)', message: 'Assumed 6-character manual fallback code.' };
    }
    return { type: 'Unknown', message: 'Code format not recognized.' };
  };

  const processCode = (code: string) => {
    console.log("Processing code:", code);
    setIsLoading(true); // Show loading for processing
    
    const { type, message } = identifyCodeType(code);

    // Simulate processing delay
    setTimeout(() => {
      setProcessedCodeInfo({ code, type, message });
      setError(null);
      setIsScanning(false); // Stop scanning after successful processing
      setIsLoading(false);
      toast({
        title: `${type} Code Processed`,
        description: `Code: ${code}. ${message}`,
        variant: type === 'Unknown' ? 'destructive' : 'default',
      });

      // TODO: Future: Navigate or fetch data based on code type and ID
      // Example: if (type === 'Truck Journey') router.push(`/truck/${code}`);
    }, 500);
  };


  const handleScanSuccess = (decodedText: string) => {
    if (!isScanning) return; 
    console.log("Scan successful:", decodedText);
    toast({ title: "QR Code Detected!", description: "Processing code..." });
    processCode(decodedText);
  };

  const handleScanError = useCallback((errorMessage: string) => {
    if (!isScanning) return; 
    console.error("Scan error callback:", errorMessage);
    // Avoid flooding toasts for common camera issues handled by QrScanner's UI
    if (!errorMessage.includes('permission') && !errorMessage.includes('camera') && !errorMessage.includes('supported') && !errorMessage.includes('video play failed')) {
        setError(`Scan Error: ${errorMessage}`);
         toast({
            variant: 'destructive',
            title: 'QR Scan Error',
            description: errorMessage.length > 100 ? 'Could not read QR code. Try manual entry.' : errorMessage,
         });
    }
    // Optionally, could decide to stop scanning on certain errors, but generally want to allow retry
  }, [isScanning, toast]);

   const handleManualSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null); 
     const trimmedCode = manualCode.trim().toUpperCase();

     if (!trimmedCode) {
        setError('Manual code cannot be empty.');
        toast({ variant: 'destructive', title: 'Invalid Manual Code', description: 'Please enter a code.'});
        return;
     }
     // Basic validation for 6-char code if not using the "manual-" prefix internally
     if (trimmedCode.length !== 6 && !trimmedCode.startsWith('manual-')) {
       setError('Manual fallback code should typically be 6 characters, or ensure correct format.');
       toast({
           variant: 'destructive',
           title: 'Invalid Manual Code Length',
           description: 'Please enter a 6-character code or check format.',
       });
       return;
     }
    
     setIsScanning(false); // Stop camera scanning when submitting manually
     const codeToProcess = trimmedCode.startsWith('manual-') ? trimmedCode : `manual-${trimmedCode}`;
     processCode(codeToProcess);
   };

   const handleRescan = () => {
     setProcessedCodeInfo(null);
     setError(null);
     setManualCode('');
     setIsLoading(false);
     setIsScanning(true); 
     toast({
        title: 'Ready to Scan',
        description: 'Point your camera at a new QR code.'
     })
   }
   
    useEffect(() => {
        // If there's processed code, ensure scanning is off.
        if (processedCodeInfo) {
            setIsScanning(false);
        }
    }, [processedCodeInfo]);


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
            <CardDescription>Scan a QR code using your device camera or enter the fallback code manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {!processedCodeInfo && (
               <>
                 {isScanning && <p className="text-center text-sm text-muted-foreground">Point your camera at the QR code.</p>}
                 <QrScanner
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                    active={isScanning}
                 />
               </>
            )}

             {processedCodeInfo && (
                 <Alert variant={processedCodeInfo.type === 'Unknown' ? 'destructive' : 'default'} className={processedCodeInfo.type !== 'Unknown' ? "bg-green-50 border-green-200" : ""}>
                   {processedCodeInfo.type === 'Unknown' ? <AlertCircle className="h-5 w-5 text-destructive-foreground" /> : <CheckCircle className="h-5 w-5 text-green-600" />}
                   <AlertTitle className={processedCodeInfo.type !== 'Unknown' ? "text-green-800" : ""}>{processedCodeInfo.type} Code Processed</AlertTitle>
                   <UiAlertDescription className={processedCodeInfo.type !== 'Unknown' ? "text-green-700 space-y-2" : "space-y-2"}>
                     <div>Successfully processed code: <span className="font-mono break-all bg-green-100 px-1 rounded">{processedCodeInfo.code}</span></div>
                     <p>{processedCodeInfo.message}</p>
                      <Button variant="link" size="sm" onClick={handleRescan} className={`p-0 h-auto ${processedCodeInfo.type !== 'Unknown' ? "text-green-700 hover:text-green-900" : "text-primary hover:underline"}`}>
                        Scan another code
                      </Button>
                   </UiAlertDescription>
                 </Alert>
              )}


             {!processedCodeInfo && error && !isScanning && ( // Show general errors only if not actively scanning and no success
                 <Alert variant="destructive">
                     <AlertCircle className="h-5 w-5"/>
                     <AlertTitle>Error</AlertTitle>
                     <UiAlertDescription>{error}</UiAlertDescription>
                 </Alert>
             )}

             {/* Show rescan button if an error occurred OR if scanning is paused but no code processed yet */}
             {!isScanning && !processedCodeInfo && (
                  <Button onClick={handleRescan} variant="outline" className="w-full sm:w-auto">
                     <ScanLine className="mr-2 h-4 w-4" /> Retry Scan
                  </Button>
             )}
             {isLoading && !processedCodeInfo && (
                <div className="flex items-center justify-center p-4">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                    <p className="text-muted-foreground">Processing code...</p>
                </div>
             )}


             <div className="relative pt-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">OR</span>
             </div>


            <form onSubmit={handleManualSubmit} className="space-y-4 pt-4">
               <div className="space-y-2">
                <Label htmlFor="manualCode">Enter Fallback Code</Label>
                <Input
                    id="manualCode"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g., ABCXYZ or full ID"
                    className="text-center font-mono text-lg tracking-widest"
                    disabled={!!processedCodeInfo || isLoading} 
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoCorrect="off"
                />
                <FormDescription className="text-xs text-center">Enter the 6-character code or the full unique ID.</FormDescription>
               </div>
               <Button type="submit" className="w-full sm:w-auto" disabled={!!processedCodeInfo || isLoading || !manualCode.trim()}>
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
