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
};

const demoProducts: Product[] = [
  { id: 1, name: 'Takis Fuego', description: 'El crujido intenso con chile y limón que prende cualquier antojo.', image: `${import.meta.env.BASE_URL}images/products/grass-1.jpg`, category: 'Botanas', snack_type: 'Picante', intensity: 'Alta', unit_name: 'bolsa', unit_weight: '56 g', price: 22, stock: 18 },
  { id: 2, name: 'Gomitas enchiladas', description: 'Gomitas suaves, bañadas en chamoy y chile de la casa.', image: `${import.meta.env.BASE_URL}images/products/grass-2.jpg`, category: 'Dulces', snack_type: 'Agridulce', intensity: 'Media', unit_name: 'bolsa', unit_weight: '150 g', price: 38, stock: 12 },
  { id: 3, name: 'Papas clásicas', description: 'Doraditas, crujientes y listas para compartir (si quieres).', image: `${import.meta.env.BASE_URL}images/products/grass-3.webp`, category: 'Botanas', snack_type: 'Salado', intensity: 'Suave', unit_name: 'bolsa', unit_weight: '45 g', price: 19, stock: 24 },
  { id: 4, name: 'Cacahuates japoneses', description: 'El crunch de siempre para la tarde, la peli y la botanita.', image: '', category: 'Botanas', snack_type: 'Salado', intensity: 'Suave', unit_name: 'bolsa', unit_weight: '100 g', price: 25, stock: 16 },
  { id: 5, name: 'Paleta de mango', description: 'Dulce, picosita y con sabor a recreo de toda la vida.', image: '', category: 'Dulces', snack_type: 'Agridulce', intensity: 'Media', unit_name: 'pieza', unit_weight: '1 pieza', price: 12, stock: 30 },
  { id: 6, name: 'Mix botanero', description: 'Una mezcla botanera para que cada puño traiga algo distinto.', image: '', category: 'Botanas', snack_type: 'Mezcla', intensity: 'Media', unit_name: 'bolsa', unit_weight: '180 g', price: 55, stock: 9 },
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
