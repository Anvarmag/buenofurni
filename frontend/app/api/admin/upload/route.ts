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

export async function POST(req: NextRequest) {
    const auth = verifyBasicAuth(req);
    if (!auth.ok) {
        return getAuthErrorResponse(auth.status!, auth.error!);
    }

    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ ok: false, error: 'No image provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename, avoid strange characters, ensure lowercase
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '').toLowerCase();
        // Generate unique name to avoid overwriting
        const uniqueName = `${Date.now()}_${cleanName}`;

        const uploadDir = path.join(process.cwd(), 'public', 'generated');
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueName);
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            ok: true,
            imagePath: `/generated/${uniqueName}`
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ ok: false, error: 'Failed to upload image' }, { status: 500 });
    }
}
