import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Calendar, ShoppingBag, Utensils } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2">Hello, {session.user?.name}!</h1>
                    <p className="text-indigo-100 text-lg">What are we cooking today?</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom-left" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/recipes" className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Utensils className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipes</h3>
                    <p className="text-gray-500 mb-4">Browse your collection or add new delicious recipes.</p>
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                        Manage Recipes <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Link>

                <Link href="/planner" className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Meal Planner</h3>
                    <p className="text-gray-500 mb-4">Schedule your meals for the week ahead.</p>
                    <div className="flex items-center text-emerald-600 font-medium text-sm">
                        Plan Week <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Link>

                <Link href="/grocery" className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="h-12 w-12 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Grocery List</h3>
                    <p className="text-gray-500 mb-4">Generate simplified shopping lists from your plan.</p>
                    <div className="flex items-center text-pink-600 font-medium text-sm">
                        View List <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
