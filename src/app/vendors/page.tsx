import { Header } from '@/components/header';
import { VendorList } from '@/app/vendors/vendor-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function VendorsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Registered Vendors</h1>
            <Link href="/" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Vendor
                </Button>
            </Link>
        </div>
        <VendorList />
      </main>
    </div>
  );
}
