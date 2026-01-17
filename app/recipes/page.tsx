import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, ChefHat } from "lucide-react";
import { RecipeCard } from "@/components/recipes/RecipeCard"; // On importe notre nouveau composant

// Cette fonction rend la page "dynamique" (rechargée à chaque visite pour avoir les dernières recettes)
export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  // 1. Récupération des données (Clean & Simple)
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: {
        _count: { select: { ingredients: true } } // On demande à Prisma de compter les ingrédients !
    }
  });

  return (
    <div className="space-y-8">
      {/* --- Zone En-tête --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mes Recettes</h1>
          <p className="text-slate-500 mt-1">
            Gérez vos créations culinaires simplement.
          </p>
        </div>

        {/* Zone Actions (Recherche + Bouton) */}
        <div className="flex items-center gap-3">
          {/* Note: La recherche visuelle est là, mais ne fonctionne pas encore (étape suivante !) */}
          <div className="relative group hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border-none bg-white rounded-xl text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Rechercher..."
            />
          </div>

          <Link
            href="/recipes/create"
            className="inline-flex items-center px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Recette
          </Link>
        </div>
      </div>

      {/* --- Grille des Recettes --- */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            // On utilise notre composant ici ! C'est beaucoup plus court.
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        /* --- État Vide (Empty State) --- */
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6 text-emerald-500">
            <ChefHat className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            Aucune recette pour le moment
          </h3>
          <p className="mt-2 text-slate-500">
            C'est un peu vide ici... Lancez-vous !
          </p>
        </div>
      )}
    </div>
  );
}