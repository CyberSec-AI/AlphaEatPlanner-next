'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Loader2, Utensils, Coffee, Sun, Moon, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface Recipe {
    id: number;
    title: string;
}

interface MealPlanItem {
    id: number;
    date: string; // ISO string from JSON
    recipe: Recipe;
    mealType: string;
    servings: number;
}

const MealTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'breakfast': return <Coffee className="w-3 h-3" />;
        case 'lunch': return <Sun className="w-3 h-3" />;
        case 'dinner': return <Moon className="w-3 h-3" />;
        default: return <Utensils className="w-3 h-3" />;
    }
};

const MealTypeLabel = ({ type }: { type: string }) => {
    const labels: Record<string, string> = { breakfast: 'Petit-déj', lunch: 'Déjeuner', dinner: 'Dîner' };
    return labels[type] || type;
};

export default function PlannerPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [items, setItems] = useState<MealPlanItem[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Meal State
    const [isAdding, setIsAdding] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [newMeal, setNewMeal] = useState({ recipeId: '', servings: 2, mealType: 'dinner' });

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const start = new Date(currentDate);
            const end = new Date(currentDate);
            end.setDate(end.getDate() + 6);

            const startStr = start.toISOString().split('T')[0];
            const endStr = end.toISOString().split('T')[0];

            const [itemsRes, recipesRes] = await Promise.all([
                fetch(`/api/meal-plan?start=${startStr}&end=${endStr}`),
                fetch('/api/recipes')
            ]);

            if (itemsRes.ok) setItems(await itemsRes.json());
            if (recipesRes.ok) setRecipes(await recipesRes.json());

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMeal.recipeId) return;

        try {
            const res = await fetch('/api/meal-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    recipe_id: parseInt(newMeal.recipeId),
                    servings: newMeal.servings,
                    meal_type: newMeal.mealType
                })
            });

            if (res.ok) {
                setIsAdding(false);
                fetchData(); // Refresh
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Generate 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    const getItemsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return items.filter(item => item.date.startsWith(dateStr));
    };

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const openAddModal = (date: Date) => {
        setSelectedDate(date.toISOString().split('T')[0]);
        setNewMeal({ recipeId: '', servings: 2, mealType: 'dinner' }); // Reset form
        setIsAdding(true);
    };

    if (loading && items.length === 0) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Mon Planning</h1>
                    <p className="text-slate-500 mt-1">Organisez votre semaine culinaire en toute simplicité.</p>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
                    <button onClick={prevWeek} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-emerald-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 px-4 font-semibold text-slate-700">
                        <CalendarIcon className="w-4 h-4 text-emerald-500" />
                        <span>
                            {days[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            {' - '}
                            {days[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                    <button onClick={nextWeek} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-emerald-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                {days.map((day) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;
                    const dayItems = getItemsForDate(day);

                    return (
                        <div key={dateStr} className={clsx(
                            "flex flex-col rounded-3xl p-4 min-h-[400px] border transition-all duration-300",
                            isToday
                                ? "bg-emerald-50/50 border-emerald-200 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                                : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"
                        )}>
                            {/* Day Header */}
                            <div className="text-center mb-6 pb-4 border-b border-slate-100/80">
                                <div className={clsx(
                                    "text-xs font-bold uppercase tracking-wider mb-1",
                                    isToday ? "text-emerald-600" : "text-slate-400"
                                )}>
                                    {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </div>
                                <div className={clsx(
                                    "text-3xl font-bold transition-all",
                                    isToday ? "text-emerald-600 scale-110" : "text-slate-700"
                                )}>
                                    {day.getDate()}
                                </div>
                            </div>

                            {/* Meals List */}
                            <div className="flex-1 space-y-3 relative">
                                {dayItems.length === 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <Sparkles className="w-6 h-6 text-slate-200 mb-2" />
                                        <span className="text-xs text-slate-400 font-medium">Libre</span>
                                    </div>
                                )}

                                {dayItems.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="pl-2">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className={clsx(
                                                    "p-1 rounded-md text-xs",
                                                    item.mealType === 'dinner' ? "bg-indigo-50 text-indigo-500" :
                                                        item.mealType === 'lunch' ? "bg-amber-50 text-amber-500" :
                                                            "bg-rose-50 text-rose-500"
                                                )}>
                                                    <MealTypeIcon type={item.mealType} />
                                                </span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {MealTypeLabel({ type: item.mealType })}
                                                </span>
                                            </div>
                                            <div className="font-semibold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">
                                                {item.recipe.title}
                                            </div>
                                            <div className="text-xs text-slate-400 font-medium">
                                                {item.servings} pers.
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={() => openAddModal(day)}
                                className={clsx(
                                    "mt-4 w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-300 group",
                                    isToday
                                        ? "border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300"
                                        : "border-slate-100 text-slate-300 hover:border-emerald-200 hover:text-emerald-500 hover:bg-slate-50"
                                )}
                            >
                                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Add Meal Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl ring-1 ring-slate-900/5 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Ajouter un Repas</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                                <Plus className="w-5 h-5 text-slate-400 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMeal} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Quel jour ?</label>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 font-medium">
                                    {selectedDate}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Choisir une Recette</label>
                                <select
                                    required
                                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-3 text-slate-700"
                                    value={newMeal.recipeId}
                                    onChange={(e) => setNewMeal({ ...newMeal, recipeId: e.target.value })}
                                >
                                    <option value="">Sélectionnez une recette...</option>
                                    {recipes.map(r => (
                                        <option key={r.id} value={r.id}>{r.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Portions</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-3 text-slate-700"
                                        value={newMeal.servings}
                                        onChange={(e) => setNewMeal({ ...newMeal, servings: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Moment</label>
                                    <select
                                        className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-3 text-slate-700"
                                        value={newMeal.mealType}
                                        onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                                    >
                                        <option value="breakfast">Petit-déj</option>
                                        <option value="lunch">Déjeuner</option>
                                        <option value="dinner">Dîner</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-3.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
