// Configuración centralizada para Google AdSense
export const ADSENSE_CONFIG = {
  // ID de cliente de AdSense (se obtiene de las variables de entorno)
  clientId: process.env.NEXT_PUBLIC_ADSENSE_ID,
  
  // Ad Slots para diferentes posiciones
  adSlots: {
    // Banner de cabecera (728x90 o responsive)
    header: process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT || '1234567890',
    
    // Banners laterales (160x600)
    sidebarLeft: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_LEFT_SLOT || '1234567891',
    sidebarRight: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_RIGHT_SLOT || '1234567892',
    
    // Banners en el contenido (336x280)
    inContent1: process.env.NEXT_PUBLIC_ADSENSE_IN_CONTENT_1_SLOT || '1234567893',
    inContent2: process.env.NEXT_PUBLIC_ADSENSE_IN_CONTENT_2_SLOT || '1234567894',
    inContent3: process.env.NEXT_PUBLIC_ADSENSE_IN_CONTENT_3_SLOT || '1234567895',
    
    // Banner de pie de página
    footer: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT || '1234567896',
  }
};

// Verificar si AdSense está configurado correctamente
export const isAdSenseEnabled = () => {
  return !!(ADSENSE_CONFIG.clientId && ADSENSE_CONFIG.clientId !== 'ca-pub-XXXXXXXXXXXXXXXXX');
}; 