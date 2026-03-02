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
        { name: 'Sophie Martin', username: 'admin', password: 'admin54', role: 'admin', avatar: 'SM', centerId: primaryCenterId },
        { name: 'Marc Dupont', username: 'moniteur', password: 'moniteur54', role: 'moniteur', avatar: 'MD', centerId: primaryCenterId },
        { name: 'Jean Roche', username: 'moniteur2', password: 'moniteur54', role: 'moniteur', avatar: 'JR', centerId: primaryCenterId },
        { name: 'Lucas Bernard', username: 'eleve', password: 'eleve54', role: 'eleve', avatar: 'LB', centerId: primaryCenterId },
        { name: 'Emma Petit', username: 'emma.p', password: 'eleve54', role: 'eleve', avatar: 'EP', centerId: primaryCenterId },
        { name: 'Hugo Roux', username: 'hugo.r', password: 'eleve54', role: 'eleve', avatar: 'HR', centerId: primaryCenterId },
        { name: 'Chloé Moreau', username: 'chloe.m', password: 'eleve54', role: 'eleve', avatar: 'CM', centerId: primaryCenterId },
        { name: 'Leo Martin', username: 'leo.m', password: 'eleve54', role: 'eleve', avatar: 'LM', centerId: primaryCenterId },
        { name: 'Lina Dubois', username: 'lina.d', password: 'eleve54', role: 'eleve', avatar: 'LD', centerId: primaryCenterId },
    ]).returning();

    const moniteurId = users.find(u => u.username === 'moniteur')!.id;
    const eleveId = users.find(u => u.username === 'eleve')!.id;
    const emmaId = users.find(u => u.username === 'emma.p')!.id;
    const hugoId = users.find(u => u.username === 'hugo.r')!.id;
    const chloeId = users.find(u => u.username === 'chloe.m')!.id;

    // 4. Insert Appointments (Sessions à venir)
    const today = new Date();

    await db.insert(schema.appointments).values([
        { studentId: eleveId, instructorId: moniteurId, date: today, time: '09:00', type: 'Conduite Ville', status: 'completed' }, // Lucas (done in UI ideally)
        { studentId: emmaId, instructorId: moniteurId, date: today, time: '10:30', type: 'Autoroute A86', status: 'completed' }, // Emma (done)
        { studentId: hugoId, instructorId: moniteurId, date: today, time: '14:00', type: 'Manoeuvres', status: 'pending' }, // Hugo (upcoming)
        { studentId: chloeId, instructorId: moniteurId, date: today, time: '15:30', type: 'Examen Blanc', status: 'pending' }, // Chloe (upcoming)
        { studentId: eleveId, instructorId: moniteurId, date: new Date(today.getTime() + 86400000 * 2), time: '11:00', type: 'Examen Blanc', status: 'pending' },
    ]);

    // 5. Insert Lessons (History & Evaluations)
    await db.insert(schema.lessons).values([
        { studentId: eleveId, instructorId: moniteurId, title: 'Conduite Ville', score: 18, date: today, status: 'done' }, // Correspond to Lucas 09:00
        { studentId: emmaId, instructorId: moniteurId, title: 'Autoroute A86', score: 17, date: today, status: 'done' }, // Correspond to Emma 10:30
        { studentId: eleveId, instructorId: moniteurId, title: 'Démarrage & Embrayage', score: 18, date: new Date(today.getTime() - 86400000 * 2), status: 'done' },
        { studentId: eleveId, instructorId: moniteurId, title: 'Contrôle en milieu urbain', score: 15, date: new Date(today.getTime() - 86400000 * 4), status: 'done' },
    ]);

    // 6. Insert Payments
    await db.insert(schema.payments).values([
        { studentId: eleveId, amount: "1200.00", description: 'Forfait 35h - Pack Sérénité', status: 'paid', date: new Date('2026-01-15') },
        { studentId: eleveId, amount: "45.00", description: 'Livre de code', status: 'paid', date: new Date('2026-01-16') },
        { studentId: emmaId, amount: "890.00", description: 'Pack Initial', status: 'paid', date: new Date('2026-02-01') },
    ]);

    console.log('Seeding finished successfully.');
}

main().catch(e => {
    console.error('Seeding failed:');
    console.error(e);
    process.exit(1);
});
