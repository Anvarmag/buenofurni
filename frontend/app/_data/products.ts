export type UpholsteryType = "Микровелюр" | "Букле" | "Экокожа";
export type LegsColorType = "Светлый дуб" | "Тёмный орех";
export type AvailabilityType = "in-stock" | "made-to-order";

export interface Product {
    slug: string;
    title: string;
    priceFrom: number;
    availability: AvailabilityType;
    badges: string[];
    upholstery: UpholsteryType;
    legsColor: LegsColorType;
    imagePath: string;
    shortDescription: string;
}

export const products: Product[] = [
    {
        slug: "omega-boucle-light",
        title: 'Стул "Омега" Букле',
        priceFrom: 6500,
        availability: "in-stock",
        badges: ["Хит"],
        upholstery: "Букле",
        legsColor: "Светлый дуб",
        imagePath: "/generated/chair_beige_1772141177229.png",
        shortDescription: "Самая популярная модель в нашей линейке с трендовой обивкой.",
    },
    {
        slug: "sigma-microvelour-dark",
        title: 'Стул "Сигма" Велюр',
        priceFrom: 5500,
        availability: "in-stock",
        badges: [],
        upholstery: "Микровелюр",
        legsColor: "Тёмный орех",
        imagePath: "/generated/chair_olive_1772141156483.png",
        shortDescription: "Классическая форма с бархатистым изумрудным велюром.",
    },
    {
        slug: "alto-ecoleather-dark",
        title: 'Стул "Альто" Кожа',
        priceFrom: 7200,
        availability: "made-to-order",
        badges: ["B2B Выбор"],
        upholstery: "Экокожа",
        legsColor: "Тёмный орех",
        imagePath: "/generated/chair_gray_1772141189527.png",
        shortDescription: "Премиальная экокожа, идеален для ресторанов и современных столовых.",
    },
    {
        slug: "luna-microvelour-light",
        title: 'Стул "Луна" Велюр',
        priceFrom: 5800,
        availability: "in-stock",
        badges: ["Новинка"],
        upholstery: "Микровелюр",
        legsColor: "Светлый дуб",
        imagePath: "/generated/chair_beige_1772141177229.png",
        shortDescription: "Мягкие плавные линии спинки и нежный бежевый оттенок.",
    },
    {
        slug: "terra-ecoleather-dark",
        title: 'Кресло "Терра" Кожа',
        priceFrom: 12500,
        availability: "made-to-order",
        badges: ["Премиум"],
        upholstery: "Экокожа",
        legsColor: "Тёмный орех",
        imagePath: "/generated/hero_chair_v3.png",
        shortDescription: "Брутальное черное кресло для переговорных и рабочих кабинетов.",
    },
    {
        slug: "nova-boucle-dark",
        title: 'Стул "Нова" Букле',
        priceFrom: 6800,
        availability: "in-stock",
        badges: ["Хит"],
        upholstery: "Букле",
        legsColor: "Тёмный орех",
        imagePath: "/generated/chair_gray_1772141189527.png",
        shortDescription: "Игра контрастов: белое букле и насыщенный тёмный орех каркаса.",
    },
    {
        slug: "scandi-ecoleather-light",
        title: 'Стул "Сканди" Кожа',
        priceFrom: 6100,
        availability: "in-stock",
        badges: [],
        upholstery: "Экокожа",
        legsColor: "Светлый дуб",
        imagePath: "/generated/chair_beige_1772141177229.png",
        shortDescription: "Теплый оттенок camel и светлый дуб для скандинавских интерьеров.",
    },
    {
        slug: "nexus-custom",
        title: 'Стул "Нексус" (На заказ)',
        priceFrom: 8500,
        availability: "made-to-order",
        badges: ["Индивидуальный цвет"],
        upholstery: "Микровелюр",
        legsColor: "Светлый дуб",
        imagePath: "/generated/chair_olive_1772141156483.png",
        shortDescription: "Базовая модель с возможностью выкраса ножек в любой цвет RAL.",
    },
    {
        slug: "loft-horeca-series",
        title: 'Стул барный "Лофт"',
        priceFrom: 7900,
        availability: "made-to-order",
        badges: ["Для бара"],
        upholstery: "Экокожа",
        legsColor: "Тёмный орех",
        imagePath: "/generated/chair_gray_1772141189527.png",
        shortDescription: "Усиленная конструкция для барных стоек и высоких столов.",
    }
];
