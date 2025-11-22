# ⚡ Guia de Otimização de Performance

## 📊 Métricas Atuais

### Build Stats
- **Módulos**: 1558 transformados
- **Tempo de Build**: ~12.6s
- **Bundle Size**: ~1.1 MB (315 KB gzipped)

### Principais Arquivos
- `charts.js`: 420.40 kB
- `index.js`: 492.79 kB
- `vendor.js`: 142.38 kB
- `ui.js`: 40.38 kB

## 🎯 Metas de Otimização

- [ ] Reduzir bundle para < 900 KB
- [ ] Tempo de build < 10s
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90

## 🚀 Otimizações Implementadas

### Code Splitting
```typescript
// Lazy loading de rotas
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Orders = lazy(() => import('./pages/Orders'));
const Delivery = lazy(() => import('./pages/Delivery'));

// Uso com Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Dynamic Imports
```typescript
// Carregar módulos sob demanda
const loadReports = async () => {
  const { reportsDatabase } = await import('@/lib/database-reports');
  return reportsDatabase.generateReport();
};
```

## 📦 Otimizações Pendentes

### 1. Code Splitting por Rota

**Problema**: Todas as rotas carregadas no bundle inicial

**Solução**:
```typescript
// src/App.tsx
import { lazy } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const WebOrder = lazy(() => import('./pages/WebOrder'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const PDVLayout = lazy(() => import('./components/PDVLayout'));
```

**Impacto Estimado**: -200 KB no bundle inicial

### 2. Otimização de Charts

**Problema**: recharts é pesado (420 KB)

**Solução**:
```typescript
// Opção 1: Lazy load de charts
const Charts = lazy(() => import('./components/analytics/Charts'));

// Opção 2: Usar biblioteca mais leve
// npm install chart.js react-chartjs-2
```

**Impacto Estimado**: -300 KB

### 3. Tree Shaking de UI Components

**Problema**: Importação de componentes não utilizados

**Solução**:
```typescript
// ❌ Evitar
import * as Icons from 'lucide-react';

// ✅ Fazer
import { User, Phone, MapPin } from 'lucide-react';
```

**Impacto Estimado**: -50 KB

### 4. Image Optimization

**Implementar**:
```typescript
// src/components/ui/OptimizedImage.tsx
import { useState } from 'react';

export const OptimizedImage = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <>
      {!loaded && <div className="skeleton" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </>
  );
};
```

### 5. Memoization

**Componentes Pesados**:
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoizar componentes
export const OrderCard = memo(({ order }) => {
  return <Card>...</Card>;
});

// Memoizar cálculos
const totalOrders = useMemo(() => {
  return orders.reduce((sum, order) => sum + order.total, 0);
}, [orders]);

// Memoizar callbacks
const handleClick = useCallback(() => {
  updateOrder(orderId);
}, [orderId]);
```

### 6. Virtual Scrolling

**Para listas grandes**:
```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window';

const OrdersList = ({ orders }) => (
  <FixedSizeList
    height={600}
    itemCount={orders.length}
    itemSize={100}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <OrderCard order={orders[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

**Impacto**: Renderização de 1000+ itens sem lag

### 7. Service Worker para Cache

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300
              }
            }
          }
        ]
      }
    })
  ]
});
```

### 8. Compression

**Vite Config**:
```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

## 🔍 Análise de Bundle

### Instalar Ferramenta
```bash
npm install --save-dev rollup-plugin-visualizer
```

### Configurar
```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

### Executar
```bash
npm run build
# Abre stats.html automaticamente
```

## 📱 Performance Mobile

### Responsive Images
```typescript
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="image-mobile.webp" 
  />
  <source 
    media="(min-width: 769px)" 
    srcSet="image-desktop.webp" 
  />
  <img src="image-fallback.jpg" alt="..." />
</picture>
```

### Touch Optimization
```css
/* Melhorar responsividade de toque */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

## 🎨 CSS Optimization

### Purge Unused CSS
```typescript
// tailwind.config.ts
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  // Tailwind já faz purge automaticamente
};
```

### Critical CSS
```typescript
// Extrair CSS crítico inline no HTML
// Usar plugin vite-plugin-critical
```

## 🔄 Runtime Performance

### Debounce e Throttle
```typescript
// src/lib/utils.ts
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Uso
const handleSearch = debounce((query: string) => {
  searchOrders(query);
}, 300);
```

### Intersection Observer
```typescript
// Lazy load de componentes visíveis
const useIntersectionObserver = (ref: RefObject<Element>) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [ref]);
  
  return isVisible;
};
```

## 📊 Monitoramento

### Web Vitals
```bash
npm install web-vitals
```

```typescript
// src/lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};
```

### Performance API
```typescript
// Medir tempo de operações
const start = performance.now();
await heavyOperation();
const end = performance.now();
console.log(`Operação levou ${end - start}ms`);
```

## 🎯 Checklist de Implementação

### Fase 1 - Quick Wins (1-2 dias)
- [ ] Implementar lazy loading de rotas
- [ ] Adicionar memoization em componentes pesados
- [ ] Otimizar imports (tree shaking)
- [ ] Adicionar loading states

### Fase 2 - Otimizações Médias (3-5 dias)
- [ ] Implementar code splitting avançado
- [ ] Adicionar virtual scrolling
- [ ] Otimizar imagens
- [ ] Implementar debounce/throttle

### Fase 3 - Otimizações Avançadas (1-2 semanas)
- [ ] Service Worker e PWA
- [ ] Análise e otimização de bundle
- [ ] Implementar CDN
- [ ] Monitoramento de performance

## 📈 Resultados Esperados

### Após Fase 1
- Bundle: -150 KB
- Build time: -2s
- FCP: -0.5s

### Após Fase 2
- Bundle: -300 KB
- Build time: -4s
- TTI: -1s

### Após Fase 3
- Bundle: -400 KB
- Build time: -6s
- Lighthouse: 90+

## 🔗 Recursos

- [Web.dev Performance](https://web.dev/performance/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Bundle Analyzer](https://github.com/btd/rollup-plugin-visualizer)

---

**Última Atualização**: 2025-01-XX  
**Responsável**: Equipe de Desenvolvimento
