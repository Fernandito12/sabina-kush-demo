import mysql from 'mysql2/promise';

export type Product = {
  id: number;
  name: string;
  summary?: string;
  description: string;
  image: string;
  category: string;
  snack_type: string;
  intensity: string;
  unit_name: string;
  unit_weight: string;
  price: number;
  stock: number;
  unlimited_stock?: boolean;
  profile_type?: string;
  product_badge?: string;
  thc_profile?: string;
  image_fit?: 'contain' | 'cover';
};

const productProfiles = {
  sabina: { summary: 'Dulce y cremosa, con un final cítrico y terroso.', description: 'El perfil insignia de la casa abre con dulzor cremoso y cítricos suaves; al final aparecen matices de tierra y especias. Como descripción sensorial orientativa, recuerda a cariofileno y limoneno. Los aromas y efectos pueden cambiar según lote y persona.' },
  pita: { summary: 'Verde y cítrica; cierra con un toque especiado.', description: 'Una entrada herbal y fresca da paso a notas cítricas, con un cierre especiado que le da personalidad. Su combinación aromática se describe con matices de limoneno y cariofileno. Una opción de perfil vivo y expresivo; la experiencia varía por persona y lote.' },
  greenHouse: { summary: 'Herbal y limpia, con dulzor ligero.', description: 'La vegetación fresca es lo primero que destaca, seguida por un toque cítrico y un final ligeramente dulce. En su lectura aromática aparecen notas que recuerdan al mirceno y al humuleno. Se presenta como un perfil equilibrado, sujeto a variación natural.' },
  kush: { summary: 'Terrosa y profunda, con especias suaves.', description: 'Un aroma clásico de tierra húmeda y especias suaves se mezcla con un acento dulce. El perfil recuerda a cariofileno y mirceno, sin sustituir un análisis del lote. Su carácter es robusto y envolvente, para quienes buscan una fragancia de mayor profundidad.' },
  weed: { summary: 'Especiada, con fondo terroso y cítrico.', description: 'Las notas especiadas y de tierra llevan el primer plano; al fondo aparece un matiz cítrico que aporta contraste. Una descripción aromática orientativa con ecos de cariofileno y limoneno. Su intensidad real depende de la flor y de cada persona.' },
  gelato: { summary: 'Cremosa y frutal, con guiños a frutos rojos.', description: 'Inspirada en perfiles de postre, combina una sensación cremosa y dulce con notas de frutos rojos y cítricos. Su carácter aromático evoca limoneno y cariofileno. Un perfil amable y redondo cuya expresión puede variar entre lotes.' },
  frosty: { summary: 'Dulce y especiada; ficha indica 24% THC y 1% CBD.', description: 'La ficha incluida en la imagen la presenta como 70% sativa y 30% índica, con 24% THC y 1% CBD. También señala notas dulces, cremosas y especiadas. Estos valores proceden de la ficha visual y requieren confirmación para el lote ofrecido.' },
  canton: { summary: 'Fresca y frutal, con un final herbal.', description: 'La selección de la casa combina notas verdes y frutales con cítricos suaves; el final herbal la distingue de los perfiles cremosos o especiados del catálogo. Como guía sensorial orientativa, aparecen matices de limoneno y humuleno. Puede cambiar según el lote.' },
} as const;
const demoImage = (filename: string) => `${import.meta.env.BASE_URL}images/products/${filename}`;

const demoProducts: Product[] = [
  { id: 1, name: 'Sabina Kush', summary: productProfiles.sabina.summary, description: productProfiles.sabina.description, image: demoImage('grass-1.jpg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 2, name: 'PitaKush', summary: productProfiles.pita.summary, description: productProfiles.pita.description, image: demoImage('grass-2.jpg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 3, name: 'Green House', summary: productProfiles.greenHouse.summary, description: productProfiles.greenHouse.description, image: demoImage('grass-3.webp'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 4, name: 'Kush', summary: productProfiles.kush.summary, description: productProfiles.kush.description, image: demoImage('flor-morada-macro.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 5, name: 'Weed Kush', summary: productProfiles.weed.summary, description: productProfiles.weed.description, image: demoImage('flor-premium-seleccion.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 6, name: 'Gelato Kush', summary: productProfiles.gelato.summary, description: productProfiles.gelato.description, image: demoImage('flor-cosecha.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 7, name: 'Frosty', summary: productProfiles.frosty.summary, description: productProfiles.frosty.description, image: demoImage('frosty-ficha.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '24% THC · 1% CBD', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: '70% sativa · 30% índica', thc_profile: '24% THC · 1% CBD', image_fit: 'contain' },
  { id: 8, name: 'Cantón Green', summary: productProfiles.canton.summary, description: productProfiles.canton.description, image: demoImage('seleccion-canton-green.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 9, name: 'Gorra 1', summary: 'Negra con bordado frontal en tipografía ornamental.', description: 'Gorra negra con cierre ajustable y bordado frontal de estilo ornamental en tono dorado. Diseño visto por la parte posterior.', image: demoImage('gorra-1.jpeg'), category: 'Accesorios', snack_type: 'Gorra', intensity: 'Pieza', unit_name: 'pieza', unit_weight: '1 pieza', price: 500, stock: 9999, unlimited_stock: true, profile_type: 'Cierre ajustable', product_badge: 'Bordado ornamental' },
  { id: 10, name: 'Gorra 2', summary: 'Negra con bordado botánico al frente.', description: 'Gorra negra de visera curva con un bordado botánico en tonos verdes. Un diseño discreto con el detalle al centro.', image: demoImage('gorra-2.jpeg'), category: 'Accesorios', snack_type: 'Gorra', intensity: 'Pieza', unit_name: 'pieza', unit_weight: '1 pieza', price: 500, stock: 9999, unlimited_stock: true, profile_type: 'Visera curva', product_badge: 'Bordado botánico' },
  { id: 11, name: 'Gorra 3', summary: 'Negra con parche Cantón Verde.', description: 'Gorra negra con visera curva y parche frontal ilustrado con la marca Cantón Verde. La foto muestra el producto en tienda.', image: demoImage('gorra-3.jpeg'), category: 'Accesorios', snack_type: 'Gorra', intensity: 'Pieza', unit_name: 'pieza', unit_weight: '1 pieza', price: 500, stock: 9999, unlimited_stock: true, profile_type: 'Visera curva', product_badge: 'Parche Cantón Verde' },
  { id: 12, name: 'Gorra 4', summary: 'Negra con bordado #SINSEMILLA y fresa.', description: 'Gorra negra con bordado blanco #SINSEMILLA y un pequeño motivo de fresa roja con hojas verdes.', image: demoImage('gorra-4.jpeg'), category: 'Accesorios', snack_type: 'Gorra', intensity: 'Pieza', unit_name: 'pieza', unit_weight: '1 pieza', price: 500, stock: 9999, unlimited_stock: true, profile_type: 'Bordado frontal', product_badge: '#SINSEMILLA' },
];

export async function getProducts(): Promise<{ products: Product[]; isDemo: boolean }> {
  const connectionString = import.meta.env.DATABASE_URL;
  if (!connectionString) return { products: demoProducts, isDemo: true };

  let connection: mysql.Connection | undefined;
  try {
    connection = await mysql.createConnection(connectionString);
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT id, name, description, image, category, snack_type, intensity, unit_name, unit_weight, price, stock FROM products WHERE active = 1 ORDER BY id DESC',
    );
    const localProductImages = new Set(['grass-1.jpg', 'grass-2.jpg', 'grass-3.webp']);
    return { products: rows.map((row) => {
      const filename = String(row.image ?? '');
      const image = localProductImages.has(filename)
        ? `${import.meta.env.BASE_URL}images/products/${encodeURIComponent(filename)}`
        : filename ? `/snackshop/assets/uploads/products/${encodeURIComponent(filename)}` : '';
      return { ...row, price: Number(row.price), stock: Number(row.stock), image };
    }) as Product[], isDemo: false };
  } catch (error) {
    console.error('No se pudo cargar el catálogo MySQL; se muestra el catálogo de demostración.', error instanceof Error ? error.message : 'Error desconocido');
    return { products: demoProducts, isDemo: true };
  } finally {
    await connection?.end();
  }
}
