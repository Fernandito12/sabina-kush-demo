# Sabina Kush · tienda web

Tienda nueva en Astro 5, independiente de la versión PHP del directorio principal. El catálogo conserva el esquema de `products` y el pedido se arma en el navegador y se envía por WhatsApp.

## Ejecutar localmente

1. Instala Node.js 20.3 o posterior.
2. Desde `webNew`, ejecuta `npm install`.
3. Copia `.env.example` como `.env` y configura `PUBLIC_WHATSAPP_NUMBER`.
4. Ejecuta `npm run dev` y abre la dirección local que muestra Astro.

Sin `DATABASE_URL`, la tienda presenta seis productos de muestra y el carrito funciona para la demo. Para usar MySQL, configura `DATABASE_URL` con la conexión del `config/database.php` existente. La clave no se debe copiar al repositorio ni al navegador: agrega esta variable en los ajustes de entorno de Vercel.

## Catálogo MySQL y publicación

El proyecto genera una web estática que puede publicarse en Vercel, Cloudflare Pages o Sites. La API del catálogo también se genera durante la compilación para conservar la ruta `/api/products.json` en el hosting estático.

`DATABASE_URL` se lee en el servidor/build y nunca se incluye en el JavaScript del navegador. Puede usarse para generar el catálogo a partir de la base de datos durante la compilación. La configuración existente usa `localhost`; solo podrá leer MySQL en un build ejecutado en ese mismo servidor. En un proveedor externo, usa un host accesible durante la compilación. Si la conexión falla o no está configurada, se incluye el catálogo de demostración.

Las fotografías de productos existentes aún no se encuentran en `assets/uploads/products`; cuando existan, habrá que sincronizarlas al hosting o almacenar imágenes en un servicio accesible desde el sitio.
