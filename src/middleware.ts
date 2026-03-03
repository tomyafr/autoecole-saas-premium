import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('autodrive_session')?.value;
    const { pathname } = request.nextUrl;

    // Protéger toutes les routes /dashboard/*
    if (pathname.startsWith('/dashboard')) {
        const payload = await verifySession(sessionCookie);

        // Si pas de session valide, rediriger vers login
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Vérification des droits basiques (RBAC) au niveau route
        if (pathname.startsWith('/dashboard/admin') && payload.role !== 'admin') {
            return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
        }

        if (pathname.startsWith('/dashboard/moniteur') && payload.role !== 'moniteur' && payload.role !== 'admin') {
            return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
        }
    }

    // Rediriger / vers /dashboard s'il est déjà connecté
    if (pathname === '/' || pathname === '/login') {
        const payload = await verifySession(sessionCookie);
        if (payload) {
            return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
