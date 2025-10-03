import { WebOrderPage } from '@/components/web-orders/WebOrderPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export default function WebOrder() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <Sonner />
      <WebOrderPage />
    </ThemeProvider>
  );
}