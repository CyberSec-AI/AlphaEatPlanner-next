import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

// GET /api/grocery-list?start=YYYY-MM-DD&end=YYYY-MM-DD
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
        return NextResponse.json({ error: "Start and end dates required" }, { status: 400 });
    }

    // 1. Fetch Meal Plan Items
    const planItems = await prisma.mealPlanItem.findMany({
        where: {
            date: {
                gte: new Date(start),
                lte: new Date(end),
            },
        },
        include: {
            recipe: {
                include: {
                    ingredients: true,
                },
            },
        },
    });

    // 2. Aggregate Ingredients
    const groceryMap: Record<string, { quantity: number; unit: string; name: string }> = {};

    for (const item of planItems) {
        const recipe = item.recipe;
        if (!recipe) continue;

        const ratio = item.servings / recipe.defaultServings;

        for (const ing of recipe.ingredients) {
            const amount = Number(ing.quantity) * ratio;
            // Normalization key: name + unit (simple approach)
            const key = `${ing.name}-${ing.unit}`;

            if (groceryMap[key]) {
                groceryMap[key].quantity += amount;
            } else {
                groceryMap[key] = {
                    name: ing.name,
                    quantity: amount,
                    unit: ing.unit,
                };
            }
        }
    }

    // 3. Convert to List
    const groceryList = Object.values(groceryMap).map(item => ({
        name: item.name,
        quantity: Math.round(item.quantity * 100) / 100, // Round to 2 decimals
        unit: item.unit,
        is_checked: false
    }));

    // Match the smoke_test expectation: list of objects
    return NextResponse.json(groceryList);
}
