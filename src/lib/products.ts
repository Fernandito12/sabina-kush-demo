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

const catalogDescription = 'Aroma dulce, cremoso y cítrico, con notas de frutos rojos y un final terroso y especiado. Perfil terpénico orientativo: cariofileno, limoneno y humuleno o mirceno. Se reportan euforia, ánimo elevado, creatividad y relajación corporal; la experiencia cambia según la persona y el lote.';
const demoImage = (filename: string) => `${import.meta.env.BASE_URL}images/products/${filename}`;

const demoProducts: Product[] = [
  { id: 1, name: 'Sabina Kush', description: catalogDescription, image: demoImage('grass-1.jpg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 2, name: 'PitaKush', description: catalogDescription, image: demoImage('grass-2.jpg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 3, name: 'Green House', description: catalogDescription, image: demoImage('grass-3.webp'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 4, name: 'Kush', description: catalogDescription, image: demoImage('flor-morada-macro.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 5, name: 'Weed Kush', description: catalogDescription, image: demoImage('flor-premium-seleccion.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 6, name: 'Gelato Kush', description: catalogDescription, image: demoImage('flor-cosecha.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
  { id: 7, name: 'Frosty', description: 'Según la ficha de la variedad: híbrida con dominancia sativa, 24% THC y 1% CBD. Aromas dulces, cremosos y especiados, con un efecto descrito como relajante y equilibrado. Datos sujetos a confirmación por lote.', image: demoImage('frosty-ficha.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '24% THC · 1% CBD', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: '70% sativa · 30% índica', thc_profile: '24% THC · 1% CBD', image_fit: 'contain' },
  { id: 8, name: 'Cantón Green', description: catalogDescription, image: demoImage('seleccion-canton-green.jpeg'), category: 'Flores', snack_type: 'Híbrida', intensity: '20–25% THC', unit_name: 'paquete', unit_weight: '28 g', price: 1000, stock: 9999, unlimited_stock: true, profile_type: 'Índica dominante', thc_profile: '20–25% THC' },
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
