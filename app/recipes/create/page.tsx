'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createRecipe } from '../actions'; // On importe notre Server Action

export default function CreateRecipePage() {
    const [isPending, startTransition] = useTransition(); // Gère l'état de chargement automatiquement

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
        // @ts-ignore (Simplification pour l'instant)
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // C'est ici que la magie opère ! 
        // startTransition permet d'appeler le serveur sans bloquer l'interface
        startTransition(async () => {
            try {
                await createRecipe(formData);
                // Pas besoin de router.push, l'action serveur fait le redirect() !
            } catch (error) {
                console.error(error);
                alert("Erreur lors de la création : " + (error as Error).message);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/recipes" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Nouvelle Recette</h1>
                    <p className="text-slate-500">Ajoutez un plat à votre collection</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Titre de la recette</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            value={formData.title} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="Ex: Pâtes à la Carbonara"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea 
                            name="description" 
                            rows={3} 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="Une courte description appétissante..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Portions</label>
                        <input 
                            type="number" 
                            name="default_servings" 
                            required 
                            min="1" 
                            value={formData.default_servings} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center pt-8">
                        <label className="flex items-center cursor-pointer gap-3">
                            <input 
                                type="checkbox" 
                                name="is_vegetarian" 
                                checked={formData.is_vegetarian} 
                                onChange={handleInputChange} 
                                className="w-5 h-5 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" 
                            />
                            <span className="text-slate-700 font-medium">C'est végétarien ?</span>
                        </label>
                    </div>
                </div>

                {/* Section Ingrédients */}
                <div className="border-t border-slate-100 pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Ingrédients</h3>
                        <button 
                            type="button" 
                            onClick={addIngredient} 
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Ajouter
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        placeholder="Nom (ex: Tomates)" 
                                        required 
                                        value={ing.name} 
                                        onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                                    />
                                </div>
                                <div className="w-20">
                                    <input 
                                        type="number" 
                                        placeholder="Qté" 
                                        required 
                                        step="0.1" 
                                        value={ing.quantity} 
                                        onChange={(e) => handleIngredientChange(idx, 'quantity', parseFloat(e.target.value))} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                                    />
                                </div>
                                <div className="w-24">
                                    <input 
                                        type="text" 
                                        placeholder="Unité" 
                                        required 
                                        value={ing.unit} 
                                        onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)} 
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeIngredient(idx)} 
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bouton de soumission */}
                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isPending} 
                        className="inline-flex items-center px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed font-semibold"
                    >
                        {isPending ? (
                            <>Sauvegarde...</>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Enregistrer la Recette
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}