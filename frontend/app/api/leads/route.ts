import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { name?: string; phone?: string };

function clean(s: string, max = 80) {
    return s.replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanPhone(s: string) {
    return s.replace(/[^\d+]/g, "").slice(0, 20);
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;

        const name = body.name ? clean(body.name, 60) : "";
        const phone = body.phone ? cleanPhone(clean(body.phone, 40)) : "";

        if (!name || !phone) {
            return NextResponse.json({ ok: false, error: "name_and_phone_required" }, { status: 400 });
        }

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            return NextResponse.json({ ok: false, error: "telegram_env_missing" }, { status: 500 });
        }

        const text =
            `BUENOFURNI - Новая заявка\n` +
            `Имя: ${name}\n` +
            `Телефон: ${phone}\n` +
            `Дата: ${new Date().toISOString()}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                disable_web_page_preview: true,
            }),
        });

        if (!tgRes.ok) {
            const details = await tgRes.text().catch(() => "");
            return NextResponse.json(
                { ok: false, error: "telegram_send_failed", details: details.slice(0, 400) },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: "unexpected_error", details: String(e?.message || e) },
            { status: 500 }
        );
    }
}