import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/meal-plan?start=YYYY-MM-DD&end=YYYY-MM-DD
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
        // Default to returning all or specific logic? 
        // For now, let's return all if no range (or maybe last 30 days).
        // Let's safe guard:
        const items = await prisma.mealPlanItem.findMany({
            include: { recipe: true },
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(items);
    }

    const items = await prisma.mealPlanItem.findMany({
        where: {
            date: {
                gte: new Date(start),
                lte: new Date(end),
            },
        },
        include: {
            recipe: true,
        },
        orderBy: { date: 'asc' },
    });

    return NextResponse.json(items);
}

// POST /api/meal-plan
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, recipe_id, servings } = body;

        const recipe = await prisma.recipe.findUnique({
            where: { id: recipe_id }
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        const item = await prisma.mealPlanItem.create({
            data: {
                date: new Date(date),
                recipeId: recipe_id,
                servings: servings,
                mealType: body.meal_type || 'dinner',
                servingsVegetarian: 0 // Default for now
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create meal plan item" }, { status: 500 });
    }
}
