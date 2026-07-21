import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { Product } from './_data/products';
import { getAllArticles } from './_data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://buenofurni.ru';

    // Static Routes
    const staticRoutes = [
        '',
        '/catalog',
        '/blog',
        '/horeca',
        '/custom',
        '/myagkie-stulya-dlya-kuhni',
        '/antivandalnye-stulya',
        '/obedennaya-gruppa',
        '/barnye-stulya',
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

    // Blog Article Routes — не зависят от products.json
    const blogRoutes = getAllArticles().map((article) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

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

        return [...staticRoutes, ...dynamicRoutes, ...blogRoutes];
    } catch {
        // Продукты не прочитались — всё равно отдаём статические роуты и блог
        return [...staticRoutes, ...blogRoutes];
    }
}
