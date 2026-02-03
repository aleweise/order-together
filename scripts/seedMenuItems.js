import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate items for any restaurant
const generateMenuItems = (restaurantId) => [
    {
        restaurant_id: restaurantId,
        name: 'Combo Clásico',
        description: 'Hamburguesa con queso, papas y refresco',
        price: 45.00,
        category: 'Hamburguesas',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
        restaurant_id: restaurantId,
        name: 'Bowl Saludable',
        description: 'Quinoa, palta, pollo grillado y verduras',
        price: 38.50,
        category: 'Bowls',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500'
    },
    {
        restaurant_id: restaurantId,
        name: 'Pizza Personal',
        description: 'Mozzarella, tomate y albahaca',
        price: 42.00,
        category: 'Platos Principales',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500'
    },
    {
        restaurant_id: restaurantId,
        name: 'Jugo Natural',
        description: 'Naranja, piña o frutilla',
        price: 15.00,
        category: 'Bebidas',
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
    },
    {
        restaurant_id: restaurantId,
        name: 'Brownie con Helado',
        description: 'Chocolate belga con helado de vainilla',
        price: 25.00,
        category: 'Postres',
        image_url: 'https://images.unsplash.com/photo-1564355808539-22fda3e53b89?w=500'
    }
];

async function seedMenus() {
    console.log('Fetching restaurants...');

    const { data: restaurants, error: rError } = await supabase
        .from('restaurants')
        .select('id, name');

    if (rError) {
        console.error('Error fetching restaurants:', rError);
        return;
    }

    console.log(`Found ${restaurants.length} restaurants. Checking menus...`);

    for (const restaurant of restaurants) {
        // Check if menu items exist
        const { count, error: cError } = await supabase
            .from('menu_items')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurant.id);

        if (cError) {
            console.error(`Error checking menu for ${restaurant.name}:`, cError);
            continue;
        }

        if (count === 0) {
            console.log(`Adding menu items for ${restaurant.name}...`);
            const items = generateMenuItems(restaurant.id);

            const { error: iError } = await supabase
                .from('menu_items')
                .insert(items);

            if (iError) {
                console.error(`Failed to add items for ${restaurant.name}:`, iError);
            } else {
                console.log(`✅ Menu added for ${restaurant.name}`);
            }
        } else {
            console.log(`Skipping ${restaurant.name} (already has ${count} items)`);
        }
    }
}

seedMenus();
