import { createFileRoute } from "@tanstack/react-router";
import { MainPage } from "@/pages/MainPage";

// Route for the Journal page
// Currently using MainPage as a placeholder, but will be updated
// to use a specific Journal component in Phase 2
export const Route = createFileRoute('/journal')({
  component: () => <MainPage />
});
