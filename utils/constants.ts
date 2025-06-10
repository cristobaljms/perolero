export const COMMON_LISTING_FIELDS = `
  *,
  city_id:cities (
    *
  ),
  state_id:states (
   *
  ),
  category:categories (
    *
  ),
  sub_category:sub_categories (
    *
  ),
  user:users (
    *
  ),
  images:listing_images (
    *
  ),
  attributes:listing_attributes (
    *
  )
`;

export const CATEGORIES = {
  PROPERTY: 1,
  VEHICLE: 2,
  JOB: 3,
};

export const SEARCH_SUGGESTIONS = [
  "Apartamento en venta",
  "Alquiler de casas",
  "Autos usados",
  "Autos nuevos",
  "Alquiler de oficinas",
  "Bicicletas montaña",
  "Bolsos de marca",
  "Celulares Samsung",
  "Computadoras portátiles",
  "Consolas de videojuegos",
  "Cámaras digitales",
  "Departamentos amueblados",
  "Electrodomésticos",
  "Empleo tiempo completo",
  "Equipos de sonido",
  "Escritorios de oficina",
  "Guitarras eléctricas",
  "Herramientas de construcción",
  "Impresoras multifunción",
  "iPhone usado",
  "Joyas de plata",
  "Juegos de mesa",
  "Lavadoras automáticas",
  "Libros de segunda mano",
  "Maquinaria industrial",
  "Mesas de comedor",
  "Motos usadas",
  "Muebles de jardín",
  "Neveras",
  "Notebooks gamer",
  "Ofertas de trabajo",
  "Pantallas LED",
  "Patinetes eléctricos",
  "Pisos en alquiler",
  "Playstation 5",
  "Relojes inteligentes",
  "Ropa de marca",
  "Sillas gamer",
  "Sofás de cuero",
  "Tablets Android",
  "Televisores 4K",
  "Terrenos en venta",
  "Teclados mecánicos",
  "Teléfonos móviles",
  "Vehículos comerciales",
  "Vestidos de fiesta",
  "Zapatillas deportivas",
  "Aire acondicionado",
  "Aspiradoras robot",
  "Baterías de cocina",
  "Bicicletas eléctricas",
  "Camas king size",
  "Cámaras de seguridad",
  "Cocinas integrales",
  "Colchones ortopédicos",
  "Drones con cámara",
  "Equipos de gimnasio",
  "Estufas de gas",
  "Freidoras de aire",
  "Gafas de sol",
  "Hornos eléctricos",
  "Instrumentos musicales",
  "Juguetes educativos",
  "Laptops gaming",
  "Licuadoras profesionales",
  "Llantas para auto",
  "Máquinas de coser",
  "Microondas digitales",
  "Monitores curvo",
  "Muebles antiguos",
  "Nintendo Switch",
  "Ollas a presión",
  "Parrillas eléctricas",
  "Perfumes originales",
  "Pisos de madera",
  "Planchas de ropa",
  "Proyectores HD",
  "Refrigeradores",
  "Relojes de lujo",
  "Roperos modernos",
  "Secadoras de ropa",
  "Sillas de oficina",
  "Smartphones Xiaomi",
  "Tablets Apple",
  "Tenis de marca",
  "Trajes formales",
  "Ventiladores de techo",
  "Xbox Series X",
  "Zapatos de cuero",
  "Accesorios para mascotas",
  "Audífonos inalámbricos",
  "Boletos para conciertos",
  "Cámaras GoPro",
  "Discos de vinilo",
  "Equipos de camping",
];

export const CATEGORY_IDS = {
  INMUEBLES: 1,
  VEHICULOS: 2,
};

export const CATEGORY_TAGS = {
  INMUEBLES: "inmuebles",
  VEHICULOS: "vehiculos",
};

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const MAX_IMAGES = 3;

export const PRODUCT_STATES = [
  { id: "new", name: "Nuevo" },
  { id: "used", name: "Usado" },
  { id: "refurbished", name: "Reacondicionado" },
];

export const CATEGORIES_MAP = [
  {
    id: 1,
    name: "Inmuebles",
    tag: "inmueble",
  },
  {
    id: 2,
    name: "Vehículos",
    tag: "vehiculo",
  },
  {
    id: 3,
    name: "Empleos",
    tag: "empleo",
  },
  {
    id: 4,
    name: "Entretenimiento",
    tag: "entretetimiento",
  },
  {
    id: 5,
    name: "Moda y Belleza",
    tag: "moda-belleza",
  },
  {
    id: 6,
    name: "Deportes y Fitness",
    tag: "deportes-fitness",
  },
  {
    id: 7,
    name: "Hogar",
    tag: "hogar",
  },
  {
    id: 8,
    name: "Bebés y Niños",
    tag: "bebes",
  },
  {
    id: 9,
    name: "Electrónica",
    tag: "electronica",
  },
  {
    id: 10,
    name: "Repuestos",
    tag: "respuestos",
  },
  {
    id: 11,
    name: "Servicios",
    tag: "servicios",
  },
];

export const ATTRIBUTES = {
  "property_contract_type": "contrato",
  "vehicle_brand": "marca",
  "vehicle_model": "modelo",
  "vehicle_year": "año",
  "product_title": "título",
  "product_state": "estado",
  "job_title": "título",
};