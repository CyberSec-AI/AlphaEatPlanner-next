'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

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
            // Calculate start/end of the current week view (let's show 7 days starting from today or start of week?)
            // Let's simplified: Show 7 days starting from "currentDate"
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
        setIsAdding(true);
    };

    if (loading && items.length === 0) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Weekly Plan</h1>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                    <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded-md"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-medium px-2 min-w-[120px] text-center">
                        {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-md"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {days.map((day) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const active = new Date().toISOString().split('T')[0] === dateStr;
                    const dayItems = getItemsForDate(day);

                    return (
                        <div key={dateStr} className={`md:min-h-[400px] rounded-xl border p-4 flex flex-col ${active ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-100'}`}>
                            <div className="text-center mb-4 pb-2 border-b border-gray-100">
                                <div className="text-sm font-medium text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                <div className={`text-2xl font-bold ${active ? 'text-primary' : 'text-gray-900'}`}>{day.getDate()}</div>
                            </div>

                            <div className="flex-1 space-y-2">
                                {dayItems.map(item => (
                                    <div key={item.id} className="bg-white p-2 rounded border border-gray-100 shadow-sm text-sm">
                                        <div className="font-medium text-gray-900 truncate">{item.recipe.title}</div>
                                        <div className="text-xs text-gray-500 flex justify-between">
                                            <span>{item.mealType}</span>
                                            <span>{item.servings} p.</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-2 border-t border-gray-100/50">
                                <button
                                    onClick={() => openAddModal(day)}
                                    className="w-full py-2 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg flex items-center justify-center dashed-border"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add Meal
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Simple Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Add Meal for {selectedDate}</h3>
                        <form onSubmit={handleAddMeal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Recipe</label>
                                <select
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary border p-2 bg-white"
                                    value={newMeal.recipeId}
                                    onChange={(e) => setNewMeal({ ...newMeal, recipeId: e.target.value })}
                                >
                                    <option value="">Select a recipe...</option>
                                    {recipes.map(r => (
                                        <option key={r.id} value={r.id}>{r.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Servings</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary border p-2"
                                        value={newMeal.servings}
                                        onChange={(e) => setNewMeal({ ...newMeal, servings: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary border p-2 bg-white"
                                        value={newMeal.mealType}
                                        onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                                    >
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">Add Meal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
