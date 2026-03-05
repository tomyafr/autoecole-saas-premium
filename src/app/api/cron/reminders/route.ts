import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, buildReminderEmail } from '@/lib/mailer';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    // Sécurité : vérifier le token CRON
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Chercher les RDV de demain qui n'ont pas encore eu de rappel
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const { data: appointments, error } = await supabase
            .from('appointments')
            .select(`
                id, date, time, type, status, reminder_sent,
                student:users!student_id(id, name, email),
                instructor:users!instructor_id(name)
            `)
            .eq('status', 'pending')
            .eq('reminder_sent', false)
            .gte('date', `${tomorrowStr}T00:00:00`)
            .lte('date', `${tomorrowStr}T23:59:59`);

        if (error) {
            console.error('Erreur fetch appointments:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!appointments || appointments.length === 0) {
            return NextResponse.json({ message: 'Aucun rappel à envoyer', sent: 0 });
        }

        let sent = 0;
        let errors = 0;

        for (const appt of appointments) {
            const student = appt.student as any;
            const instructor = appt.instructor as any;

            if (!student?.email) {
                console.log(`Pas d'email pour ${student?.name}, skip`);
                continue;
            }

            const dateFormatted = new Date(appt.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const html = buildReminderEmail(
                student.name,
                dateFormatted,
                appt.time,
                instructor?.name || 'Non assigné',
                appt.type || 'Session de conduite'
            );

            const result = await sendEmail({
                to: student.email,
                subject: `🚗 Rappel AutoDrive — Votre session du ${dateFormatted}`,
                html,
            });

            if (result.success) {
                // Marquer comme envoyé
                await supabase
                    .from('appointments')
                    .update({ reminder_sent: true })
                    .eq('id', appt.id);
                sent++;
            } else {
                errors++;
                console.error(`Erreur email pour ${student.name}:`, result.error);
            }
        }

        return NextResponse.json({
            message: `Rappels traités`,
            total: appointments.length,
            sent,
            errors,
            date: tomorrowStr,
        });
    } catch (e: any) {
        console.error('Erreur cron rappels:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
