import { createFileRoute } from "@tanstack/react-router";
import { MainPage } from "@/pages/MainPage";

// This is the default route that will be displayed when the app loads
// In our case, this will show the Notes section
export const Route = createFileRoute('/')({
  component: () => <MainPage />
});
