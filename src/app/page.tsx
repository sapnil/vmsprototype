import { VendorForm } from '@/app/vendor-form';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <VendorForm />
      </main>
    </div>
  );
}
