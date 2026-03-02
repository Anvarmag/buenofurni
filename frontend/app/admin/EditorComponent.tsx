'use client';

import { useRouter } from 'next/navigation';

export default function EditorComponent() {
    const router = useRouter();

    const handleSave = async (productsData: any) => {
        try {
            const response = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products: productsData }),
            });

            if (response.ok) {
                // Clear Next.js router cache to show fresh data on /catalog
                router.refresh();
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    return (
        <button
            onClick={() => handleSave([])}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
            Save (example)
        </button>
    );
}
