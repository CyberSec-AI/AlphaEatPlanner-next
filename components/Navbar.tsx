'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { clsx } from 'clsx';
import { ChefHat, ShoppingCart, CalendarDays, LogOut, LayoutDashboard, Snowflake } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { name: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
        { name: 'Mes Recettes', href: '/recipes', icon: ChefHat },
        { name: 'Planning', href: '/planner', icon: CalendarDays },
        { name: 'Liste de Courses', href: '/grocery', icon: ShoppingCart },
        { name: 'Frigo Magique', href: '/fridge', icon: Snowflake },
    ];

    if (!session) return null;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transform group-hover:rotate-6 transition-all duration-300">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-slate-800 group-hover:text-emerald-600 transition-colors">
                                EatPlanner
                            </span>
                        </Link>

                        <div className="hidden lg:ml-12 lg:flex lg:space-x-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                                            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2'
                                        )}
                                    >
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mb-0.5" />}
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs font-semibold text-slate-600 uppercase">fr</span>
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3">
                            <span className="hidden md:block text-sm font-medium text-slate-700">
                                {session.user?.name || 'Chef'}
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"
                                title="Déconnexion"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
