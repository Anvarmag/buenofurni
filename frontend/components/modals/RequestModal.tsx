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

export default function RequestModal() {
    const { modalState, closeModal } = useModal();

    return (
        <BaseModal
            isOpen={modalState.isOpen && modalState.type === "b2c"}
            onClose={closeModal}
            leadType="b2c"
            source={modalState.source}
            title="Отправить заявку"
            subtitle="Заполните форму, и мы свяжемся с вами."
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="b2c-name" className="mb-2 block text-sm font-medium">Ваше имя</label>
                    <input
                        id="b2c-name"
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <div>
                    <label htmlFor="b2c-phone" className="mb-2 block text-sm font-medium">Телефон</label>
                    <input
                        id="b2c-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+7 (999) 000-00-00"
                        minLength={18}
                        maxLength={18}
                        onChange={(e) => {
                            e.target.value = formatPhoneNumber(e.target.value);
                        }}
                        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>
            </div>
        </BaseModal>
    );
}
