import Link from "next/link";
import { ChefHat, Star, Users, Leaf } from "lucide-react";
import { Recipe as RecipeType } from "@prisma/client"; // On utilise le type généré automatiquement par Prisma !

// On définit ce que le composant attend comme données
interface RecipeCardProps {
  recipe: RecipeType & {
    _count?: { ingredients: number }; // Optionnel: pour compter les ingrédients plus tard
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  // Petite logique pour éviter les erreurs si pas d'image
  const hasImage = !!recipe.imageUrl;

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
      {/* Lien cliquable autour de l'image */}
      <Link href={`/recipes/${recipe.id}`} className="block relative h-56 bg-slate-100 overflow-hidden">
        {hasImage ? (
          <img
            src={recipe.imageUrl!}
            alt={recipe.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
            <ChefHat className="w-16 h-16 mb-2 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider opacity-60">
              Aucune Image
            </span>
          </div>
        )}

        {/* Dégradé sombre pour lire le texte par dessus */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>

        {/* Badge Végétarien */}
        <div className="absolute top-4 left-4 flex gap-2">
          {recipe.isVegetarian && (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-lg">
              <Leaf className="w-3 h-3 mr-1" /> Végé
            </span>
          )}
        </div>
      </Link>

      {/* Contenu de la carte */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {recipe.title}
            </h3>
          </Link>
        </div>

        {/* Notation (Étoiles) */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (recipe.rating || 0)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Infos du bas */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
          <div className="flex items-center text-slate-500 text-sm font-medium">
            <Users className="w-4 h-4 mr-2 text-emerald-500" />
            {recipe.defaultServings} Portions
          </div>
          
          {/* Si on a le compte des ingrédients, on l'affiche, sinon rien */}
          {recipe._count?.ingredients ? (
             <div className="text-slate-400 text-xs">
               {recipe._count.ingredients} ingrédients
             </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}