import { VendorForm } from '@/app/vendor-form';
import { mockVendors } from '@/lib/vendors';

export default function Home({
  searchParams,
}: {
  searchParams: { vendorId?: string };
}) {
  const { vendorId } = searchParams;
  const isNewSiteFlow = !!vendorId;
  const vendor = vendorId
    ? mockVendors.find((v) => v.id === vendorId)
    : null;

  const title = isNewSiteFlow
    ? `New Site Registration for ${vendor?.tradeName || 'Existing Vendor'}`
    : 'New Vendor Registration';
  const description = isNewSiteFlow
    ? 'Fill out the form below to register a new site for this vendor.'
    : 'Fill out the form below to become a vendor.';

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <VendorForm vendorId={vendorId} />
    </main>
  );
}
