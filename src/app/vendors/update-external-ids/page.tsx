
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UploadCloud,
  LoaderCircle,
  ListChecks,
  Hand,
  FileSpreadsheet,
  ChevronsRightLeft,
  Save,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { mockVendors, type Site } from '@/lib/vendors';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Schemas
const uploadFormSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, 'File is required.')
    .refine(
      (files) =>
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv'
        ].includes(files?.[0]?.type),
      'Only .xlsx, .xls, and .csv files are accepted.'
    ),
});
type UploadFormValues = z.infer<typeof uploadFormSchema>;

const manualUpdateFormSchema = z.object({
  sites: z.array(
    z.object({
      siteId: z.string(),
      oracleVendorId: z.string().optional(),
      oracleSiteId: z.string().optional(),
    })
  ),
});
type ManualUpdateFormValues = z.infer<typeof manualUpdateFormSchema>;

// Helper types
type ExcelRecord = {
  PAN_Number: string;
  GST_Number: string;
  Oracle_Vendor_ID: string;
  Oracle_Site_ID: string;
  rowNumber: number;
};
type VmsSite = Site & { vendorPan: string; vendorTradeName: string };
type GroupedVmsRecords = { [pan: string]: VmsSite[] };
type GroupedExcelRecords = { [pan: string]: ExcelRecord[] };

type ProcessingResult = {
  vmsRecords: GroupedVmsRecords;
  excelRecords: GroupedExcelRecords;
};

// Main Component
export default function UpdateExternalIdsPage() {
  const [view, setView] = useState<'upload' | 'manual-mapping'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] =
    useState<ProcessingResult | null>(null);
  const [uploadFormKey, setUploadFormKey] = useState(Date.now());
  const { toast } = useToast();

  const uploadForm = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
  });

  const manualUpdateForm = useForm<ManualUpdateFormValues>();
  const { fields, control } = useFieldArray({
    control: manualUpdateForm.control,
    name: 'sites',
  });

  const handleFileUpload = async (values: UploadFormValues) => {
    setIsProcessing(true);
    console.log('Uploading file:', values.file[0].name);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // --- SIMULATION of file processing ---
    const allSitesWithVendorInfo: VmsSite[] = mockVendors.flatMap((vendor) =>
      vendor.sites.map((site) => ({
        ...site,
        vendorPan: vendor.panNumber,
        vendorTradeName: vendor.tradeName,
      }))
    );

    // 1. These are the mock records from the uploaded Excel file.
    const excelRecords: ExcelRecord[] = [
      {
        PAN_Number: 'CCDE1234F', // This PAN matches GreenScape Services
        GST_Number: '36CCDE1234F1Z5',
        Oracle_Vendor_ID: 'EXL-VEN-901',
        Oracle_Site_ID: 'EXL-SITE-901',
        rowNumber: 5,
      },
      {
        PAN_Number: 'XYZ-PAN-404', // This PAN does not match any VMS record needing update
        GST_Number: '00NOTFOUND00000F0Z0',
        Oracle_Vendor_ID: 'EXL-VEN-404',
        Oracle_Site_ID: 'EXL-SITE-404',
        rowNumber: 10,
      },
    ];

    // 2. Get the set of PANs from our mock Excel file.
    const excelPans = new Set(excelRecords.map((record) => record.PAN_Number));

    // 3. Find VMS records that both need an ID AND have a PAN that's in the Excel file.
    const vmsRecordsToMap = allSitesWithVendorInfo.filter(
      (site) =>
        (!site.oracleVendorId || !site.oracleSiteId) &&
        excelPans.has(site.vendorPan)
    );

    // 4. Get the set of PANs from the VMS records we just found.
    const vmsPansToMap = new Set(vmsRecordsToMap.map((site) => site.vendorPan));

    // 5. Filter the Excel records to only include those that have a matching VMS record.
    const excelRecordsToMap = excelRecords.filter((record) =>
      vmsPansToMap.has(record.PAN_Number)
    );


    // 6. Group records by PAN for display
    const groupVms = (records: VmsSite[]): GroupedVmsRecords =>
      records.reduce((acc, record) => {
        (acc[record.vendorPan] = acc[record.vendorPan] || []).push(record);
        return acc;
      }, {} as GroupedVmsRecords);

    const groupExcel = (records: ExcelRecord[]): GroupedExcelRecords =>
      records.reduce((acc, record) => {
        (acc[record.PAN_Number] = acc[record.PAN_Number] || []).push(record);
        return acc;
      }, {} as GroupedExcelRecords);

    setProcessingResult({
      vmsRecords: groupVms(vmsRecordsToMap),
      excelRecords: groupExcel(excelRecordsToMap),
    });
    
    manualUpdateForm.reset({
      sites: vmsRecordsToMap.map((vmsSite) => {
        const excelRecord = excelRecordsToMap.find(
          (rec) =>
            rec.PAN_Number === vmsSite.vendorPan &&
            rec.GST_Number === vmsSite.gstNumber
        );

        return {
          siteId: vmsSite.id,
          oracleVendorId: excelRecord ? excelRecord.Oracle_Vendor_ID : '',
          oracleSiteId: '', // Always leave blank for manual entry
        };
      }),
    });

    setView('manual-mapping');
    setIsProcessing(false);
  };

  const handleManualUpdate = async (values: ManualUpdateFormValues) => {
    setIsProcessing(true);
    console.log('Saving manual updates:', values);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsProcessing(false);
    handleReset();
    toast({
      title: 'Success!',
      description: 'The Oracle External IDs have been updated manually.',
      className: 'bg-green-100 text-green-900 border-green-200',
    });
  };

  const handleReset = () => {
    setView('upload');
    setProcessingResult(null);
    uploadForm.reset();
    setUploadFormKey(Date.now());
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 py-10">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Update Oracle External IDs
        </h1>
        <p className="text-muted-foreground">
          Bulk update Oracle Vendor and Site IDs for registered sites.
        </p>
      </div>

      {view === 'upload' && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="text-primary" />
              Upload File
            </CardTitle>
            <CardDescription>
              If any records can't be matched automatically, you'll be able
              to map them manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <ListChecks className="h-4 w-4" />
              <AlertTitle>Excel File Requirements</AlertTitle>
              <AlertDescription>
                <p>Your Excel or CSV file must contain the following columns:</p>
                <ul className="my-2 list-inside list-disc space-y-1 pl-2 font-mono text-sm">
                  <li>PAN_Number</li>
                  <li>GST_Number</li>
                  <li>Oracle_Vendor_ID</li>
                  <li>Oracle_Site_ID</li>
                </ul>
                <p>
                  The combination of PAN and GST number is used
                  to uniquely identify and update a site.
                </p>
              </AlertDescription>
            </Alert>

            <Form {...uploadForm}>
              <form
                key={uploadFormKey}
                onSubmit={uploadForm.handleSubmit(handleFileUpload)}
                className="space-y-4"
              >
                <FormField
                  control={uploadForm.control}
                  name="file"
                  render={({ field: { onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>File Upload</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".xlsx, .xls, .csv"
                          placeholder="No file selected"
                          onChange={(e) => onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormDescription>
                        Select the .xlsx, .xls or .csv file to upload.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
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
      )}

      {view === 'manual-mapping' && processingResult && (
        <div className="space-y-6">
          <Alert variant="destructive">
            <ChevronsRightLeft className="h-4 w-4" />
            <AlertTitle>Manual Mapping Required</AlertTitle>
            <AlertDescription>
              We couldn't automatically map all records. Please review the
              unmapped records from your file and manually enter the
              corresponding Oracle IDs for the VMS records below.
            </AlertDescription>
          </Alert>

          <Form {...manualUpdateForm}>
            <form
              onSubmit={manualUpdateForm.handleSubmit(handleManualUpdate)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="lg:col-span-1 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hand className="text-primary" />
                      VMS Records to Update
                    </CardTitle>
                    <CardDescription>
                      Enter the Oracle IDs for these sites found in the system.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="multiple"
                      className="w-full"
                      defaultValue={Object.keys(processingResult.vmsRecords).map(
                        (pan) => `pan-${pan}`
                      )}
                    >
                      {Object.entries(processingResult.vmsRecords).map(
                        ([pan, sitesForPan]) => (
                          <AccordionItem value={`pan-${pan}`} key={pan}>
                            <AccordionTrigger className="font-mono text-sm">
                              PAN: {pan}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                              {sitesForPan.map((site) => {
                                const fieldIndex = fields.findIndex(
                                  (f) => f.siteId === site.id
                                );
                                if (fieldIndex === -1) return null;

                                return (
                                  <div
                                    key={fields[fieldIndex].id}
                                    className="space-y-4 rounded-lg border p-4"
                                  >
                                    <div>
                                      <p className="font-semibold">
                                        {site.legalName}
                                      </p>
                                      <div className="text-sm text-muted-foreground">
                                        <span>{site.gstNumber}</span>
                                        <span className="mx-2">·</span>
                                        <span>{site.natureOfExpense}</span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                      <FormField
                                        control={control}
                                        name={`sites.${fieldIndex}.oracleVendorId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Oracle Vendor ID
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="Prefilled from file"
                                                {...field}
                                                readOnly
                                                className="bg-gray-100"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={control}
                                        name={`sites.${fieldIndex}.oracleSiteId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Oracle Site ID
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="Enter Site ID"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-1 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="text-primary" />
                      Matching Excel Records
                    </CardTitle>
                    <CardDescription>
                      These records from your file were matched by PAN and GST number.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="multiple"
                      className="w-full"
                      defaultValue={Object.keys(
                        processingResult.excelRecords
                      ).map((pan) => `excel-pan-${pan}`)}
                    >
                      {Object.entries(processingResult.excelRecords).map(
                        ([pan, recordsForPan]) => (
                          <AccordionItem value={`excel-pan-${pan}`} key={pan}>
                            <AccordionTrigger className="font-mono text-sm">
                              PAN: {pan}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                              {recordsForPan.map((record) => (
                                <div
                                  key={record.rowNumber}
                                  className="rounded-lg border p-4 text-sm"
                                >
                                  <p>
                                    <span className="font-semibold">
                                      Row {record.rowNumber}:
                                    </span>
                                  </p>
                                  <div className="mt-2 space-y-1 font-mono text-xs">
                                    <p>GST: {record.GST_Number}</p>
                                    <p>
                                      Oracle Vendor ID:{' '}
                                      {record.Oracle_Vendor_ID}
                                    </p>
                                    <p>
                                      Oracle Site ID: {record.Oracle_Site_ID}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              <CardFooter className="flex justify-end gap-4 bg-background border-t p-6 mt-6 rounded-b-lg">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isProcessing}
                >
                  <Undo2 />
                  Start Over
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Save />
                  )}
                  Save Manual Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      )}
    </main>
  );
}
