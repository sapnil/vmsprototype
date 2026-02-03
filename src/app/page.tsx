import { VendorForm } from '@/app/vendor-form';

export default function Home() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          New Vendor Registration
        </h1>
        <p className="text-muted-foreground">
          Fill out the form below to become a vendor.
        </p>
      </div>
      <VendorForm />
    </main>
  );
}
