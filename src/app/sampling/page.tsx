'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Sprout,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  QrCode,
  PackageSearch, // Using this if no items are found
  CalendarIcon as CalendarLucideIcon,
  X,
  Save,
  MapPin,
  ClipboardSignature, // For collectedBy
  Layers, // For sampleDepth
  ListTree, // For sub-samples
  Beaker, // For samplingMethod
  LinkIcon // For Associated Survey ID
} from 'lucide-react';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generateUniqueQRCodeData } from '@/lib/qrcode'; // Assuming this gives a prefix like "sample-"


const soilSampleSchema = z.object({
  id: z.string().optional(), // This will be the internal DB ID
  qrCodeId: z.string().min(1, "QR Code ID is required."), // This is what's on the physical sample
  collectionDate: z.date({ required_error: "Collection date is required." }),
  collectedBy: z.string().min(1, "Collector name is required."),
  fieldId: z.string().min(1, "Field ID or name is required."),
  latitude: z.coerce.number().min(-90).max(90, 'Invalid Latitude').optional(),
  longitude: z.coerce.number().min(-180).max(180, 'Invalid Longitude').optional(),
  sampleDepth: z.string().min(1, "Sample depth is required (e.g., 0-15cm)."),
  numberOfSubSamples: z.coerce.number().int().min(1, "At least one sub-sample is required.").optional(),
  samplingMethod: z.string().optional(),
  associatedSurveyId: z.string().optional(),
  notes: z.string().optional(),
});

type SoilSampleFormValues = z.infer<typeof soilSampleSchema>;

export interface SoilSample extends SoilSampleFormValues {
  id: string; // Internal unique ID
}

const initialSoilSamples: SoilSample[] = [
  {
    id: crypto.randomUUID(),
    qrCodeId: 'sample-1690000000000-ABCDEF',
    collectionDate: new Date('2024-07-25'),
    collectedBy: 'Alice Wonderland',
    fieldId: 'Field-A01',
    latitude: 40.7128,
    longitude: -74.0060,
    sampleDepth: '0-15cm',
    numberOfSubSamples: 5,
    samplingMethod: 'Auger',
    associatedSurveyId: 'SURVEY-1680000000000',
    notes: 'Sampled near the old oak tree.'
  },
  {
    id: crypto.randomUUID(),
    qrCodeId: 'sample-1690000100000-GHIJKL',
    collectionDate: new Date('2024-07-28'),
    collectedBy: 'Bob The Builder',
    fieldId: 'Field-C05',
    latitude: 34.0522,
    longitude: -118.2437,
    sampleDepth: '15-30cm',
    numberOfSubSamples: 3,
    samplingMethod: 'Core Sampler',
    associatedSurveyId: 'SURVEY-1680000100000',
    notes: 'Rocky soil, difficult to sample.'
  },
];

export default function SamplingPage() {
  const { toast } = useToast();
  const [samples, setSamples] = useState<SoilSample[]>(initialSoilSamples);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<SoilSample | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<SoilSampleFormValues>({
    resolver: zodResolver(soilSampleSchema),
    defaultValues: {
      qrCodeId: '',
      collectionDate: new Date(),
      collectedBy: '',
      fieldId: '',
      latitude: undefined,
      longitude: undefined,
      sampleDepth: '',
      numberOfSubSamples: 1,
      samplingMethod: '',
      associatedSurveyId: '',
      notes: '',
    },
  });

   useEffect(() => {
    if (editingSample) {
      form.reset({
        ...editingSample,
        collectionDate: editingSample.collectionDate ? new Date(editingSample.collectionDate) : new Date(),
      });
    } else {
      // For new samples, pre-fill qrCodeId if user hasn't manually entered one yet after opening form.
      // This allows them to scan/enter one from a pre-printed label.
      // If they generate one, they can copy-paste it here.
      const defaultQrId = editingSample ? editingSample.qrCodeId : generateUniqueQRCodeData('sample');
      form.reset({
        id: undefined,
        qrCodeId: form.getValues('qrCodeId') || defaultQrId, // Preserve if user typed, else generate
        collectionDate: new Date(),
        collectedBy: '',
        fieldId: '',
        latitude: undefined,
        longitude: undefined,
        sampleDepth: '',
        numberOfSubSamples: 1,
        samplingMethod: '',
        associatedSurveyId: '',
        notes: '',
      });
    }
  }, [editingSample, form, isFormOpen]);


  const handleAddNewSample = () => {
    setEditingSample(null);
    // Reset QR code ID for new sample, user can either input existing or generate a new one.
    form.reset({ ...form.formState.defaultValues, qrCodeId: generateUniqueQRCodeData('sample'), collectionDate: new Date()});
    setIsFormOpen(true);
  };

  const handleEditSample = (sample: SoilSample) => {
    setEditingSample(sample);
    setIsFormOpen(true);
  };

  const handleDeleteSample = (sampleId: string) => {
    setSamples((prevSamples) => prevSamples.filter((s) => s.id !== sampleId));
    toast({
      title: 'Sample Deleted',
      description: 'The soil sample has been removed from the list.',
    });
  };

  const onSubmit = (values: SoilSampleFormValues) => {
    if (editingSample) {
      const updatedSamples = samples.map((s) =>
        s.id === editingSample.id ? { ...editingSample, ...values } : s
      );
      setSamples(updatedSamples);
      toast({ title: 'Sample Updated', description: `Sample ${values.qrCodeId} has been updated.` });
    } else {
      const newSample: SoilSample = { ...values, id: crypto.randomUUID() };
      setSamples((prevSamples) => [newSample, ...prevSamples]);
      toast({ title: 'Sample Added', description: `New sample ${values.qrCodeId} has been added.` });
    }
    setIsFormOpen(false);
    setEditingSample(null);
  };

  const filteredSamples = useMemo(() => {
    return samples.filter((s) =>
      s.qrCodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fieldId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collectedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sampleDepth.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [samples, searchTerm]);

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Sprout className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Soil Sampling</h1>
        <Link href="/qr/generate/sample" passHref className="ml-auto">
             <Button variant="outline" size="sm">
                 <QrCode className="mr-2 h-4 w-4" /> Generate New Sample QR
             </Button>
        </Link>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-lg rounded-lg border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Soil Samples</CardTitle>
              <CardDescription>Log sample collection details, locations, and link to QR codes.</CardDescription>
            </div>
            <Button onClick={handleAddNewSample}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Sample Log
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search samples (QR ID, Field ID, Collector, Depth)..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredSamples.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>QR Code ID</TableHead>
                      <TableHead>Collection Date</TableHead>
                      <TableHead>Field ID</TableHead>
                      <TableHead>Collected By</TableHead>
                      <TableHead>Depth</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSamples.map((sample) => (
                      <TableRow key={sample.id}>
                        <TableCell className="font-medium">{sample.qrCodeId}</TableCell>
                        <TableCell>{format(new Date(sample.collectionDate), 'PP')}</TableCell>
                        <TableCell>{sample.fieldId}</TableCell>
                        <TableCell>{sample.collectedBy}</TableCell>
                        <TableCell>{sample.sampleDepth}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditSample(sample)} className="mr-2">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete sample "{sample.qrCodeId}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSample(sample.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
               <div className="mt-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <PackageSearch className="h-16 w-16 mb-4 text-primary" />
                <h3 className="text-lg font-semibold">No Soil Samples Found</h3>
                <p className="text-sm mb-4">
                  {searchTerm ? "Try adjusting your search terms." : "Get started by logging a new soil sample or generate a QR code first."}
                </p>
                 {!searchTerm && (
                    <Link href="/qr/generate/sample" passHref>
                        <Button variant="outline">
                            <QrCode className="mr-2 h-4 w-4" />
                            Generate Sample QR Code
                        </Button>
                    </Link>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingSample(null);
      }}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSample ? 'Edit Soil Sample Log' : 'Add New Soil Sample Log'}</DialogTitle>
            <DialogDescriptionComponent>
              {editingSample ? 'Update the details of the soil sample.' : 'Log a new soil sample. You can generate a QR ID separately if needed.'}
            </DialogDescriptionComponent>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="qrCodeId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center"><QrCode className="mr-2 h-4 w-4 text-muted-foreground" /> QR Code ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., sample-12345-XYZ" {...field} />
                      </FormControl>
                      <FormDescription>Enter the ID from the QR code label. <Link href="/qr/generate/sample" className="text-primary hover:underline">Generate one</Link> if needed.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="collectionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Collection Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarLucideIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="collectedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><ClipboardSignature className="mr-2 h-4 w-4 text-muted-foreground" /> Collected By*</FormLabel>
                      <FormControl>
                        <Input placeholder="Surveyor's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="fieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field ID/Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., North Paddock A01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sampleDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Layers className="mr-2 h-4 w-4 text-muted-foreground" /> Sample Depth*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 0-15cm, 15-30cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="md:col-span-2 p-4 bg-secondary/50 border border-dashed">
                    <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-base flex items-center"><MapPin className="mr-2 h-4 w-4" /> Location (GPS - Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="e.g., 40.7128" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="e.g., -74.0060" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                 <FormField
                  control={form.control}
                  name="numberOfSubSamples"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><ListTree className="mr-2 h-4 w-4 text-muted-foreground" /> Number of Sub-Samples (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="samplingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Beaker className="mr-2 h-4 w-4 text-muted-foreground" /> Sampling Method (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Auger, Core Sampler" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="associatedSurveyId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center"><LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Associated Survey ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SURVEY-12345" {...field} />
                      </FormControl>
                       <FormDescription>Link this sample to a field survey record.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes about this sample..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> {editingSample ? 'Save Changes' : 'Add Sample Log'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
