import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

function verifyBasicAuth(req: NextRequest) {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
        return { ok: false, status: 500, error: 'Admin env missing' };
    }

    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        try {
            const decoded = atob(authValue);
            const [user, pwd] = decoded.split(':');

            if (user === adminUser && pwd === adminPass) {
                return { ok: true };
            }
        } catch (e) {
            // Ignore decoding errors, treat as invalid auth
        }
    }

    return { ok: false, status: 401, error: 'Auth required' };
}

function getAuthErrorResponse(status: number, message: string) {
    if (status === 401) {
        return new NextResponse(JSON.stringify({ ok: false, error: message }), {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin"',
                'Content-Type': 'application/json',
            },
        });
    }
    return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: NextRequest) {
    const auth = verifyBasicAuth(req);
    if (!auth.ok) {
        return getAuthErrorResponse(auth.status!, auth.error!);
    }

    const filePath = path.join(process.cwd(), 'data', 'products.json');

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(fileContents);
        const response = NextResponse.json({ ok: true, products });
        response.headers.set('Cache-Control', 'no-store');
        return response;
    } catch (error) {
        console.error('Error reading products.json:', error);
        return NextResponse.json(
            { ok: false, error: 'Failed to read products data' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const auth = verifyBasicAuth(req);
    if (!auth.ok) {
        return getAuthErrorResponse(auth.status!, auth.error!);
    }

    try {
        const body = await req.json();

        if (!body || !Array.isArray(body.products)) {
            return NextResponse.json(
                { ok: false, error: 'validation_error' },
                { status: 400 }
            );
        }

        const { products } = body;

        for (const item of products) {
            if (
                typeof item.title !== 'string' ||
                typeof item.slug !== 'string' ||
                typeof item.priceFrom !== 'number'
            ) {
                return NextResponse.json(
                    { ok: false, error: 'validation_error: required fields missing' },
                    { status: 400 }
                );
            }
        }

        const filePath = path.join(process.cwd(), 'data', 'products.json');
        await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');

        const response = NextResponse.json({ ok: true });
        response.headers.set('Cache-Control', 'no-store');
        return response;
    } catch (error) {
        console.error('Error updating products.json:', error);
        return NextResponse.json(
            { ok: false, error: 'Failed to update products data' },
            { status: 500 }
        );
    }
}
