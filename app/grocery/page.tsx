'use client';

import { useState, useEffect } from 'react';
import { Loader2, Calendar } from 'lucide-react';

interface GroceryItem {
    name: string;
    quantity: number;
    unit: string;
    is_checked: boolean;
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
        // In a real app we might persist this check state to DB
        // For now just local state
        const newItems = [...items];
        newItems[index].is_checked = !newItems[index].is_checked;
        setItems(newItems);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Grocery List</h1>
                    <p className="text-gray-500">Automatically generated from your meal plan</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar className="w-5 h-5 text-gray-400 ml-2" />
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="border-none focus:ring-0 text-sm"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="border-none focus:ring-0 text-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {items.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No items found for this period. Add meals to your plan first!
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {items.map((item, idx) => (
                                <div key={`${item.name}-${idx}`} className={`p-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer ${item.is_checked ? 'opacity-50' : ''}`} onClick={() => toggleCheck(idx)}>
                                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${item.is_checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                        {item.is_checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <div className="flex-1">
                                        <span className={`font-medium text-gray-900 ${item.is_checked ? 'line-through text-gray-400' : ''}`}>{item.name}</span>
                                    </div>
                                    <div className="text-gray-500 font-mono text-sm">
                                        {item.quantity} {item.unit}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
