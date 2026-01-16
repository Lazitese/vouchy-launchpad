
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = process.env.VITE_SITE_URL || 'https://vouchy.click';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Static routes to include
const STATIC_ROUTES = [
    '',
    '/auth',
    '/terms',
    '/privacy',
];

// Routes to exclude
const EXCLUDED_ROUTES = [
    '/dashboard',
    '/onboarding',
    '/settings',
    '/not-found'
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    let dynamicRoutes = [];

    // Try to fetch dynamic routes if credentials are present
    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            console.log('Fetching dynamic routes from Supabase...');
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

            // Fetch public spaces for /collect/:slug
            // Assuming table is 'spaces' and has 'slug' and 'is_public' or similar
            // Adjust table name and fields based on actual schema
            const { data: spaces, error } = await supabase
                .from('spaces')
                .select('slug')
                .eq('status', 'active'); // Assuming there's a status field, or just fetch all

            if (error) {
                console.warn('Warning: Could not fetch spaces for sitemap:', error.message);
            } else if (spaces) {
                dynamicRoutes = spaces.map(space => `/collect/${space.slug}`);
                console.log(`Found ${spaces.length} public spaces.`);
            }

            // Add other dynamic entities if needed (e.g. public showcases)

        } catch (err) {
            console.error('Error connecting to Supabase:', err);
        }
    } else {
        console.log('Skipping dynamic routes (SUPABASE_URL or KEY not found in env).');
    }

    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
    const date = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    const outputPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(outputPath, xml);

    console.log(`Sitemap generated at: ${outputPath}`);
}

generateSitemap().catch(console.error);
