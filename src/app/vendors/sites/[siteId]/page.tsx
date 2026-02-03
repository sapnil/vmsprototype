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
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusColors = {
  Approved:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Pending:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Rejected:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
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
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
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
              <CardTitle>Site Details: {site.legalName}</CardTitle>
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
            <Badge
              variant="outline"
              className={cn(
                statusColors[site.status],
                'self-start sm:self-center'
              )}
            >
              {site.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4">
              <Hash className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">GST Number</p>
                <p className="font-medium">{site.gstNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Building2 className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Legal Name</p>
                <p className="font-medium">{site.legalName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calendar className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date Added</p>
                <p className="font-medium">{site.dateAdded}</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <User className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contact Person
                  </p>
                  <p className="font-medium">{site.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{site.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
