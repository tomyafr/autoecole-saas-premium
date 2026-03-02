import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
        throw new Error('POSTGRES_URL is not defined in .env.local');
    }

    const client = neon(connectionString);
    const db = drizzle(client, { schema });

    console.log('Seeding the database...');

    // 1. Clear existing data
    await db.delete(schema.payments);
    await db.delete(schema.lessons);
    await db.delete(schema.appointments);
    await db.delete(schema.users);
    await db.delete(schema.centers);

    // 2. Insert Center
    const centers = await db.insert(schema.centers).values([
        { name: 'Elite Drive Paris Nord', address: '12 Rue de la Paix', city: 'Paris' },
        { name: 'Elite Drive Lyon', address: '5 Avenue des Alpes', city: 'Lyon' },
    ]).returning();

    const primaryCenterId = centers[0].id;

    // 3. Insert Users
    const users = await db.insert(schema.users).values([
        {
            name: 'Sophie Martin',
            username: 'admin',
            password: 'admin54',
            role: 'admin',
            avatar: 'SM',
            centerId: primaryCenterId,
        },
        {
            name: 'Marc Dupont',
            username: 'moniteur',
            password: 'moniteur54',
            role: 'moniteur',
            avatar: 'MD',
            centerId: primaryCenterId,
        },
        {
            name: 'Jean Roche',
            username: 'moniteur2',
            password: 'moniteur54',
            role: 'moniteur',
            avatar: 'JR',
            centerId: primaryCenterId,
        },
        {
            name: 'Lucas Bernard',
            username: 'eleve',
            password: 'eleve54',
            role: 'eleve',
            avatar: 'LB',
            centerId: primaryCenterId,
        },
    ]).returning();

    const adminId = users.find(u => u.username === 'admin')!.id;
    const moniteurId = users.find(u => u.username === 'moniteur')!.id;
    const moniteur2Id = users.find(u => u.username === 'moniteur2')!.id;
    const eleveId = users.find(u => u.username === 'eleve')!.id;

    // 4. Insert Appointments
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await db.insert(schema.appointments).values([
        {
            studentId: eleveId,
            instructorId: moniteurId,
            date: new Date('2026-03-12'),
            time: '08:00',
            type: 'Conduite urbaine',
            status: 'pending',
        },
        {
            studentId: eleveId,
            instructorId: adminId, // Sophie also teaches in the mock
            date: new Date('2026-03-12'),
            time: '09:30',
            type: 'Code accéléré',
            status: 'pending',
        },
        {
            studentId: eleveId,
            instructorId: moniteur2Id,
            date: new Date('2026-03-15'),
            time: '15:30',
            type: 'Manoeuvres parking',
            status: 'pending',
        },
    ]);

    // 5. Insert Lessons (History)
    await db.insert(schema.lessons).values([
        {
            studentId: eleveId,
            instructorId: moniteurId,
            title: 'Démarrage & Embrayage',
            score: 18,
            date: new Date('2026-02-10'),
            status: 'done',
        },
        {
            studentId: eleveId,
            instructorId: moniteur2Id,
            title: 'Contrôle en milieu urbain',
            score: 15,
            date: new Date('2026-02-08'),
            status: 'done',
        },
    ]);

    // 6. Insert Payments
    await db.insert(schema.payments).values([
        {
            studentId: eleveId,
            amount: "1200.00",
            description: 'Forfait 35h - Pack Sérénité',
            status: 'paid',
            date: new Date('2026-01-15'),
        },
        {
            studentId: eleveId,
            amount: "45.00",
            description: 'Livre de code',
            status: 'paid',
            date: new Date('2026-01-16'),
        }
    ]);

    console.log('Seeding finished successfully.');
}

main().catch(e => {
    console.error('Seeding failed:');
    console.error(e);
    process.exit(1);
});
