'use server';

import { supabase } from '@/lib/supabase';

/**
 * Simule l'envoi d'un message WhatsApp via une intégration n8n ou API.
 * Dans une production réeelle, cela ferait un fetch vers un webhook.
 */
export async function sendWhatsAppNotification(to: string, message: string) {
    try {
        console.log(`[SIMULATION WHATSAPP] To: ${to}, Message: ${message}`);

        // Simuler un appel API
        // const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
        //     method: 'POST',
        //     body: JSON.stringify({ to, message })
        // });

        return { success: true };
    } catch (error) {
        console.error("Erreur envoi notification WhatsApp:", error);
        return { success: false, error };
    }
}

export async function remindStudent(appointmentId: string) {
    try {
        const { data: appointment, error: fetchError } = await supabase
            .from('appointments')
            .select('*, student:users!student_id(*)')
            .eq('id', appointmentId)
            .single();

        if (fetchError || !appointment) throw fetchError || new Error("RDV non trouvé");

        const student = appointment.student;
        if (!student.phone) {
            return { success: false, error: "Pas de numéro de téléphone pour cet élève." };
        }

        const dateStr = new Date(appointment.date).toLocaleDateString('fr-FR');
        const message = `Bonjour ${student.name}, votre leçon de conduite est prévue le ${dateStr} à ${appointment.time}. Merci de confirmer votre présence. À bientôt !`;

        const res = await sendWhatsAppNotification(student.phone, message);

        if (res.success) {
            await supabase
                .from('appointments')
                .update({ reminder_sent: true })
                .eq('id', appointmentId);
        }

        return res;
    } catch (error) {
        console.error("Erreur rappel élève:", error);
        return { success: false, error };
    }
}
