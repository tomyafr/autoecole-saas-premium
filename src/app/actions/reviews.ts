'use server';

import { supabase } from '@/lib/supabase';

export async function submitReview(data: {
    student_id: string;
    instructor_id: string;
    lesson_id: string;
    rating: number;
    comment: string;
}) {
    try {
        const { error } = await supabase
            .from('reviews')
            .insert([data]);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Submit review error:", error);
        return { success: false, error: error.message };
    }
}

export async function getInstructorAverageRating(instructorId: string) {
    try {
        const { data } = await supabase
            .from('reviews')
            .select('rating')
            .eq('instructor_id', instructorId);

        if (!data || data.length === 0) return 0;
        const sum = data.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / data.length) * 10) / 10;
    } catch (error) {
        console.error("Get instructor rating error:", error);
        return 0;
    }
}
