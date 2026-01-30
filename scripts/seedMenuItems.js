import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Menu items data for each restaurant
const menuItemsData = [
    // Acai Bar Superfood
    {
        restaurant_name: 'Acai Bar Superfood',
        items: [
            { name: 'Acai Bowl Clásico', description: 'Acai con granola, banana y miel', price: 35, category: 'Bowls' },
            { name: 'Acai Bowl Tropical', description: 'Acai con mango, coco y chía', price: 40, category: 'Bowls' },
            { name: 'Smoothie Verde', description: 'Espinaca, piña, manzana y jengibre', price: 25, category: 'Smoothies' },
            { name: 'Smoothie de Fresa', description: 'Fresa, banana y leche de almendras', price: 25, category: 'Smoothies' },
            { name: 'Tostadas de Aguacate', description: 'Pan integral con aguacate y huevo', price: 30, category: 'Desayunos' },
        ]
    },
    // As de Copas
    {
        restaurant_name: 'As de Copas',
        items: [
            { name: 'Hamburguesa Clásica', description: 'Carne, lechuga, tomate y queso', price: 45, category: 'Hamburguesas' },
            { name: 'Hamburguesa BBQ', description: 'Carne, cebolla caramelizada y salsa BBQ', price: 50, category: 'Hamburguesas' },
            { name: 'Alitas Picantes', description: '10 alitas con salsa buffalo', price: 40, category: 'Entradas' },
            { name: 'Papas Fritas', description: 'Porción grande con salsas', price: 20, category: 'Acompañamientos' },
            { name: 'Cerveza Artesanal', description: 'Cerveza local 500ml', price: 25, category: 'Bebidas' },
        ]
    },
    // Bistro La Casona
    {
        restaurant_name: 'Bistro La Casona',
        items: [
            { name: 'Salmón a la Parrilla', description: 'Con vegetales asados y arroz', price: 85, category: 'Platos Principales' },
            { name: 'Risotto de Hongos', description: 'Risotto cremoso con hongos silvestres', price: 65, category: 'Platos Principales' },
            { name: 'Ensalada César', description: 'Lechuga romana, crutones y parmesano', price: 35, category: 'Ensaladas' },
            { name: 'Sopa del Día', description: 'Pregunta por la sopa especial', price: 25, category: 'Entradas' },
            { name: 'Tiramisú', description: 'Postre italiano clásico', price: 30, category: 'Postres' },
        ]
    },
    // El Aljibe Comida Típica
    {
        restaurant_name: 'El Aljibe Comida Típica',
        items: [
            { name: 'Pique Macho', description: 'Carne, salchicha, papas y vegetales', price: 55, category: 'Platos Principales' },
            { name: 'Silpancho', description: 'Carne apanada con arroz, papa y huevo', price: 45, category: 'Platos Principales' },
            { name: 'Sajta de Pollo', description: 'Pollo en salsa de ají amarillo', price: 40, category: 'Platos Principales' },
            { name: 'Empanadas de Queso', description: '3 empanadas fritas', price: 15, category: 'Entradas' },
            { name: 'Api con Pastel', description: 'Bebida caliente con pastel de queso', price: 12, category: 'Desayunos' },
        ]
    },
    // Frisby
    {
        restaurant_name: 'Frisby',
        items: [
            { name: 'Pollo Broaster Entero', description: 'Pollo frito crujiente', price: 70, category: 'Pollos' },
            { name: 'Medio Pollo', description: 'Medio pollo con papas', price: 40, category: 'Pollos' },
            { name: 'Alitas Frisby', description: '12 alitas picantes', price: 35, category: 'Alitas' },
            { name: 'Hamburguesa de Pollo', description: 'Pollo apanado con vegetales', price: 30, category: 'Hamburguesas' },
            { name: 'Ensalada Coleslaw', description: 'Ensalada de repollo', price: 15, category: 'Acompañamientos' },
        ]
    },
    // La Candelaria
    {
        restaurant_name: 'La Candelaria',
        items: [
            { name: 'Parrillada Mixta', description: 'Carne, chorizo, pollo y vegetales', price: 95, category: 'Parrillas' },
            { name: 'Bife de Chorizo', description: 'Corte argentino 300g', price: 75, category: 'Carnes' },
            { name: 'Choripán', description: 'Chorizo en pan con chimichurri', price: 25, category: 'Sandwiches' },
            { name: 'Provoleta', description: 'Queso provolone a la parrilla', price: 30, category: 'Entradas' },
            { name: 'Flan Casero', description: 'Con dulce de leche', price: 20, category: 'Postres' },
        ]
    },
    // Paprika
    {
        restaurant_name: 'Paprika',
        items: [
            { name: 'Pollo al Curry', description: 'Pollo en salsa de curry con arroz', price: 50, category: 'Platos Principales' },
            { name: 'Pad Thai', description: 'Fideos tailandeses con vegetales', price: 45, category: 'Platos Principales' },
            { name: 'Sushi Roll Mixto', description: '12 piezas variadas', price: 60, category: 'Sushi' },
            { name: 'Gyozas', description: '6 dumplings al vapor', price: 30, category: 'Entradas' },
            { name: 'Té Verde', description: 'Té japonés caliente', price: 10, category: 'Bebidas' },
        ]
    },
    // Patio Cervecero
    {
        restaurant_name: 'Patio Cervecero',
        items: [
            { name: 'Tabla de Quesos', description: 'Selección de quesos artesanales', price: 55, category: 'Entradas' },
            { name: 'Costillas BBQ', description: 'Costillas de cerdo con salsa BBQ', price: 70, category: 'Platos Principales' },
            { name: 'Nachos Supreme', description: 'Nachos con queso, guacamole y crema', price: 40, category: 'Entradas' },
            { name: 'Cerveza IPA', description: 'Cerveza artesanal 500ml', price: 28, category: 'Bebidas' },
            { name: 'Brownie con Helado', description: 'Brownie caliente con helado de vainilla', price: 25, category: 'Postres' },
        ]
    },
    // Pollos Copacabana
    {
        restaurant_name: 'Pollos Copacabana',
        items: [
            { name: 'Pollo a la Brasa Entero', description: 'Pollo marinado al carbón', price: 65, category: 'Pollos' },
            { name: '1/4 de Pollo', description: 'Cuarto de pollo con papas', price: 25, category: 'Pollos' },
            { name: 'Chaufa de Pollo', description: 'Arroz chaufa con pollo', price: 35, category: 'Platos Principales' },
            { name: 'Tallarín Saltado', description: 'Fideos salteados con pollo', price: 35, category: 'Platos Principales' },
            { name: 'Chicha Morada', description: 'Bebida tradicional peruana', price: 8, category: 'Bebidas' },
        ]
    },
    // Sabor Brasileño
    {
        restaurant_name: 'Sabor Brasileño',
        items: [
            { name: 'Feijoada Completa', description: 'Guiso de frijoles negros con carnes', price: 60, category: 'Platos Principales' },
            { name: 'Picanha a la Parrilla', description: 'Corte brasileño premium 400g', price: 90, category: 'Carnes' },
            { name: 'Coxinha de Pollo', description: '4 croquetas brasileñas', price: 25, category: 'Entradas' },
            { name: 'Pão de Queijo', description: '6 panecillos de queso', price: 20, category: 'Entradas' },
            { name: 'Caipirinha', description: 'Cóctel brasileño clásico', price: 30, category: 'Bebidas' },
        ]
    },
];

async function seedMenuItems() {
    console.log('🌱 Starting menu items seeding...\n');

    try {
        // Get all restaurants
        const { data: restaurants, error: restaurantsError } = await supabase
            .from('restaurants')
            .select('id, name');

        if (restaurantsError) {
            throw new Error(`Error fetching restaurants: ${restaurantsError.message}`);
        }

        console.log(`📍 Found ${restaurants.length} restaurants\n`);

        // Clear existing menu items
        console.log('🗑️  Clearing existing menu items...');
        const { error: deleteError } = await supabase
            .from('menu_items')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
            console.warn(`⚠️  Warning clearing menu items: ${deleteError.message}`);
        }

        // Insert menu items for each restaurant
        let totalInserted = 0;

        for (const menuData of menuItemsData) {
            const restaurant = restaurants.find(r => r.name === menuData.restaurant_name);

            if (!restaurant) {
                console.log(`⚠️  Restaurant "${menuData.restaurant_name}" not found, skipping...`);
                continue;
            }

            const itemsToInsert = menuData.items.map(item => ({
                restaurant_id: restaurant.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                available: true
            }));

            const { data, error } = await supabase
                .from('menu_items')
                .insert(itemsToInsert)
                .select();

            if (error) {
                console.error(`❌ Error inserting items for ${restaurant.name}:`, error.message);
                continue;
            }

            totalInserted += data.length;
            console.log(`✅ ${restaurant.name}: ${data.length} items added`);
        }

        console.log(`\n🎉 Seeding completed! Total items inserted: ${totalInserted}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

// Run the seeder
seedMenuItems();
