import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Connection string from Neon creation
const CONNECTION_STRING = "postgresql://neondb_owner:npg_iJCK9sOPg2Vj@ep-sweet-bonus-afwc255d-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

async function seed() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    });

    try {
        await client.connect();

        // Read JSON
        const jsonPath = resolve(__dirname, '../../restaurants.json');
        const raw = readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);

        console.log(`Initialized seed for ${data.establecimientos.length} restaurants...`);

        for (const establishment of data.establecimientos) {
            console.log(`Processing: ${establishment.nombre}`);

            // 1. Insert Restaurant
            const category = Array.isArray(establishment.tipo_establecimiento)
                ? establishment.tipo_establecimiento[0]
                : establishment.tipo_establecimiento;

            const res = await client.query(`
                INSERT INTO restaurants (name, address, phone, category, rating, description)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `, [
                establishment.nombre,
                establishment.direccion,
                establishment.telefono,
                category,
                establishment.rating,
                `Destacados: ${establishment.destacados.join(', ')}`
            ]);

            const restaurantId = res.rows[0].id;
            console.log(`  -> Created Restaurant ID: ${restaurantId}`);

            // 2. Insert Menu Items
            const getRandomPrice = () => Math.floor(Math.random() * (60 - 25 + 1) + 25);

            for (const itemName of establishment.destacados) {
                await client.query(`
                    INSERT INTO menu_items (restaurant_id, name, price, category, description)
                    VALUES ($1, $2, $3, $4, $5)
                `, [
                    restaurantId,
                    itemName,
                    getRandomPrice(),
                    'Destacado',
                    'Plato recomendado de la casa'
                ]);
            }
            console.log(`  -> Added ${establishment.destacados.length} menu items.`);
        }

        console.log("\n✅ Seeding Complete!");

    } catch (e) {
        console.error("Seed Error:", e);
    } finally {
        await client.end();
    }
}

seed();
