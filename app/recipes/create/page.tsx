'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Save } from 'lucide-react';

export default function CreateRecipePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        default_servings: 2,
        is_vegetarian: false,
        ingredients: [{ name: '', quantity: 1, unit: 'pcs' }]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleIngredientChange = (index: number, field: string, value: string | number) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: 1, unit: 'pcs' }]
        }));
    };

    const removeIngredient = (index: number) => {
        const newIngredients = [...formData.ingredients];
        newIngredients.splice(index, 1);
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/recipes');
                router.refresh(); // Refresh server components
            } else {
                alert('Failed to create recipe');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">New Recipe</h1>
                <p className="text-gray-500">Add a new dish to your collection</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 gap-6">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Default Servings</label>
                            <input type="number" name="default_servings" required min="1" value={formData.default_servings} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                        </div>
                        <div className="w-1/2 flex items-center pt-6">
                            <input type="checkbox" name="is_vegetarian" id="is_vegetarian" checked={formData.is_vegetarian} onChange={handleInputChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                            <label htmlFor="is_vegetarian" className="ml-2 block text-sm text-gray-900">Vegetarian?</label>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
                        <button type="button" onClick={addIngredient} className="text-sm text-primary hover:text-indigo-700 font-medium flex items-center">
                            <Plus className="w-4 h-4 mr-1" /> Add Ingredient
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <input type="text" placeholder="Name (e.g. Tomato)" required value={ing.name} onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                                </div>
                                <div className="w-20">
                                    <input type="number" placeholder="Qty" required step="0.1" value={ing.quantity} onChange={(e) => handleIngredientChange(idx, 'quantity', parseFloat(e.target.value))} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                                </div>
                                <div className="w-24">
                                    <input type="text" placeholder="Unit" required value={ing.unit} onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                                </div>
                                <button type="button" onClick={() => removeIngredient(idx)} className="p-2 text-red-400 hover:text-red-600">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Recipe'}
                    </button>
                </div>
            </form>
        </div>
    );
}
