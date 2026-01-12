'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, CalendarDays, ArrowRight } from 'lucide-react';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 overflow-hidden relative">

            {/* Background Blob decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <div className="mb-8 relative inline-block group">
                    {/* Avocado-like icon representation (Placeholder until real image) */}
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500 border border-slate-100">
                        <span className="text-6xl filter drop-shadow-md">🥑</span>
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                        Premium
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight leading-tight">
                    Planifiez avec <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                        Style & Saveur.
                    </span>
                </h1>

                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Votre assistant culinaire personnel. Organisez vos repas, gérez votre frigo et générez vos courses en un clic.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/recipes"
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <ChefHat className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Mes Recettes
                    </Link>

                    <Link
                        href="/planner"
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-800 border-2 border-slate-100 rounded-2xl font-semibold hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <CalendarDays className="w-5 h-5" />
                        Le Planning
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-10 text-slate-400 text-sm font-medium">
                V5.0 • Design Premium
            </div>
        </div>
    );
}
