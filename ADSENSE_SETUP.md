# Configuración de Google AdSense

## Pasos para configurar AdSense

### 1. Configuración en Google AdSense

1. Ve a [Google AdSense](https://www.google.com/adsense/)
2. Inicia sesión con tu cuenta de Google
3. Agrega tu sitio web
4. Completa toda la información solicitada
5. Espera la aprobación (puede tomar días o semanas)

### 2. Obtener tu ID de AdSense

Una vez aprobado, encontrarás tu ID de AdSense en el formato: `ca-pub-XXXXXXXXXXXXXXXXX`

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXXX

# Ad Slots específicos (obtener de AdSense)
NEXT_PUBLIC_ADSENSE_HEADER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_LEFT_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_SIDEBAR_RIGHT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_IN_CONTENT_1_SLOT=1234567893
NEXT_PUBLIC_ADSENSE_IN_CONTENT_2_SLOT=1234567894
NEXT_PUBLIC_ADSENSE_IN_CONTENT_3_SLOT=1234567895
NEXT_PUBLIC_ADSENSE_FOOTER_SLOT=1234567896
```

### 4. Crear Ad Units en AdSense

Para cada banner, crea un Ad Unit en tu panel de AdSense:

1. **Banner de cabecera**: Tamaño 728x90 (Leaderboard) o Responsive
2. **Banners laterales**: Tamaño 160x600 (Wide Skyscraper)
3. **Banners en contenido**: Tamaño 336x280 (Large Rectangle)

### 5. Componentes disponibles

#### HeaderBanner
```tsx
import HeaderBanner from "@/components/adsense/banners/HeaderBanner";

<HeaderBanner adSlot="tu-ad-slot" />
```

#### SidebarBanner
```tsx
import SidebarBanner from "@/components/adsense/banners/SidebarBanner";

<SidebarBanner adSlot="tu-ad-slot" className="sticky top-24" />
```

#### InContentBanner
```tsx
import InContentBanner from "@/components/adsense/banners/InContentBanner";

<InContentBanner adSlot="tu-ad-slot" />
```

#### AdBanner genérico
```tsx
import AdBanner from "@/components/adsense/AdBanner";

<AdBanner
  adSlot="tu-ad-slot"
  adFormat="auto"
  style={{ display: 'block', width: '100%', height: '250px' }}
  responsive={true}
/>
```

### 6. Configuración centralizada

Usa `ADSENSE_CONFIG` desde `@/lib/adsense-config` para gestionar todos los ad slots:

```tsx
import { ADSENSE_CONFIG } from "@/lib/adsense-config";

<HeaderBanner adSlot={ADSENSE_CONFIG.adSlots.header} />
```

### 7. Verificación

Para verificar si AdSense está configurado:

```tsx
import { isAdSenseEnabled } from "@/lib/adsense-config";

if (isAdSenseEnabled()) {
  // Mostrar anuncios
}
```

## Notas importantes

- Los anuncios solo se mostrarán en producción con un dominio aprobado
- En desarrollo, verás espacios vacíos donde irían los anuncios
- Asegúrate de cumplir las políticas de AdSense
- No hagas clic en tus propios anuncios
- Los ad slots deben ser únicos para cada posición

## Políticas de AdSense a considerar

1. Contenido de calidad y original
2. Buena experiencia de usuario
3. Navegación clara del sitio web
4. Políticas de privacidad y términos de servicio
5. No más de 3 anuncios por página (recomendado) 