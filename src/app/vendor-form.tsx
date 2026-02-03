
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  FileText,
  Users,
  ShieldCheck,
  Upload,
  LoaderCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGstAutofill } from '@/app/actions';
import { cn } from '@/lib/utils';
import { mockVendors } from '@/lib/vendors';

const formSchema = z.object({
  gstNumber: z.string().length(15, 'GST Number must be 15 characters.'),
  tradeName: z.string().min(2, 'Trade name is required.'),
  legalName: z.string().min(2, 'Legal name is required.'),
  panNumber: z.string().length(10, 'PAN must be 10 characters.'),
  registrationDate: z.string().min(1, 'Registration date is required.'),
  address: z.string().min(10, 'Address is required.'),
  contactPerson: z.string().min(2, 'Contact person name is required.'),
  contactEmail: z.string().email('Invalid email address.'),
  contactPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits.'),

  bankName: z.string().min(2, 'Bank name is required.'),
  accountNumber: z.string().min(9, 'Account number is required.'),
  ifscCode: z.string().length(11, 'IFSC code must be 11 characters.'),
  branchName: z.string().min(2, 'Branch name is required.'),

  natureOfBusiness: z.string({ required_error: 'This field is required.' }),
  natureOfExpense: z.string({ required_error: 'This field is required.' }),
  paymentFrequency: z.string({ required_error: 'This field is required.' }),

  referenceName: z.string().optional(),
  referenceContact: z.string().optional(),
  backgroundCheckNotes: z.string().optional(),

  registrationCertificate: z.any().optional(),
  panCard: z.any().optional(),
  addressProof: z.any().optional(),
});

type VendorFormValues = z.infer<typeof formSchema>;

const steps = [
  {
    id: 'Contact & Identity',
    icon: Building2,
    fields: [
      'gstNumber',
      'tradeName',
      'legalName',
      'panNumber',
      'registrationDate',
      'address',
      'contactPerson',
      'contactEmail',
      'contactPhone',
    ],
  },
  {
    id: 'Bank Details',
    icon: Landmark,
    fields: ['bankName', 'accountNumber', 'ifscCode', 'branchName'],
  },
  {
    id: 'Business Attributes',
    icon: FileText,
    fields: ['natureOfBusiness', 'natureOfExpense', 'paymentFrequency'],
  },
  {
    id: 'References',
    icon: Users,
    fields: ['referenceName', 'referenceContact', 'backgroundCheckNotes'],
  },
  {
    id: 'Document Upload',
    icon: ShieldCheck,
    fields: ['registrationCertificate', 'panCard', 'addressProof'],
  },
];

const DocumentUploadItem = ({
  field,
  label,
}: {
  field: any;
  label: string;
}) => {
  const [fileName, setFileName] = useState('');

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border bg-background p-3 shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <FileText className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
        <div className="overflow-hidden">
          <p className="font-medium">{label}</p>
          {fileName && (
            <p className="truncate text-sm text-muted-foreground">
              {fileName}
            </p>
          )}
        </div>
      </div>
      <Button asChild variant="outline" size="sm" className="flex-shrink-0">
        <label>
          <Upload className="mr-2" />
          Upload
          <input
            type="file"
            className="sr-only"
            {...field}
            value={undefined} // Uncontrolled
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
              setFileName(file?.name ?? '');
            }}
          />
        </label>
      </Button>
    </div>
  );
};

export function VendorForm({ vendorId }: { vendorId?: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isNewSiteFlow = !!vendorId;
  const vendor = isNewSiteFlow
    ? mockVendors.find((v) => v.id === vendorId)
    : null;

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isNewSiteFlow
      ? {
          gstNumber: '',
          tradeName: vendor?.tradeName || '',
          legalName: '',
          panNumber: vendor?.panNumber || '',
          registrationDate: '',
          address: '',
          contactPerson: '',
          contactEmail: '',
          contactPhone: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          branchName: '',
          referenceName: '',
          referenceContact: '',
          backgroundCheckNotes: '',
        }
      : {
          gstNumber: '27ABCDE1234F1Z4',
          tradeName: 'Test Vendor Inc.',
          legalName: 'Test Legal Name',
          panNumber: 'ABCDE1234F',
          registrationDate: '01/01/2024',
          address: '123 Test Street, Test City, Test State 12345',
          contactPerson: 'Test Person',
          contactEmail: 'test@example.com',
          contactPhone: '9876543210',
          bankName: 'Test Bank of Testing',
          accountNumber: '0987654321',
          ifscCode: 'TEST0001234',
          branchName: 'Test Branch',
          natureOfBusiness: 'service_provider',
          natureOfExpense: 'services',
          paymentFrequency: 'monthly',
          referenceName: 'Test Reference',
          referenceContact: 'ref@example.com',
          backgroundCheckNotes: 'All background checks passed.',
        },
  });

  const onGstAutofill = async () => {
    await form.trigger('gstNumber');
    const gstNumber = form.getValues('gstNumber');
    if (form.getFieldState('gstNumber').invalid) return;

    setIsAutofilling(true);
    const result = await handleGstAutofill(gstNumber);
    setIsAutofilling(false);

    if (result.error || !result.data) {
      toast({
        variant: 'destructive',
        title: 'Autofill Failed',
        description: result.error,
      });
    } else {
      const { legalName, address, panNumber, registrationDate } = result.data;
      form.setValue('legalName', legalName, { shouldValidate: true });
      form.setValue('address', address, { shouldValidate: true });
      form.setValue('panNumber', panNumber, { shouldValidate: true });
      form.setValue('registrationDate', registrationDate, {
        shouldValidate: true,
      });
      toast({
        title: 'Success!',
        description: 'Vendor details have been pre-filled.',
        className: 'bg-accent text-accent-foreground border-accent',
      });
    }
  };

  const onSubmit = async (values: VendorFormValues) => {
    setIsSubmitting(true);
    // In a real app, you would handle file uploads and send data to your backend.
    console.log(values);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    toast({
      title: 'Form Submitted Successfully!',
      description: 'Vendor empanelment is now pending approval.',
      className: 'bg-accent text-accent-foreground border-accent',
    });
    form.reset();
    setCurrentStep(0);
  };
  
  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as (keyof VendorFormValues)[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center" style={{ minWidth: '120px' }}>
                        <div
                            className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold transition-all",
                                currentStep > index ? "border-primary bg-primary text-primary-foreground" :
                                currentStep === index ? "border-primary text-primary" : "border-border text-muted-foreground",
                            )}
                        >
                            {currentStep > index ? <Check className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                        </div>
                        <p className={cn(
                            "mt-2 text-xs font-semibold sm:text-sm",
                            currentStep >= index ? "text-foreground" : "text-muted-foreground"
                        )}>{step.id}</p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={cn("flex-1 border-t-2 mx-4 transition-all", currentStep > index ? "border-primary" : "border-border")} />
                    )}
                </React.Fragment>
            ))}
        </div>

        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="text-primary" />
                Contact & Identity Details
              </CardTitle>
              <CardDescription>
                Start by entering the GST number to autofill details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-end gap-2 sm:flex-row">
                <FormField
                  control={form.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>GST Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 29ABCDE1234F1Z5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={onGstAutofill}
                  disabled={isAutofilling}
                  className="w-full flex-shrink-0 sm:w-auto"
                >
                  {isAutofilling ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                  Autofill with AI
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Name / Business Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your business name"
                          {...field}
                          readOnly={isNewSiteFlow}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name of Business</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prefilled by AI"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prefilled by AI"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Registration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prefilled by AI"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Prefilled by AI"
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="text-primary" />
                Bank Details
              </CardTitle>
              <CardDescription>
                Provide your bank account details for payments.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. State Bank of India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SBIN0001234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Main Branch, Delhi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary" />
                Business Attributes
              </CardTitle>
              <CardDescription>
                Help us understand your business better.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="natureOfBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Business</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="trader">Trader</SelectItem>
                        <SelectItem value="service_provider">
                          Service Provider
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="natureOfExpense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Expense</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="raw_material">Raw Material</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="capital_goods">
                          Capital Goods
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="per_invoice">Per Invoice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-primary" />
                Reference & Background Checks
              </CardTitle>
              <CardDescription>
                Optional: Provide references and background check details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="referenceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="referenceContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email or phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="backgroundCheckNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Check Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notes on background checks performed..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-primary" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload required business documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="registrationCertificate"
                render={({ field }) => (
                  <DocumentUploadItem
                    field={field}
                    label="Registration Certificate"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="panCard"
                render={({ field }) => (
                  <DocumentUploadItem field={field} label="PAN Card Copy" />
                )}
              />
              <FormField
                control={form.control}
                name="addressProof"
                render={({ field }) => (
                  <DocumentUploadItem field={field} label="Address Proof" />
                )}
              />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button
                type="button"
                onClick={handlePrevious}
                variant="outline"
              >
                <ArrowLeft />
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight />
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                  Submit for Approval
                  <ArrowRight />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
