import { VendorLinkLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/vendors" className="flex items-center gap-3">
            <VendorLinkLogo className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-xl font-bold tracking-tight">
              VendorLink
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">Vendor Empanelment</p>
            <Link href="/vendors" passHref>
                <Button variant="outline">View Vendors</Button>
            </Link>
        </div>
      </div>
    </header>
  );
}
