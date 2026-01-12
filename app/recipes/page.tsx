import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus, ChefHat, Clock, Users } from "lucide-react";
import Image from "next/image";

export default async function RecipesPage() {
    const session = await getServerSession(authOptions);
    const recipes = await prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
        include: { ingredients: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
                    <p className="text-gray-500">Manage your culinary collection</p>
                </div>
                <Link
                    href="/recipes/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Recipe
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-100 relative">
                            {recipe.imageUrl ? (
                                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ChefHat className="w-12 h-12" />
                                </div>
                            )}
                            {recipe.isFavorite && (
                                <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{recipe.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {recipe.defaultServings} serv.
                                </div>
                                <div className="flex items-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${recipe.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {recipe.isVegetarian ? 'Vegetarian' : 'Standard'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {recipes.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                        <ChefHat className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No recipes yet</h3>
                    <p className="mt-1 text-gray-500">Get started by creating your first recipe.</p>
                </div>
            )}
        </div>
    );
}
