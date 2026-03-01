import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Контакты | BUENOFURNI',
    description: 'Мы всегда на связи. Свяжитесь с нами для обсуждения вашего заказа.',
};

export default function ContactsPage() {
    return (
        <main className="bg-[var(--background)] min-h-screen pt-32 sm:pt-40 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                <div className="text-center mb-16 sm:mb-24">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black mb-6">
                        Контакты
                    </h1>
                    <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
                        Будем рады ответить на ваши вопросы и обсудить детали заказа!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Contacts Card */}
                    <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-black/5 flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold mb-8">Связаться с нами</h2>

                        <div className="space-y-8 lg:space-y-10">
                            <div>
                                <p className="text-sm font-medium text-[var(--muted)] mb-2 uppercase tracking-wider">Телефон</p>
                                <a href="tel:+79930940807" className="text-xl sm:text-2xl font-medium hover:text-[var(--accent)] transition-colors inline-flex items-center gap-3">
                                    +7 993 094-08-07
                                </a>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[var(--muted)] mb-2 uppercase tracking-wider">Email</p>
                                <a href="mailto:buenofurni@yandex.ru" className="text-xl sm:text-2xl font-medium hover:text-[var(--accent)] transition-colors">
                                    buenofurni@yandex.ru
                                </a>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[var(--muted)] mb-4 uppercase tracking-wider">Мессенджеры</p>
                                <a href="https://t.me/buenofurni_support" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#2AABEE] text-white px-8 py-4 font-medium hover:opacity-90 transition-opacity">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.666 3.475-1.512 5.792-2.512 6.95-2.997 3.303-1.385 3.99-1.624 4.435-1.63z" /></svg>
                                    Написать в Telegram
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-transparent p-8 sm:p-12 rounded-[2rem] border border-black/10 flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold mb-8">Часы работы</h2>

                        <ul className="space-y-6 lg:space-y-8">
                            <li className="flex justify-between items-center border-b border-black/5 pb-6">
                                <span className="text-[var(--muted)]">Пн - Пт</span>
                                <span className="font-medium text-lg">10:00 – 19:00</span>
                            </li>
                            <li className="flex justify-between items-center pb-2">
                                <span className="text-[var(--muted)]">Сб - Вс</span>
                                <span className="font-medium text-lg">Выходной</span>
                            </li>
                        </ul>

                        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                            <p className="text-sm leading-relaxed text-[var(--muted)]">
                                Оставьте заявку на сайте, и наш менеджер свяжется с вами в течение часа рабочего времени.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
