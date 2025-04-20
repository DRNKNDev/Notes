import { createFileRoute, redirect } from "@tanstack/react-router";

// This is the default route that will redirect to notes or onboarding
export const Route = createFileRoute('/')({  
  beforeLoad: () => {
    // Check if onboarding is complete
    const isOnboardingComplete = localStorage.getItem('isOnboardingComplete') === 'true';
    
    if (isOnboardingComplete) {
      // If onboarding is complete, redirect to notes
      throw redirect({ to: '/notes' });
    } else {
      // If onboarding is not complete, redirect to onboarding
      throw redirect({ to: '/onboarding' });
    }
  }
});
