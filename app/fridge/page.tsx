'use client';

import { useState } from 'react';
import { Snowflake, Plus, X, Search, ChefHat, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function FridgePage() {
    const [ingredients, setIngredients] = useState<string[]>(['Oeufs', 'Tomates', 'Mozzarella', 'Basilic']);
    const [newItem, setNewItem] = useState('');
    const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const addIngredient = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim() && !ingredients.includes(newItem.trim())) {
            setIngredients([...ingredients, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeIngredient = (item: string) => {
        setIngredients(ingredients.filter(i => i !== item));
    };

    const findMagicRecipes = async () => {
        setIsSearching(true);
        // Simulate API call for magic search
        setTimeout(() => {
            setSuggestedRecipes([
                { id: 1, title: 'Salade Caprese', matches: 3, total: 4, image: '🥗' },
                { id: 2, title: 'Omelette aux Herbes', matches: 2, total: 3, image: '🍳' },
            ]);
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 text-white overflow-hidden shadow-2xl shadow-emerald-500/20">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium text-emerald-50">
                            <Sparkles className="w-4 h-4" />
                            <span>Beta Feature</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Frigo Magique</h1>
                        <p className="text-lg text-emerald-50/90 leading-relaxed">
                            Ne gaspillez plus ! Dites-nous ce qu'il vous reste, nous vous dirons quoi cuisiner ce soir.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Snowflake className="w-40 h-40 text-white/10 rotate-12" />
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inventory Management */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Plus className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Dans mon frigo...</h2>
                    </div>

                    <form onSubmit={addIngredient} className="relative">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Ajouter un ingrédient (ex: Carottes)"
                            className="w-full pl-5 pr-14 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-lg"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </form>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm min-h-[300px]">
                        {ingredients.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
                                <Snowflake className="w-16 h-16" />
                                <p>Le frigo est vide...</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {ingredients.map((item) => (
                                    <div
                                        key={item}
                                        className="group flex items-center gap-2 pl-4 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-white hover:shadow-md hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300"
                                    >
                                        <span>{item}</span>
                                        <button
                                            onClick={() => removeIngredient(item)}
                                            className="p-1 hover:bg-rose-100 hover:text-rose-500 rounded-lg transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={findMagicRecipes}
                        disabled={ingredients.length === 0 || isSearching}
                        className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isSearching ? (
                            <>
                                <Snowflake className="w-6 h-6 animate-spin" />
                                Recherche magique...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                Trouver des Idées
                            </>
                        )}
                    </button>
                </div>

                {/* Suggestions Window */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <ChefHat className="w-5 h-5 effect-shine" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Suggestions</h2>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg min-h-[500px] p-6 relative overflow-hidden">
                        {!isSearching && suggestedRecipes.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-6">
                                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-12 h-12 text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">En attente d'ingrédients...</h3>
                                    <p className="text-slate-400 max-w-xs mx-auto">Ajoutez ce que vous avez sous la main et lancez la magie pour découvrir des recettes.</p>
                                </div>
                            </div>
                        )}

                        {suggestedRecipes.length > 0 && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                {suggestedRecipes.map(recipe => (
                                    <Link href={`/recipes?id=${recipe.id}`} key={recipe.id} className="block group">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all">
                                            <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-4xl shadow-sm group-hover:scale-105 transition-transform">
                                                {recipe.image}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors">{recipe.title}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${(recipe.matches / recipe.total) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-emerald-600">{recipe.matches}/{recipe.total} Ingr.</span>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-slate-50 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                <Search className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
