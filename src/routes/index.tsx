import { createFileRoute, redirect } from "@tanstack/react-router";

// This is the default route that will redirect to the notes route
export const Route = createFileRoute('/')({  
  beforeLoad: () => {
    // Redirect to the notes route
    throw redirect({ to: '/notes' })
  }
});
