import { createFileRoute } from "@tanstack/react-router";
import { PromptPage } from "@/pages/PromptPage";

// Route for the Prompt page
export const Route = createFileRoute('/prompt')({
  component: () => <PromptPage />
});
