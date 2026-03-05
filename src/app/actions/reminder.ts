'use server';

import { sendEmail, buildReminderEmail } from '@/lib/mailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function sendManualReminder(appointmentId: string) {
    try {
        const { data: appt, error } = await supabase
            .from('appointments')
            .select(`
                id, date, time, type,
                student:users!student_id(name, email),
                instructor:users!instructor_id(name)
            `)
            .eq('id', appointmentId)
            .single();

        if (error || !appt) {
            return { success: false, error: 'Rendez-vous introuvable' };
        }

        const student = appt.student as any;
        const instructor = appt.instructor as any;

        if (!student?.email) {
            return { success: false, error: 'Cet élève n\'a pas d\'adresse email renseignée' };
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
            await supabase
                .from('appointments')
                .update({ reminder_sent: true })
                .eq('id', appointmentId);
        }

        return result;
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
