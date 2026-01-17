'use server'; // Indispensable : Dit à Next.js que ce code reste sur le serveur

import prisma from "../../lib/prisma"; // On remonte de 2 dossiers
import { authOptions } from "../../lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

// On définit le type des données qu'on attend
type RecipeData = {
  title: string;
  description: string;
  default_servings: number;
  is_vegetarian: boolean;
  ingredients: { name: string; quantity: number; unit: string }[];
};

export async function createRecipe(data: RecipeData) {
  // 1. Sécurité : On vérifie qui est connecté
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Vous devez être connecté pour créer une recette.");
  }

  // 2. On récupère l'ID de l'utilisateur via son email
  const user = await prisma.user.findUnique({
    where: { username: session.user.email } // Ou 'email' selon ton schéma User
  });

  if (!user) throw new Error("Utilisateur introuvable.");

  // 3. Sauvegarde dans la DB (Prisma gère tout, même les ingrédients !)
  await prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      defaultServings: data.default_servings, // Attention à la casse (camelCase dans Prisma)
      isVegetarian: data.is_vegetarian,
      authorId: user.id,
      ingredients: {
        create: data.ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit
        }))
      }
    }
  });

  // 4. On rafraîchit la liste des recettes pour voir la nouvelle
  revalidatePath('/recipes');
  
  // 5. On redirige l'utilisateur
  redirect('/recipes');
}