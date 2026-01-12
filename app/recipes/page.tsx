import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus, ChefHat, Clock, Users, Search, Star, Leaf } from "lucide-react";

export default async function RecipesPage() {
    const session = await getServerSession(authOptions);
    // Fetch recipes from DB
    const recipes = await prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Mes Recettes</h1>
                    <p className="text-slate-500 mt-1">Organisez vos repas, gérez vos recettes et générez des listes sans effort.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2.5 border-none bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                            placeholder="Rechercher..."
                        />
                    </div>
                    <Link
                        href="/recipes/create"
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvelle Recette
                    </Link>
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                        {/* Card Image Area */}
                        <div className="h-56 bg-slate-100 relative overflow-hidden">
                            {recipe.imageUrl ? (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                    <ChefHat className="w-16 h-16 mb-2 opacity-50" />
                                    <span className="text-xs font-medium uppercase tracking-wider opacity-60">Aucune Image</span>
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                {recipe.isVegetarian && (
                                    <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-lg">
                                        <Leaf className="w-3 h-3 mr-1" /> Végé
                                    </span>
                                )}
                            </div>

                            {/* Author Badge (Mock) */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow-md">
                                    <ChefHat className="w-4 h-4" />
                                </div>
                                <span className="text-white text-xs font-medium bg-slate-900/40 backdrop-blur-md px-2 py-1 rounded-lg">
                                    {session?.user?.name || 'Chef'}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                    {recipe.title}
                                </h3>
                                {/* Edit/Delete actions could go here */}
                            </div>

                            {/* Rating Stars (Mock) */}
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < (recipe.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                <div className="flex items-center text-slate-500 text-sm font-medium">
                                    <Users className="w-4 h-4 mr-2 text-emerald-500" />
                                    {recipe.defaultServings} Portions
                                </div>
                                <div className="flex items-center text-slate-400 text-xs">
                                    3 items
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {recipes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6 text-emerald-500">
                        <ChefHat className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Aucune recette pour le moment</h3>
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto">Commencez par ajouter votre première création culinaire pour remplir votre livre de cuisine.</p>
                    <Link
                        href="/recipes/create"
                        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Créer une Recette
                    </Link>
                </div>
            )}
        </div>
    );
}
