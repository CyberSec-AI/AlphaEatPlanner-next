export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/planner/:path*",
        "/grocery/:path*",
        // "/recipes/:path*", // Public for now? Or protected? Let's protect sensitive routes
    ],
};
