'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Package,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  PackageSearch,
  CalendarIcon,
  X,
  Save,
} from 'lucide-react';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
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

// Define Zod schema for supply item validation
const supplyItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Supply name must be at least 2 characters." }),
  category: z.enum(['rock_dust', 'sampling_kit', 'equipment', 'other'], { required_error: "Category is required." }),
  quantity: z.coerce.number().min(0, { message: "Quantity must be a non-negative number." }),
  unit: z.string().min(1, { message: "Unit is required (e.g., tons, bags, units)." }),
  supplier: z.string().optional(),
  orderDate: z.date().nullable().optional(),
  expectedDeliveryDate: z.date().nullable().optional(),
  actualDeliveryDate: z.date().nullable().optional(),
  status: z.enum(['pending_order', 'ordered', 'shipped', 'delivered', 'cancelled', 'on_hold'], { required_error: "Status is required." }),
  notes: z.string().optional(),
});

type SupplyFormValues = z.infer<typeof supplyItemSchema>;

export interface SupplyItem extends SupplyFormValues {
  id: string; // Ensure id is always present after creation
}

const initialSupplyItems: SupplyItem[] = [
    {
        id: crypto.randomUUID(),
        name: 'Basalt Rock Dust',
        category: 'rock_dust',
        quantity: 50,
        unit: 'tons',
        supplier: 'Quarry King Ltd.',
        orderDate: new Date('2024-05-15'),
        expectedDeliveryDate: new Date('2024-06-01'),
        actualDeliveryDate: new Date('2024-06-03'),
        status: 'delivered',
        notes: 'High quality basalt, fine grind.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Soil Sample Bags (Large)',
        category: 'sampling_kit',
        quantity: 200,
        unit: 'units',
        supplier: 'LabSupply Co.',
        orderDate: new Date('2024-07-01'),
        expectedDeliveryDate: new Date('2024-07-10'),
        actualDeliveryDate: null,
        status: 'ordered',
        notes: 'Heavy-duty, 1kg capacity.'
    },
];


export default function SupplyPage() {
  const { toast } = useToast();
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>(initialSupplyItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<SupplyFormValues>({
    resolver: zodResolver(supplyItemSchema),
    defaultValues: {
      name: '',
      category: undefined,
      quantity: 0,
      unit: '',
      supplier: '',
      orderDate: null,
      expectedDeliveryDate: null,
      actualDeliveryDate: null,
      status: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        ...editingItem,
        orderDate: editingItem.orderDate ? new Date(editingItem.orderDate) : null,
        expectedDeliveryDate: editingItem.expectedDeliveryDate ? new Date(editingItem.expectedDeliveryDate) : null,
        actualDeliveryDate: editingItem.actualDeliveryDate ? new Date(editingItem.actualDeliveryDate) : null,
      });
    } else {
      form.reset({
        name: '',
        category: undefined,
        quantity: 0,
        unit: '',
        supplier: '',
        orderDate: null,
        expectedDeliveryDate: null,
        actualDeliveryDate: null,
        status: undefined,
        notes: '',
      });
    }
  }, [editingItem, form, isFormOpen]);

  const handleAddNewSupply = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: SupplyItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setSupplyItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast({
      title: 'Supply Item Deleted',
      description: 'The supply item has been removed from the list.',
    });
  };

  const onSubmit = (values: SupplyFormValues) => {
    if (editingItem) {
      // Update existing item
      const updatedItems = supplyItems.map((item) =>
        item.id === editingItem.id ? { ...item, ...values } : item
      );
      setSupplyItems(updatedItems);
      toast({ title: 'Supply Item Updated', description: `${values.name} has been updated.` });
    } else {
      // Add new item
      const newItem: SupplyItem = { ...values, id: crypto.randomUUID() };
      setSupplyItems((prevItems) => [newItem, ...prevItems]);
      toast({ title: 'Supply Item Added', description: `${values.name} has been added to supplies.` });
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const filteredSupplyItems = useMemo(() => {
    return supplyItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supplyItems, searchTerm]);

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <Package className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Supply Coordination</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-lg rounded-lg border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Supplies</CardTitle>
              <CardDescription>Track inventory, orders, and deliveries of essential supplies.</CardDescription>
            </div>
            <Button onClick={handleAddNewSupply}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Supply
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search supplies (name, category, supplier, status)..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredSupplyItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSupplyItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", {
                                'bg-yellow-100 text-yellow-800': item.status === 'pending_order' || item.status === 'on_hold',
                                'bg-blue-100 text-blue-800': item.status === 'ordered',
                                'bg-indigo-100 text-indigo-800': item.status === 'shipped',
                                'bg-green-100 text-green-800': item.status === 'delivered',
                                'bg-red-100 text-red-800': item.status === 'cancelled',
                            })}>
                                {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </TableCell>
                        <TableCell>{item.supplier || 'N/A'}</TableCell>
                        <TableCell>{item.orderDate ? format(new Date(item.orderDate), 'PP') : 'N/A'}</TableCell>
                        <TableCell>{item.expectedDeliveryDate ? format(new Date(item.expectedDeliveryDate), 'PP') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)} className="mr-2">
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
                                  This action cannot be undone. This will permanently delete the supply item
                                  "{item.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteItem(item.id)}
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
                <PackageSearch className="h-16 w-16 mb-4" />
                <h3 className="text-lg font-semibold">No Supply Items Found</h3>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new supply item."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingItem(null);
      }}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Supply Item' : 'Add New Supply Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details of the supply item.' : 'Fill in the details for the new supply item.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Supply Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Basalt Rock Dust" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rock_dust">Rock Dust</SelectItem>
                          <SelectItem value="sampling_kit">Sampling Kit</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending_order">Pending Order</SelectItem>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                           <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity*</FormLabel>
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
                      <FormControl>
                        <Input placeholder="e.g., tons, bags, units" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Supplier (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Order Date (Optional)</FormLabel>
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Delivery Date (Optional)</FormLabel>
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                  name="actualDeliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Actual Delivery Date (Optional)</FormLabel>
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes about this supply item..." {...field} />
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
                  <Save className="mr-2 h-4 w-4" /> {editingItem ? 'Save Changes' : 'Add Supply'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
