'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadCloud, LoaderCircle, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, 'File is required.')
    .refine(
      (files) =>
        files?.[0]?.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        files?.[0]?.type === 'application/vnd.ms-excel',
      'Only .xlsx and .xls files are accepted.'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateExternalIdsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // Key to reset form
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsUploading(true);
    // In a real app, you would send this to a server action to process the Excel file.
    // For this demo, we'll just simulate the upload process.
    console.log('Uploading file:', values.file[0].name);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    form.reset();
    setFormKey(Date.now()); // By changing the key, we force the form to re-mount.
    
    toast({
      title: 'Upload Successful',
      description: 'The Oracle External IDs are being updated in the background.',
      className: 'bg-accent text-accent-foreground border-accent',
    });
  };

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="text-primary" />
              Update Oracle External IDs
            </CardTitle>
            <CardDescription>
              Upload an Excel file to bulk update Oracle Vendor and Site IDs for
              registered sites.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <ListChecks className="h-4 w-4" />
              <AlertTitle>Excel File Requirements</AlertTitle>
              <AlertDescription>
                <p>
                  Your Excel file must contain the following columns:
                </p>
                <ul className="my-2 list-inside list-disc space-y-1 pl-2 font-mono text-sm">
                  <li>PAN_Number</li>
                  <li>GST_Number</li>
                  <li>Bank_Account_Number</li>
                  <li>Oracle_Vendor_ID</li>
                  <li>Oracle_Site_ID</li>
                </ul>
                <p>
                  The combination of PAN, GST, and Bank Account number is used to uniquely identify and update a site.
                </p>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form key={formKey} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Excel File Upload</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".xlsx, .xls"
                          placeholder="No file selected"
                          onChange={(e) => onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormDescription>
                        Select the .xlsx or .xls file to upload.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <UploadCloud />
                  )}
                  Upload and Process File
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
