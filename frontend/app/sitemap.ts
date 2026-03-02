import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { Product } from './_data/products';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://buenofurni.ru';

    // Static Routes
    const staticRoutes = [
        '',
        '/catalog',
        '/horeca',
        '/custom',
        '/materials',
        '/production',
        '/contacts',
        '/user-agreement',
        '/privacy-policy'
    ].map((route) => {
        const result: { url: string; lastModified: string; changeFrequency: "daily" | "weekly"; priority: number } = {
            url: `${baseUrl}${route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: (route === '' || route === '/catalog') ? 'daily' : 'weekly',
            priority: route === '' ? 1 : (route === '/catalog' ? 0.9 : 0.8),
        };
        return result;
    });

    // Dynamic Product Routes
    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const products: Product[] = JSON.parse(fileContent);

        const dynamicRoutes = products.map((product) => {
            const result: { url: string; lastModified: string; changeFrequency: "weekly"; priority: number } = {
                url: `${baseUrl}/product/${product.slug}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.7,
            };
            return result;
        });

        return [...staticRoutes, ...dynamicRoutes];
    } catch (e) {
        // Fallback if products.json fails to read during build
        return staticRoutes;
    }
}
