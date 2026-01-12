'use client';

import { useState, useEffect } from 'react';
import { Loader2, Calendar, ShoppingCart, Check, Trash2, Printer, Share2 } from 'lucide-react';
import { clsx } from 'clsx';

interface GroceryItem {
    name: string;
    quantity: number;
    unit: string;
    is_checked: boolean;
    category?: string; // Potential future field
}

export default function GroceryPage() {
    const [items, setItems] = useState<GroceryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Default to today + 7 days
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const [dateRange, setDateRange] = useState({ start: today, end: nextWeekStr });

    useEffect(() => {
        fetchList();
    }, [dateRange]);

    const fetchList = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/grocery-list?start=${dateRange.start}&end=${dateRange.end}`);
            if (res.ok) {
                setItems(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCheck = (index: number) => {
        const newItems = [...items];
        newItems[index].is_checked = !newItems[index].is_checked;
        setItems(newItems);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Liste de Courses</h1>
                    <p className="text-slate-500 mt-1">Générée automatiquement à partir de votre planning.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Date Picker */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="border-none focus:ring-0 text-sm text-slate-600 p-0"
                        />
                        <span className="text-slate-300">→</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="border-none focus:ring-0 text-sm text-slate-600 p-0"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-emerald-500" /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
                            {/* Paper Header Effect */}
                            <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                            {items.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-center font-medium">Votre liste est vide pour cette période.<br />Planifiez des repas pour voir apparaître vos ingrédients.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 p-2">
                                    {items.map((item, idx) => (
                                        <div
                                            key={`${item.name}-${idx}`}
                                            onClick={() => toggleCheck(idx)}
                                            className={clsx(
                                                "group flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200",
                                                item.is_checked ? "bg-slate-50/50" : "hover:bg-slate-50"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-all duration-200",
                                                item.is_checked ? "bg-emerald-500 border-emerald-500" : "border-slate-300 group-hover:border-emerald-400"
                                            )}>
                                                {item.is_checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                            </div>

                                            <div className="flex-1">
                                                <span className={clsx(
                                                    "font-medium transition-all duration-200 block",
                                                    item.is_checked ? "text-slate-400 line-through" : "text-slate-800"
                                                )}>
                                                    {item.name}
                                                </span>
                                            </div>

                                            <div className={clsx(
                                                "px-3 py-1 rounded-lg text-sm font-semibold transition-all",
                                                item.is_checked ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-600"
                                            )}>
                                                {item.quantity} {item.unit}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/10">
                            <h3 className="text-lg font-bold mb-4">Résumé</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Total Articles</span>
                                    <span className="font-bold text-xl">{items.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">À acheter</span>
                                    <span className="font-bold text-xl text-emerald-400">
                                        {items.filter(i => !i.is_checked).length}
                                    </span>
                                </div>
                                <div className="h-px bg-slate-700 my-4"></div>
                                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                    <Share2 className="w-4 h-4" /> Partager
                                </button>
                                <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                    <Printer className="w-4 h-4" /> Imprimer
                                </button>
                            </div>
                        </div>

                        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                            <h3 className="font-bold text-emerald-900 mb-2">Astuce Écolo 🌱</h3>
                            <p className="text-sm text-emerald-700 leading-relaxed">
                                Vérifiez d'abord votre "Frigo Magique" avant de partir faire les courses pour éviter le gaspillage alimentaire !
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
