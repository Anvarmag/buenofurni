import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

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
        } catch {
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

        // Generate a clean base name (no extension), unique
        const rawName = file.name.replace(/\.[^.]+$/, ''); // strip extension
        const cleanName = rawName.replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase();
        const uniqueBase = `${Date.now()}_${cleanName}`;

        const uploadDir = path.join(process.cwd(), 'public', 'generated');
        await fs.mkdir(uploadDir, { recursive: true });

        const mainFileName = `${uniqueBase}.webp`;
        const thumbFileName = `${uniqueBase}_thumb.webp`;

        const mainFilePath = path.join(uploadDir, mainFileName);
        const thumbFilePath = path.join(uploadDir, thumbFileName);

        // Full-size: max 1600px wide, WebP quality 82, no upscale
        await sharp(buffer)
            .rotate()
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(mainFilePath);

        await sharp(buffer)
            .rotate()
            .resize({ width: 400, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(thumbFilePath);

        return NextResponse.json({
            ok: true,
            imagePath: `/generated/${mainFileName}`,
            thumbPath: `/generated/${thumbFileName}`,
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ ok: false, error: 'Failed to upload image' }, { status: 500 });
    }
}
