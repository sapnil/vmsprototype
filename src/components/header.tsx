import { VendorLinkLogo } from '@/components/icons';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <VendorLinkLogo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tight">
            VendorLink
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">Vendor Empanelment</p>
      </div>
    </header>
  );
}
