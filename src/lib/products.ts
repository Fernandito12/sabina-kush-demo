import mysql from 'mysql2/promise';

export type Product = {
  id: number;
  name: string;
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
  thc_profile?: string;
  image_fit?: 'contain' | 'cover';
};

const productDescriptions = {
  sabina: 'La variedad insignia de la casa: una entrada cremosa y dulce que abre paso a cítricos suaves y termina con un matiz terroso. Perfil aromático orientativo de cariofileno y limoneno; se describe como alegre y relajante, con una sensación corporal gradual.',
  pita: 'Un perfil fresco y expresivo: notas verdes y cítricas al inicio, seguidas por un fondo especiado. La combinación aromática recuerda al limoneno y al cariofileno. Se reporta como una experiencia animada que acompaña momentos sociales o creativos.',
  greenHouse: 'De carácter herbal y limpio, con aroma de vegetación fresca, un toque cítrico y un cierre ligeramente dulce. Perfil terpénico orientativo con notas de mirceno y humuleno. Su efecto se describe como sereno y equilibrado.',
  kush: 'Una flor de aroma profundo: tierra húmeda, especias suaves y un acento dulce. El perfil recuerda al cariofileno y al mirceno. Se reporta una sensación tranquila y envolvente; ideal para quien prefiere perfiles clásicos e intensos.',
  weed: 'Selección de presencia marcada, con notas especiadas y terrosas que se suavizan con un fondo cítrico. Perfil aromático orientativo de cariofileno y limoneno. Se describe con ánimo elevado y relajación progresiva.',
  gelato: 'Un perfil de postre: aroma dulce y cremoso con acentos de frutos rojos y cítricos. Sus notas recuerdan al limoneno y al cariofileno. Se reporta como una experiencia luminosa y creativa, con relajación corporal moderada.',
  frosty: 'Según la ficha de la variedad: híbrida con dominancia sativa, 24% THC y 1% CBD. Aromas dulces, cremosos y especiados, con un efecto descrito como relajante y equilibrado. Datos sujetos a confirmación por lote.',
  canton: 'La selección de la casa con un perfil fresco y frutal: notas verdes, cítricos suaves y un final herbal. Perfil terpénico orientativo con matices de limoneno y humuleno. Se describe como equilibrada, con ánimo ligero y calma gradual.',
} as const;
const demoImage = (filename: string) => `${import.meta.env.BASE_URL}images/products/${filename}`;

const demoProducts: Product[] = [
  { id: 1, name: 'Sabina Kush', description: productDescriptions.sabina, image: demoImage('grass-1.jpg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 2, name: 'PitaKush', description: productDescriptions.pita, image: demoImage('grass-2.jpg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 3, name: 'Green House', description: productDescriptions.greenHouse, image: demoImage('grass-3.webp'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 4, name: 'Kush', description: productDescriptions.kush, image: demoImage('flor-morada-macro.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 5, name: 'Weed Kush', description: productDescriptions.weed, image: demoImage('flor-premium-seleccion.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 6, name: 'Gelato Kush', description: productDescriptions.gelato, image: demoImage('flor-cosecha.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 7, name: 'Frosty', description: productDescriptions.frosty, image: demoImage('frosty-ficha.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '24% THC · 1% CBD', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: '70% sativa · 30% índica', thc_profile: '24% THC · 1% CBD', image_fit: 'contain' },
  { id: 8, name: 'Cantón Green', description: productDescriptions.canton, image: demoImage('seleccion-canton-green.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
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
