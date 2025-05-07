'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Truck,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  PackageSearch, // Using this if no items are found
  CalendarIcon as CalendarLucideIcon, // Renamed to avoid conflict
  X,
  Save,
  SlidersHorizontal,
  Users2,
  CloudSun,
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
  DialogDescription as DialogDescriptionComponent, // Renamed
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Define Zod schema for application operation
const applicationOperationSchema = z.object({
  id: z.string().optional(),
  applicationDate: z.date({ required_error: "Application date is required." }),
  fieldId: z.string().min(1, "Field ID or name is required."),
  rockDustType: z.string().min(1, "Rock dust type is required."),
  amountApplied: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  unit: z.string().min(1, { message: "Unit is required (e.g., tons, kg)." }),
  applicationMethod: z.string().min(1, {message: "Application method is required"}),
  equipmentUsed: z.string().optional(),
  personnel: z.string().min(1, "Personnel involved is required."),
  weatherConditions: z.string().optional(),
  notes: z.string().optional(),
});

type ApplicationOperationFormValues = z.infer<typeof applicationOperationSchema>;

export interface ApplicationOperation extends ApplicationOperationFormValues {
  id: string;
}

const initialApplicationOperations: ApplicationOperation[] = [
  {
    id: crypto.randomUUID(),
    applicationDate: new Date('2024-07-15'),
    fieldId: 'Field-A01',
    rockDustType: 'Basalt Rock Dust',
    amountApplied: 10,
    unit: 'tons',
    applicationMethod: 'Spreader Truck',
    equipmentUsed: 'Spreader Model X200',
    personnel: 'John Doe, Jane Smith',
    weatherConditions: 'Sunny, 22°C, Light breeze',
    notes: 'Applied evenly across the field.'
  },
  {
    id: crypto.randomUUID(),
    applicationDate: new Date('2024-07-20'),
    fieldId: 'Field-B03',
    rockDustType: 'Wollastonite',
    amountApplied: 5,
    unit: 'tons',
    applicationMethod: 'Manual Spreading',
    equipmentUsed: 'Shovels, Wheelbarrows',
    personnel: 'Mike Brown',
    weatherConditions: 'Cloudy, 18°C',
    notes: 'Focused on northern section.'
  },
];


export default function ApplicationPage() {
  const { toast } = useToast();
  const [operations, setOperations] = useState<ApplicationOperation[]>(initialApplicationOperations);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<ApplicationOperation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<ApplicationOperationFormValues>({
    resolver: zodResolver(applicationOperationSchema),
    defaultValues: {
      applicationDate: new Date(),
      fieldId: '',
      rockDustType: '',
      amountApplied: 0,
      unit: 'tons',
      applicationMethod: '',
      equipmentUsed: '',
      personnel: '',
      weatherConditions: '',
      notes: '',
    },
  });

   useEffect(() => {
    if (editingOperation) {
      form.reset({
        ...editingOperation,
        applicationDate: editingOperation.applicationDate ? new Date(editingOperation.applicationDate) : new Date(),
      });
    } else {
      form.reset({
        id: undefined,
        applicationDate: new Date(),
        fieldId: '',
        rockDustType: '',
        amountApplied: 0,
        unit: 'tons',
        applicationMethod: '',
        equipmentUsed: '',
        personnel: '',
        weatherConditions: '',
        notes: '',
      });
    }
  }, [editingOperation, form, isFormOpen]);

  const handleAddNewOperation = () => {
    setEditingOperation(null);
    setIsFormOpen(true);
  };

  const handleEditOperation = (operation: ApplicationOperation) => {
    setEditingOperation(operation);
    setIsFormOpen(true);
  };

  const handleDeleteOperation = (operationId: string) => {
    setOperations((prevOps) => prevOps.filter((op) => op.id !== operationId));
    toast({
      title: 'Operation Deleted',
      description: 'The application operation has been removed.',
    });
  };

  const onSubmit = (values: ApplicationOperationFormValues) => {
    if (editingOperation) {
      const updatedOps = operations.map((op) =>
        op.id === editingOperation.id ? { ...editingOperation, ...values } : op
      );
      setOperations(updatedOps);
      toast({ title: 'Operation Updated', description: `Operation for field ${values.fieldId} has been updated.` });
    } else {
      const newOperation: ApplicationOperation = { ...values, id: crypto.randomUUID() };
      setOperations((prevOps) => [newOperation, ...prevOps]);
      toast({ title: 'Operation Added', description: `New operation for field ${values.fieldId} has been added.` });
    }
    setIsFormOpen(false);
    setEditingOperation(null);
  };

  const filteredOperations = useMemo(() => {
    return operations.filter((op) =>
      op.fieldId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.rockDustType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.applicationMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.personnel.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operations, searchTerm]);

  // Dummy data for selects - replace with actual data fetching
  const rockDustTypes = ['Basalt Rock Dust', 'Wollastonite', 'Volcanic Ash', 'Limestone'];
  const applicationMethods = ['Spreader Truck', 'Manual Spreading', 'Aerial Dusting', 'Liquid Injection'];


  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Truck className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Application Operations</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-lg rounded-lg border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Application Operations</CardTitle>
              <CardDescription>Track rock dust application details, equipment, and personnel.</CardDescription>
            </div>
            <Button onClick={handleAddNewOperation}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Operation
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search operations (field, rock type, method, personnel)..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredOperations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Field ID</TableHead>
                      <TableHead>Rock Dust</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Personnel</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperations.map((op) => (
                      <TableRow key={op.id}>
                        <TableCell>{format(new Date(op.applicationDate), 'PP')}</TableCell>
                        <TableCell className="font-medium">{op.fieldId}</TableCell>
                        <TableCell>{op.rockDustType}</TableCell>
                        <TableCell className="text-right">{op.amountApplied}</TableCell>
                        <TableCell>{op.unit}</TableCell>
                        <TableCell>{op.applicationMethod}</TableCell>
                        <TableCell>{op.personnel}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditOperation(op)} className="mr-2">
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
                                  This action cannot be undone. This will permanently delete the operation for field "{op.fieldId}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteOperation(op.id)}
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
                <h3 className="text-lg font-semibold">No Application Operations Found</h3>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new application operation."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingOperation(null);
      }}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOperation ? 'Edit Application Operation' : 'Add New Application Operation'}</DialogTitle>
            <DialogDescriptionComponent> {/* Renamed usage */}
              {editingOperation ? 'Update the details of the application operation.' : 'Fill in the details for the new operation.'}
            </DialogDescriptionComponent>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="applicationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Date*</FormLabel>
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
                  name="rockDustType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rock Dust Type*</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rock dust type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rockDustTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          <SelectItem value="other_rock_dust">Other (Specify in Notes)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amountApplied"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Applied*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit*</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value || "tons"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="lbs">Pounds</SelectItem>
                           <SelectItem value="bags">Bags</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" /> Application Method*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select application method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {applicationMethods.map(method => <SelectItem key={method} value={method}>{method}</SelectItem>)}
                           <SelectItem value="other_method">Other (Specify in Notes)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipmentUsed"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Equipment Used (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spreader Model X, Tractor Y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="personnel"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center"><Users2 className="mr-2 h-4 w-4 text-muted-foreground" /> Personnel Involved*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe, Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weatherConditions"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center"><CloudSun className="mr-2 h-4 w-4 text-muted-foreground" /> Weather Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunny, 20°C, calm" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Any additional notes about this operation..." {...field} />
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
                  <Save className="mr-2 h-4 w-4" /> {editingOperation ? 'Save Changes' : 'Add Operation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
