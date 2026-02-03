import { mockVendors } from '@/lib/vendors';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import {
  Building2,
  Mail,
  Calendar,
  User,
  Hash,
  ArrowLeft,
  MapPin,
  Phone,
  Landmark,
  Briefcase,
  FileText,
  Clock,
  Banknote,
  Download,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const statusColors = {
  Approved:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Pending:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Rejected:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

const activeStatusColors = {
    Active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    Inactive: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-900/50 dark:text-stone-300 dark:border-stone-800',
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <Icon className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const DocumentItem = ({
  label,
  fileName,
}: {
  label: string;
  fileName?: string;
}) => {
  const isAvailable = !!fileName;

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 rounded-md border p-3",
      isAvailable ? "bg-background shadow-sm" : "border-dashed bg-muted/50"
    )}>
      <div className="flex items-center gap-3 overflow-hidden">
        <FileText className={cn("h-6 w-6 flex-shrink-0", isAvailable ? "text-primary" : "text-muted-foreground/50")} />
        <div className="overflow-hidden">
          <p className={cn("font-medium", !isAvailable && "text-muted-foreground")}>{label}</p>
          <p className="truncate text-sm text-muted-foreground">
            {isAvailable ? fileName : "Not uploaded"}
          </p>
        </div>
      </div>
      {isAvailable ? (
        <Button asChild variant="outline" size="sm" className="flex-shrink-0">
          <a href="#" download={fileName}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="flex-shrink-0" disabled>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      )}
    </div>
  );
};

export default function SiteDetailsPage({
  params,
}: {
  params: { siteId: string };
}) {
  const { siteId } = params;
  let site = null;
  let vendor = null;

  for (const v of mockVendors) {
    const s = v.sites.find((s) => s.id === siteId);
    if (s) {
      site = s;
      vendor = v;
      break;
    }
  }

  if (!site || !vendor) {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <Button asChild variant="outline">
          <Link href="/vendors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendor List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="h-7 w-7 text-primary" />
                <span>{site.legalName}</span>
              </CardTitle>
              <CardDescription className="mt-1">
                Part of vendor:{' '}
                <Link
                  href={`/vendors?openVendorId=${vendor.id}`}
                  className="text-primary hover:underline"
                >
                  {vendor.tradeName}
                </Link>
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <Badge
                variant="outline"
                className={cn(statusColors[site.status])}
              >
                {site.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn(site.isActive ? activeStatusColors.Active : activeStatusColors.Inactive)}
              >
                {site.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem icon={Hash} label="GST Number" value={site.gstNumber} />
            <InfoItem
              icon={Calendar}
              label="Date Added to System"
              value={site.dateAdded}
            />
            <InfoItem
              icon={Calendar}
              label="Official Registration Date"
              value={site.registrationDate}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-primary" />
              Contact & Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoItem
              icon={User}
              label="Contact Person"
              value={site.contactPerson}
            />
            <InfoItem
              icon={Mail}
              label="Contact Email"
              value={site.contactEmail}
            />
            <InfoItem
              icon={Phone}
              label="Contact Phone"
              value={site.contactPhone}
            />
            <Separator />
            <InfoItem
              icon={MapPin}
              label="Registered Address"
              value={site.address}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="text-primary" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoItem icon={Landmark} label="Bank Name" value={site.bankName} />
            <InfoItem
              icon={Hash}
              label="Account Number"
              value={site.accountNumber}
            />
            <InfoItem icon={FileText} label="IFSC Code" value={site.ifscCode} />
            <InfoItem
              icon={Building2}
              label="Branch Name"
              value={site.branchName}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="text-primary" />
            Business Attributes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={Briefcase}
            label="Nature of Business"
            value={site.natureOfBusiness}
          />
          <InfoItem
            icon={Banknote}
            label="Nature of Expense"
            value={site.natureOfExpense}
          />
          <InfoItem
            icon={Clock}
            label="Payment Frequency"
            value={site.paymentFrequency}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Uploaded Documents
          </CardTitle>
           <CardDescription>
            Documents submitted during the registration process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DocumentItem label="Registration Certificate" fileName={site.registrationCertificate} />
          <DocumentItem label="PAN Card Copy" fileName={site.panCard} />
          <DocumentItem label="Address Proof" fileName={site.addressProof} />
        </CardContent>
      </Card>
    </main>
  );
}
