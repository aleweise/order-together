import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env vars
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const restaurants = [
    { name: 'Acai Bar Superfood', logo_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=100&h=100&fit=crop' },
    { name: 'Bistro La Casona', logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop' },
    { name: 'As de Copas', logo_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&h=100&fit=crop' },
    { name: 'Burger King', logo_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop' },
    { name: 'Sbarro', logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
    { name: 'Subway', logo_url: 'https://images.unsplash.com/photo-1509722747741-0015928ea6a8?w=100&h=100&fit=crop' },
    { name: 'Dumbo', logo_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=100&h=100&fit=crop' },
    { name: 'Pollos Copacabana', logo_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=100&h=100&fit=crop' },
    { name: 'Jardin de Asia', logo_url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100&h=100&fit=crop' },
    { name: 'El Hornito', logo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop' },
    { name: 'Tanta', logo_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=100&h=100&fit=crop' },
    { name: 'Factory Grill', logo_url: 'https://images.unsplash.com/photo-1544025162-d76690b67f11?w=100&h=100&fit=crop' }
];

async function seedRestaurants() {
    console.log('Seeding restaurants...');

    for (const r of restaurants) {
        const { data, error } = await supabase
            .from('restaurants')
            .upsert(r, { onConflict: 'name' })
            .select();

        if (error) {
            console.error(`Error inserting ${r.name}:`, error);
        } else {
            console.log(`Inserted/Updated: ${r.name}`);
        }
    }

    console.log('Done!');
}

seedRestaurants();
