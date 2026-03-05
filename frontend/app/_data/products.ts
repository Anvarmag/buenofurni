export type UpholsteryType = "Микровелюр" | "Букле" | "Экокожа";
export type LegsColorType = "Орех" | "Светло коричневый" | "Коричневый" | "Натуральный" | "Черный";
export type LegsMaterialType = "Березовая фанера" | "Массив березы" | "Массив дуба" | "Массив бука";
export type CategoryType = "Стулья" | "Барные стулья" | "Табуретки" | "Столы";
export type AvailabilityType = "in-stock" | "made-to-order";

export interface Product {
    id?: string;
    slug: string;
    title: string;
    category?: CategoryType;
    priceFrom: number;
    availability: AvailabilityType;
    badges: string[];
    upholstery: UpholsteryType;
    legsColor: LegsColorType;
    legsMaterial?: LegsMaterialType;
    imagePath: string;
    galleryImages?: string[];
    shortDescription: string;
    sku?: string;
    tags?: string[];
}

