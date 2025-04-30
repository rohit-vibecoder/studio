
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ClipboardList, MapPin, Sun, Droplets, TestTube2, Leaf, Camera, StickyNote, Save } from 'lucide-react';

import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Define the form schema using Zod
const fieldSurveySchema = z.object({
  surveyId: z.string().min(1, 'Survey ID is required').default(`SURVEY-${Date.now()}`),
  surveyDate: z.date({ required_error: 'Survey date is required.' }),
  surveyorName: z.string().min(1, 'Surveyor name is required.'),
  latitude: z.coerce.number().min(-90).max(90, 'Invalid Latitude'),
  longitude: z.coerce.number().min(-180).max(180, 'Invalid Longitude'),
  siteConditions: z.string().optional(),
  observations: z.string().min(5, 'Observations must be at least 5 characters.'),
  soilType: z.enum(['clay', 'silt', 'sand', 'loam', 'peat', 'chalky', 'other'], { required_error: 'Soil type is required.' }),
  vegetationCover: z.enum(['bare', 'sparse', 'moderate', 'dense'], { required_error: 'Vegetation cover is required.' }),
  weatherConditions: z.string().optional(),
  soilMoisture: z.number().min(0).max(100).default(50), // Percentage or scale 0-100
  phMeasurement: z.coerce.number().min(0).max(14).optional(),
  notes: z.string().optional(),
});

type FieldSurveyFormValues = z.infer<typeof fieldSurveySchema>;

export default function SurveyPage() {
  const { toast } = useToast();

  const form = useForm<FieldSurveyFormValues>({
    resolver: zodResolver(fieldSurveySchema),
    defaultValues: {
      surveyId: `SURVEY-${Date.now()}`,
      surveyorName: '',
      latitude: undefined,
      longitude: undefined,
      siteConditions: '',
      observations: '',
      soilType: undefined,
      vegetationCover: undefined,
      weatherConditions: '',
      soilMoisture: 50,
      phMeasurement: undefined,
      notes: '',
    },
  });

  function onSubmit(data: FieldSurveyFormValues) {
    console.log('Field Survey Data Submitted:', data);
    toast({
      title: 'Survey Submitted Successfully',
      description: `Survey ID: ${data.surveyId}`,
    });
    // Reset form or navigate away after submission
     form.reset({
        surveyId: `SURVEY-${Date.now() + 1}`, // Generate new default ID
        surveyDate: undefined, // Reset date
        surveyorName: '',
        latitude: undefined,
        longitude: undefined,
        siteConditions: '',
        observations: '',
        soilType: undefined,
        vegetationCover: undefined,
        weatherConditions: '',
        soilMoisture: 50,
        phMeasurement: undefined,
        notes: '',
     });
  }

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <ClipboardList className="h-5 w-5 text-primary mr-2" />
        <h1 className="text-xl font-semibold text-primary">Field Survey</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-lg rounded-lg border border-border">
          <CardHeader>
            <CardTitle>Conduct Field Survey</CardTitle>
            <CardDescription>Record site conditions, observations, and measurements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Survey ID (Readonly) */}
                  <FormField
                    control={form.control}
                    name="surveyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Survey ID</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormDescription>Auto-generated survey identifier.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   {/* Survey Date */}
                   <FormField
                      control={form.control}
                      name="surveyDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Survey</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                           <FormDescription>Select the date when the survey was conducted.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     {/* Surveyor Name */}
                     <FormField
                        control={form.control}
                        name="surveyorName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Surveyor Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Enter surveyor's name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                     {/* Placeholder for GPS */}
                      <Card className="md:col-span-2 p-4 bg-secondary/50 border border-dashed">
                        <CardHeader className="p-0 pb-2">
                           <CardTitle className="text-base flex items-center"><MapPin className="mr-2 h-4 w-4" /> Location (GPS)</CardTitle>
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
                            {/* Future: Could add a button to 'Get Current Location' */}
                        </CardContent>
                    </Card>


                  {/* Site Conditions */}
                  <FormField
                    control={form.control}
                    name="siteConditions"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center"><Sun className="mr-2 h-4 w-4"/> Site Conditions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the general site conditions (e.g., slope, aspect, drainage)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   {/* Observations */}
                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center"><Camera className="mr-2 h-4 w-4" /> Observations</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Detailed observations (e.g., signs of erosion, specific plant species, rock dust visibility)" {...field} />
                        </FormControl>
                         <FormDescription>Be specific about what you see.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    {/* Soil Type */}
                     <FormField
                      control={form.control}
                      name="soilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><TestTube2 className="mr-2 h-4 w-4" /> Soil Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select soil type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="clay">Clay</SelectItem>
                              <SelectItem value="silt">Silt</SelectItem>
                              <SelectItem value="sand">Sand</SelectItem>
                              <SelectItem value="loam">Loam</SelectItem>
                              <SelectItem value="peat">Peat</SelectItem>
                              <SelectItem value="chalky">Chalky</SelectItem>
                               <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vegetation Cover */}
                     <FormField
                      control={form.control}
                      name="vegetationCover"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Leaf className="mr-2 h-4 w-4" /> Vegetation Cover</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vegetation cover" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bare">Bare</SelectItem>
                              <SelectItem value="sparse">Sparse</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="dense">Dense</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     {/* Weather Conditions */}
                     <FormField
                        control={form.control}
                        name="weatherConditions"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center"><Sun className="mr-2 h-4 w-4" /> Weather Conditions (Optional)</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Sunny, 25°C, light breeze" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                      {/* Soil Moisture */}
                    <FormField
                        control={form.control}
                        name="soilMoisture"
                        render={({ field: { value, onChange } }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><Droplets className="mr-2 h-4 w-4" /> Soil Moisture Level ({value}%)</FormLabel>
                                <FormControl>
                                    <Slider
                                        defaultValue={[50]}
                                        value={[value]}
                                        max={100}
                                        step={1}
                                        onValueChange={(vals) => onChange(vals[0])}
                                        className="pt-2"
                                    />
                                </FormControl>
                                <FormDescription>Estimate moisture: 0% (Dry) to 100% (Saturated).</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* pH Measurement */}
                    <FormField
                        control={form.control}
                        name="phMeasurement"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><TestTube2 className="mr-2 h-4 w-4" /> pH Measurement (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="e.g., 6.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Photos Placeholder */}
                    <div className="md:col-span-2">
                         <Label className="flex items-center"><Camera className="mr-2 h-4 w-4" /> Photos (Optional)</Label>
                         <Button type="button" variant="outline" className="w-full mt-2" disabled>
                           Upload Photos (Feature Coming Soon)
                         </Button>
                         <p className="text-sm text-muted-foreground mt-1">Attach relevant site photos.</p>
                    </div>


                     {/* Notes */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center"><StickyNote className="mr-2 h-4 w-4" /> Additional Notes (Optional)</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Any other relevant details or comments" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Save className="mr-2 h-4 w-4" /> Save Survey
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}

    