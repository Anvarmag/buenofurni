import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;

    if (url.pathname.startsWith('/admin')) {
        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASS;

        if (!adminUser || !adminPass) {
            return new NextResponse('Admin env missing', { status: 500 });
        }

        const basicAuth = req.headers.get('authorization');

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            if (user === adminUser && pwd === adminPass) {
                return NextResponse.next();
            }
        }

        return new NextResponse('Auth required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin"',
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
