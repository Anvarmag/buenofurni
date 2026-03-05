'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../_data/products';

export default function AdminCatalogEditor() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/admin/products');
                if (!res.ok) throw new Error('Failed to fetch data');
                const data = await res.json();
                if (data.ok && Array.isArray(data.products)) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error(err);
                setMessage({ text: 'Error loading products', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (index: number, field: keyof Product, value: unknown) => {
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setProducts(newProducts);
    };

    const handleArrayChange = (index: number, field: 'tags' | 'badges', value: string) => {
        const arrayVal = value.split(',').map(s => s.trim()).filter(Boolean);
        handleChange(index, field, arrayVal);
    };

    const handleUploadImage = async (index: number, file: File, isGallery: boolean = false) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok && data.ok) {
                if (isGallery) {
                    const currentGallery = products[index].galleryImages || [];
                    handleChange(index, 'galleryImages', [...currentGallery, data.imagePath]);
                } else {
                    handleChange(index, 'imagePath', data.imagePath);
                }
            } else {
                alert('Ошибка загрузки: ' + (data.error || 'Unknown'));
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при загрузке картинки');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products }),
            });
            const data = await res.json();

            if (res.ok && data.ok) {
                setMessage({ text: 'Успешно сохранено!', type: 'success' });
                router.refresh();
            } else {
                throw new Error(data.error || 'Failed to save');
            }
        } catch (err: unknown) {
            console.error(err);
            setMessage({ text: err instanceof Error ? err.message : 'Ошибка сохранения', type: 'error' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleAddProduct = () => {
        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            slug: `new-product-${Date.now()}`,
            title: 'Новый товар',
            category: 'Стулья',
            priceFrom: 0,
            availability: 'made-to-order',
            badges: [],
            tags: [],
            upholstery: 'Микровелюр',
            legsMaterial: 'Березовая фанера',
            legsColor: 'Орех',
            imagePath: '',
            shortDescription: '',
            sku: ''
        };
        setProducts([newProduct, ...products]);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col">
            {/* Header Stick */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-black/5 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
                        Управление каталогом ({products.length})
                    </h2>
                    <button
                        onClick={handleAddProduct}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg text-black transition-colors"
                    >
                        + Добавить товар
                    </button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    {message && (
                        <span className={`text-sm font-medium px-4 py-2 rounded-xl flex-1 md:flex-none text-center truncate ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="button-primary px-8 py-2.5 shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none md:w-auto w-full"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                Сохраняем...
                            </span>
                        ) : 'Сохранить всё'}
                    </button>
                </div>
            </div>

            <div className="p-4 md:p-6 bg-gray-50/50 flex-1">
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                    {products.map((product, idx) => (
                        <div key={product.id || idx} className="bg-white p-5 md:p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow group relative">

                            <div className="absolute top-4 right-4 text-gray-300 font-mono text-xs hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                #{idx + 1}
                            </div>

                            <button
                                onClick={() => {
                                    if (confirm('Удалить этот товар из списка?')) {
                                        const newP = [...products];
                                        newP.splice(idx, 1);
                                        setProducts(newP);
                                    }
                                }}
                                className="absolute top-4 right-14 text-red-500 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Удалить товар"
                            >
                                Удалить
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Изображение (Левая колонка) */}
                                <div className="md:col-span-3 flex flex-col gap-3">
                                    <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative group/img flex items-center justify-center">
                                        {product.imagePath ? (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.imagePath} alt={product.title} className="w-full h-full object-contain p-4" />
                                            </>
                                        ) : (
                                            <span className="text-gray-400 text-sm font-medium">Нет фото</span>
                                        )}

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => fileInputRefs.current[idx]?.click()}
                                                className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-lg"
                                            >
                                                Загрузить
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => { fileInputRefs.current[idx] = el }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleUploadImage(idx, e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={product.imagePath || ''}
                                        onChange={(e) => handleChange(idx, 'imagePath', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-mono outline-none focus:border-gray-400"
                                        placeholder="URL основной картинки..."
                                        title="Путь к картинке (можно редактировать вручную)"
                                    />

                                    {/* Галерея дополнительных фото */}
                                    <div className="mt-2 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Галерея ({product.galleryImages?.length || 0})</span>
                                            <button
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        if (target.files && target.files[0]) {
                                                            handleUploadImage(idx, target.files[0], true);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                                className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 font-medium transition-colors"
                                            >
                                                + Добавить фото
                                            </button>
                                        </div>

                                        {product.galleryImages && product.galleryImages.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {product.galleryImages.map((imgPath, gIdx) => (
                                                    <div key={gIdx} className="aspect-square bg-white border border-gray-100 rounded-lg relative group/thumb overflow-hidden">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={imgPath} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Удалить это фото из галереи?')) {
                                                                    const newGallery = [...product.galleryImages!];
                                                                    newGallery.splice(gIdx, 1);
                                                                    handleChange(idx, 'galleryImages', newGallery);
                                                                }
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm"
                                                            title="Удалить фото"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Основные данные (Центр) */}
                                <div className="md:col-span-5 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Название</label>
                                        <input
                                            type="text"
                                            value={product.title || ''}
                                            onChange={(e) => handleChange(idx, 'title', e.target.value)}
                                            className="w-full border-b border-gray-200 hover:border-gray-300 bg-transparent px-0 py-1 text-lg font-bold text-black focus:border-black outline-none transition-colors"
                                            placeholder="Введите название..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Артикул</label>
                                        <input
                                            type="text"
                                            value={product.sku || ''}
                                            onChange={(e) => handleChange(idx, 'sku', e.target.value)}
                                            className="w-full border-b border-gray-200 hover:border-gray-300 bg-transparent px-0 py-1 text-sm font-medium text-black focus:border-black outline-none transition-colors"
                                            placeholder="Напр. BF-101..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Категория (Мебель)</label>
                                        <select
                                            value={product.category || 'Стулья'}
                                            onChange={(e) => handleChange(idx, 'category', e.target.value)}
                                            className="w-full bg-gray-50 hover:bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        >
                                            <option value="Стулья">Стулья</option>
                                            <option value="Барные стулья">Барные стулья</option>
                                            <option value="Табуретки">Табуретки</option>
                                            <option value="Столы">Столы</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Цена от (₽)</label>
                                            <input
                                                type="number"
                                                value={product.priceFrom || 0}
                                                onChange={(e) => handleChange(idx, 'priceFrom', Number(e.target.value))}
                                                className="w-full bg-gray-50 hover:bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Наличие</label>
                                            <select
                                                value={product.availability || 'in-stock'}
                                                onChange={(e) => handleChange(idx, 'availability', e.target.value)}
                                                className="w-full bg-gray-50 hover:bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            >
                                                <option value="in-stock">В наличии</option>
                                                <option value="made-to-order">На заказ</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Краткое описание</label>
                                        <textarea
                                            value={product.shortDescription || ''}
                                            onChange={(e) => handleChange(idx, 'shortDescription', e.target.value)}
                                            rows={2}
                                            className="w-full bg-gray-50 hover:bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-y"
                                            placeholder="Короткое описание для карточки..."
                                        />
                                    </div>
                                </div>

                                {/* Характеристики (Правая колонка) */}
                                <div className="md:col-span-4 space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Обивка</label>
                                            <select
                                                value={product.upholstery || 'Микровелюр'}
                                                onChange={(e) => handleChange(idx, 'upholstery', e.target.value)}
                                                className="w-full bg-white hover:border-gray-300 border border-gray-200 rounded-md px-2 py-1.5 text-[13px] font-medium focus:border-black outline-none transition-colors"
                                            >
                                                <option value="Микровелюр">Микровелюр</option>
                                                <option value="Букле">Букле</option>
                                                <option value="Экокожа">Экокожа</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Материал ножек</label>
                                            <select
                                                value={product.legsMaterial || 'Березовая фанера'}
                                                onChange={(e) => handleChange(idx, 'legsMaterial', e.target.value)}
                                                className="w-full bg-white hover:border-gray-300 border border-gray-200 rounded-md px-2 py-1.5 text-[13px] font-medium focus:border-black outline-none transition-colors"
                                            >
                                                <option value="Березовая фанера">Березовая фанера</option>
                                                <option value="Массив березы">Массив березы</option>
                                                <option value="Массив дуба">Массив дуба</option>
                                                <option value="Массив бука">Массив бука</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Цвет ножек</label>
                                            <select
                                                value={product.legsColor || 'Орех'}
                                                onChange={(e) => handleChange(idx, 'legsColor', e.target.value)}
                                                className="w-full bg-white hover:border-gray-300 border border-gray-200 rounded-md px-2 py-1.5 text-[13px] font-medium focus:border-black outline-none transition-colors"
                                            >
                                                <option value="Орех">Орех</option>
                                                <option value="Светло коричневый">Светло коричневый</option>
                                                <option value="Коричневый">Коричневый</option>
                                                <option value="Натуральный">Натуральный</option>
                                                <option value="Черный">Черный</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-3 mt-1 border-t border-gray-100">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">URL Slug (ссылка)</label>
                                            <input
                                                type="text"
                                                value={product.slug || ''}
                                                onChange={(e) => handleChange(idx, 'slug', e.target.value)}
                                                className="w-full bg-white hover:border-gray-300 border border-gray-200 rounded-md px-2 py-1.5 text-xs font-mono text-gray-600 focus:border-black outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" title="Свойства для фильтров">Теги</label>
                                                <input
                                                    type="text"
                                                    value={(product.tags || []).join(', ')}
                                                    onChange={(e) => handleArrayChange(idx, 'tags', e.target.value)}
                                                    className="w-full bg-white hover:border-gray-300 border border-gray-200 rounded-md px-2 py-1.5 text-[13px] focus:border-black outline-none transition-colors"
                                                    placeholder="хит, букле..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" title="Ярлыки на картинке">Бейджи</label>
                                                <input
                                                    type="text"
                                                    value={(product.badges || []).join(', ')}
                                                    onChange={(e) => handleArrayChange(idx, 'badges', e.target.value)}
                                                    className="w-full bg-white hover:border-gray-300 border border-gray-200 rounded-md px-2 py-1.5 text-[13px] focus:border-black outline-none transition-colors"
                                                    placeholder="Хит, Новинка..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
