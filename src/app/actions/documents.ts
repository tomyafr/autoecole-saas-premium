'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getAdminDocuments() {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select(`
                *,
                student:users!student_id(id, name, email)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateDocumentStatus(docId: string, status: 'valid' | 'rejected') {
    try {
        const { error } = await supabase
            .from('documents')
            .update({ status })
            .eq('id', docId);

        if (error) throw error;

        revalidatePath('/dashboard/admin/documents');
        revalidatePath('/dashboard/eleve/documents');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
