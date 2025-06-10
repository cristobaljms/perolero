# 🚀 RECOMENDACIONES DE OPTIMIZACIÓN ADICIONALES

## ⚡ RENDIMIENTO

### 1. **Implementar React.lazy para Code Splitting**
```typescript
// En lugar de imports normales, usar lazy loading para componentes grandes
const ListingDetails = React.lazy(() => import('./components/listings/listing-details'));
const SearchAutocomplete = React.lazy(() => import('./components/search-autocomplete'));

// Wrapper con Suspense
<Suspense fallback={<div>Cargando...</div>}>
  <ListingDetails />
</Suspense>
```

### 2. **Optimizar Imágenes con blur placeholder**
```typescript
// En ListingCard.tsx, agregar blur placeholder
<Image
  src={listing.images[0].image_url}
  alt={listing.description || "Sin descripción"}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  priority={index < 4} // Solo las primeras 4 imágenes con priority
/>
```

### 3. **Implementar Virtual Scrolling**
Para listas largas de anuncios, considera usar `react-window` o `react-virtualized`.

### 4. **Caché de React Query**
```typescript
// En providers/query-client-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});
```

### 5. **Bundle Analyzer**
Agrega al package.json:
```json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^latest"
  }
}
```

## 🔒 SEGURIDAD

### 6. **Content Security Policy (CSP)**
Agregar a `next.config.ts`:
```typescript
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.supabase.co; connect-src 'self' *.supabase.co;"
        }
      ]
    }
  ]
}
```

### 7. **Rate Limiting**
Implementar rate limiting en las API routes:
```typescript
// utils/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minuto
});

export function rateLimiter(identifier: string) {
  const count = rateLimit.get(identifier) as number || 0;
  if (count >= 10) { // 10 requests por minuto
    throw new Error('Rate limit exceeded');
  }
  rateLimit.set(identifier, count + 1);
}
```

### 8. **Input Sanitization**
Usar las funciones del archivo `utils/validation.ts` en todos los formularios:
```typescript
import { sanitizeHtml, searchQuerySchema } from '@/utils/validation';

// En formularios de búsqueda
const sanitizedQuery = sanitizeHtml(query);
const validatedQuery = searchQuerySchema.parse(sanitizedQuery);
```

### 9. **Helmet para Headers de Seguridad**
```bash
npm install @next/bundle-analyzer helmet
```

## 🗄️ BASE DE DATOS

### 10. **Índices de Base de Datos**
En Supabase, crear índices para:
```sql
-- Para búsquedas por categoría
CREATE INDEX idx_listings_category_created ON listings(category_id, created_at DESC);

-- Para búsquedas por ubicación
CREATE INDEX idx_listings_location ON listings(state_id, city_id);

-- Para búsquedas de texto completo
CREATE INDEX idx_listings_search ON listings USING gin(search_vector);
```

### 11. **Row Level Security (RLS)**
Habilitar RLS en todas las tablas:
```sql
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Política para lecturas públicas
CREATE POLICY "Allow public read" ON listings FOR SELECT USING (true);

-- Política para que usuarios solo puedan editar sus propios listings
CREATE POLICY "Users can update own listings" ON listings 
  FOR UPDATE USING (auth.uid() = user_id);
```

## 📱 UX/UI

### 12. **Progressive Web App (PWA)**
```json
// En public/manifest.json
{
  "name": "Portal de Anuncios",
  "short_name": "Anuncios",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 13. **Skeleton Loading**
Crear componentes skeleton para mejor UX:
```typescript
export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 aspect-square rounded-lg"></div>
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}
```

### 14. **Error Boundaries**
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>;
    }
    return this.props.children;
  }
}
```

## 🧪 TESTING

### 15. **Testing Framework**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### 16. **E2E Testing**
```bash
npm install --save-dev playwright
```

## 📊 MONITORING

### 17. **Analytics y Monitoring**
```typescript
// utils/analytics.ts
export function trackEvent(eventName: string, properties?: object) {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    gtag('event', eventName, properties);
  }
}
```

### 18. **Error Tracking**
Considerar integrar Sentry para tracking de errores en producción.

## 🔧 CONFIGURACIÓN

### 19. **ESLint y Prettier estrictos**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error"
  }
}
```

### 20. **Husky para Git Hooks**
```bash
npm install --save-dev husky lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 🚀 DEPLOYMENT

### 21. **Optimización de Build**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### 22. **Docker para Containerización**
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 MÉTRICAS DE ÉXITO

Monitorear:
- **Core Web Vitals** (LCP, FID, CLS)
- **Bundle Size** (<250KB inicial)
- **Time to Interactive** (<3 segundos)
- **Error Rate** (<0.1%)
- **API Response Times** (<500ms p95)

---

**Prioridad de implementación:**
1. 🔴 Crítico: CSP, RLS, Rate Limiting, Bundle Analysis
2. 🟡 Importante: PWA, Skeleton Loading, Error Boundaries
3. 🟢 Opcional: Testing, Monitoring, Docker 