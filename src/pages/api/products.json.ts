import type { APIRoute } from 'astro';
import { getProducts } from '../../lib/products';

export const prerender = true;

export const GET: APIRoute = async () => {
  const result = await getProducts();
  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
};
