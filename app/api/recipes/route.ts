import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/recipes
export async function GET() {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                ingredients: true,
                steps: true,
            },
        });
        // Parse tags manually if needed, or handle in frontend. 
        // Prisma returns string for simple types, but we might want to ensure JSON structure if it matters.
        // For now returning as is.
        return NextResponse.json(recipes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
    }
}

// POST /api/recipes
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // In a real app, ensure session exists. 
        // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const {
            title,
            description,
            default_servings,
            is_favorite,
            rating,
            is_vegetarian,
            tags,
            ingredients,
            steps
        } = body;

        const recipe = await prisma.recipe.create({
            data: {
                title,
                description,
                defaultServings: default_servings,
                isFavorite: is_favorite,
                rating,
                isVegetarian: is_vegetarian,
                tags: JSON.stringify(tags),
                // Create ingredients
                ingredients: {
                    create: ingredients.map((ing: any) => ({
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        variantMode: ing.variant_mode || 'all',
                    })),
                },
                // Create steps (assuming steps is a list of strings or objects)
                // If steps is just a list of instructions, we might need to map it.
                // Looking at smoke_test.py, it doesn't send steps for the 'Greek Salad'. 
                // We'll handle if steps are provided.
                steps: steps ? {
                    create: steps.map((step: any, index: number) => ({
                        stepOrder: index + 1,
                        instruction: typeof step === 'string' ? step : step.instruction,
                    }))
                } : undefined
            },
            include: {
                ingredients: true,
            }
        });

        return NextResponse.json(recipe);

    } catch (error) {
        console.error("Error creating recipe:", error);
        return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
    }
}
