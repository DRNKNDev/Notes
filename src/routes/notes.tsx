import { createFileRoute } from "@tanstack/react-router";
import { MainPage } from "@/pages/MainPage";

// Explicit route for the Notes section
// This can be used for direct navigation to the Notes section
// Currently it just renders the same component as the index route
export const Route = createFileRoute('/notes')({
  component: () => <MainPage />
});
