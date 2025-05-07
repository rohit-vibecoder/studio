'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  FlaskConical,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  PackageSearch, // Using this if no items are found
  CalendarIcon as CalendarLucideIcon,
  X,
  Save,
  ClipboardCheck, // For lab name
  Ruler, // For measurement type
  FileText, // For report ID
  Atom, // for pH
  ThermometerSnowflake, // for CEC
  Percent, // for Organic Carbon
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

// Define Zod schema for lab result
const labResultSchema = z.object({
  id: z.string().optional(),
  sampleQrCodeId: z.string().min(1, "Sample QR Code ID is required."),
  analysisDate: z.date({ required_error: "Analysis date is required." }),
  labName: z.string().min(1, "Lab name is required."),
  reportId: z.string().optional(),
  ph: z.coerce.number().min(0).max(14).optional(),
  organicCarbonPercent: z.coerce.number().min(0).max(100).optional(),
  cecMeL100g: z.coerce.number().min(0).optional(), // Cation Exchange Capacity
  elementCa: z.coerce.number().min(0).optional().describe("Calcium (ppm or mg/kg)"),
  elementMg: z.coerce.number().min(0).optional().describe("Magnesium (ppm or mg/kg)"),
  elementK: z.coerce.number().min(0).optional().describe("Potassium (ppm or mg/kg)"),
  elementP: z.coerce.number().min(0).optional().describe("Phosphorus (ppm or mg/kg)"),
  otherMeasurements: z.string().optional().describe("JSON string or free text for other measurements"),
  notes: z.string().optional(),
});

type LabResultFormValues = z.infer<typeof labResultSchema>;

export interface LabResult extends LabResultFormValues {
  id: string;
}

const initialLabResults: LabResult[] = [
  {
    id: crypto.randomUUID(),
    sampleQrCodeId: 'sample-1690000000000-ABCDEF',
    analysisDate: new Date('2024-08-01'),
    labName: 'AgriGrowth Labs',
    reportId: 'AGL-2024-00123',
    ph: 6.8,
    organicCarbonPercent: 2.5,
    cecMeL100g: 15.2,
    elementCa: 2000,
    elementMg: 500,
    elementK: 150,
    elementP: 25,
    otherMeasurements: '{"Nitrogen (N)": "0.15%", "Texture": "Loam"}',
    notes: 'Standard soil panel performed.'
  },
  {
    id: crypto.randomUUID(),
    sampleQrCodeId: 'sample-1690000100000-GHIJKL',
    analysisDate: new Date('2024-08-05'),
    labName: 'TerraAnalytics Inc.',
    reportId: 'TA-SR-5890',
    ph: 7.2,
    organicCarbonPercent: 1.8,
    cecMeL100g: 12.5,
    elementCa: 1800,
    elementMg: 450,
    notes: 'Only pH and OC requested.'
  },
];

export default function LabPage() {
  const { toast } = useToast();
  const [results, setResults] = useState<LabResult[]>(initialLabResults);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<LabResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<LabResultFormValues>({
    resolver: zodResolver(labResultSchema),
    defaultValues: {
      sampleQrCodeId: '',
      analysisDate: new Date(),
      labName: '',
      reportId: '',
      ph: undefined,
      organicCarbonPercent: undefined,
      cecMeL100g: undefined,
      elementCa: undefined,
      elementMg: undefined,
      elementK: undefined,
      elementP: undefined,
      otherMeasurements: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (editingResult) {
      form.reset({
        ...editingResult,
        analysisDate: editingResult.analysisDate ? new Date(editingResult.analysisDate) : new Date(),
      });
    } else {
      form.reset({
        id: undefined,
        sampleQrCodeId: '',
        analysisDate: new Date(),
        labName: '',
        reportId: '',
        ph: undefined,
        organicCarbonPercent: undefined,
        cecMeL100g: undefined,
        elementCa: undefined,
        elementMg: undefined,
        elementK: undefined,
        elementP: undefined,
        otherMeasurements: '',
        notes: '',
      });
    }
  }, [editingResult, form, isFormOpen]);

  const handleAddNewResult = () => {
    setEditingResult(null);
    setIsFormOpen(true);
  };

  const handleEditResult = (result: LabResult) => {
    setEditingResult(result);
    setIsFormOpen(true);
  };

  const handleDeleteResult = (resultId: string) => {
    setResults((prevResults) => prevResults.filter((res) => res.id !== resultId));
    toast({
      title: 'Result Deleted',
      description: 'The lab result has been removed.',
    });
  };

  const onSubmit = (values: LabResultFormValues) => {
    if (editingResult) {
      const updatedResults = results.map((res) =>
        res.id === editingResult.id ? { ...editingResult, ...values } : res
      );
      setResults(updatedResults);
      toast({ title: 'Result Updated', description: `Lab result for sample ${values.sampleQrCodeId} updated.` });
    } else {
      const newResult: LabResult = { ...values, id: crypto.randomUUID() };
      setResults((prevResults) => [newResult, ...prevResults]);
      toast({ title: 'Result Added', description: `New lab result for sample ${values.sampleQrCodeId} added.` });
    }
    setIsFormOpen(false);
    setEditingResult(null);
  };

  const filteredResults = useMemo(() => {
    return results.filter((res) =>
      res.sampleQrCodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.reportId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [results, searchTerm]);

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <FlaskConical className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Lab Analysis</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-lg rounded-lg border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Enter Lab Results</CardTitle>
              <CardDescription>Input analysis data for soil samples.</CardDescription>
            </div>
            <Button onClick={handleAddNewResult}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Lab Result
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search results (Sample ID, Lab, Report ID)..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredResults.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample QR ID</TableHead>
                      <TableHead>Analysis Date</TableHead>
                      <TableHead>Lab Name</TableHead>
                      <TableHead>Report ID</TableHead>
                      <TableHead className="text-right">pH</TableHead>
                      <TableHead className="text-right">OC %</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((res) => (
                      <TableRow key={res.id}>
                        <TableCell className="font-medium">{res.sampleQrCodeId}</TableCell>
                        <TableCell>{format(new Date(res.analysisDate), 'PP')}</TableCell>
                        <TableCell>{res.labName}</TableCell>
                        <TableCell>{res.reportId || 'N/A'}</TableCell>
                        <TableCell className="text-right">{res.ph !== undefined ? res.ph.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{res.organicCarbonPercent !== undefined ? res.organicCarbonPercent.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditResult(res)} className="mr-2">
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
                                  This action cannot be undone. This will permanently delete the lab result for sample "{res.sampleQrCodeId}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteResult(res.id)}
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
                <h3 className="text-lg font-semibold">No Lab Results Found</h3>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new lab result."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingResult(null);
      }}>
        <DialogContent className="sm:max-w-lg md:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResult ? 'Edit Lab Result' : 'Add New Lab Result'}</DialogTitle>
            <DialogDescriptionComponent>
              {editingResult ? 'Update the lab analysis data.' : 'Enter the results from a lab analysis for a soil sample.'}
            </DialogDescriptionComponent>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <FormField
                  control={form.control}
                  name="sampleQrCodeId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Sample QR Code ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., sample-123-XYZ" {...field} />
                      </FormControl>
                      <FormDescription>The ID from the physical sample bag.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="analysisDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-1">
                      <FormLabel>Analysis Date*</FormLabel>
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
                  name="labName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel className="flex items-center"><ClipboardCheck className="mr-2 h-4 w-4 text-muted-foreground" /> Lab Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the testing laboratory" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4 text-muted-foreground" /> Lab Report ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Lab's internal report identifier" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="md:col-span-2 p-4 bg-secondary/50 border border-dashed">
                    <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-base flex items-center"><Ruler className="mr-2 h-4 w-4" /> Key Measurements</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="ph"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><Atom className="mr-1 h-3 w-3 text-muted-foreground" /> pH</FormLabel>
                                <FormControl>
                                <Input type="number" step="0.1" placeholder="e.g., 6.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="organicCarbonPercent"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><Percent className="mr-1 h-3 w-3 text-muted-foreground" /> Organic Carbon (%)</FormLabel>
                                <FormControl>
                                <Input type="number" step="0.01" placeholder="e.g., 2.75" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="cecMeL100g"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><ThermometerSnowflake className="mr-1 h-3 w-3 text-muted-foreground" /> CEC (meq/100g)</FormLabel>
                                <FormControl>
                                <Input type="number" step="0.1" placeholder="e.g., 12.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="elementCa"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calcium (Ca)</FormLabel>
                                <FormControl>
                                <Input type="number" step="any" placeholder="ppm or mg/kg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="elementMg"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Magnesium (Mg)</FormLabel>
                                <FormControl>
                                <Input type="number" step="any" placeholder="ppm or mg/kg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="elementK"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Potassium (K)</FormLabel>
                                <FormControl>
                                <Input type="number" step="any" placeholder="ppm or mg/kg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="elementP"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phosphorus (P)</FormLabel>
                                <FormControl>
                                <Input type="number" step="any" placeholder="ppm or mg/kg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                
                <FormField
                  control={form.control}
                  name="otherMeasurements"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Other Measurements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='e.g., {"Nitrogen (N)": "0.2%", "Texture": "Sandy Loam"} or free text' {...field} />
                      </FormControl>
                      <FormDescription>Enter as JSON or free text for additional parameters.</FormDescription>
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
                        <Textarea placeholder="Any additional notes about this lab result or analysis..." {...field} />
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
                  <Save className="mr-2 h-4 w-4" /> {editingResult ? 'Save Changes' : 'Add Result'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
