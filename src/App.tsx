import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import WebOrder from "./pages/WebOrder";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import { OrderList } from "@/components/orders/OrderList";
import { ResetPassword } from "@/components/auth/ResetPassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [Analytics, setAnalytics] = useState<React.ComponentType | null>(null);

  // Carregar Analytics dinamicamente se disponível
  useEffect(() => {
    import("@vercel/analytics/react")
      .then((module) => {
        setAnalytics(() => module.Analytics);
      })
      .catch(() => {
        // Analytics não disponível - não é crítico
        console.warn("Vercel Analytics não disponível");
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/web-order" element={<WebOrder />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {Analytics && <Analytics />}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
