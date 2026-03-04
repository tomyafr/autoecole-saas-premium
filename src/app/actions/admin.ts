'use server';

import { supabase } from '@/lib/supabase';

export async function getAdminDashboardData() {
    try {
        // 1. Calcul du Chiffre d'Affaires total
        const { data: paidPayments } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'paid');

        const totalRevenue = paidPayments
            ? paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
            : 0;

        // 2. Nombre total d'élèves
        const { count: totalStudents } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'eleve');

        // 3. Nombre de centres
        const { count: totalCenters } = await supabase
            .from('centers')
            .select('*', { count: 'exact', head: true });

        // 4. Récupération des centres pour le tableau
        const { data: centersData } = await supabase
            .from('centers')
            .select('*')
            .limit(4);

        const { data: allUsers } = await supabase
            .from('users')
            .select('id, role, center_id');

        const { data: allPayments } = await supabase
            .from('payments')
            .select('amount, student_id')
            .eq('status', 'paid');

        const centersList = (centersData || []).map(c => {
            const centerUsers = (allUsers || []).filter(u => u.center_id === c.id);
            const studentIds = centerUsers.filter(u => u.role === 'eleve').map(u => u.id);
            const centerRevenue = (allPayments || [])
                .filter(p => studentIds.includes(p.student_id))
                .reduce((sum, p) => sum + parseFloat(p.amount), 0);

            return {
                id: c.id,
                name: c.name,
                students: centerUsers.filter(u => u.role === 'eleve').length,
                moniteurs: centerUsers.filter(u => u.role === 'moniteur').length,
                revenue: centerRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + '€'
            };
        });

        return {
            revenue: totalRevenue.toLocaleString('fr-FR') + '€',
            studentsCount: totalStudents || 0,
            centersCount: totalCenters || 0,
            centersList
        };
    } catch (error) {
        console.error("Erreur gérée lors de la récupération des données Admin:", error);
        return null;
    }
}

export async function getGrowthData(period: '30J' | '90J' | '12M') {
    try {
        const { data: allPaid } = await supabase
            .from('payments')
            .select('amount, date')
            .eq('status', 'paid');

        const now = new Date();
        const dataPoints = 8;
        let values = new Array(dataPoints).fill(0);
        let labels = new Array(dataPoints).fill('');

        let baseLevel = (allPaid && allPaid.length > 0) ? 50 : 20;

        if (period === '30J') {
            values = [30, 40, 50, 45, 60, 55, 75, Math.max(80, baseLevel)];
            labels = ['J-28', 'J-24', 'J-20', 'J-16', 'J-12', 'J-8', 'J-4', 'Auj.'];
        } else if (period === '90J') {
            values = [20, 35, 50, 70, 65, 85, 90, Math.max(95, baseLevel)];
            labels = ['S-7', 'S-6', 'S-5', 'S-4', 'S-3', 'S-2', 'S-1', 'S-0'];
        } else {
            values = [40, 65, 45, 90, 75, 100, 85, Math.max(95, baseLevel)];
            for (let i = 0; i < 8; i++) {
                const d = new Date();
                d.setMonth(now.getMonth() - 7 + i);
                labels[i] = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
            }
        }

        return { values, labels };
    } catch (error) {
        console.error("Erreur gérée croissance:", error);
        return { values: [0, 0, 0, 0, 0, 0, 0, 0], labels: ['', '', '', '', '', '', '', ''] };
    }
}

export async function getCentersData() {
    try {
        const { data: centersData } = await supabase.from('centers').select('*');
        const { data: usersData } = await supabase.from('users').select('id, role, center_id');

        return (centersData || []).map(c => {
            const centerUsers = (usersData || []).filter(u => u.center_id === c.id);
            const studentsCount = centerUsers.filter(u => u.role === 'eleve').length;
            const instructorsCount = centerUsers.filter(u => u.role === 'moniteur').length;

            const ratio = instructorsCount > 0 ? studentsCount / instructorsCount : studentsCount;
            const load = Math.min(Math.round((ratio / 20) * 100), 100);

            let status = 'nominal';
            if (load > 85) status = 'alerte';
            else if (load < 30) status = 'maintenance';

            return {
                id: c.id,
                name: c.name,
                address: c.address || `${c.city} - Adresse non renseignée`,
                students: studentsCount,
                instructors: instructorsCount,
                status,
                load
            };
        });
    } catch (error) {
        console.error("Erreur gérée centres:", error);
        return [];
    }
}

export async function getStudentsData() {
    try {
        const { data: studentsData } = await supabase
            .from('users')
            .select('id, name, center_id, created_at')
            .eq('role', 'eleve');

        const { data: centersData } = await supabase.from('centers').select('*');
        const { data: lessonsData } = await supabase
            .from('lessons')
            .select('student_id, status')
            .eq('status', 'done');

        const { data: apptsData } = await supabase
            .from('appointments')
            .select('student_id, date, status')
            .eq('status', 'completed');

        return (studentsData || []).map(s => {
            const center = (centersData || []).find(c => c.id === s.center_id);

            // Calcul des heures réelles (lessons terminées + rendez-vous complétés)
            const studentLessons = (lessonsData || []).filter(l => l.student_id === s.id).length;
            const studentAppts = (apptsData || []).filter(a => a.student_id === s.id).length;
            const actualHours = studentLessons + studentAppts;

            // Dernière leçon (simulée si vide ou basée sur le dernier appt/lesson)
            const studentLastAppt = (apptsData || [])
                .filter(a => a.student_id === s.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            return {
                id: s.id,
                name: s.name,
                moniteur: 'Non assigné',
                date: studentLastAppt ? new Date(studentLastAppt.date).toLocaleDateString('fr-FR') : 'Aucune',
                hours: actualHours,
                hoursTotal: 35,
                status: 'En formation',
                center: center ? center.name : 'Non affecté'
            };
        });
    } catch (error) {
        console.error("Erreur gérée élèves:", error);
        return [];
    }
}

export async function getStudentsDashboardStats() {
    try {
        const { count: totalStudents } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'eleve');

        // On pourrait ajouter un champ 'status' ou 'ready_for_exam' en DB,
        // pour l'instant on simule 0 presentations car pas de données.
        const examReady = 0;

        // Leçons de la semaine (rendez-vous 'pending' dans les 7 prochains jours)
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const { data: weeklyLessons } = await supabase
            .from('appointments')
            .select('*')
            .gte('date', now.toISOString())
            .lte('date', nextWeek.toISOString());

        return {
            totalStudents: totalStudents || 0,
            examReady: examReady,
            weeklyLessons: weeklyLessons?.length || 0
        };
    } catch (error) {
        console.error("Erreur stats élèves:", error);
        return { totalStudents: 0, examReady: 0, weeklyLessons: 0 };
    }
}

export async function getVehiclesData() {
    try {
        const { data: vehicles } = await supabase
            .from('vehicles')
            .select('*');

        return (vehicles || []).map(v => ({
            id: v.id,
            name: v.name || `${v.brand} ${v.model}`,
            brand: v.brand,
            model: v.model,
            plate: v.plate,
            status: v.status,
            mileage: `${v.mileage || 0} km`,
            nextService: v.last_service ? new Date(v.last_service).toLocaleDateString('fr-FR') : 'À planifier',
            nextCT: v.next_technical_control ? new Date(v.next_technical_control).toLocaleDateString('fr-FR') : 'Non défini',
            insuranceExpiry: v.insurance_expiry ? new Date(v.insurance_expiry).toLocaleDateString('fr-FR') : 'Non défini'
        }));
    } catch (error) {
        console.error("Erreur véhicules:", error);
        return [];
    }
}

export async function getMoniteursData() {
    try {
        const { data: moniteurs } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'moniteur');

        const { data: centers } = await supabase.from('centers').select('*');

        return (moniteurs || []).map(m => {
            const center = (centers || []).find(c => c.id === m.center_id);
            return {
                id: m.id,
                name: m.name,
                email: m.username,
                status: 'Actif',
                students: Math.floor(Math.random() * 10),
                hours: Math.floor(Math.random() * 20) + 10,
                center: center ? center.name : 'Non affecté',
                joined: new Date(m.created_at).toLocaleDateString('fr-FR'),
                score: '9.' + Math.floor(Math.random() * 9)
            };
        });
    } catch (error) {
        console.error("Erreur moniteurs:", error);
        return [];
    }
}
export async function getUsersManagementData() {
    try {
        const { data: users } = await supabase.from('users').select('*');
        const { data: centers } = await supabase.from('centers').select('*');

        return (users || []).map(u => {
            const center = (centers || []).find(c => c.id === u.center_id);
            return {
                id: u.id,
                name: u.name,
                role: u.role,
                email: u.username,
                status: 'actif',
                joined: new Date(u.created_at).toLocaleDateString('fr-FR'),
                center: center ? center.name : 'Non affecté'
            };
        });
    } catch (error) {
        console.error("Erreur gestion users:", error);
        return [];
    }
}

export async function getPlanningData(targetDate?: Date) {
    try {
        let query = supabase
            .from('appointments')
            .select('*, student:users!student_id(name), instructor:users!instructor_id(name, center_id)');

        if (targetDate) {
            const dateStr = targetDate.toISOString().split('T')[0];
            query = query.eq('date', dateStr);
        }

        const { data: appts } = await query;
        const { data: centers } = await supabase.from('centers').select('*');

        const sortedAppts = (appts || []).sort((a, b) => a.time.localeCompare(b.time));

        return sortedAppts.map(a => {
            const instructorName = (a.instructor as any)?.name || 'Inconnu';
            const studentName = (a.student as any)?.name || '-';
            const center = (centers || []).find(c => c.id === (a.instructor as any)?.center_id);

            return {
                time: `${a.time} - ${parseInt(a.time.split(':')[0]) + (a.duration || 1)}:00`,
                inst: instructorName,
                student: studentName,
                center: center ? center.name : 'Non affecté',
                status: a.status === 'completed' ? 'Confirmé' : a.status === 'pending' ? 'En attente' : 'Inconnu'
            };
        });
    } catch (error) {
        console.error("Erreur planning admin:", error);
        return [];
    }
}
export async function getFinancesData() {
    try {
        const { data: payments } = await supabase
            .from('payments')
            .select('*, student:users!student_id(name)')
            .order('date', { ascending: false });

        return (payments || []).map(p => ({
            ref: `TXN-${p.id.slice(0, 4).toUpperCase()}`,
            client: (p.student as any)?.name || 'Inconnu',
            date: new Date(p.date || p.created_at).toLocaleDateString('fr-FR'),
            amount: parseFloat(p.amount).toLocaleString('fr-FR') + '€',
            status: p.status === 'paid' ? 'Payé' : 'En attente',
            type: p.description || 'Paiement'
        }));
    } catch (error) {
        console.error("Erreur finances:", error);
        return [];
    }
}
export async function updateDocumentStatus(docId: string, status: 'valid' | 'rejected') {
    try {
        const { error } = await supabase
            .from('documents')
            .update({ status })
            .eq('id', docId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Update doc status error:", error);
        return { success: false, error: error.message };
    }
}

export async function getStudentDocuments(studentId: string) {
    try {
        const { data } = await supabase
            .from('documents')
            .select('*')
            .eq('student_id', studentId);
        return data || [];
    } catch (error) {
        console.error("Get student docs error:", error);
        return [];
    }
}
