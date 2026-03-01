import { useModal } from "@/app/providers";
import BaseModal from "./BaseModal";

// Функция для форматирования номера телефона: +7 (999) 000-00-00
const formatPhoneNumber = (value: string) => {
    if (["+7", "+7 ", "+7 (", "+7(", "+"].includes(value)) return "";

    let digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Игнорируем первую 7/8 если они набраны как первая цифра 
    if (digits[0] === "7" || digits[0] === "8") {
        digits = digits.substring(1);
    }

    if (digits.length === 0) return "+7 (";

    let result = "+7 (";
    result += digits.substring(0, 3);
    if (digits.length >= 4) result += `) ${digits.substring(3, 6)}`;
    if (digits.length >= 7) result += `-${digits.substring(6, 8)}`;
    if (digits.length >= 9) result += `-${digits.substring(8, 10)}`;

    return result;
};

export default function HorecaRequestModal() {
    const { modalState, closeModal } = useModal();

    return (
        <BaseModal
            isOpen={modalState.isOpen && modalState.type === "b2b"}
            onClose={closeModal}
            leadType="b2b"
            source={modalState.source}
            title="Получить коммерческое предложение"
            subtitle="Оставьте контакты для обсуждения оптовых поставок мебели (HoReCa)."
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="b2b-company" className="mb-2 block text-sm font-medium">Компания / Проект</label>
                    <input
                        id="b2b-company"
                        name="company"
                        type="text"
                        required
                        placeholder="Название ресторана или бюро"
                        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <div>
                    <label htmlFor="b2b-name" className="mb-2 block text-sm font-medium">Контактное лицо</label>
                    <input
                        id="b2b-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Как к вам обращаться"
                        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="b2b-phone" className="mb-2 block text-sm font-medium">Телефон</label>
                        <input
                            id="b2b-phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="+7 (999) 000-00-00"
                            minLength={18}
                            maxLength={18}
                            onChange={(e) => {
                                e.target.value = formatPhoneNumber(e.target.value);
                            }}
                            className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
                    <div>
                        <label htmlFor="b2b-quantity" className="mb-2 block text-sm font-medium">Кол-во стульев</label>
                        <input
                            id="b2b-quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            placeholder="от 10 шт"
                            className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="b2b-comment" className="mb-2 block text-sm font-medium">Комментарий (необязательно)</label>
                    <textarea
                        id="b2b-comment"
                        name="comment"
                        rows={2}
                        placeholder="Особые пожелания или сроки..."
                        className="w-full resize-none rounded-2xl border border-black/10 bg-white px-5 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>
            </div>
        </BaseModal>
    );
}
