
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Search,
  ArrowRight,
  ArrowLeft,
  Check,
  Briefcase,
  Receipt,
  FileSignature,
  CalendarIcon,
  Banknote,
  ShieldAlert,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';

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
import { useToast } from '@/hooks/use-toast';
import { handleGstAutofill, handlePennyDropVerification } from '@/app/actions';
import { cn } from '@/lib/utils';
import { mockVendors } from '@/lib/vendors';
import { Checkbox } from '@/components/ui/checkbox';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const bankAccountSchema = z.object({
  id: z.string().optional(),
  bankName: z.string().min(2, 'Bank name is required.'),
  branchName: z.string().min(2, 'Branch name is required.'),
  accountNumber: z.string().min(9, 'Account number is required.'),
  accountType: z.enum(['savings', 'current'], {
    required_error: 'You need to select an account type.',
  }),
  ifscCode: z.string().length(11, 'IFSC code must be 11 characters.'),
  beneficiaryName: z.string().optional(),
  crn: z.string().optional(),
  verificationStatus: z.enum(['idle', 'success', 'failed']).default('idle'),
});

const formSchema = z.object({
  // Contact & Identity
  vendorCode: z.string().optional(),
  gstNumber: z.string().length(15, 'GST Number must be 15 characters.'),
  tradeName: z.string().min(2, 'Trade name is required.'),
  legalName: z.string().min(2, 'Legal name is required.'),
  panNumber: z.string().length(10, 'PAN must be 10 characters.'),
  panLinkedWithAadhar: z.boolean().default(false),
  registrationDate: z.string().min(1, 'Registration date is required.'),
  address1: z.string().min(3, 'Address Line 1 is required.'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  pincode: z.string().length(6, 'Pincode must be 6 digits.'),
  contactPerson: z.string().min(2, 'Contact person name is required.'),
  contactEmail: z.string().email('Invalid email address.'),
  contactPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits.'),
  departmentName: z.string().optional(),

  // Business & Compliance
  natureOfService: z.string({ required_error: 'This field is required.' }),
  paymentFrequency: z.string({ required_error: 'This field is required.' }),
  composite: z.boolean().default(false),
  eInvoiceRequired: z.boolean().default(false),
  registeredUnderMsme: z.boolean().default(false),
  msmeRegistrationNumber: z.string().optional(),
  paygroup: z.string().optional(),
  groupCode: z.string().optional(),

  // Bank Details
  bankAccounts: z
    .array(bankAccountSchema)
    .min(1, 'At least one bank account is required.'),

  // Tax Information
  taxExemption: z.boolean().default(false),
  tdsRate: z.string().optional(),
  tdsExemptionCertificateNumber: z.string().optional(),
  tdsExemptionFromDate: z.date().optional(),
  tdsExemptionToDate: z.date().optional(),
  itrFiled: z.boolean().default(false),

  // Agreement Details
  agreementStartDate: z.date().optional(),
  agreementEndDate: z.date().optional(),

  // Document Upload
  registrationCertificate: z.any().optional(),
  panCard: z.any().optional(),
  cancelledCheque: z.any().optional(),
  addressProof: z.any().optional(),
  itrProof: z.any().optional(),
  msmeCertificate: z.any().optional(),
  tdsExemptionCertificate: z.any().optional(),
});

type VendorFormValues = z.infer<typeof formSchema>;

const steps = [
  {
    id: 'Contact & Identity',
    icon: Building2,
    fields: [
      'vendorCode',
      'gstNumber',
      'tradeName',
      'legalName',
      'panNumber',
      'panLinkedWithAadhar',
      'registrationDate',
      'address1',
      'city',
      'state',
      'pincode',
      'contactPerson',
      'contactEmail',
      'contactPhone',
    ],
  },
  {
    id: 'Business & Compliance',
    icon: Briefcase,
    fields: [
      'natureOfService',
      'paymentFrequency',
      'registeredUnderMsme',
      'msmeRegistrationNumber',
    ],
  },
  {
    id: 'Bank Details',
    icon: Landmark,
    fields: ['bankAccounts'],
  },
  {
    id: 'Tax Information',
    icon: Receipt,
    fields: ['taxExemption', 'tdsRate', 'itrFiled'],
  },
  {
    id: 'Agreement Details',
    icon: FileSignature,
    fields: ['agreementStartDate', 'agreementEndDate'],
  },
  {
    id: 'Document Upload',
    icon: ShieldCheck,
    fields: [
      'registrationCertificate',
      'panCard',
      'addressProof',
      'itrProof',
      'msmeCertificate',
      'tdsExemptionCertificate',
      'cancelledCheque',
    ],
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
    <div className="flex items-center justify-between gap-4 rounded-md border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <FileText className="h-6 w-6 flex-shrink-0 text-primary" />
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
  const [verifyingAccountIndex, setVerifyingAccountIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const isNewSiteFlow = !!vendorId;
  const vendor = isNewSiteFlow
    ? mockVendors.find((v) => v.id === vendorId)
    : null;

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorCode: vendor?.id,
      gstNumber: '36CCDE1234F1Z5',
      tradeName: isNewSiteFlow ? vendor?.tradeName || '' : 'Test Vendor Inc.',
      legalName: 'Test Legal Name',
      panNumber: isNewSiteFlow ? vendor?.panNumber || '' : 'ABCDE1234F',
      registrationDate: '01/01/2024',
      address1: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      contactPerson: 'Test Person',
      contactEmail: 'test@example.com',
      contactPhone: '9876543210',
      natureOfService: 'rent',
      paymentFrequency: 'rent',
      bankAccounts: [
        {
          bankName: 'Test Bank of Testing',
          accountNumber: '0987654321',
          ifscCode: 'TEST0001234',
          branchName: 'Test Branch',
          accountType: 'current',
          beneficiaryName: '',
          verificationStatus: 'idle',
        },
      ],
      panLinkedWithAadhar: true,
      composite: false,
      eInvoiceRequired: true,
      itrFiled: true,
      registeredUnderMsme: true,
      msmeRegistrationNumber: 'MSME123456789',
      taxExemption: false,
    },
  });

  const {
    fields: bankAccountFields,
    append: appendBankAccount,
    remove: removeBankAccount,
  } = useFieldArray({
    control: form.control,
    name: 'bankAccounts',
  });

  const onGstAutofill = async () => {
    await form.trigger('gstNumber');
    const gstNumber = form.getValues('gstNumber');
    if (form.getFieldState('gstNumber').invalid) return;

    setIsAutofilling(true);
    const { data: result, error } = await handleGstAutofill(gstNumber);
    setIsAutofilling(false);

    if (error || !result) {
      toast({
        variant: 'destructive',
        title: 'Autofill Failed',
        description: error,
      });
    } else {
      const { legalName, address, panNumber, registrationDate } = result;
      form.setValue('legalName', legalName, { shouldValidate: true });
      form.setValue('address1', address, { shouldValidate: true });
      form.setValue('panNumber', panNumber, { shouldValidate: true });
      form.setValue('registrationDate', registrationDate, {
        shouldValidate: true,
      });
      toast({
        title: 'Success!',
        description: 'Vendor details have been pre-filled.',
        className: 'bg-green-100 text-green-900 border-green-200',
      });
    }
  };

  const onVerifyBankAccount = async (index: number) => {
    const output = await form.trigger([
      `bankAccounts.${index}.accountNumber`,
      `bankAccounts.${index}.ifscCode`,
    ]);
    if (!output) return;

    const account = form.getValues('bankAccounts')[index];
    setVerifyingAccountIndex(index);

    const { success, message, beneficiaryName, error } =
      await handlePennyDropVerification(account.accountNumber, account.ifscCode);

    setVerifyingAccountIndex(null);

    if (error) {
      form.setValue(`bankAccounts.${index}.verificationStatus`, 'failed');
      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: error,
      });
      return;
    }

    if (success) {
      form.setValue(`bankAccounts.${index}.verificationStatus`, 'success');
      form.setValue(`bankAccounts.${index}.beneficiaryName`, beneficiaryName, {
        shouldValidate: true,
      });
      toast({
        title: 'Verification Successful',
        description: message,
        className: 'bg-green-100 text-green-900 border-green-200',
      });
    } else {
      form.setValue(`bankAccounts.${index}.verificationStatus`, 'failed');
      form.setValue(`bankAccounts.${index}.beneficiaryName`, '');
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: message,
      });
    }
  };

  const onSubmit = async (values: VendorFormValues) => {
    const hasFailedVerification = values.bankAccounts.some(
      (acc) => acc.verificationStatus === 'failed'
    );

    if (hasFailedVerification && !values.cancelledCheque) {
      toast({
        variant: 'destructive',
        title: 'Missing Document',
        description:
          'At least one bank verification failed. Please upload a cancelled cheque copy to proceed.',
      });
      setCurrentStep(steps.findIndex((step) => step.id === 'Document Upload'));
      return;
    }

    setIsSubmitting(true);
    console.log(values);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    toast({
      title: 'Form Submitted Successfully!',
      description: 'Vendor empanelment is now pending approval.',
      className: 'bg-green-100 text-green-900 border-green-200',
    });
    form.reset();
    setCurrentStep(0);
  };

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, {
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

  const hasFailedBankVerification = form
    .watch('bankAccounts')
    .some((acc) => acc.verificationStatus === 'failed');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className="flex flex-col items-center text-center"
                style={{ minWidth: '120px' }}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold transition-all',
                    currentStep > index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : currentStep === index
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {currentStep > index ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                <p
                  className={cn(
                    'mt-2 text-xs font-semibold sm:text-sm',
                    currentStep >= index
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.id}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 border-t-2 mx-4 transition-all',
                    currentStep > index ? 'border-primary' : 'border-border'
                  )}
                />
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
              {isNewSiteFlow && (
                 <FormField
                  control={form.control}
                  name="vendorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Vendor Code" {...field} readOnly className="bg-gray-100"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                    <Search />
                  )}
                  Fetch
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Name / Vendor Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your business name"
                          {...field}
                          readOnly={isNewSiteFlow}
                          className={isNewSiteFlow ? 'bg-gray-100' : ''}
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
                          className="bg-gray-100"
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
                          className="bg-gray-100"
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
                           className="bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="panLinkedWithAadhar"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          PAN Linked with Aadhaar
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              <div className="space-y-4">
                <p className="text-sm font-medium">Registered Address</p>
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Street, building number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment, suite, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                   <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 400001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
                      <FormLabel>Contact Email / Email ID</FormLabel>
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
                      <FormLabel>Contact Phone / Mobile No</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="departmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Finance" {...field} />
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
                <Briefcase className="text-primary" />
                Business & Compliance
              </CardTitle>
              <CardDescription>
                Help us understand your business better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="natureOfService"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nature of Service</FormLabel>
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
                                 <SelectItem value="raw_material">Raw Material</SelectItem>
                                <SelectItem value="capital_goods">
                                Capital Goods
                                </SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
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
                                <SelectItem value="rent">Rent</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="paygroup"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Paygroup (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter paygroup" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="groupCode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Group Code (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter group code" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-4">
                     <FormField
                        control={form.control}
                        name="composite"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Composite GST Scheme
                                </FormLabel>
                                <FormDescription>
                                Is the vendor registered under the composite GST scheme?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="eInvoiceRequired"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                E-Invoice Required
                                </FormLabel>
                                <FormDescription>
                                Is e-invoicing mandatory for this vendor?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="registeredUnderMsme"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Registered under MSME
                                </FormLabel>
                                <FormDescription>
                                Is the vendor a registered Micro, Small, or Medium Enterprise?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                </div>
                {form.watch('registeredUnderMsme') && (
                    <FormField
                        control={form.control}
                        name="msmeRegistrationNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>MSME Registration Number</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. UDYAM-XX-00-0000000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="text-primary" />
                Bank Details
              </CardTitle>
              <CardDescription>
                Provide and verify bank account details for payments. You can add multiple accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {bankAccountFields.map((field, index) => {
                   const verificationStatus = form.watch(`bankAccounts.${index}.verificationStatus`);
                  return (
                  <div key={field.id} className="space-y-4 rounded-lg border p-4 relative">
                     {bankAccountFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                        onClick={() => removeBankAccount(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.accountNumber`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="Enter your account number"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.ifscCode`}
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
                    </div>
                     <Button
                        type="button"
                        onClick={() => onVerifyBankAccount(index)}
                        disabled={verifyingAccountIndex === index}
                        className="w-full sm:w-auto"
                        >
                        {verifyingAccountIndex === index ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Banknote />
                        )}
                        Verify Account
                        </Button>
                     {verificationStatus !== 'idle' && (
                        <Alert
                            variant={
                            verificationStatus === 'success'
                                ? 'default'
                                : 'destructive'
                            }
                             className={cn(
                                verificationStatus === 'success' &&
                                'border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&>svg]:text-green-600'
                            )}
                        >
                            {verificationStatus === 'success' ? (
                            <ShieldCheck />
                            ) : (
                            <ShieldAlert />
                            )}
                            <AlertTitle>
                            {verificationStatus === 'success'
                                ? 'Verification Successful'
                                : 'Verification Failed'}
                            </AlertTitle>
                            <AlertDescription>
                                {form.watch(`bankAccounts.${index}.beneficiaryName`) || (verificationStatus === 'failed' ? 'Account details could not be verified.' : '')}
                            </AlertDescription>
                        </Alert>
                    )}
                    <Separator />
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.beneficiaryName`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Beneficiary Name (as per bank)</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Verified account holder name"
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
                            control={form.control}
                            name={`bankAccounts.${index}.bankName`}
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
                            name={`bankAccounts.${index}.branchName`}
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
                         <FormField
                            control={form.control}
                            name={`bankAccounts.${index}.crn`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>CRN (Optional)</FormLabel>
                                <FormControl>
                                <Input placeholder="Customer Relationship Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name={`bankAccounts.${index}.accountType`}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Type of Account</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-row space-x-4"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="savings" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Savings
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="current" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Current
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                )})}
              </div>
               <Button
                type="button"
                variant="outline"
                onClick={() => appendBankAccount({
                    bankName: '',
                    branchName: '',
                    accountNumber: '',
                    ifscCode: '',
                    accountType: 'current',
                    beneficiaryName: '',
                    verificationStatus: 'idle',
                })}
                >
                <PlusCircle className="mr-2" />
                Add Another Bank Account
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Receipt className="text-primary" />
                    Tax Information
                </CardTitle>
                <CardDescription>
                    Provide details about your tax status and exemptions.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="itrFiled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                ITR Filed for Last Financial Year
                                </FormLabel>
                            </div>
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="taxExemption"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Tax Exemption
                                </FormLabel>
                                <FormDescription>
                                Is the vendor exempt from tax deductions?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    {!form.watch('taxExemption') ? (
                         <FormField
                            control={form.control}
                            name="tdsRate"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>TDS Rate (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter TDS rate" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                    ) : (
                        <div className="space-y-4 rounded-md border p-4">
                            <p className="font-medium text-sm">TDS Exemption Details</p>
                             <FormField
                                control={form.control}
                                name="tdsExemptionCertificateNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>TDS Exemption Certificate Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Certificate Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="tdsExemptionFromDate"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Exemption From Date</FormLabel>
                                        <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                format(field.value, "PPP")
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
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            />
                                        </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tdsExemptionToDate"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Exemption To Date</FormLabel>
                                        <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                format(field.value, "PPP")
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
                                                date > new Date("2100-01-01") || date < new Date()
                                            }
                                            initialFocus
                                            />
                                        </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}

        {currentStep === 4 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSignature className="text-primary" />
                        Agreement Details
                    </CardTitle>
                    <CardDescription>
                        Provide the start and end dates for the agreement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormField
                        control={form.control}
                        name="agreementStartDate"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Agreement Start Date</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, "PPP")
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
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="agreementEndDate"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Agreement End Date</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, "PPP")
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
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        )}

        {currentStep === 5 && (
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
              {hasFailedBankVerification && (
                <div className="relative">
                  <DocumentUploadItem
                    field={form.control.register('cancelledCheque')}
                    label="Cancelled Cheque Copy"
                  />
                  <Badge variant="destructive" className="absolute -top-2 -right-2">Required</Badge>
                   <FormDescription className="pt-2">
                    A cancelled cheque is required because at least one bank account verification failed.
                  </FormDescription>
                </div>
              )}
              <DocumentUploadItem
                field={form.control.register('registrationCertificate')}
                label="Registration Certificate"
              />
              <DocumentUploadItem
                field={form.control.register('panCard')}
                label="PAN Card Copy"
              />
              <DocumentUploadItem
                field={form.control.register('addressProof')}
                label="Address Proof"
              />
              {form.watch('itrFiled') && (
                <DocumentUploadItem
                    field={form.control.register('itrProof')}
                    label="ITR Proof"
                />
              )}
               {form.watch('registeredUnderMsme') && (
                <DocumentUploadItem
                    field={form.control.register('msmeCertificate')}
                    label="MSME Certificate"
                />
              )}
               {form.watch('taxExemption') && (
                <DocumentUploadItem
                    field={form.control.register('tdsExemptionCertificate')}
                    label="TDS Exemption Certificate"
                />
              )}
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

    